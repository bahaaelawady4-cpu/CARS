import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, PlusCircle, Home, LogIn, LogOut, User, UserPlus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass fixed top-0 w-full z-50 py-4 px-6 mb-12 shadow-2xl">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter hover:scale-105 transition-transform">
          <Car size={32} className="text-blue-500" />
          <span>LUX<span className="text-blue-500">DRIVE</span></span>
        </Link>
        
        <div className="flex items-center gap-8 font-medium">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-1 hover:text-blue-400 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`
            }
          >
            <Home size={18} /> Home
          </NavLink>

          {user ? (
            <>
              <NavLink 
                to="/add" 
                className={({ isActive }) => 
                  `flex items-center gap-1 hover:text-blue-400 transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`
                }
              >
                <PlusCircle size={18} /> Add Car
              </NavLink>
              
              <div className="h-6 w-[1px] bg-slate-800 mx-2" />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                  <User size={16} className="text-blue-500" />
                  <span className="text-sm font-bold truncate max-w-[100px]">
                    {user.name}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                <LogIn size={18} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                <UserPlus size={18} /> Join Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
