import React from 'react';
import { Directories } from '../directories/Directory';
import DirectoryList from '../directories/DirectoryList';
import DirectoryEdit from '../directories/DirectoryEdit';
import DirectoryActions from '../actions/DirectoryActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const ManageDirectoriesSection = (props: {
    directories: Directories
}) => {
    React.useEffect(() => {
            DirectoryActions.get();
        },
        []
    );

    const directories = props.directories;
    const [directoryAdd, setDirectoryAdd] = React.useState(false);

    return (
        <>
            <div className='d-flex flex-row justify-content-end'>
                <div className='align-self-center'>
                    <button
                        type='button'
                        className='btn btn-outline-white text-primary'
                        onClick={() => setDirectoryAdd(!directoryAdd)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Directory
                    </button>
                </div>
            </div>

            <div
                className='d-flex flex-column mt-5'
            >
                {
                    directoryAdd &&
                    <DirectoryEdit
                        finished={() => setDirectoryAdd(false)}
                    />
                }
                <DirectoryList
                    directories={directories}
                />
            </div>
        </>
    );
}

export default ManageDirectoriesSection;