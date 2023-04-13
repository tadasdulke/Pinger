import { renderHook, waitFor } from '@testing-library/react';
 
import useFetchChatSpaceMember from '../useFetchChatSpaceMember';
import getChatSpaceMember from '../../services/getChatSpaceMember';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/getChatSpaceMember', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useFetchChatSpaceMember', () => {
    it('should fetch channel', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getChatSpaceMember.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchChatSpaceMember())

        await waitFor(async () => {
            expect(result.current.member).toBe(expectedResult.data)
        })
    });
});