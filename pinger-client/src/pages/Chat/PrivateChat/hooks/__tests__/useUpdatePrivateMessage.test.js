import { renderHook, waitFor } from '@testing-library/react';
 
import useUpdatePrivateMessage from '../useUpdatePrivateMessage';
import updatePrivateMessage from '../../services/updatePrivateMessage';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/updatePrivateMessage', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useUpdatePrivateMessage', () => {
    it('should update private message', async () => {
        const expectedResult = {
            status: 204,
        }

        updatePrivateMessage.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useUpdatePrivateMessage())

        await waitFor(async () => {
            const actionResult = await result.current.sendUpdateMessageAction();
            expect(result.current.member).toBe(actionResult.data)
        })
    });
});