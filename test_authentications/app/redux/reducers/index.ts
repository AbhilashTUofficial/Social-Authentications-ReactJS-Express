import {combineReducers} from 'redux';
import formsReducer from './forms';
import fbStateReducer from './facebookSlice';

const rootReducer = combineReducers({
  forms: formsReducer,
  fbState: fbStateReducer,
});

export default rootReducer;
