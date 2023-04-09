import apiClient from '@Api';
import uploadChannelMessageFile from '../uploadChannelMessageFile'

describe('uploadChannelMessageFile', () => {
  test('should upload channel message file', async () => {
    const expectedResponse = {
        status: 200,
        data: "updated"
    }
    
    apiClient.addChannelMessageFile = jest.fn().mockResolvedValue(expectedResponse);
    
    const response = await uploadChannelMessageFile({fileName: "file"}, 1);
    expect(response).toEqual(expectedResponse);
  });
});
