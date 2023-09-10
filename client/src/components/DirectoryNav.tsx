import { NavLink } from 'react-router-dom';
import { Directories } from '../models/Directory';
import DirectoryAvatar from './DirectoryAvatar';
import './DirectoryNav.sass';

const DirectoryNav = (props: {
  directories: Directories;
  directoryName?: string;
  className?: string;
}) => {
  const directories = props.directories;
  const dirLookup = directories.get_lookup();
  const className = props.className;
  const dirName = props.directoryName;

  const current =
    dirName && dirLookup.has(dirName) ? dirLookup.get(dirName) : undefined;

  const children = current
    ? directories.get_children(current.id)
    : directories.get_root();

  const parent =
    current?.parent && directories.has(current?.parent)
      ? directories.get(current.parent)?.name
      : '/';

  return (
    <div
      className={
        'directory-nav d-flex flex-wrap ' + (className ? ` ${className}` : '')
      }
    >
      {current && (
        <div className='banner'>
          {current.banner_url && (
            <img
              className='banner-img'
              src={current.banner_url}
              alt={current.name}
            />
          )}
          {parent && (
            <NavLink to={encodeURI(parent)} className='back'>
              Back
            </NavLink>
          )}
        </div>
      )}
      {children &&
        children.map((dir) => (
          <NavLink key={dir.id} to={encodeURI(dir.name)} className='mt-4 ms-3'>
            <DirectoryAvatar directory={dir} />
          </NavLink>
        ))}
    </div>
  );
};

export default DirectoryNav;
