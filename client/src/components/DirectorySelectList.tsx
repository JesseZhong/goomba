import React from 'react';
import DirectoryActions from '../actions/DirectoryActions';
import ManagementActions from '../actions/ManagementActions';
import DirectorySelectableAvatar from './DirectorySelectableAvatar';
import { Directories, Directory } from '../models/Directory';
import { PendingChanges } from '../models/PendingChanges';

const DirectorySelectList = (props: {
  directories: Directories | Directory[];
  pendingChanges: PendingChanges;
  className?: string;
}) => {
  const directories = props.directories
    ? [...props.directories.values()]
    : props.directories;
  const {
    className,
    pendingChanges: { selectedDirectory, selectedVideos, unsavedVideos },
  } = props;

  const [selected, setSelected] = React.useState<Directory | undefined>(
    undefined
  );

  /**
   * Setup a selected directory so videos can be selected for it.
   * @param directory Selected directory or nothing.
   */
  const doSetSelected = (directory?: Directory) => {
    setSelected(directory);
    ManagementActions.selectDirectory(directory);
    ManagementActions.selectVideos(
      directory ? new Set(directory.videos) : undefined
    );
  };

  /**
   * Undo any selected videos and directory.
   */
  const reset = () => {
    ManagementActions.resetSelections();
    setSelected(undefined);
  };

  /**
   * Apply any pending selected videos for a directory.
   */
  const confirmSelection = () => {
    if (selectedDirectory) {
      // Apply pending videos to the selected directory.
      const directory = selectedDirectory;
      directory.videos = selectedVideos
        ? [...selectedVideos.values()]
        : undefined;

      // Push changes.
      DirectoryActions.put(directory);

      // Reset pending after done.
      reset();
    }
  };

  return (
    <div
      className={
        'directory-select-list d-flex flex-wrap ' +
        (className ? ` ${className}` : '')
      }
    >
      {directories &&
        directories.map((dir) => (
          <DirectorySelectableAvatar
            key={dir.id}
            directory={dir}
            onClick={() => {
              // Don't allow selecting if videos are being edited.
              if (!unsavedVideos?.size) {
                // Toggle if already selected.
                if (selected?.id === dir.id) {
                  doSetSelected(undefined);
                } else {
                  doSetSelected(dir);
                }
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
            className='mt-4 ms-3'
          />
        ))}
    </div>
  );
};

export default DirectorySelectList;
