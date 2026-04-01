import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCar } from '../services/api';
import { ArrowLeft, Save, Car, Tag, DollarSign, Calendar, FileText, ImageIcon } from 'lucide-react';

const AddCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    year: new Date().getFullYear(),
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert('Please select a vehicle image');
    
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('images', imageFile);

    try {
      await createCar(data);
      navigate('/');
    } catch (error) {
      console.error('Error adding car:', error);
      alert(error.response?.data?.message || 'Error adding car. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Collection
      </Link>

      <section className="space-y-6">
        <header>
          <h1 className="text-4xl font-extrabold text-white">Add New Vehicle</h1>
          <p className="text-slate-400 mt-2">Enter the details of the luxury car to add it to your collection.</p>
        </header>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Car size={14} /> Name
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Model S Plaid"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Tag size={14} /> Brand
              </label>
              <input
                required
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Tesla"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <DollarSign size={14} /> Price ($)
              </label>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Calendar size={14} /> Year
              </label>
              <input
                required
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <ImageIcon size={14} /> Vehicle Image
            </label>
            <div className="flex items-start gap-4">
              {preview && (
                <div className="w-32 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-grow">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-2">Select a high-quality image of the vehicle.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <FileText size={14} /> Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about this exceptional vehicle..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full justify-center text-lg py-4 disabled:opacity-50"
          >
            {loading ? 'Adding to Garage...' : <><Save size={20} /> Save Car Details</>}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AddCar;
