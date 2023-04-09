import apiClient from '@Api';
import uploadPrivateFile from '../uploadPrivateFile'

describe('uploadPrivateFile', () => {
  test('should upload private message file', async () => {
    const expectedResponse = {
        status: 200,
        data: "updated"
    }
    
    apiClient.addPrivateMessageFile = jest.fn().mockResolvedValue(expectedResponse);
    
    const response = await uploadPrivateFile({fileName: "file"}, 1);
    expect(response).toEqual(expectedResponse);
  });
});
