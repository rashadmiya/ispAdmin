import React from 'react';
import { View } from 'react-native';
import InvestModal from '../modals/InvestModal';;
import IncomeModal from '../modals/IncomeModal';
import ExpenseModal from '../modals/ExpenseModal';
import LossModal from '../modals/LossModal';
import BorrowModal from '../modals/BorrowModal';
import TemplateModal from '../modals/TamplateModal';
import LoanToModal from '../modals/LoanToModal';

// type Props = {
//     openedItem: string;
// };
interface openItem {
    name:string,
    parent:string,
}
const OwnerRouteManager = ({ openedItem, isModalVisible, modalHide }:
    { openedItem: openItem, isModalVisible: boolean, modalHide: () => void }) => {

    return (
        <View >
            {openedItem.parent == 'invest' && openedItem.name == 'add' && (<InvestModal openedItem={openedItem.parent} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem.parent == 'income' && openedItem.name == 'add' && (<IncomeModal openedItem={openedItem.parent} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem.parent == 'expense' && openedItem.name == 'add' && (<ExpenseModal openedItem={openedItem.parent} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem.parent == 'borrow' && openedItem.name == 'add' && (<BorrowModal isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem.parent == 'loss' && openedItem.name == 'add' && (<LossModal openedItem={openedItem.parent} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem.parent == 'loanTo' && openedItem.name == 'add' && (<LoanToModal openedItem={openedItem.parent} isModalVisible={isModalVisible} modalHide={modalHide}/>)}
            {openedItem.parent == 'foundTransfer' && openedItem.name == 'add' && (<TemplateModal openedItem={openedItem.parent} isModalVisible={isModalVisible} modalHide={modalHide}/>)}

        </View>
    )

}

export default OwnerRouteManager

