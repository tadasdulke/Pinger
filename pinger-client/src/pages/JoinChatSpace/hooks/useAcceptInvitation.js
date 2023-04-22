import { useApiAction } from '@Common';
import acceptInvitation from '../serivces/acceptInvitation';

const useAcceptInvitation = () => {
  const { loaded, sendAction } = useApiAction(
    (chatspaceId) => acceptInvitation(chatspaceId),
  );

  return {
    inviteAcceptLoaded: loaded,
    acceptInvitationAction: sendAction,
  };
};

export default useAcceptInvitation;
