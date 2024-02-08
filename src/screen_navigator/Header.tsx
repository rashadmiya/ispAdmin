import React from 'react';
import { ConstantColor } from '../utils/constant_color';
import HeaderBackArrow from './HeaderBackArrow';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

const Header: NativeStackNavigationOptions = {
    headerStyle: {
        backgroundColor: '#fff',
    },
    headerTitleAlign: 'center',
    headerTitleStyle: { fontSize: 15, color: '#000' },
    headerLeft: () => <HeaderBackArrow />,

    headerShadowVisible: false,
    contentStyle:{shadowColor:'transparent'}
}

export default Header


// import HeaderBackArrow from "./HeaderBackArrow";

// export const Header = {
//     headerStyle: {
//       backgroundColor: 'blue',
//       shadowColor: 'transparent', // Assuming you want to hide the header shadow
//     },
//     headerTitleAlign: 'center',
//     headerTitleStyle: {
//       fontSize: 18,
//       color: 'white',
//     },
//     headerLeft: () => <HeaderBackArrow />, // Replace with your custom header left component
//     headerShadowVisible: false,
//   };