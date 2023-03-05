import videoSchema from './video-schema';

const createVideo = (obj?: {}) => ({
  id: '',
  name: 'gub GUBS',
  stream_key: 'goobers video, gabbagool stream',
  download_key: 'goobers video, gabbagool download',
  download_available: true,
  member: true,
  tags: [
    'this is okay',
    'I\'m sure this is fine.',
    'HEYA',
  ],
  date_aired: '2021-11-28T01:00:00.000Z',
  date_added: '2021-11-28T01:00:00.000Z',
  ...obj
});


describe('when validating videos', () => {
  it.each([
    {
      video: createVideo({
        name: undefined
      }),
      expected: 'Required.',
    },
  ])(
    'returns $expected error for $video.',
    async ({
      video,
      expected,
    }) => {
      const { errors } = await videoSchema.validate(
        video,
        {
          strict: true,
          abortEarly: false,
        }
      ).catch(errors => errors);

      expect(errors).toContain(expected);
    }
  );
});