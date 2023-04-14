import { renderHook, waitFor } from '@testing-library/react';

import getSelf from "../../services/getSelf";
import useFetchSelf from '../useFetchSelf';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/getSelf', () => ({
    __esModule: true,
    default: jest.fn()
}));

describe('useFetchSelf', () => {
    it('should fetch self', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getSelf.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useFetchSelf())

        await waitFor(async () => {
            expect(result.current.self).toBe(expectedResult)
        })
    });
});