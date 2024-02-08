import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "../utils/customIcons";
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { ConstantColor } from "../utils/constant_color";

const HeaderLeft = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            style={{ paddingLeft: 5 }}
        // onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
            <Icon type='material' name="menu" size={30} color={ConstantColor.black} onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer())
            }} />
        </TouchableOpacity>
    )
}

export default HeaderLeft;