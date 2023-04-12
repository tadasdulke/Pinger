import { act, renderHook, waitFor } from '@testing-library/react';

import getChatSpaces from '../../serivces/getChatSpaces';
import useFetchAllChatSpaces from '../useFetchAllChatSpaces';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../serivces/getChatSpaces', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useFetchAllChatSpaces', () => {
    it('should fetch all chat spaces', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getChatSpaces.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchAllChatSpaces())

        await waitFor(async () => {
            expect(result.current.allChatSpaces).toBe(expectedResult)
        })
    });
});