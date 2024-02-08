import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
let timestrams = firestore.Timestamp

export type InvestInterface = {
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    investmentDate: any,
    withdrawDate: any
}

export type IncomeInterface = {
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    incomeDate: any,
}

export type ExpenditureInterface = {
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    expenseDate: any,
}
export type LossInterface = {
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    dateOfLoss: any,
}

export type BorrowInterface = {
    partner_id: string,
    type: string,
    amount: number,
    createdAt: any,
    borrowDate: any,
    repaymentDate: any
}