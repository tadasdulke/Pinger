import addFiles from '../addFiles';

describe('addFiles', () => {
  test('should trigger uploadFiles event', async () => {
    const target = {
        files: [
            {
                name: "text.txt"
            }
        ]
    }

    const uploadFilesMock = jest.fn();

    addFiles({target}, [], uploadFilesMock);

    expect(uploadFilesMock).toBeCalledWith(target.files)

  });
});
