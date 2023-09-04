import './DirectoryAvatar.sass';
import React from 'react';
import { Directory } from '../models/directory';

const DirectoryAvatar = (props: {
  directory: Directory;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
}) => {
  const {
    directory: { name, avatar_url },
    className,
    onClick,
  } = props;

  return (
    <div
      className={'directory-card' + (className ? ` ${className}` : '')}
      onClick={onClick}
    >
      <div className='avatar'>
        {avatar_url ? (
          <div className='avatar-img'>
            <img src={avatar_url} alt={name} />
            <img className='filter' src={avatar_url} alt={name} />
          </div>
        ) : (
          <span>{name[0]}</span>
        )}
      </div>
      <span className='name'>{name}</span>
    </div>
  );
};

export default DirectoryAvatar;
