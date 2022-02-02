import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Videos } from '../videos/Video';
import VideoEdit from '../videos/VideoEdit';
import DirectoryEditActions from '../actions/DirectoryEditActions';
import EditMultiSelectVideoList from './EditMultiSelectVideoList';
import { PendingDirectoryEdit } from './PendingDirectoryEdit';
import orderBy from 'lodash/orderBy';


const ManageVideosSection = (props: {
    videos: Videos,
    pendingDirectoryEdit: PendingDirectoryEdit
}) => {
    const pendingDirEdit = props.pendingDirectoryEdit;

    const videos = orderBy(
        [...props.videos.values()],
        ['date_added'],
        ['desc']
    );
    const [videoAdd, setVideoAdd] = React.useState(false);

    return (
        <>
            <div className='d-flex flex-row justify-content-end'>
                <div className='align-self-center'>
                    <button
                        type='button'
                        className='btn btn-outline-white text-primary'
                        onClick={() => setVideoAdd(!videoAdd)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Video
                    </button>
                </div>
            </div>

            <div
                className='d-flex flex-column'
            >
                {
                    videoAdd &&
                    <VideoEdit
                        finished={() => setVideoAdd(false)}
                    />
                }
                <EditMultiSelectVideoList
                    videos={videos}
                    disableEdit={!!pendingDirEdit.directory}
                    selected={pendingDirEdit.selectedVideos}
                    onSelected={(videos: Set<string>) => {
                        DirectoryEditActions.selectVideos(videos);
                    }}
                />
            </div>
        </>
    );
}

export default ManageVideosSection;