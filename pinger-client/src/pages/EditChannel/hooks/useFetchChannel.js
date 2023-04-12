import { useFetchData } from '@Common'
import { getChannel } from '@Services'

const useFetchChannel = (channelId) => {
    const { loaded: channelLoaded, result: channelResult } = useFetchData(
        () => getChannel(channelId),
    );

    return {
        channelLoaded,
        channelResult
    }
}

export default useFetchChannel;