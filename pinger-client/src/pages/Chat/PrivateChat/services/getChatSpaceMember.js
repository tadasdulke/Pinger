import apiClient from '@Api';

const getChatSpaceMember = async (memberId) => {
    return await apiClient.getChatSpaceMember(memberId);
}

export default getChatSpaceMember;