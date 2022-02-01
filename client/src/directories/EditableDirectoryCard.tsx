import React from 'react';
import { Directory } from './Directory';
import DirectoryEdit from './DirectoryEdit';
import DirectoryCard from './DirectoryCard';
import ManageButtons from '../common/ManageButtons';
import DirectoryActions from '../actions/DirectoryActions';


const EditableDirectoryCard = (props: {
    directory: Directory,
    className?: string
}) => {
    const directory = props.directory;
    const [edit, setEdit] = React.useState(false);

    const wrap = React.createRef<HTMLDivElement>();

    return (
        <div
            ref={wrap}
            style={{
                position: 'relative'
            }}
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
                        onEditClick={() => setEdit(true)}
                        onRemoveConfirm={() => DirectoryActions.remove(directory.id)}
                    />
                    <DirectoryCard directory={directory} />
                </>
            }
        </div>
    );
}

export default EditableDirectoryCard;