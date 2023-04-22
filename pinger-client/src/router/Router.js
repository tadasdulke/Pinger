import React, {useEffect} from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { BaseLayout } from '@Components';
import { ROUTES } from "@Router";
import { useDispatch } from 'react-redux';
import {
  Login, 
  Register, 
  ChatSpaces, 
  CreateChatSpace, 
  Chat, 
  JoinChatSpace, 
  CreateChannel, 
  EditChannel, 
  ManageChatSpace,
  ChatSpaceMembers,
  ChatSpaceChannels
} from '../pages'
import AuthorizedRoute from './AuthorizedRoute'
import UnauthorizedRoute from './UnauthorizedRoute'
import ManagedRoute from './ManagedRoute'
import PrivateChat from '../pages/Chat/PrivateChat';
import ChannelChat from '../pages/Chat/ChannelChat';
import EditProfile from '../pages/Chat/EditProfile';

import { restore as restoreErrorState } from '../store/slices/errors';

const Router = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreErrorState())
  }, [location])

  return (
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
          <Route
            path={ROUTES.EDIT_PROFILE}
            element={<EditProfile />}
          />
          <Route
            path={`${ROUTES.EDIT_CHANNEL}/:channelId`}
            element={<EditChannel />}
          />
          <Route
            path="manage-chatspace"
            element={<ManageChatSpace />}
          />
          <Route
            path="chatspace-users"
            element={<ChatSpaceMembers />}
          />
          <Route
            path="chatspace-channels"
            element={<ChatSpaceChannels />}
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
  )
}

export default Router;