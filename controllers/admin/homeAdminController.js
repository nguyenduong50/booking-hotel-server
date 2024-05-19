import User from '../../models/User.js';
import Transaction from '../../models/Transaction.js';
import { pagging } from '../../utils/pagging.js';

export const getHomeAdmin = async(req, res) => {
    const users = await User.find({});
    const countUser = users.length;

    const transactions = await Transaction.find({}).populate('user').populate('hotel');
    const countTransaction = transactions.length;

    const totalEarning = transactions.reduce((total, item) => {
        return total + item.price;
    }, 0);

    const transactionsLastest = pagging(transactions, 8);

    res.send({
        countUser,
        countOrder: countTransaction,
        totalEarning,
        transactionsLastest: transactionsLastest[0]
    });
}