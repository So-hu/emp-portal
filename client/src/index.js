import "bootstrap/dist/css/bootstrap.css";
import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import store from './store/store.js';

//import the store in the highest level component, pass using provider

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));


