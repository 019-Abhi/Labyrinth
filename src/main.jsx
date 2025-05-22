import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Home from './Home.jsx';
import Game from './Game.jsx';

const router = createBrowserRouter([

  {path: '/Labyrinth/', element: <Home />},
  {path: '/Labyrinth/Game', element: <Game />},

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
