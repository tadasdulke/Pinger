import { useFetchData} from '@Common';
import { getChannels } from '@Services';

const useFetchChannels = (searchInput) => {
    const { loaded, result  } = useFetchData(
        async () =>  await getChannels(searchInput),
        [searchInput],
    );

    return {
        channelsLoaded: loaded,
        channelsResult: result
    }
}

export default useFetchChannels;