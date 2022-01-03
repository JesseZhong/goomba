import * as React from 'react';
import _ from 'lodash';
import { AppState } from "./containers/AppContainer";
import { Switch, Route, Redirect } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import VideosPage from './videos/VideosPage';
import VideoView from './videos/VideoView';
import RequestAuthorization from './auth/RequestAuth';
import FetchingAccess from './auth/FetchingAccess';
import Denied from './auth/Denied';
import SessionActions from './actions/SessionActions';


const titles: string[] = [
    'Goob',
    'Goobers',
    'Goomba',
    'Goomba Roomba',
    'Gom Goms',
    'Gruber'
]

// Load session.
SessionActions.load();

const App = (state: AppState) => {
    
    // Give a random title.
    document.title = _.sample(titles) ?? 'Goob';

    const route = () => {
        if (state.session?.access_token) {
            <Switch>
                <Route path='/view/:id' render={(props: any) => (
                    <VideoView {...props} />
                )} />
                <Route exact path='/' render={(props: any) => (
                    <VideosPage {...props} videos={state.videos} />
                )} />
                <Route path='*' component={PageNotFound} />
            </Switch>
        }
        else {
            return (
                <Switch>
                    <Route
                        exact
                        path='/'
                    >
                        <Redirect to='/requestauth' />
                    </Route>
                    <Route
                        exact
                        path='/denied'
                        component={Denied}
                    />
                    <Route
                        exact
                        path='/requestauth'
                        render={(props: any) =>
                            <RequestAuthorization {...props}
                                session={state.session}
                            />}
                    />
                    <Route
                        exact
                        path='/authorized'
                        render={(props: any) =>
                            <FetchingAccess {...props}
                                session={state.session}
                            />
                        }
                    />
                    <Route path='*' render={() => <Redirect to='/denied' />} />
                </Switch>
            )
        }
    }

    return (
        <div className='page'>
            <Switch>
                {route()}
            </Switch>
        </div>
    )
}

export default App;