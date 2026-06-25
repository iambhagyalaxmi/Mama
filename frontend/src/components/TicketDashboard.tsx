import { useEffect, useState } from 'react';
import axios from 'axios';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function TicketDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || '';
    // We would fetch tickets normally, using mock data if backend isn't responding yet
    axios.get(`${API_URL}/api/tickets`)
      .then(res => setTickets(res.data))
      .catch(() => {
        setTickets([
          { id: '1', ticketNumber: 'TKT-1023', title: 'Cannot access student portal', category: 'Technical Support', status: 'open', priority: 'high', createdAt: new Date().toISOString() },
          { id: '2', ticketNumber: 'TKT-1024', title: 'Fee payment failing', category: 'Fees', status: 'in-progress', priority: 'critical', createdAt: new Date().toISOString() }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-4xl mx-auto my-8">
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Support Tickets</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          Create Ticket
        </button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading tickets...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Ticket ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="p-4 text-sm font-medium text-gray-900">{ticket.ticketNumber}</td>
                  <td className="p-4 text-sm text-gray-700">{ticket.title}</td>
                  <td className="p-4 text-sm text-gray-600">{ticket.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${ticket.status === 'open' ? 'bg-blue-100 text-blue-700' : 
                        ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium
                      ${ticket.priority === 'critical' ? 'text-red-600' : 
                        ticket.priority === 'high' ? 'text-orange-600' : 
                        'text-gray-600'}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
