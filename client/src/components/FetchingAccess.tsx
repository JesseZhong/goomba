import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  faCircleNotch,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Session } from '../models/session';
import AuthActions from '../actions/AuthActions';
import { useEffect, useMemo } from 'react';

/**
 * When the user authorizes or denies Discord access
 * they will be routed to this component via the Discord
 * OAuth redirect_uri.
 */
const FetchingAccess = (props: { session: Session }) => {
  const { access_token, session_id } = props?.session ?? {};

  const navigate = useNavigate();
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);

  // If the user denied access, an error (usually 'access_denied') is passed.
  // In this case, inform the user that authorization is required and prompt
  // them to retry the process. Retry button redirects back to the '/requestauth'.
  const error = query.get('error');
  const code = query.get('code');
  const state = query.get('state');

  useEffect(() => {
    if (!!navigate && !!access_token) {
      navigate('/');
    }
  }, [access_token, navigate]);

  useEffect(() => {
    if (!!navigate && !!state && !!code) {
      // Ping the API to retreive the access and refresh tokens from Discord.
      // Navigate back to root once the tokens are received.
      AuthActions.requestAccess(state, code).then(
        () => navigate('/'),
        () => navigate('/denied')
      );
    }
  }, [state, code, navigate]);

  if (!!error) {
    return (
      <div
        className='d-flex flex-column justify-content-center align-items-center'
        style={{
          height: '100vh',
        }}
      >
        <FontAwesomeIcon
          icon={faTimesCircle}
          size={'5x'}
          className='text-danger'
        />
        <h1>Authorization Required!</h1>
        <p>
          You need to authorize access with Discord before viewing this page.
        </p>
        <Link to='/requestauth' className='btn btn-secondary'>
          Retry
        </Link>
      </div>
    );
  } else if (!!access_token) {
    return (
      <div>
        <img
          src='https://media1.tenor.com/images/bf327be1ebbde7f32baf5136042bf118/tenor.gif?itemid=14563637'
          alt='To the moon!'
        />
      </div>
    );
  }
  // Check for any kind of inconsistencies. States no matching or no
  // code could mean some kind of attack. Display this if that happens.
  else if (state !== session_id || code === null) {
    return (
      <div
        className='d-flex flex-column justify-content-center align-items-center'
        style={{
          height: '100vh',
        }}
      >
        <img
          src='https://media1.tenor.com/images/04ab212f14107f7595857c74819a79c9/tenor.gif?itemid=9167536'
          alt='What even?'
        />
        <h1>Incorrect State</h1>
        <p>You, uh, playing fuck, fuck games??</p>
      </div>
    );
  } else {
    return (
      <div
        className='d-flex flex-column justify-content-center align-items-center'
        style={{
          height: '100vh',
        }}
      >
        <h1>Fetching Access</h1>
        <FontAwesomeIcon icon={faCircleNotch} size={'4x'} spin />
      </div>
    );
  }
};

export default FetchingAccess;
