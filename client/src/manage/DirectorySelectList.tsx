import React from 'react';
import { Directories, Directory } from '../directories/Directory';
import DirectoryEditActions from '../actions/DirectoryEditActions';
import EditSelectDirectoryCard from './EditSelectDirectoryCard';
import { PendingDirectoryEdit } from '../manage/PendingDirectoryEdit';
import DirectoryActions from '../actions/DirectoryActions';
import './DirectorySelectList.sass';


const DirectorySelectList = (props: {
    directories: Directories | Directory[],
    pendingDirectoryEdit: PendingDirectoryEdit
    className?: string
}) => {
    const directories = props.directories
        ? [...props.directories.values()]
        : props.directories;
    const className = props.className;

    const [selected, setSelected] = React.useState<Directory | undefined>(undefined);

    /**
     * Setup a selected directory so videos can be selected for it.
     * @param directory Selected directory or nothing.
     */
    const doSetSelected = (
        directory?: Directory
    ) => {
        setSelected(directory);
        DirectoryEditActions.selectDirectory(directory);
        DirectoryEditActions.selectVideos(
            directory
            ? new Set(directory.videos)
            : undefined
        );
    }

    /**
     * Apply any pending selected videos for a directory.
     */
    const confirmSelection = () => {
        const pending = props.pendingDirectoryEdit;
        if (pending.directory) {

            // Apply pending videos to the selected directory.
            const directory = pending.directory;
            directory.videos = pending.selectedVideos
                ? [...pending.selectedVideos.values()]
                : undefined;

            // Push changes.
            DirectoryActions.put(directory);
        }
        setSelected(undefined);
    }

    /**
     * Undo any selected videos and directory.
     */
    const reset = () => {
        DirectoryEditActions.reset();
        setSelected(undefined);
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
                            onConfirm={confirmSelection}
                            onCancel={reset}
                            selected={selected?.id === dir.id}
                            className='mx-3'
                        />
                )
            }
        </div>
    )
}

export default DirectorySelectList;