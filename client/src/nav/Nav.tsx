
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import image from '../assets/goobs.png';
import './Nav.sass';

const Nav = (props: {

}) => {

    return (
        <nav className='nav navbar py-0'>
            <div
                className='d-flex flex-row justify-content-between align-items-center'
                style={{
                    width: '100vw'
                }}
            >
                <div className='d-flex flex-row'>
                    <Link
                        className='navbar-brand ms-3'
                        to='/'
                    >
                        <img
                            src={image}
                            alt='Gobbers'
                            width='32'
                            style={{
                                marginTop: '-5px'
                            }}
                        />
                    </Link>
                    <Link
                        className='nav-link'
                        to='/tags'
                    >
                        <FontAwesomeIcon icon={faHashtag} />
                    </Link>
                    <Link
                        className='nav-link'
                        to='/manage'
                    >
                        <FontAwesomeIcon icon={faCog} />
                    </Link>
                </div>
                <div
                    className='input-group my-1'
                    style={{
                        maxWidth: '18em'
                    }}
                >
                    <span className='input-group-text'>
                        <FontAwesomeIcon
                            icon={faSearch}
                            size='xs'
                        />
                    </span>
                    <input
                        className='form-control me-2'
                        type='search'
                        placeholder='search'
                        aria-label='Search'
                    />
                </div>
            </div>
        </nav>
    );
}

export default Nav;