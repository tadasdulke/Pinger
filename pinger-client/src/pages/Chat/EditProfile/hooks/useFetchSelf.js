import { useFetchData } from '@Common'

import getSelf from "../services/getSelf";

const useFetchSelf = () => {
    const { result } = useFetchData(
        getSelf,
    );

    return {
        self: result
    }
}

export default useFetchSelf;
