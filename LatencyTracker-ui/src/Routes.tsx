import React from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import Homepage from './pages/homepage';

const AppRoutes: React.FC = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Homepage />,
    },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
