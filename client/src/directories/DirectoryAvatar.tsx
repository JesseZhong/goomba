import { MouseEventHandler } from 'react-bootstrap/node_modules/@types/react';
import { Directory } from './Directory';
import './DirectoryAvatar.sass';

const DirectoryAvatar = (props: {
  directory: Directory;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}) => {
  const directory = props.directory;
  const className = props.className;

  return (
    <div
      className={'directory-card' + (className ? ` ${className}` : '')}
      onClick={props.onClick}
    >
      <div className='avatar'>
        {directory.avatar_url ? (
          <div className='avatar-img'>
            <img src={directory.avatar_url} alt={directory.name} />
            <img
              className='filter'
              src={directory.avatar_url}
              alt={directory.name}
            />
          </div>
        ) : (
          <span>{directory.name[0]}</span>
        )}
      </div>
      <span className='name'>{directory.name}</span>
    </div>
  );
};

export default DirectoryAvatar;
