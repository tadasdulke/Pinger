import React from 'react';
import {createRoot} from 'react-dom/client'
import store from './store'
import { Provider } from 'react-redux';
import App from './App'
import { setConfiguration } from 'react-grid-system';
import tailwindConfig from '../tailwind.config';
import "react-loading-skeleton/dist/skeleton.css";
import './index.css'

const domNode = document.getElementById('root');
const root = createRoot(domNode)

const breakpoints = Object.values(tailwindConfig.theme.screens);
setConfiguration({
    breakpoints: breakpoints.map(breakpoint => breakpoint.substring(0, breakpoint.length-2)),
    maxScreenClass: 'xl'
})

root.render(<Provider store={store}><App/></Provider>)