import { useFetchData } from '@Common'
import { searchChatSpaceMembers } from '@Services';

const useSearchChatSpaceMembers = (searchField) => {
    const { loaded: chatspaceMembersLoaded, result: allChatSpaceMembersResult } = useFetchData(
        () => searchChatSpaceMembers(searchField),
        [searchField],
    );

    return {
        chatspaceMembersLoaded,
        allChatSpaceMembersResult
    }
}

export default useSearchChatSpaceMembers;
