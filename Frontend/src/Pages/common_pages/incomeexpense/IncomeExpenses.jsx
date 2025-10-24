import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  addNewTransaction, 
  approveTheTransaction, 
  getAllTransactions, 
  rejectTheTransaction 
} from '../../../api/ProjectApi';
import { formatDateToReadable } from '../../../utils/formateDates';

const IncomeExpenses = () => {
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const locallySavedProject = localStorage.getItem("projectId");

  const [transactions, setTransactions] = useState([]);
  const [change, setChange] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    description: ''
  });

  const categories = {
    income: ['Client Payment', 'Change Order', 'Financing', 'Rebates', 'Other Income'],
    expense: [
      'Materials', 'Labor', 'Subcontractors', 'Equipment Rental', 
      'Permits & Fees', 'Site Utilities', 'Tools', 
      'Transportation', 'Insurance', 'Other Expenses'
    ]
  };

  // Fetch all transactions
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllTransactions(locallySavedProject);
        setTransactions(response);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transactions", { theme: "light", autoClose: 1500 });
      }
    };
    getData();
  }, [change]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.category) {
      setError('Please select a category');
      toast.error("Please select a category", { theme: "light", autoClose: 1500 });
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than zero');
      toast.error("Amount must be greater than zero", { theme: "light", autoClose: 1500 });
      return;
    }

    const newTransaction = {
      companyId: user.companyId,
      projectId: locallySavedProject,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      status: 'pending',
      requestedBy: user.username,
      requestedById: user.id,
      approvedBy: ''
    };

    try {
      await addNewTransaction(newTransaction);
      toast.success("Transaction recorded successfully!", { theme: "light", autoClose: 1500 });
      setChange((prev) => !prev);
      setFormData({
        type: formData.type,
        category: '',
        amount: '',
        description: ''
      });
    } catch (err) {
      console.error(err);
      toast.error("Error adding transaction", { theme: "light", autoClose: 1500 });
    }
  };

  const approveTransaction = async (id) => {
    const newData = {
      status: 'approved',
      approvedBy: user.username,
      approvedById: user.id,
    };

    try {
      await approveTheTransaction(id, newData);
      toast.success("Transaction approved!", { theme: "light", autoClose: 1500 });
      setChange((prev) => !prev);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve transaction", { theme: "light", autoClose: 1500 });
    }
  };

  const rejectTransaction = async (id) => {
    const rejectData = {
      status: 'rejected',
      approvedBy: user.username,
      approvedById: user.id,
    };

    try {
      await rejectTheTransaction(id, rejectData);
      toast.info("Transaction rejected.", { theme: "light", autoClose: 1500 });
      setChange((prev) => !prev);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject transaction", { theme: "light", autoClose: 1500 });
    }
  };

  const getPendingTransactions = () => transactions.filter(t => t.status === 'pending');

  const calculateBalance = () => transactions.reduce((acc, t) => {
    if (t.status === 'approved') {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }
    return acc;
  }, 0);

  const getTotalIncome = () => transactions
    .filter(t => t.type === 'income' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const getTotalExpense = () => transactions
    .filter(t => t.type === 'expense' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  return (
    <div className="">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
        <h1 className="text-2xl font-bold mb-6">Income/Expenses</h1>

        {/* Summary Cards */}
        {user.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-600 mb-1">Total Income</h3>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(getTotalIncome())}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-600 mb-1">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(getTotalExpense())}</p>
            </div>
            <div className={`p-4 rounded-lg ${calculateBalance() >= 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <h3 className={`text-sm font-medium mb-1 ${calculateBalance() >= 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                Balance
              </h3>
              <p className={`text-2xl font-bold ${calculateBalance() >= 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                {formatCurrency(calculateBalance())}
              </p>
            </div>
          </div>
        )}

        {/* Transaction Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Record Financial Transaction</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <div className="max-w-120 gap-4 mb-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Income</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600"
                    />
                    <span className="ml-2 text-gray-700">Expense</span>
                  </label>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm outline-none"
                >
                  <option value="">Select a category</option>
                  {categories[formData.type].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm outline-none"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 outline-none"
            >
              Record Transaction
            </button>
          </form>
        </div>

        {/* Pending Approvals */}
        {user.role === 'admin' && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Transactions Pending Approval</h2>
            {getPendingTransactions().length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions pending approval.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getPendingTransactions().map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDateToReadable(transaction.createdDate)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'income'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{transaction.description}</td>
                        <td className={`px-4 py-3 text-sm font-medium text-right ${
                          transaction.type === 'income' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{transaction.requestedBy}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <button
                            onClick={() => approveTransaction(transaction.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectTransaction(transaction.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* All Transactions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Requested By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action By</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDateToReadable(transaction.createdDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {transaction.description.length > 50
                          ? transaction.description.slice(0, 50) + "..."
                          : transaction.description}
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium text-right ${
                        transaction.type === 'income' ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.requestedBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.approvedBy || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {transaction.approvedDate
                          ? formatDateToReadable(transaction.approvedDate)
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenses;
