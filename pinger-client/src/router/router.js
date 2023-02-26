import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./constants";
import {Login, Register, ChatSpaces} from '../pages'
import AuthorizedRoute from './AuthorizedRoute'
import UnauthorizedRoute from './UnauthorizedRoute'
import ManagedRoute from './ManagedRoute'

const router = createBrowserRouter([
    {
      path: ROUTES.LOGIN,
      element: (
        <UnauthorizedRoute>
            <Login/>
        </UnauthorizedRoute>
        ),
    },
    {
      path: ROUTES.REGISTER,
      element: (
        <UnauthorizedRoute>
            <Register/>
        </UnauthorizedRoute>
        ),
    },
    {
      path: ROUTES.MAIN,
      element: (
        <ManagedRoute/>
      ),
    },
    {
      path: ROUTES.CHATSPACES,
      element: (
        <AuthorizedRoute>
            <ChatSpaces/>
        </AuthorizedRoute>
      ),
    },
]);

export default router;