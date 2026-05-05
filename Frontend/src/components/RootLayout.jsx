
import { Outlet } from "react-router-dom";
import Header from './Header'
import { Toaster } from 'react-hot-toast';

function RootLayout() {
  return (
    <div className="app-container">
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <div className="main-content container">
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
