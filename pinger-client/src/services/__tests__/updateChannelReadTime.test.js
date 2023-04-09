import apiClient from '@Api';
import updateChannelReadTime from '../updateChannelReadTime'

describe('updateChannelReadTime', () => {
  test('should update channel read time', async () => {
    const expectedResponse = {
        status: 200,
        data: "updated"
    }
    
    apiClient.updateChannelReadTime = jest.fn().mockResolvedValue(expectedResponse);
    
    const response = await updateChannelReadTime(1);
    expect(response).toEqual(expectedResponse);
  });
});
