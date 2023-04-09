import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default (props: { tags: string[] }) => {
  const [tags, setTags] = useState(props.tags);

  const filter = (predicate: string) => {
    if (!predicate) {
      setTags(props.tags);
    }

    let results: string[] = [];
    props.tags.forEach((tag: string) => {
      // TODO: Needs Yup for sanitation.
      if (new RegExp(`.*${predicate}.*`).test(tag)) {
        results.push(tag);
      }
    });

    setTags(results);
  };

  return (
    <div>
      <div className='input-group'>
        <div className='input-group-prepend'>
          <span className='input-group-text' id='search'>
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <input
          type='text'
          className='form-control'
          placeholder='Search'
          aria-label='Search'
          aria-describedby='search'
          onChange={(e) => filter(e.target.value)}
        />
      </div>
      <div>
        {tags &&
          tags.map((tag, index) => (
            <Link
              key={index}
              to={{
                pathname: '/items',
              }}
            >
              {tag}
            </Link>
          ))}
      </div>
    </div>
  );
};
