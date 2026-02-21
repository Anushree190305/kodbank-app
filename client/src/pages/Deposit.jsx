import { useState } from 'react';
import { accountAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Deposit() {
  const { updateUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid positive amount' });
      return;
    }

    setLoading(true);
    try {
      const { data } = await accountAPI.deposit(num);
      updateUser({ balance: data.balance, totalDeposited: data.totalDeposited });
      setMessage({ type: 'success', text: `Deposit successful! New balance: ₹${data.balance.toLocaleString()}` });
      setAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Deposit failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Deposit</h1>

      <div className="max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter amount"
              />
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
