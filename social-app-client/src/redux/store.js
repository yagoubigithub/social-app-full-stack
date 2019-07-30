import {createStore, combineReducers, compose,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';


//Reducers
import userReducer  from './reducers/userReducer';
import dataReducer  from './reducers/dataReducer';
import uiReducer  from './reducers/uiReducer';


const initialState = {};


const middelware = [thunk];

const reducers = combineReducers({
    user :userReducer,
   data :  dataReducer,
    ui : uiReducer,
})

const store = createStore(reducers, initialState, compose(applyMiddleware(...middelware),  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default  store;
