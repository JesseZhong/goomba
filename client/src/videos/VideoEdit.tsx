import React from 'react';
import { v4 as uuid } from 'uuid';
import { Video } from './Video';
import VideoCard from './VideoCard';
import VideoActions from '../actions/VideoActions';
import videoSchema from './video-schema';
import ImageUpload from '../common/ImageUpload';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import OptionalField from '../common/OptionalField';
import './VideoEdit.sass';

const KeyCodes = {
  tab: 9,
  space: 32,
  comma: 188,
  enter: [10, 13],
};

const delimiters = [
  KeyCodes.tab,
  KeyCodes.space,
  KeyCodes.comma,
  ...KeyCodes.enter,
];

const VideoEdit = (props: {
  className?: string;
  tags?: string[];
  video?: Video;
  finished?: () => void;
}) => {
  const video =
    props.video ??
    ({
      id: uuid(),
      name: '',
      stream_key: '',
    } as Video);

  const [showPutError, setShowPutError] = React.useState(false);

  const finished = () => {
    props.finished?.();
  };

  return (
    <div className={'video-edit my-5 ' + props.className ?? ''}>
      <Formik
        initialValues={video}
        validationSchema={videoSchema}
        onSubmit={(newVideo, { setSubmitting }) => {
          // Set current time if date added isn't set.
          newVideo.date_added = newVideo.date_added ?? new Date().toISOString();

          // Some client-side sync'ing.
          newVideo.download_available = newVideo.download_key
            ? true
            : undefined;

          VideoActions.put(newVideo).then(
            () => {
              setSubmitting(false);
              finished();
            },
            () => setShowPutError(true)
          );
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className='mx-4'>
            <div className='d-flex flex-row'>
              <div className='container'>
                <div className='row mb-3'>
                  <div className='col-2'>Title</div>
                  <div className='col-8 d-flex flex-column'>
                    <Field
                      as='input'
                      name='name'
                      placeholder='Title of the video'
                      className='form-control'
                    />
                    <ErrorMessage
                      name='name'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-2'>Stream Key</div>
                  <div className='col-8 d-flex flex-column'>
                    <Field
                      as='input'
                      name='stream_key'
                      placeholder='S3 object stream key'
                      className='form-control'
                    />
                    <ErrorMessage
                      name='stream_key'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-2'>Download Key</div>
                  <div className='col-8 d-flex flex-column'>
                    <OptionalField
                      as='input'
                      name='download_key'
                      placeholder='S3 object download key'
                      className='form-control'
                    />
                    <ErrorMessage
                      name='download_key'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-2'>Date Aired</div>
                  <div className='col-4 d-flex flex-column'>
                    <OptionalField
                      type='datetime-local'
                      name='date_aired'
                      className='form-control'
                    />
                    <ErrorMessage
                      name='date-aired'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-2'>Member</div>
                  <div className='col-4 d-flex flex-column'>
                    <OptionalField type='checkbox' name='member' />
                    <ErrorMessage
                      name='member'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>
              </div>

              <div className='d-flex flex-column justify-content-between'>
                <div className='d-flex flex-column'>
                  <span>Preview</span>
                  <VideoCard video={values} />
                </div>

                <div className='d-flex flex-column mb-2'>
                  <div className='d-flex flex-column'>
                    <span>Thumbnail</span>
                    <ImageUpload
                      value={values.thumbnail_key}
                      onChange={(file_key: string, image_url?: string) => {
                        setFieldValue('thumbnail_key', file_key);
                        setFieldValue('thumbnail_url', image_url);
                      }}
                    />
                  </div>
                  <ErrorMessage
                    name='thumbnail'
                    component='div'
                    className='text-danger ms-2'
                  />
                </div>
              </div>
            </div>

            <div className='d-flex flex-column mb-2'>
              <ReactTags
                tags={values.tags?.map((tag) => ({
                  id: tag,
                  text: tag,
                }))}
                handleAddition={(tag: Tag) => {
                  let tags = values.tags;
                  tags?.push(tag.text);
                  setFieldValue('tags', tags);
                }}
                handleDelete={(index: number) => {
                  let tags = values.tags;
                  delete tags?.[index];
                  setFieldValue('tags', tags);
                }}
                delimiters={delimiters}
                placeholder='Tag video.'
                classNames={{
                  tagInputField: 'form-control',
                }}
              />
            </div>

            {showPutError && <span className='text-danger'>Error saving.</span>}

            <div className='mt-3'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='btn btn-success me-2'
              >
                Save
              </button>
              <button
                type='button'
                className='btn text-light'
                onClick={finished}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VideoEdit;
