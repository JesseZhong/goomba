import React from 'react';
import { Directory } from './Directory';
import './DirectoryCard.sass';


const DirectoryCard = (props: {
    directory: Directory
}) => {

    const directory = props.directory;
    
    return (
        <div className='directory-card'>
            <div className='banner'>
                {
                    directory.banner_url
                    ? <div className='banner-img'>
                        <img
                            src={directory.banner_url}
                            alt={directory.name}
                        />
                        <img
                            className='filter'
                            src={directory.banner_url}
                            alt={directory.name}
                        />
                    </div>
                    : <span>
                        {directory.name[0]}
                    </span>
                }
            </div>
            <span className='name'>
                {directory.name}
            </span>
        </div>
    );
}

export default DirectoryCard;