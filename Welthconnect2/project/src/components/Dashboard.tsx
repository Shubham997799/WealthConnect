import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  ArrowRightLeft, 
  PieChart,
  Building2,
  User,
  ChevronDown
} from 'lucide-react';

type Account = {
  id: string;
  accountNumber: string;
  ifscCode: string;
  type: 'savings' | 'business';
  balance: number;
  accountHolder: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
};

type Transaction = {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  date: Date;
  description: string;
  fromAccount?: string;
  toAccount?: string;
};

const expenseCategories = [
  'Shopping',
  'Food & Dining',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Business Expenses',
  'Others'
];

function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'newAccount' | 'deposit' | 'transfer' | 'analytics'>('dashboard');
  const [newAccount, setNewAccount] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    type: 'savings' as const
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [transferData, setTransferData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    ifscCode: ''
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const generateIFSC = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bankCode = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const branchCode = Math.floor(100000 + Math.random() * 900000).toString();
    return `${bankCode}${branchCode}`;
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccountData: Account = {
      id: crypto.randomUUID(),
      accountNumber: generateAccountNumber(),
      ifscCode: generateIFSC(),
      type: newAccount.type,
      balance: 0,
      accountHolder: {
        firstName: newAccount.firstName,
        middleName: newAccount.middleName,
        lastName: newAccount.lastName
      }
    };
    setAccounts([...accounts, newAccountData]);
    setActiveView('dashboard');
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    const account = accounts.find(acc => acc.id === selectedAccount);
    if (!account) return;

    const updatedAccounts = accounts.map(acc => {
      if (acc.id === selectedAccount) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    });

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      type: 'credit',
      category: 'Deposit',
      date: new Date(),
      description: 'Account Deposit'
    };

    setAccounts(updatedAccounts);
    setTransactions([newTransaction, ...transactions]);
    setDepositAmount('');
    setActiveView('dashboard');
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferData.amount);
    if (isNaN(amount) || amount <= 0) return;

    const fromAccount = accounts.find(acc => acc.id === transferData.fromAccount);
    const toAccount = accounts.find(acc => acc.id === transferData.toAccount);

    if (!fromAccount || !toAccount || fromAccount.balance < amount) return;

    const updatedAccounts = accounts.map(acc => {
      if (acc.id === transferData.fromAccount) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.id === transferData.toAccount) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    });

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount,
      type: 'debit',
      category: 'Transfer',
      date: new Date(),
      description: 'Money Transfer',
      fromAccount: fromAccount.accountNumber,
      toAccount: toAccount.accountNumber
    };

    setAccounts(updatedAccounts);
    setTransactions([newTransaction, ...transactions]);
    setTransferData({
      fromAccount: '',
      toAccount: '',
      amount: '',
      ifscCode: ''
    });
    setActiveView('dashboard');
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true;
    
    const transactionDate = new Date(transaction.date);
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

    if (startDate && endDate) {
      return transactionDate >= startDate && transactionDate <= endDate;
    } else if (startDate) {
      return transactionDate >= startDate;
    } else if (endDate) {
      return transactionDate <= endDate;
    }
    return true;
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Axis Bank</span>
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                activeView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('newAccount')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                activeView === 'newAccount' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              New Account
            </button>
            <button
              onClick={() => setActiveView('deposit')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                activeView === 'deposit' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <Wallet className="w-5 h-5" />
              Deposit
            </button>
            <button
              onClick={() => setActiveView('transfer')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                activeView === 'transfer' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <ArrowRightLeft className="w-5 h-5" />
              Transfer
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`w-full flex items-center gap-2 p-3 rounded-lg ${
                activeView === 'analytics' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <PieChart className="w-5 h-5" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600">Manage your accounts and transactions</p>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <User className="w-5 h-5" />
            <span>Profile</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Total Balance</p>
              <h2 className="text-3xl font-bold">₹{totalBalance.toFixed(2)}</h2>
            </div>
            <ArrowRightLeft className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Transaction History Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              {filteredTransactions.length === 0 ? (
                <p className="text-gray-600">No transactions found for the selected period.</p>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.category}</p>
                        {transaction.fromAccount && transaction.toAccount && (
                          <p className="text-xs text-gray-500">
                            From: {transaction.fromAccount} To: {transaction.toAccount}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Accounts List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Your Accounts</h3>
              {accounts.length === 0 ? (
                <p className="text-gray-600">No accounts yet. Create your first account!</p>
              ) : (
                <div className="space-y-4">
                  {accounts.map(account => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            {account.accountHolder.firstName} {account.accountHolder.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Account: {account.accountNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            IFSC: {account.ifscCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">₹{account.balance.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 capitalize">{account.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'newAccount' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccount.firstName}
                    onChange={e => setNewAccount({...newAccount, firstName: e.target.value})}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={newAccount.middleName}
                    onChange={e => setNewAccount({...newAccount, middleName: e.target.value})}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccount.lastName}
                    onChange={e => setNewAccount({...newAccount, lastName: e.target.value})}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <select
                  value={newAccount.type}
                  onChange={e => setNewAccount({...newAccount, type: e.target.value as 'savings' | 'business'})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="savings">Savings Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
        )}

        {activeView === 'deposit' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Deposit Money</h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Account
                </label>
                <select
                  required
                  value={selectedAccount}
                  onChange={e => setSelectedAccount(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Choose an account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - {account.accountHolder.firstName} {account.accountHolder.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Deposit
              </button>
            </form>
          </div>
        )}

        {activeView === 'transfer' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Transfer Money</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Account
                </label>
                <select
                  required
                  value={transferData.fromAccount}
                  onChange={e => setTransferData(prev => ({ ...prev, fromAccount: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select source account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountNumber} - {account.accountHolder.firstName} {account.accountHolder.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Account
                </label>
                <select
                  required
                  value={transferData.toAccount}
                  onChange={e => setTransferData(prev => ({ ...prev, toAccount: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select destination account</option>
                  {accounts
                    .filter(account => account.id !== transferData.fromAccount)
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.accountNumber} - {account.accountHolder.firstName} {account.accountHolder.lastName}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={transferData.amount}
                  onChange={e => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Transfer
              </button>
            </form>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Transaction Analytics</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Expense Categories</h4>
                <div className="space-y-2">
                  {expenseCategories.map(category => {
                    const categoryTransactions = transactions.filter(t => t.category === category);
                    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
                    return (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-gray-600">{category}</span>
                        <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Transaction History</h4>
                <div className="h-64 overflow-y-auto">
                  {transactions.map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

export default Dashboard