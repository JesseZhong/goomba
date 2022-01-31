import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HoverButtonGroup from '../common/HoverButtonGroup';
import { Directory } from './Directory';
import DirectoryEdit from './DirectoryEdit';
import DirectoryCard from './DirectoryCard';


const EditableDirectoryCard = (props: {
    directory: Directory,
    className?: string
}) => {
    const directory = props.directory;
    const [edit, setEdit] = React.useState(false);

    const wrap = React.createRef<HTMLDivElement>();

    return (
        <div>
            {
                edit
                ? <DirectoryEdit
                    directory={directory}
                />
                : <>
                    <HoverButtonGroup
                        owner={wrap}
                    >
                        <button
                            type='button'
                            onClick={() => setEdit(true)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    </HoverButtonGroup>
                    <DirectoryCard directory={directory} />
                </>
            }
        </div>
    );
}

export default EditableDirectoryCard;