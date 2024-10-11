import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import { AppProvider } from './AppContext'; 
import Layout from './components/Layout'; 
import Home from './pages/Home';
import Group from './pages/Group';
import MainGroup from './pages/MainGroup';
import ParingSearch from './pages/ParingSearch';
import Result from './pages/Result';
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
        path: "/group",
        element: <Group />,
      },
      {
        path: "/paring_search",
        element: <ParingSearch />,
      },
      {
        path: "/result",
        element: <Result />,
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
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;