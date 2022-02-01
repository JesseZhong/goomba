import React from 'react';
import { Directories, Directory } from './Directory';
import DirectoryEditActions from '../actions/DirectoryEditActions';
import EditSelectDirectoryCard from './EditSelectDirectoryCard';
import './DirectorySelectList.sass';


const DirectorySelectList = (props: {
    directories: Directories | Directory[],
    className?: string
}) => {
    const directories = props.directories
        ? [...props.directories.values()]
        : props.directories;
    const className = props.className;
    
    const [selected, setSelected] = React.useState<Directory | undefined>(undefined);

    const doSetSelected = (
        directory?: Directory
    ) => {
        setSelected(directory);
        DirectoryEditActions.selectDirectory(directory);
        DirectoryEditActions.selectVideos(
            directory
            ? new Set(directory.videos)
            : undefined
        )
    }

    return (
        <div
            className={
                'directory-select-list d-flex flex-wrap ' +
                (className ? ` ${className}` : '')
            }
        >
            {
                directories &&
                directories.map(
                    dir => 
                        <EditSelectDirectoryCard
                            key={dir.id}
                            directory={dir}
                            onClick={() => {

                                // Toggle if already selected.
                                if (selected?.id === dir.id) {
                                    doSetSelected(undefined);
                                } else {
                                    doSetSelected(dir);
                                }
                            }}
                            onEdit={() => {

                                // Deselect on edit.
                                if (selected?.id === dir.id) {
                                    doSetSelected(undefined);
                                }
                            }}
                            selected={selected?.id === dir.id}
                            className='mx-3'
                        />
                )
            }
        </div>
    )
}

export default DirectorySelectList;