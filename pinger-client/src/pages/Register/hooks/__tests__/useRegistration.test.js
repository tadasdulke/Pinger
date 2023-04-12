import { act, renderHook, waitFor } from '@testing-library/react';
import handleRegistration from "../../services/handleRegistration";
import useRegistration from "../useRegistration";

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
  }));

jest.mock('../../services/handleRegistration', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('useRegistration', () => {
    it('should initiate registartion action', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        handleRegistration.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useRegistration())

        act(() => {
            result.current.sendAction()
        })

        await waitFor(async () => {
            const actionResult = await result.current.sendAction();
            expect(actionResult).toBe(expectedResult)
        })
    });
});