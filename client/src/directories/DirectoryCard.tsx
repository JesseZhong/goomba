import React from 'react';
import { Directory } from './Directory';

const DirectoryCard = (props: {
    directory: Directory
}) => {

    const directory = props.directory;
    
    return (
        <div>
            <span>
                {directory.name}
            </span>
        </div>
    );
}

export default DirectoryCard;