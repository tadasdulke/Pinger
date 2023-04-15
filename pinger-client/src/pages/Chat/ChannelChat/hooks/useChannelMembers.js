import { useFetchData } from '@Common'
import { getChannelMembers } from '@Services';

const useChannelMembers = (channelId) => {
    const { loaded: channelMembersLoaded, result: channelMembersResult } = useFetchData(
        () => getChannelMembers(channelId),
    );

    return {
        channelMembersLoaded,
        channelMembersResult
    }
}

export default useChannelMembers;

