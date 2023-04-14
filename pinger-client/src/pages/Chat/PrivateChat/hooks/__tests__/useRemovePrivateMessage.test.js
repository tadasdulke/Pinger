import { renderHook, waitFor } from '@testing-library/react';
 
import useRemovePrivateMessage from '../useRemovePrivateMessage';
import removePrivateMessage from '../../services/removePrivateMessage';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/removePrivateMessage', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useRemovePrivateMessage', () => {
    it('should remove private message', async () => {
        const expectedResult = {
            status: 204,
        }

        removePrivateMessage.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useRemovePrivateMessage())

        await waitFor(async () => {
            const actionResult = await result.current.sendRemoveMessageAction();
            expect(actionResult).toBe(expectedResult)
        })
    });
});