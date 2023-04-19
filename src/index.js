import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import { HashRouter } from 'react-router-dom';

import {App} from './components/app';
import {store} from './store/store';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  // <React.StrictMode>
      <Provider store={store}>
          <HashRouter>
              <App/>
          </HashRouter>
      </Provider>
  // </React.StrictMode>
);
