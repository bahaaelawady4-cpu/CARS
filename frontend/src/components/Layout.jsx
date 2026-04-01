import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <div className="hero-gradient" />
      <Navbar />
      <main className="container pt-32 pb-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;
