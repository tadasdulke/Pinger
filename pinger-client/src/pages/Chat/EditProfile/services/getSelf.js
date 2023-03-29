import apiClient from '@Api';

const getSelf = async () => {
    return await apiClient.getSelf();
}

export default getSelf;