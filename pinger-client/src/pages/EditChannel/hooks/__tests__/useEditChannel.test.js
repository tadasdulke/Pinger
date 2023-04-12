import { act, renderHook, waitFor } from '@testing-library/react';

import editChannel from '../../services/editChannel';
import useEditChannel from '../useEditChannel';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/editChannel', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useEditChannel', () => {
    it('should edit channel', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        editChannel.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useEditChannel())

        await waitFor(async () => {
            const actionResult = await result.current.editChannelAction();
            expect(actionResult).toBe(expectedResult)
        })
    });
});