import { renderHook, waitFor } from '@testing-library/react';
 
import { searchChatSpaceMembers } from '@Services'
import useFetchChatSpaceMembers from '../useFetchChatSpaceMembers';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('@Services', () => ({
    searchChatSpaceMembers: jest.fn(),
}));

describe('useFetchChatSpaceMembers', () => {
    it('should fetch channels', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        searchChatSpaceMembers.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchChatSpaceMembers("channel search"))

        await waitFor(async () => {
            expect(result.current.chatSpaceMembersResult).toBe(expectedResult)
        })
    });
});