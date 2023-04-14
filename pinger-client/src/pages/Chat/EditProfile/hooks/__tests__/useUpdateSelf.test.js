import { renderHook, act } from '@testing-library/react';

import useUpdateSelf from '../useUpdateSelf'
import updateSelf from '../../services/updateSelf';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/updateSelf', () => ({
    __esModule: true,
    default: jest.fn()
}));

describe('useUpdateSelf', () => {
    it('should update self', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        updateSelf.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useUpdateSelf())
        await act(async () => {
            const response = await result.current.sendUpdateSelfAction();

            expect(response).toBe(expectedResult)
        })
    });
});