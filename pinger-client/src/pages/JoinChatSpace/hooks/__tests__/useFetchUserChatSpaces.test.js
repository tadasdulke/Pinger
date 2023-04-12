import { renderHook, waitFor } from '@testing-library/react';

import getUserChatSpaces from '../../../ChatSpaces/services/getUserChatSpaces';
import useFetchUserChatSpaces from '../useFetchUserChatSpaces';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../../ChatSpaces/services/getUserChatSpaces', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useFetchUserChatSpaces', () => {
    it('should fetch joined chat spaces', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getUserChatSpaces.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchUserChatSpaces())

        await waitFor(async () => {
            expect(result.current.joinedChatSpaces).toBe(expectedResult)
        })
    });
});