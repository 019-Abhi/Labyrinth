import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Play from './Play.jsx';
import Home from './Home.jsx'


const router = createBrowserRouter([

  {path: '/Labyrinth/', element: <Home />},
  {path: '/Labyrinth/Play', element: <Play />}

]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
