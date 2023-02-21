import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Link,
} from "react-router-dom";
import Login from './pages/Login'
import store from './store'
import { Provider } from 'react-redux';

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <h1>Hello World</h1>
          <Link to="login">About Us</Link>
        </div>
      ),
    },
    {
      path: "login",
      element: <Login/>,
    },
  ]);

const App = () => (
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)

export default App;