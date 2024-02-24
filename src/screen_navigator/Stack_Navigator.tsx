import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ItemDetails from '../screens/ItemDetails';
import ListItem from '../screens/ListItem';
import { BORROWERS, EXPENSES, FUNDTRANSFER, HOME, INCOME, INVESTMENTS, ITEMDETAILS, ITEMLIST, LOANTO, LOSSES, USERMANAGER } from '../utils/constant_route';
import Header from './Header';
import HeaderLeft from './HeaderLeft';
import Home from '../screens/Home';
import UserManager from '../screens/UserManager';
import Borrower from '../screens/Borrower';
import Investments from '../screens/Investments';
import Losses from '../screens/Losses';
import Expenses from '../screens/Expenses';
import Income from '../screens/Income';
import LoanTo from '../screens/LoanTo';
import FundTransfers from '../screens/FundTransfers';

const Stack_Navigator = () => {
  const stack = createNativeStackNavigator();
  return (
    // <NavigationContainer>
    <stack.Navigator>
      <stack.Screen name={HOME} component={Home}
        options={{
          title: "Home",
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 16,},
          // headerStyle: { backgroundColor: 'transparent' },
          headerShadowVisible: true,
          contentStyle:{shadowColor:'transparent'},
          headerLeft: () => <HeaderLeft />,
        }}
      />
      <stack.Screen name={ITEMLIST} component={ListItem} options={Header}/>
      <stack.Screen name={ITEMDETAILS} component={ItemDetails} options={Header} />
      <stack.Screen name={USERMANAGER} component={UserManager} options={Header} />
      <stack.Screen name={BORROWERS} component={Borrower} options={Header} />
      <stack.Screen name={INVESTMENTS} component={Investments} options={Header} />
      <stack.Screen name={LOSSES} component={Losses} options={Header} />
      <stack.Screen name={EXPENSES} component={Expenses} options={Header} />
      <stack.Screen name={INCOME} component={Income} options={Header} />
      <stack.Screen name={LOANTO} component={LoanTo} options={Header} />
      <stack.Screen name={FUNDTRANSFER} component={FundTransfers} options={Header} />
    </stack.Navigator>
    // </NavigationContainer>
  )
}

export default Stack_Navigator