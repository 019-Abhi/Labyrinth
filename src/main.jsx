import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Home from './Home.jsx';
import Game from './Game.jsx';
import Login from './Login.jsx'; 
import Createacc from './Createacc.jsx';

const router = createBrowserRouter([

  {path: '/home', element: <Home />},
  {path: '/game', element: <Game />},
  {path: '/login', element: <Login />},
  {path: '/createacc', element: <Createacc />},
  {path: '/', element: <Login />},



]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router = {router} />
  </StrictMode>,
)
