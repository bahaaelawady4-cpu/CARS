import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../services/api';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Eye, Plus } from 'lucide-react';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await getCars({ limit: 1000 });
      console.log(' Fetched cars:', response.data.data);
      setCars(response.data.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (carId) => {
    console.warn(` Image failed to load for car: ${carId}`);
    setImageErrors(prev => ({ ...prev, [carId]: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-white mb-3">Our Collection</h1>
          <p className="text-slate-400 max-w-lg leading-relaxed">Discover the world's most luxurious and high-performance vehicles, handpicked for you.</p>
        </div>
        <Link to="/add" className="btn btn-primary whitespace-nowrap">
          <Plus size={20} /> Add Inventory
        </Link>
      </header>

      {cars.length === 0 ? (
        <div className="glass p-20 text-center rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">No cars in the garage yet.</h2>
          <Link to="/add" className="btn btn-primary">Add your first car</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => {
            const defaultImage = 'https://placehold.co/800x500/1e293b/fff?text=No+Image';
            const serverImage = car.image && car.image.length > 0
              ? car.image[0].startsWith('/')
                ? `http://localhost:5000${car.image[0]}?t=2026`
                : car.image[0]
              : defaultImage;
            const imageSrc = imageErrors[car._id] ? defaultImage : serverImage;

            return (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 relative flex flex-col"
              >
                <div 
                  className="w-full relative overflow-hidden bg-[#050505]"
                  style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img 
                    src={imageSrc}
                    alt={car.name}
                    onError={() => handleImageError(car._id)}
                    className="group-hover:scale-110 transition-transform duration-700 ease-out"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="absolute top-4 right-4 glass px-4 py-1.5 rounded-full text-sm font-bold text-white z-10 shadow-lg">
                  {car.year}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-1 block">
                        {car.brand} • {car.category?.name || 'Uncategorized'}
                      </span>
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {car.name}
                      </h3>
                    </div>
                    <span className="text-xl font-bold text-blue-400">
                      ${car.price?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                    {car.description || "Experience pure luxury and performance with this exceptional vehicle."}
                  </p>
                  <Link to={`/car/${car._id}`} className="btn btn-secondary w-full justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Eye size={18} /> View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
