import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ItemDetails from '../screens/ItemDetails';
import ListItem from '../screens/ListItem';
import { HOME, ITEMDETAILS, ITEMLIST, USERMANAGER } from '../utils/constant_route';
import Header from './Header';
import HeaderLeft from './HeaderLeft';
import Home from '../screens/Home';
import UserManager from '../screens/UserManager';

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
    </stack.Navigator>
    // </NavigationContainer>
  )
}

export default Stack_Navigator