const mockUpload = jest.fn();

const mockImageApi = jest.fn((..._args) => ({
  upload: mockUpload,
}));

jest.mock('../AuthActions');
jest.mock('../../api/ImageAPI', () => ({
  __esModule: true,
  default: mockImageApi,
}));

import ImageAPI from '../../api/ImageAPI';
import { AuthAccess } from '../AuthActions';
import ImageActions from '../ImageActions';
import events from 'events';

afterEach(() => {
  jest.clearAllMocks();
});

it('sets up the API with the correct URL and access action', () => {
  expect(ImageAPI).toHaveBeenCalledWith('example api url', AuthAccess);
});

describe('ImageActions', () => {
  describe('#upload', () => {
    beforeEach(() => {
      mockUpload.mockResolvedValue('example response');
    });

    it('call the API', async () => {
      const image_key = 'example image key';
      const file = 'example file' as unknown as File;
      const event = 'example event' as unknown as events.EventEmitter;

      const result = await ImageActions.upload(image_key, file, event);

      expect(mockUpload).toHaveBeenCalledWith(image_key, file, event);
      expect(result).toEqual('example response');
    });
  });
});
