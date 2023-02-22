import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import {Login, Register} from './pages'

  const router = createBrowserRouter([
    {
      path: "login",
      element: <Login/>,
    },
    {
      path: "register",
      element: <Register/>,
    },
  ]);

const App = () => (
    <RouterProvider router={router}/>
)

export default App;