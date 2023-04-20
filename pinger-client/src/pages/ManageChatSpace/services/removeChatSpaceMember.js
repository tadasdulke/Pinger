import apiClient from '@Api';

const removeChatSpaceMember = async (memberId) => await apiClient.removeChatSpaceMember(memberId);

export default removeChatSpaceMember;
