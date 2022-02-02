import React from 'react';
import { Directories, Directory } from './Directory';
import DirectoryCard from './DirectoryCard';

const DirectoryNav = (props: {
    directories: Directories,
    onChange?: (directory?: Directory) => void,
    className?: string
}) => {
    const directories = props.directories;
    const className = props.className;
    const [current, setCurrent] = React.useState<Directory | undefined>(undefined);

    const children = current
        ? directories.get_children(current.id)
        : directories.get_root();

    const changeDirectory = (
        dir?: Directory
    ) => {
        setCurrent(dir);
        props.onChange?.(dir);
    }

    const navDown = (
        dir?: Directory
    ) => changeDirectory(dir);

    const navUp = () => changeDirectory(
        current?.parent
        ? directories.get(current.parent)
        : undefined
    );

    return (
        <div className={
                'd-flex flex-wrap ' +
                (className ? ` ${className}` : '')
            }
        >
            {
                current &&
                <button
                    onClick={navUp}
                >
                    Back
                </button>
            }
            {
                children &&
                children.map(
                    dir =>
                        <div
                            key={dir.id}
                            onClick={() => navDown(dir)}
                            className='mx-3'
                        >
                            <DirectoryCard directory={dir} />
                        </div>
                )
            }
        </div>
    )
}

export default DirectoryNav;