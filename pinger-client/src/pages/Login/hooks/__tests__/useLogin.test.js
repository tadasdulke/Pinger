import useLogin from "../useLogin";
import getToken from "../../services/getToken";
import { act, renderHook, waitFor } from '@testing-library/react';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  }));

jest.mock('../../services/getToken', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('LoginForm', () => {
    it('should render withour errors', async () => {
        const expectedResult = {
            status: 200,
            data: 'test'
        }

        getToken.mockResolvedValue(expectedResult);

        const { result } = renderHook(() => useLogin())

        act(() => {
            result.current.sendAction()
        })

        await waitFor(async () => {
            const actionResult = await result.current.sendAction();
            expect(actionResult).toBe(expectedResult)
        })
    });
});