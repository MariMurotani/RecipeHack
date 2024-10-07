import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import NotFound from './components/NotFound';

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,  // Aboutコンポーネントへのルート
  },
  {
    path: "*",
    element: <NotFound />,  // 存在しないパスにアクセスしたときに表示
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
