import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CategoryManagePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  
  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  
  const { token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingId) {
        await axios.put(`/api/categories/${editingId}`, { name, slug, image }, config);
        setEditingId(null);
      } else {
        await axios.post('/api/categories', { name, slug, image }, config);
      }
      
      // Reset form and refetch
      setName('');
      setSlug('');
      setImage('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setImage('');
  };

  return (
    <div className="container-custom py-10 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-dark mb-8">Manage Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Create/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-dark mb-6">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h2>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) {
                      setSlug(e.target.value.toLowerCase().replace(/ /g, '-'));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="e.g. Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-gray-50 text-gray-medium"
                  placeholder="e.g. electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 btn-primary py-2.5 flex justify-center items-center gap-2">
                  {editingId ? <CheckIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="btn-outline px-4 flex justify-center items-center">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Categories Table */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">{error}</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-medium">
                  <thead className="bg-gray-50 text-xs uppercase font-semibold text-dark border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Slug</th>
                      <th className="px-6 py-4">Products</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {cat.image ? (
                               <img src={cat.image} className="w-10 h-10 rounded-lg object-cover" alt={cat.name} />
                            ) : (
                               <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs uppercase">{cat.name.substring(0,2)}</div>
                            )}
                            <span className="font-semibold text-dark">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">{cat.slug}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                            {cat.productCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(cat)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                              <PencilSquareIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => deleteHandler(cat._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && (
                   <div className="text-center py-12 text-gray-medium">
                     No categories found. Create your first one!
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
