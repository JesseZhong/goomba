import React from 'react';
import { Directories } from '../directories/Directory';
import DirectorySelectList from '../directories/DirectorySelectList';
import DirectoryEdit from '../directories/DirectoryEdit';
import DirectoryActions from '../actions/DirectoryActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingDirectoryEdit } from './PendingDirectoryEdit';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const ManageDirectoriesSection = (props: {
    directories: Directories,
    pendingDirectoryEdit: PendingDirectoryEdit
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

            <div className='d-flex flex-column'>
                {
                    directoryAdd &&
                    <DirectoryEdit
                        finished={() => setDirectoryAdd(false)}
                    />
                }
                <DirectorySelectList
                    directories={directories}
                />
            </div>
        </>
    );
}

export default ManageDirectoriesSection;