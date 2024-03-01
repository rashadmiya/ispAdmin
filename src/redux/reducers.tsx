import {combineReducers} from '@reduxjs/toolkit';
import login_user from './slices/login_user';
import expense_constant from './slices/expense_constant';
import loss_constant from './slices/loss_constant';
import notice_slice from './slices/notice_slice';


const redusers = combineReducers({
    loggedInUser : login_user,
    expenseConstant: expense_constant,
    lossConstant: loss_constant,
    notice: notice_slice
});

export default redusers