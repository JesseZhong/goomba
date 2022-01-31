import React from 'react';
import { Directories, Directory } from './Directory';
import EditableDirectoryCard from './EditableDirectoryCard';

const DirectoryList = (props: {
    directories: Directories | Directory[],
    className?: string
}) => {
    const directories = props.directories
        ? [...props.directories.values()]
        : props.directories;

    const onClick = (
        e: React.MouseEvent<HTMLDivElement>,
        dir: Directory
    ) => {

    }

    return (
        <div className={'d-flex flex-wrap ' + props.className}>
            {
                directories &&
                directories.map(
                    dir =>
                        <div
                            key={dir.id}
                            onClick={e => onClick(e, dir)}
                        >
                            <EditableDirectoryCard directory={dir} />
                        </div>
                )
            }
        </div>
    )
}

export default DirectoryList;