import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import './styles/responsive.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer 
        position="bottom-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable ={false}
        pauseOnHover 
        theme="light"
        limit={3} // Set a limit to avoid too many toasts
      />
    </BrowserRouter>
  </React.StrictMode>
);