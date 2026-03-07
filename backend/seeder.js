import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// The 12 products we used in the static design
const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.8,
    numReviews: 124,
    description: 'Experience premium sound quality with active noise cancellation, 30-hour battery life, and comfortable over-ear fit perfect for long listening sessions.',
    countInStock: 50,
  },
  {
    name: 'Minimalist Leather Watch',
    price: 129.5,
    originalPrice: 159.0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    category: 'Accessories',
    rating: 4.5,
    numReviews: 89,
    description: 'A sleek, timeless timepiece featuring genuine leather straps, water resistance up to 50m, and precise quartz movement.',
    countInStock: 25,
  },
  {
    name: 'Smart Fitness Tracker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?q=80&w=1000&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.3,
    numReviews: 210,
    description: 'Track your steps, heart rate, sleep cycles, and more. Water-resistant design with OLED display and up to 10 days of battery life.',
    countInStock: 100,
  },
  {
    name: 'Ergonomic Desk Chair',
    price: 249.0,
    originalPrice: 299.0,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop',
    category: 'Home & Office',
    rating: 4.7,
    numReviews: 56,
    description: 'Stay comfortable during long work days with lumbar support, adjustable height and armrests, and breathable mesh back material.',
    countInStock: 15,
  },
  {
    name: 'Premium Coffee Maker',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1495474472205-51f242fc44e6?q=80&w=1000&auto=format&fit=crop',
    category: 'Home Appliances',
    rating: 4.6,
    numReviews: 342,
    description: 'Start your morning right with programmable brewing, thermal carafe to keep coffee hot for hours, and built-in water filtration.',
    countInStock: 40,
  },
  {
    name: 'Travel Backpack 40L',
    price: 119.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    category: 'Fashion',
    rating: 4.9,
    numReviews: 178,
    description: 'The ultimate carry-on companion. Features weather-resistant material, laptop sleeve, hidden security pockets, and ergonomic padded straps.',
    countInStock: 60,
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 139.5,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
    category: 'Electronics',
    rating: 4.7,
    numReviews: 430,
    description: 'Elevate your gaming with tactile mechanical switches, customizable per-key RGB lighting, and durable aluminum frame.',
    countInStock: 0,
  },
  {
    name: 'Yoga Mat with Alignment Lines',
    price: 45.0,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=1000&auto=format&fit=crop',
    category: 'Sports',
    rating: 4.4,
    numReviews: 112,
    description: 'Perfect your poses with eco-friendly TPE material, laser-etched alignment system, and extra-thick cushioning for joint protection.',
    countInStock: 120,
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // 1. Create a dummy Admin user
    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by pre-save hook automatically, but insertMany bypasses hooks
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
      },
    ]);

    // Need to correctly hash passwords manually for insertMany
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await User.deleteMany(); // Reset
    const usersWithHashedPasswords = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isAdmin: false,
      },
    ]);

    const adminUser = usersWithHashedPasswords[0]._id;

    // 2. Add admin user ref to all products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // 3. Insert products into DB
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
