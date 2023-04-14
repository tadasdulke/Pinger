import { renderHook, waitFor } from '@testing-library/react';
 
import getChatSpace from '../../services/getChatSpace';
import useFetchChatSpace from '../useFetchChatSpace';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/getChatSpace', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useFetchChatSpace', () => {
    it('should fetch channel', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getChatSpace.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchChatSpace())

        await waitFor(async () => {
            expect(result.current.result).toBe(expectedResult)
        })
    });
});