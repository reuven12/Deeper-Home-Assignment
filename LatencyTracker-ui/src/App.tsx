import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Routes from './Routes';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';

const App: React.FC = () => (
  <PrimeReactProvider>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </PrimeReactProvider>
);

export default App;
