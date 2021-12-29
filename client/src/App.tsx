import * as React from 'react';
import { AppState } from "./containers/AppContainer";
import { Switch, Route } from 'react-router-dom';
import PageNotFound from './not-found/PageNotFound';
import VideosPage from './videos/VideosPage';
import VideoView from './videos/VideoView';
import _ from 'lodash';


const titles: string[] = [
    'Goob',
    'Goobers',
    'Goomba',
    'Goomba Roomba',
    'Gom Goms',
    'Gruber'
]

const App = (state: AppState) => {
    
    // Give a random title.
    document.title = _.sample(titles) ?? 'Goob';

    return (
        <div className='page'>
            <Switch>
                <Route path='/view' render={(props: any) => (
                    <VideoView
                        id={props.location?.state as number}
                        videos={state.videoes}
                    />
                )} />
                <Route exact path='/' render={(props: any) => (
                    <VideosPage {...props} videos={state.videoes} />
                )} />
                <Route path='*' component={PageNotFound} />
            </Switch>
        </div>
    )
}

export default App;