import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import FileList from '../FileList';
import removeFile from '../utils/removeFile';

jest.mock('../utils/removeFile', () => ({
    __esModule: true,
    default: jest.fn()
}))

describe('FileList', () => {
    const files = [
        {
            file: {
                name: 'test.txt'
            }
        }
    ]

    it('should render withour errors', () => {
        expect(() => render(
            <FileList
                files={files}
            />
        )).not.toThrow();
    });

    it('should render call removeFile after click', async () => {
        const removeFileMock = jest.fn();
        removeFile.mockReturnValue(removeFileMock)

        render(
            <FileList
                files={files}
            />
        )

        const removeFileButton = screen.getByTestId('remove-file-button')
        await act(() => {
            fireEvent.click(removeFileButton)
        });        
    });
});