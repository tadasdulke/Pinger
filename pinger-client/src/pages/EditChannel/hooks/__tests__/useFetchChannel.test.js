import { renderHook, waitFor } from '@testing-library/react';
 
import { getChannel } from '@Services'
import { useFetchChannel } from '..'

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('@Services', () => ({
    getChannel: jest.fn(),
}));

describe('useFetchChannel', () => {
    it('should fetch channel', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getChannel.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchChannel())

        await waitFor(async () => {
            expect(result.current.channelResult).toBe(expectedResult)
        })
    });
});