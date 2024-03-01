
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';
import { UserInterface } from '../interfaces/user_interface';


const loadUser = async () => {
    let currentUser = auth().currentUser;
    let snapshot = await firestore().collection('employes').doc(currentUser?.uid).get();
    let user = snapshot.data() as UserInterface;
    console.log("currentUser:", user.fullName)
    if (user) {
        return user;
    }
}


export default loadUser;