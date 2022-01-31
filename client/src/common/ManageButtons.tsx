import React from 'react';
import HoverButtonGroup from './HoverButtonGroup';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ManageButtons.sass';


const ManageButtons = (props: {
    owner: React.RefObject<HTMLElement>,
    onEditClick: () => void,
    onRemoveConfirm: () => void
}) => {

    return (
        <HoverButtonGroup
            owner={props.owner}
            className='manage-buttons'
        >
            <button
                type='button'
                onClick={props.onRemoveConfirm}
                className='remove'
            >
                <FontAwesomeIcon
                    icon={faTrash}
                    size='3x'
                />
            </button>
            <button
                type='button'
                onClick={props.onEditClick}
                className='edit'
            >
                <FontAwesomeIcon
                    icon={faEdit}
                    size='3x'
                />
            </button>
        </HoverButtonGroup>
    )
}

export default ManageButtons;