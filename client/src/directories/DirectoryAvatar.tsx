import { MouseEventHandler } from 'react-bootstrap/node_modules/@types/react';
import { Directory } from './Directory';
import './DirectoryAvatar.sass';

const DirectoryAvatar = (props: {
  directory: Directory;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
}) => {
  const {
    directory: { name, avatar_url },
    className,
  } = props;

  return (
    <div
      className={'directory-card' + (className ? ` ${className}` : '')}
      onClick={props.onClick}
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
