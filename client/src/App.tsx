import * as React from 'react';
import sample from 'lodash/sample';
import { AppState } from './containers/AppContainer';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Home from './home/Home';
import chadgura from './assets/chadgura.png';
import DirectoryVideos from './home/DirectoryVideos';
import RecentVideos from './home/RecentVideos';


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
                    <Routes>
                        <Route
                            path='/watch/:id'
                            element={<VideoPlayer />}
                        />
                        <Route
                            path='/manage'
                            element={
                                <ManagePage
                                    directories={state.directories}
                                    videos={state.videos}
                                    pendingDirectoryEdit={state.pendingDirectoryEdit}
                                />
                            }
                        />
                        <Route
                            path='/videos'
                            element={<VideosByDate videos={state.videos} />}
                        />
                        <Route
                            path='/home'
                            element={<Home directories={state.directories} />}
                        >
                            <Route
                                path=':dirName'
                                element={
                                    <DirectoryVideos
                                        directories={state.directories}
                                        videos={state.videos}
                                    />
                                }
                            />
                            <Route
                                index
                                element={<RecentVideos videos={state.videos} />}
                            />
                        </Route>
                        <Route
                            path='/'
                            element={<Navigate replace to='/home' />}
                        />
                        <Route path='*' element={PageNotFound} />
                    </Routes>
                </>
            );
        }
        else {
            return (
                <Routes>
                    <Route
                        path='/'
                        element={<Navigate replace to='/requestauth' />}
                    />
                    <Route path='/denied' element={Denied} />
                    <Route
                        path='/requestauth'
                        element={<RequestAuthorization session={state.session} />}
                    />
                    <Route
                        path='/authorized'
                        element={<FetchingAccess session={state.session} />}
                    />
                    <Route
                        path='*'
                        element={<Navigate replace to='/denied' />}
                    />
                </Routes>
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