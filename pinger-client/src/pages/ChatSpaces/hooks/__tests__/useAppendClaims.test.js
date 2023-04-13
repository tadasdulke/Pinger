import { renderHook, waitFor } from '@testing-library/react';

import useAppendClaims from '../useAppendClaims';
import appendClaims from '../../services/appendClaims';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/appendClaims', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useAppendClaims', () => {
    it('should append claims', async () => {
        const expectedResult = {
            status: 204,
        }

        appendClaims.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useAppendClaims())

        await waitFor(async () => {
            const actionResult = await result.current.addClaims();
            expect(actionResult).toBe(expectedResult)
        })
    });
});