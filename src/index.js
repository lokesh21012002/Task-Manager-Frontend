import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App2 from './App2';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
