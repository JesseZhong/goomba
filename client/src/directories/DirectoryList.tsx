import React from 'react';
import { Directories, Directory } from './Directory';
import DirectoryCard from './DirectoryCard';

const DirectoryList = (props: {
    directories: Directories | Directory[],
    className?: string
}) => {
    const directories = props.directories
        ? [...props.directories.values()]
        : props.directories;

    const [current, setCurrent] = React.useState();

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
                            onClick={e => onClick(e, dir)}
                        >
                            <DirectoryCard directory={dir} />
                        </div>
                )
            }
        </div>
    )
}

export default DirectoryList;