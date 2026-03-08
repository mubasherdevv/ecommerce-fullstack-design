import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Fetch all categories with product counts
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    
    // Create an array to hold categories with counts
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        // Count how many products use this category name
        const count = await Product.countDocuments({ category: category.name });
        return {
          ...category.toObject(),
          productCount: count
        };
      })
    );
    
    res.json(categoriesWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-'),
      image: image || 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=200'
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.slug = slug || category.slug;
      category.image = image || category.image;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      // Check if products exist in this category before allowing deletion
      const productCount = await Product.countDocuments({ category: category.name });
      
      if (productCount > 0) {
        return res.status(400).json({ 
          message: `Cannot delete category. There are ${productCount} products assigned to it. Please reassign those products first.` 
        });
      }

      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export { getCategories, createCategory, updateCategory, deleteCategory };
