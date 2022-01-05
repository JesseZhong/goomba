import * as React from 'react';
import _ from 'lodash';
import { AppState } from "./containers/AppContainer";
import { Switch, Route, Redirect } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import VideosPage from './videos/VideosPage';
import VideoView from './videos/VideoView';
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
    'Groombers'
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
                    <Nav session={state.session} />
                    <Switch>
                        <Route path='/view/:id' render={(props: any) => (
                            <VideoView {...props} />
                        )} />
                        <Route path='/manage' render={(props: any) => (
                            <ManagePage {...props} videos={state.videos} />
                        )} />
                        <Route exact path='/' render={(props: any) => (
                            <VideosPage {...props} videos={state.videos} />
                        )} />
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