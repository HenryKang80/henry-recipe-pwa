import React from 'react';
import ReactDOM from 'react-dom/client';
import RecipeApp from './App';
import { register } from './serviceWorkerRegistration';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecipeApp />
  </React.StrictMode>
);

register();