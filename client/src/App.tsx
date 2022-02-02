import * as React from 'react';
import sample from 'lodash/sample';
import { AppState } from './containers/AppContainer';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PageNotFound from './not-found/PageNotFound';
import VideosByDate from './video-views/VideosByDate';
import VideoPlayer from './videos/VideoPlayer';
import RequestAuthorization from './auth/RequestAuth';
import FetchingAccess from './auth/FetchingAccess';
import SessionActions from './actions/SessionActions';
import ManagePage from './manage/ManagePage';
import Denied from './auth/Denied';
import Nav from './nav/Nav';
import chadgura from './assets/chadgura.png';
import Home from './home/Home';


const titles: string[] = [
    'Goob',
    'Goobers',
    'Goomba',
    'Goomba Roomba',
    'Gom Goms',
    'Gruber',
    'Gub Gubs',
    'Groombers',
    'Gubbers',
    'Goobus'
]

// Load session.
SessionActions.load();

const title = sample(titles) ?? 'Goob';

const App = (state: AppState) => {
    
    // Give a random title.
    document.title = title;

    const route = () => {
        if (state.session?.access_token) {
            return (
                <>
                    <Nav
                        className='mb-1'
                        session={state.session}
                    />
                    <Switch>
                        <Route
                            path='/watch/:id'
                            render={(props: any) => (
                                <VideoPlayer {...props} />
                            )}
                        />
                        <Route
                            path='/manage'
                            render={(props: any) => (
                                <ManagePage
                                    {...props}
                                    directories={state.directories}
                                    videos={state.videos}
                                    pendingDirectoryEdit={state.pendingDirectoryEdit}
                                />
                            )}
                        />
                        <Route
                            exact
                            path='/videos'
                            render={(props: any) => (
                                <VideosByDate
                                    {...props}
                                    videos={state.videos}
                                />
                            )}
                        />
                        <Route exact path='/'
                            render={(props: any) => (
                                <Home
                                    {...props}
                                    directories={state.directories}
                                    videos={state.videos}
                                />
                            )}
                        />
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
        <>
            <Helmet
                htmlAttributes={{
                    lang: 'en'
                }}
            >
                <meta charSet='utf-8' />
                <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
                <meta name='theme-color' content='#000000' />
                
                <meta property='og:type' content='website' />
                <meta property='og:title' content={title} />
                <meta property='og:url' content={window.location.href} />
                <meta property='og:image' content={chadgura} />
                <meta property='og:description' content='OH NYOOO' />

                <meta name='twitter:card' content='summary_large_image' />
                <script
                    src='https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js'
                    integrity='sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB'
                    crossOrigin='anonymous'
                />
                <script
                    src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js'
                    integrity='sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13'
                    crossOrigin='anonymous'
                />
            </Helmet>
            <div className='page'>
                {route()}
            </div>
        </>
    )
}

export default App;