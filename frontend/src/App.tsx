import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import { AppProvider } from './AppContext'; 
import Layout from './components/Layout'; 
import Home from './pages/Home';
import Group from './pages/Group';
import MainGroup from './pages/MainGroup';
import ParingSearch from './pages/ParingSearch';
import Constitution from './pages/Constitution';
import About from './pages/About';
import NotFound from './pages/NotFound';
import CentralityAnalytics from './pages/CentralityAnalytics';

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,  // 共通の Layout コンポーネント
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />, 
      },
      {
        path: "/main-group",
        element: <MainGroup />,
        errorElement: <NotFound />, 
      },
      {
        path: "/group",
        element: <Group />,
        errorElement: <NotFound />, 
      },
      {
        path: "/paring_search",
        element: <ParingSearch />,
        errorElement: <NotFound />, 
      },
      {
        path: "/constitution",
        element: <Constitution />,
        errorElement: <NotFound />, 
      },
      {
        path: "/centrality_analytics",
        element: <CentralityAnalytics />,
        errorElement: <NotFound />, 
      },
      {
        path: "/about",
        element: <About />,
        errorElement: <NotFound />, 
      },
      {
        path: "*",
        element: <NotFound />,
        errorElement: <NotFound />, 
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