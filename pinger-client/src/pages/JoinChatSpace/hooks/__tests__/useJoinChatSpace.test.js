import { act, renderHook, waitFor } from '@testing-library/react';

import joinChatSpace from '../../serivces/joinChatSpace';
import useJoinChatSpace from '../useJoinChatSpace';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../serivces/joinChatSpace', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useJoinChatSpace', () => {
    it('should initiate registartion action', async () => {
        const expectedResult = {
            status: 200,
        }

        joinChatSpace.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useJoinChatSpace())

        await waitFor(async () => {
            const actionResult = await result.current.joinChatSpace();
            expect(actionResult).toBe(expectedResult)
        })
    });
});