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
    const className = props.className;

    return (
        <div
            className={
                'd-flex flex-wrap ' +
                (className ? ` ${className}` : '')
            }
        >
            {
                directories &&
                directories.map(
                    dir => <EditableDirectoryCard
                        key={dir.id}
                        directory={dir}
                    />
                )
            }
        </div>
    )
}

export default DirectoryList;