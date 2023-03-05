import React from 'react';
import { Directory } from '../directories/Directory';
import DirectoryEdit from '../directories/DirectoryEdit';
import DirectoryCard from '../directories/DirectoryCard';
import ManageButtons from '../common/ManageButtons';
import DirectoryActions from '../actions/DirectoryActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './DirectoryEditSelect.sass';


const EditSelectDirectoryCard = (props: {
  directory: Directory,
  selected?: boolean,
  onClick?: () => void,
  onEdit?: () => void,
  onConfirm?: () => void,
  onCancel?: () => void,
  className?: string
}) => {
  const directory = props.directory;
  const className = props.className;
  const selected = props.selected;

  const [edit, setEdit] = React.useState(false);

  const wrap = React.createRef<HTMLDivElement>();

  return (
    <div
      ref={wrap}
      className={
        'directory-edit-select' +
        (className ? ` ${className}` : '')
      }
    >
      {
        edit
        ? <DirectoryEdit
            directory={directory}
            finished={() => setEdit(false)}
          />
        : <>
          <ManageButtons
            owner={wrap}
            onEditClick={() => {
              setEdit(true);
              props.onEdit?.();
            }}
            onRemoveConfirm={() => DirectoryActions.remove(directory.id)}
          />
          {
            selected &&
            <div className='selected-ring' />
          }
          <DirectoryCard
            directory={directory}
            onClick={props.onClick}
          />
          {
            selected &&
            <div
              className='vid-edit-controls'
            >
              <button
                className='confirm'
                type='button'
                onClick={props.onConfirm}
              >
                <FontAwesomeIcon
                  icon={faCheck}
                  size='2x'
                />
              </button>
              <button
                className='cancel'
                type='button'
                onClick={props.onCancel}
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size='2x'
                />
              </button>
            </div>
          }
        </>
      }
    </div>
  );
}

export default EditSelectDirectoryCard;