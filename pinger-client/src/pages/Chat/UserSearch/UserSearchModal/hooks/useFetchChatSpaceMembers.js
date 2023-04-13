import { searchChatSpaceMembers } from '@Services';
import { useFetchData } from '@Common'

const useFetchChatSpaceMembers = (searchInput) => {
    const { loaded, result } = useFetchData(
        async () => await searchChatSpaceMembers(searchInput),
        [searchInput],
      );


    return { chatSpaceMembersLoaded: loaded, chatSpaceMembersResult: result }
}

export default useFetchChatSpaceMembers;