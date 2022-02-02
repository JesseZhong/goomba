import React from 'react';
import { Directories } from '../directories/Directory';
import DirectorySelectList from './DirectorySelectList';
import DirectoryEdit from '../directories/DirectoryEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DirectoryEditPending } from './DirectoryEditPending';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const ManageDirectoriesSection = (props: {
    directories: Directories,
    pendingDirectoryEdit: DirectoryEditPending
}) => {
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
                    pendingDirectoryEdit={props.pendingDirectoryEdit}
                />
            </div>
        </>
    );
}

export default ManageDirectoriesSection;