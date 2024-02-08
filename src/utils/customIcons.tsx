import React from "react";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';

type IconType = 'material' | 'ant' | 'ent' | 'evil' | 'feather' | 'font' | 'font5' | 'fontPro' | 'fontisto' | 'foundation' | 'ion' | 'matCom' | 'zocial' | 'oct';

const getIconFont = (type: IconType) => {
    switch (type) {
        case 'material':
            return MaterialIcon;
        case 'ant':
            return AntDesign;
        case 'ent':
            return Entypo;
        case 'evil':
            return EvilIcons;
        case 'feather':
            return Feather;
        case 'font':
            return FontAwesome;
        case 'font5':
            return FontAwesome5;
        case 'fontPro':
            return FontAwesome5Pro;
        case 'fontisto':
            return Fontisto;
        case 'foundation':
            return Foundation;
        case 'ion':
            return Ionicons;
        case 'matCom':
            return MaterialCommunityIcons;
        case 'zocial':
            return Zocial;
        case 'oct':
            return Octicons;
        default:
            return MaterialIcon; // Default to MaterialIcon if type is not recognized
    }
}

interface IconProps {
    type: IconType;
    name: string; // Include the 'name' property
    size: number;
    color?: string;
    style?: object;
    onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({ type, name, size, color, style, onPress, ...props }) => {
    const FontIcon = getIconFont(type);

    return <FontIcon name={name} size={size} color={color} style={style} onPress={onPress} {...props} />
}

export default Icon;
