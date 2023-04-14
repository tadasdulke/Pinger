import { useApiAction } from '@Common'
import updateSelf from '../services/updateSelf'

const useUpdateSelf = () => {
    const { sendAction } = useApiAction(
        (file, userName) => updateSelf(file, userName),
    );

    return {
        sendUpdateSelfAction: sendAction
    }


}

export default useUpdateSelf;