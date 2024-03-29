import React from 'react';
import { Directories } from '../directories/Directory';
import DirectorySelectList from './DirectorySelectList';
import DirectoryEdit from '../directories/DirectoryEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingChanges } from './PendingChanges';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const DirectoryManagmentSection = (props: {
  directories: Directories;
  pendingChanges: PendingChanges;
}) => {
  const { directories, pendingChanges } = props;
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
        {directoryAdd && (
          <DirectoryEdit finished={() => setDirectoryAdd(false)} />
        )}
        <DirectorySelectList
          directories={directories}
          pendingChanges={pendingChanges}
        />
      </div>
    </>
  );
};

export default DirectoryManagmentSection;
