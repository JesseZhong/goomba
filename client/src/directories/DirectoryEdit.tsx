import React from 'react';
import { Directory } from './directory';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import DirectoryValidation from './DirectoryValidation';
import DirectoryActions from '../actions/DirectoryActions';
import ImageUpload from '../common/ImageUpload';
import DirectoryAvatar from './DirectoryAvatar';
import OptionalField from '../common/OptionalField';
import { v4 as uuid } from 'uuid';
import './DirectoryEdit.sass';

const DirectoryEdit = (props: {
  availableDirectories?: Directory[];
  className?: string;
  directory?: Directory;
  finished?: () => void;
}) => {
  const directory =
    props.directory ??
    ({
      id: uuid(),
      name: '',
    } as Directory);

  const [showPutError, setShowPutError] = React.useState(false);

  const finished = () => {
    props.finished?.();
  };

  return (
    <div className={'directory-edit my-5 ' + props.className ?? ''}>
      <Formik
        initialValues={directory}
        validationSchema={DirectoryValidation}
        onSubmit={(newDirectory, { setSubmitting }) => {
          DirectoryActions.put(newDirectory).then(
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
                  <div className='col-2'>Name</div>
                  <div className='col-8 d-flex flex-column'>
                    <Field
                      as='input'
                      name='name'
                      placeholder='Name of the directory.'
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
                  <div className='col-2'>Avatar</div>
                  <div className='col-8 d-flex flex-column'>
                    <ImageUpload
                      value={values.avatar}
                      onChange={(file_key: string, image_url?: string) => {
                        setFieldValue('avatar', file_key);
                        setFieldValue('avatar_url', image_url);
                      }}
                    />
                    <ErrorMessage
                      name='thumbnail'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-2'>Banner</div>
                  <div className='col-8 d-flex flex-column'>
                    <ImageUpload
                      value={values.banner}
                      onChange={(file_key: string) =>
                        setFieldValue('banner', file_key)
                      }
                    />
                    <ErrorMessage
                      name='thumbnail'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-2'>Parent</div>
                  <div className='col-4 d-flex flex-column'>
                    <OptionalField type='select' name='parent' />
                    <ErrorMessage
                      name='parent'
                      component='div'
                      className='text-danger ms-2'
                    />
                  </div>
                </div>
              </div>

              <div className='d-flex flex-column justify-content-between'>
                <div className='d-flex flex-column'>
                  <span>Preview</span>
                  <DirectoryAvatar directory={values} />
                </div>
              </div>
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

export default DirectoryEdit;
