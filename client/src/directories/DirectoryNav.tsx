import React from 'react';
import { Directories, Directory } from './Directory';
import DirectoryCard from './DirectoryCard';
import './DirectoryNav.sass';


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
                'directory-nav d-flex flex-wrap ' +
                (className ? ` ${className}` : '')
            }
        >
            {
                current &&
                <div className='banner'>
                    {
                        current.banner_url &&
                        <img
                            className='banner-img'
                            src={current.banner_url}
                            alt={current.name}
                        />
                    }
                    <button
                        onClick={navUp}
                        className='back-btn'
                    >
                        Back
                    </button>
                </div>
            }
            {
                children &&
                children.map(
                    dir =>
                        <div
                            key={dir.id}
                            onClick={() => navDown(dir)}
                            className='mx-3 mt-4'
                        >
                            <DirectoryCard directory={dir} />
                        </div>
                )
            }
        </div>
    )
}

export default DirectoryNav;