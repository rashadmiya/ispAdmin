import {combineReducers} from '@reduxjs/toolkit';
import login_user from './slices/login_user';


const redusers = combineReducers({
    loggedInUser : login_user,
});

export default redusers