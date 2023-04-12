import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import CreateChatSpaceForm from '../CreateChatSpaceForm';
import { useCreateChatSpace } from '../hooks';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@Router'

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn()
}))

jest.mock('react-redux', () => ({
    useDispatch: jest.fn()
}))

jest.mock('../hooks', () => ({
    useCreateChatSpace: jest.fn()
}))

describe('LoginForm', () => {
    beforeEach(() => {
        useCreateChatSpace.mockReturnValue({sendAction: jest.fn()});
    })

    it('should render withour errors', () => {
        expect(() => render(<CreateChatSpaceForm/>)).not.toThrow();
    });

    it('should render input fields', () => {
        const { getByLabelText } = render(
            <CreateChatSpaceForm/>
        );
        
        expect(getByLabelText("Name")).toBeInTheDocument()
        
    });

    it('should indicate fields as required if fields are empty', async () => {
        const { getAllByText, getByRole } = render(
            <CreateChatSpaceForm/>
        );
        
        const createButton = getByRole('button', {
            name: /Create/i
          })
        
        await act(() => {
            fireEvent.click(createButton)
        });

        expect(getAllByText("Required")).toHaveLength(1);
    });

    it('should handle create after create button click', async () => {
        const response = { status: 204}
        const createChatSpaceActionMock = jest.fn();
        useCreateChatSpace.mockReturnValue({sendAction: createChatSpaceActionMock.mockResolvedValue(response)});
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);

        const { getByRole, getByLabelText } = render(
            <CreateChatSpaceForm />
        );
        
        const createButton = getByRole('button', {
            name: /Create/i
          })

        const chatSpaceFieldName = getByLabelText('Name')
        const chatSpaceName = "sample chatspace"
        
        await act(() => {
            fireEvent.change(chatSpaceFieldName, {target: {value: chatSpaceName}})
            fireEvent.click(createButton)
        });

        expect(createChatSpaceActionMock).toBeCalledWith(chatSpaceName);
        expect(createChatSpaceActionMock).toBeCalledTimes(1);
        expect(navigateMock).toBeCalledWith(ROUTES.CHATSPACES)
    });
});