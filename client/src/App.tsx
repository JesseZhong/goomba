import * as React from 'react';
import _ from 'lodash';
import { AppState } from "./containers/AppContainer";
import { Switch, Route, Redirect } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import VideosByDate from './video-views/VideosByDate';
import VideoPlayer from './videos/VideoPlayer';
import RequestAuthorization from './auth/RequestAuth';
import FetchingAccess from './auth/FetchingAccess';
import Nav from './nav/Nav';
import Denied from './auth/Denied';
import SessionActions from './actions/SessionActions';
import ManagePage from './manage/ManagePage';


const titles: string[] = [
    'Goob',
    'Goobers',
    'Goomba',
    'Goomba Roomba',
    'Gom Goms',
    'Gruber',
    'Gub Gubs',
    'Groombers',
    'Gubbers'
]

// Load session.
SessionActions.load();

const App = (state: AppState) => {
    
    // Give a random title.
    document.title = _.sample(titles) ?? 'Goob';

    const route = () => {
        if (state.session?.access_token) {
            return (
                <>
                    <Nav
                        className='mb-1'
                        session={state.session}
                    />
                    <Switch>
                        <Route path='/watch/:id' render={(props: any) => (
                            <VideoPlayer {...props} />
                        )} />
                        <Route path='/manage' render={(props: any) => (
                            <ManagePage {...props} videos={state.videos} />
                        )} />
                        <Route exact path='/videos' render={(props: any) => (
                            <VideosByDate {...props} videos={state.videos} />
                        )} />
                        <Route exact path='/'>
                            <Redirect to='/videos' />
                        </Route>
                        <Route path='*' component={PageNotFound} />
                    </Switch>
                </>
            );
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
            {route()}
        </div>
    )
}

export default App;