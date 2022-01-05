import React from 'react';
import uuid from 'node-uuid';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Video } from './Video';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import VideoValidation from './VideoValidation';
import VideoActions from '../actions/VideoActions';
import FileUpload from '../common/ImageUpload';
import { WithContext as ReactTags, Tag } from 'react-tag-input';
import './VideoEdit.sass';
import VideoCard from './VideoCard';

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
    ...KeyCodes.enter
];


const VideoEdit = (props: {
    tags?: string[],
    video?: Video,
    finished?: () => void
}) => {

    const video = props.video ?? {
        id: uuid.v4()
    } as Video;

    const [showPutError, setShowPutError] = React.useState(false);

    const finished = () => {
        props.finished?.();
    }

    return (
        <div
            className='video-edit'
        >
            <button
                type='button'
                className='btn close-btn'
                onClick={finished}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <Formik
                initialValues={video}
                validationSchema={VideoValidation}
                onSubmit={(newVideo, { setSubmitting }) => {

                    VideoActions.put(
                        newVideo,
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
                            <div className='d-flex flex-column'>
                                <div className='d-flex flex-column mb-4'>
                                    <div className='input-group input-group-sm flex-nowrap pe-5'>
                                        <span className='input-group-text'>
                                            Title
                                        </span>
                                        <Field
                                            as='input'
                                            name='name'
                                            placeholder='Title of the video'
                                            className='form-control'
                                        />
                                    </div>
                                    <ErrorMessage
                                        name='name'
                                        component='div'
                                        className='text-danger ms-2'
                                    />
                                </div>

                                <div className='d-flex flex-column mb-4'>
                                    <div className='input-group input-group-sm flex-nowrap pe-5'>
                                        <span className='input-group-text'>
                                            Key
                                        </span>
                                        <Field
                                            as='input'
                                            name='key'
                                            placeholder='S3 object key of the video'
                                            className='form-control'
                                        />
                                    </div>
                                    <ErrorMessage
                                        name='key'
                                        component='div'
                                        className='text-danger ms-2'
                                    />
                                </div>

                                <div className='d-flex flex-column mb-4'>
                                    <div className='input-group input-group-sm flex-nowrap pe-5'>
                                        <span className='input-group-text'>
                                            Date Aired
                                        </span>
                                        <input
                                            type='datetime-local'
                                            name='date_aired'
                                            className='form-control'
                                        />
                                    </div>
                                    <ErrorMessage
                                        name='date-aired'
                                        component='div'
                                        className='text-danger ms-2'
                                    />
                                </div>
                            </div>

                            <div className='d-flex flex-column justify-content-between'>
                                <div className='d-flex flex-column'>
                                    <span>Preview</span>
                                    <VideoCard video={values} />
                                </div>
                                <div className='d-flex flex-column mb-2'>
                                    <div className='input-group input-group-sm flex-nowrap pe-5'>
                                        <span className='input-group-text'>
                                            Thumbnail
                                        </span>
                                        <FileUpload
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
                                tags={values.tags?.map(
                                    tag => ({
                                        id: tag,
                                        text: tag
                                    })
                                )}
                                handleAddition={(tag: Tag) => {
                                    let tags = values.tags;
                                    tags?.push(tag.text);
                                    setFieldValue('tags', tags);
                                }}
                                handleDelete={(index: number) => {
                                    let tags = values.tags;
                                    delete tags?.[index]
                                    setFieldValue('tags', tags);
                                }}
                                delimiters={delimiters}
                                placeholder='Tag video.'
                                classNames={{
                                    tagInputField: 'form-control'
                                }}
                            />
                        </div>

                        {
                            showPutError &&
                            <span className='text-danger'>
                                Error saving.
                            </span>
                        }

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
}

export default VideoEdit;
