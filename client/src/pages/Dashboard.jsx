import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const cards = [
    { label: 'Current Balance', value: `₹${(user?.balance ?? 0).toLocaleString()}`, color: 'primary' },
    { label: 'Total Deposited', value: `₹${(user?.totalDeposited ?? 0).toLocaleString()}`, color: 'green' },
    { label: 'Total Withdrawn', value: `₹${(user?.totalWithdrawn ?? 0).toLocaleString()}`, color: 'gray' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Account Number</p>
          <p className="text-lg font-semibold text-gray-800">{user?.accountNumber}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Account Type</p>
          <p className="text-lg font-semibold text-gray-800">{user?.accountType}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Account Holder</p>
          <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500 mb-2">{card.label}</p>
            <p
              className={`text-2xl font-bold ${
                card.color === 'primary'
                  ? 'text-primary-600'
                  : card.color === 'green'
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
