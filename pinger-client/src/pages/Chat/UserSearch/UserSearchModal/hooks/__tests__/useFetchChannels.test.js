import { renderHook, waitFor } from '@testing-library/react';
 
import { getChannels } from '@Services'
import useFetchChannels from '../useFetchChannels';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('@Services', () => ({
    getChannels: jest.fn(),
}));

describe('getChannels', () => {
    it('should fetch channels', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getChannels.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchChannels("channel search"))

        await waitFor(async () => {
            expect(result.current.channelsResult).toBe(expectedResult)
        })
    });
});