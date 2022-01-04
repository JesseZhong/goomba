
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag, faCog, faSearch } from '@fortawesome/free-solid-svg-icons';
import image from '../assets/goobs.png';

const Nav = (props: {

}) => {

    return (
        <nav className='navbar navbar-dark bg-dark'>
            <div className='container-fluid'>
                <Link
                    className='navbar-brand'
                    to='/'
                >
                    <img
                        src={image}
                        alt='Gobbers'
                        width='30'
                        height='24'
                    />
                </Link>
                <button
                    className='navbar-toggler'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#navbarNav'
                    aria-controls='navbarNav'
                    aria-expanded='false'
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav'>
                        <li className='nav-item'>
                            <Link
                                className='nav-link'
                                to='/tags'
                            >
                                <FontAwesomeIcon icon={faHashtag} />
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link
                                className='nav-link'
                                to='/manage'
                            >
                                <FontAwesomeIcon icon={faCog} />
                            </Link>
                        </li>
                    </ul>

                    <div className='input-group mb-3'>
                        <span className='input-group-text'>
                            <FontAwesomeIcon icon={faSearch} />
                        </span>
                        <input
                            className='form-control me-2'
                            type='search'
                            placeholder='search'
                            aria-label='Search'
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Nav;