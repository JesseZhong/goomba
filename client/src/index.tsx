import { createRoot } from 'react-dom/client';
import AppContainer from './containers/AppContainer';
import { BrowserRouter } from 'react-router-dom';
import './index.sass';

const container = document.getElementById('root');
if (!!container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>,
  );
}