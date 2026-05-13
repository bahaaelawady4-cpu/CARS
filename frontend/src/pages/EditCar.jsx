import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getCarById, updateCar } from '../services/api';
import { ArrowLeft, Save, Car, Tag, DollarSign, Calendar, FileText, ImageIcon } from 'lucide-react';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    year: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchCarDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCarDetails = async () => {
    try {
      const { data } = await getCarById(id);
      const car = data.data;
      setFormData({
        name: car.name,
        brand: car.brand,
        price: car.price,
        year: car.year,
        description: car.description || '',
      });
      // car.image is an array, extract the first image URL for preview
      if (car.image && car.image.length > 0) {
        const imgUrl = car.image[0].startsWith('/')
          ? `http://localhost:5000${car.image[0]}`
          : car.image[0];
        setPreview(imgUrl);
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('Could not load car details');
      navigate('/');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('images', imageFile);

    try {
      await updateCar(id, data);
      navigate(`/car/${id}`);
    } catch (error) {
      console.error('Error updating car:', error);
      alert(error.response?.data?.message || 'Error updating car');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (fetching) return <div className="text-center py-20 text-slate-400">Loading details...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link to={`/car/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Details
      </Link>

      <section className="space-y-6">
        <header>
          <h1 className="text-4xl font-extrabold text-white">Edit Vehicle</h1>
          <p className="text-slate-400 mt-2">Modify the details for the {formData.brand} {formData.name}.</p>
        </header>

        <form onSubmit={handleSubmit} className="glass p-8 rounded-3xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Car size={14} /> Name
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <Tag size={14} /> Brand
              </label>
              <input
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
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
                <p className="text-xs text-slate-500 mt-2">Leave empty to keep the current image.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <FileText size={14} /> Description
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full justify-center text-lg py-4 disabled:opacity-50"
          >
            {loading ? 'Updating...' : <><Save size={20} /> Update Car Details</>}
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditCar;
