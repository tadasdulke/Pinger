import removeFile from '../removeFile';

describe('removeFile', () => {
  test('should remove file', async () => {
    const files = [
        {
            file: {
                name: 'test.txt'
            }
        }
    ]

    const setFiles = jest.fn();

    removeFile('test.txt', setFiles, files);

    expect(setFiles).toBeCalledTimes(1);
  });
});
