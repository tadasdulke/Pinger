import { renderHook, waitFor } from '@testing-library/react';

import { useCreateChatSpace } from '..';
import createChatSpace from '../../services/createChatSpace';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/createChatSpace', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useCreateChatSpace', () => {
    it('should initiate chat space creation action', async () => {
        const expectedResult = {
            status: 200,
        }

        createChatSpace.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useCreateChatSpace())

        await waitFor(async () => {
            const actionResult = await result.current.sendAction();
            expect(actionResult).toBe(expectedResult)
        })
    });
});