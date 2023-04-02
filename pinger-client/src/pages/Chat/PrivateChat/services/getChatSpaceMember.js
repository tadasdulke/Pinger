import apiClient from '@Api';

const getChatSpaceMember = async (memberId) => await apiClient.getChatSpaceMember(memberId);

export default getChatSpaceMember;
