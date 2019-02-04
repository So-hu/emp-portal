import reducer from './reducer';
import {createStore} from 'redux';

const store = createStore(reducer)

//purely for debugging, logs any state changes to console
store.subscribe( () => {
    console.log('state\n', store.getState());
  });

export default store