import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import AddCar from './pages/AddCar';
import Login from './pages/Login';
import Register from './pages/Register';
import EditCar from './pages/EditCar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/car/:id" element={<CarDetails />} />
            <Route path="/add" element={<AddCar />} />
            <Route path="/edit/:id" element={<EditCar />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
