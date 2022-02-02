import React from 'react';
import { MouseEventHandler } from 'react-bootstrap/node_modules/@types/react';
import { Directory } from './Directory';
import './DirectoryCard.sass';


const DirectoryCard = (props: {
    directory: Directory,
    onClick?: MouseEventHandler<HTMLDivElement>,
    className?: string
}) => {
    const directory = props.directory;
    const className = props.className;

    return (
        <div
            className={
                'directory-card' +
                (className ? ` ${className}` : '')
            }
            onClick={props.onClick}
        >
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