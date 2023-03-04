import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { BaseLayout } from '@Components';
import { ROUTES } from "@Router";
import {Login, Register, ChatSpaces, CreateChatSpace, Chat } from '../pages'
import AuthorizedRoute from './AuthorizedRoute'
import UnauthorizedRoute from './UnauthorizedRoute'
import ManagedRoute from './ManagedRoute'

const router = createBrowserRouter([
    {
      path: ROUTES.LOGIN,
      element: (
        <UnauthorizedRoute>
          <BaseLayout>
            <Login/>
          </BaseLayout>
        </UnauthorizedRoute>
        ),
    },
    {
      path: ROUTES.REGISTER,
      element: (
        <UnauthorizedRoute>
          <BaseLayout>
            <Register/>
          </BaseLayout>
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
          <BaseLayout>
            <ChatSpaces/>
          </BaseLayout>
        </AuthorizedRoute>
      ),
    },
    {
      path: ROUTES.CREATE_CHATSPACE,
      element: (
        <AuthorizedRoute>
          <BaseLayout>
            <CreateChatSpace/>
          </BaseLayout>
        </AuthorizedRoute>
      ),
    },
    {
      path: ROUTES.USE_CHATSPACE,
      element: (
        <AuthorizedRoute>
          <BaseLayout>
            <Chat/>
          </BaseLayout>
        </AuthorizedRoute>
      ),
    },
]);

export default router;