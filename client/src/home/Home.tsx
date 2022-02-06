import React from 'react';
import DirectoryActions from '../actions/DirectoryActions';
import VideoActions from '../actions/VideoActions';
import { Directories, Directory } from '../directories/Directory';
import DirectoryNav from '../directories/DirectoryNav';
import VideosByDate from '../video-views/VideosByDate';
import { Videos } from '../videos/Video';
import compact from 'lodash/compact';


const RECENT_VIDS = 20;

const Home = (props: {
    directories: Directories,
    videos: Videos
}) => {

    React.useEffect(() => {
            DirectoryActions.get();
            VideoActions.getVideos();
        },
        []
    );

    const [currentDir, setCurrentDir] = React.useState<Directory | undefined>(undefined);

    const currentVideos = compact(
        currentDir?.videos?.map(
            vid => props.videos.get(vid)
        )
    );

    return (
        <div className='d-flex flex-column'>
            <DirectoryNav
                directories={props.directories}
                onChange={setCurrentDir}
                className='mb-4'
            />
            {
                currentDir
                ? <VideosByDate
                    videos={currentVideos}
                />
                : 
                <div className='d-flex flex-column mt-3'>
                    <h5 className='ms-2'>
                        Recent
                    </h5>
                    <VideosByDate
                        videos={props.videos}
                        topToShow={RECENT_VIDS}
                    />
                </div>
            }
        </div>
    );
}

export default Home;