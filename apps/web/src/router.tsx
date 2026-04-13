import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/RootLayout';
import { Landing } from './pages/Landing';
import { Explore } from './pages/Explore';
import { PartDetail } from './pages/PartDetail';
import { Build } from './pages/Build';
import { Community } from './pages/Community';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'explore', element: <Explore /> },
      { path: 'parts/:category/:id', element: <PartDetail /> },
      { path: 'build', element: <Build /> },
      { path: 'community', element: <Community /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
