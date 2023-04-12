import { renderHook, waitFor } from '@testing-library/react';

import useCreateChannel from '../useCreateChannel';
import createChannel from '../../services/createChannel'; 

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/createChannel', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useCreateChannel', () => {
    it('should initiate channel creation action', async () => {
        const expectedResult = {
            status: 200,
        }

        createChannel.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useCreateChannel())

        await waitFor(async () => {
            const actionResult = await result.current.createChannel();
            expect(actionResult).toBe(expectedResult)
        })
    });
});