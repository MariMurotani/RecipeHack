import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import Layout from './components/Layout';  // Layout コンポーネントをインポート
import Home from './pages/Home';
import MainGroup from './pages/MainGroup';
import About from './pages/About';
import NotFound from './pages/NotFound';

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,  // 共通の Layout コンポーネント
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/main-group",
        element: <MainGroup />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ]
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
