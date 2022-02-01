import React from 'react';
import { Directory } from './Directory';
import DirectoryEdit from './DirectoryEdit';
import DirectoryCard from './DirectoryCard';
import ManageButtons from '../common/ManageButtons';
import DirectoryActions from '../actions/DirectoryActions';
import HoverButtonGroup from '../common/HoverButtonGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import './EditSelectDirectoryCard.sass';


const EditSelectDirectoryCard = (props: {
    directory: Directory,
    selected?: boolean,
    onClick?: () => void,
    onEdit?: () => void,
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
                'edit-select-directory-card' +
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
                    <div
                        onClick={props.onClick}
                    >
                        <DirectoryCard
                            directory={directory}
                            className={selected ? 'selected' : ''}
                        />
                        {
                            selected &&
                            <HoverButtonGroup
                                owner={wrap}
                            >
                                <button
                                    type='button'
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                                <button
                                    type='button'
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </HoverButtonGroup>
                        }
                    </div>
                </>
            }
        </div>
    );
}

export default EditSelectDirectoryCard;