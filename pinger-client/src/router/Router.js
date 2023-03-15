import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BaseLayout } from '@Components';
import { ROUTES } from "@Router";
import {Login, Register, ChatSpaces, CreateChatSpace, Chat, JoinChatSpace, CreateChannel } from '../pages'
import AuthorizedRoute from './AuthorizedRoute'
import UnauthorizedRoute from './UnauthorizedRoute'
import ManagedRoute from './ManagedRoute'
import PrivateChat from '../pages/Chat/PrivateChat';
import ChannelChat from '../pages/Chat/ChannelChat';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.LOGIN}
          element={
            <UnauthorizedRoute>
              <BaseLayout>
                <Login/>
              </BaseLayout>
            </UnauthorizedRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <UnauthorizedRoute>
              <BaseLayout>
                <Register/>
              </BaseLayout>
            </UnauthorizedRoute>
          }
        />
        <Route
          path={ROUTES.MAIN}
          element={<ManagedRoute/>}
        />
        <Route
          path={ROUTES.CHATSPACES}
          element={
            <AuthorizedRoute>
              <BaseLayout>
                <ChatSpaces/>
              </BaseLayout>
            </AuthorizedRoute>
          }
        />
        <Route
          path={ROUTES.CREATE_CHATSPACE}
          element={
            <AuthorizedRoute>
              <BaseLayout>
                <CreateChatSpace/>
              </BaseLayout>
            </AuthorizedRoute>
          }
        />
        <Route
          path={ROUTES.USE_CHATSPACE}
          element={
            <AuthorizedRoute>
              <BaseLayout>
                <Chat/>
              </BaseLayout>
            </AuthorizedRoute>
          }
        >
          <Route
            path="direct-message/:receiverId"
            element={<PrivateChat />}
          />
          <Route
            path={ROUTES.CREATE_CHANNEL}
            element={<CreateChannel />}
          />
          <Route
            path={`${ROUTES.CHANNEL_CHAT}/:channelId`}
            element={<ChannelChat />}
          />
        </Route>
        <Route
          path={ROUTES.JOIN_CHATSPACE}
          element={
            <AuthorizedRoute>
              <BaseLayout>
                <JoinChatSpace/>
              </BaseLayout>
            </AuthorizedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;