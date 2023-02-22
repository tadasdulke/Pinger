import React from 'react';
import {createRoot} from 'react-dom/client'
import store from './store'
import { Provider } from 'react-redux';
import App from './App'

import './index.css'

const domNode = document.getElementById('root');
const root = createRoot(domNode)


root.render(<Provider store={store}><App/></Provider>)