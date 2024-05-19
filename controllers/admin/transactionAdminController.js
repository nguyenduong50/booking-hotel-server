import Transaction from '../../models/Transaction.js';
import { pagging } from '../../utils/pagging.js';

export const getTransactions = async(req, res) => {
    const transactions = await Transaction.find({}).populate('user').populate('hotel');

    const transactionsPagging = pagging(transactions, 8);

    return res.send(transactionsPagging);
};
