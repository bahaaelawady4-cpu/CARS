import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCarById, deleteCar } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Trash2, Calendar, DollarSign, Tag, Info, Pencil } from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await getCarById(id);
      setCar(response.data.data);
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('Could not load car details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this car from inventory?')) {
      try {
        await deleteCar(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting car:', error);
        alert(error.response?.data?.message || 'Error deleting car');
      }
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-slate-400">Loading car details...</div>;
  if (!car) return <div className="text-center py-20 text-slate-400">Car not found.</div>;

  const imageUrl = car.image && car.image[0]
    ? (car.image[0].startsWith('/') ? `http://localhost:5000${car.image[0]}` : car.image[0])
    : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} /> Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div 
          className="rounded-3xl overflow-hidden glass w-full relative bg-[#050505] flex items-center justify-center"
          style={{ height: '400px' }}
        >
          <img 
            src={imageUrl} 
            alt={car.name}
            className="transition-transform duration-1000 ease-out hover:scale-105 drop-shadow-2xl"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        <div className="space-y-6">
          <header>
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm">{car.brand}</span>
            <h1 className="text-4xl font-extrabold text-white mt-1">{car.name}</h1>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Year</p>
                <p className="font-bold text-white">{car.year}</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Price</p>
                <p className="font-bold text-white">${car.price?.toLocaleString()}</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Brand</p>
                <p className="font-bold text-white">{car.brand}</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Info size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Category</p>
                <p className="font-bold text-white">{car.category?.name || 'Uncategorized'}</p>
              </div>
            </div>
            <div className="glass p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Info size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-bold text-white">Available</p>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl space-y-3">
            <h3 className="font-bold text-white">Description</h3>
            <p className="text-slate-400 leading-relaxed font-light">
              {car.description || "Experience pure luxury and performance with this exceptional vehicle. Contact our sales department for more information about performance and luxury packages."}
            </p>
          </div>

          {isAdmin && (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link to={`/edit/${id}`} className="btn bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all justify-center">
                <Pencil size={18} /> Edit Details
              </Link>
              <button 
                onClick={handleDelete} 
                className="btn bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all justify-center"
              >
                <Trash2 size={18} /> Delete Car
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
