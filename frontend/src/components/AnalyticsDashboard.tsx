import { useState } from 'react';

export default function AnalyticsDashboard() {
  const [metrics] = useState({
    totalConversations: 1240,
    ticketVolume: 156,
    resolutionRate: '82%',
    customerSatisfaction: '4.8/5'
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 w-full max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">System Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Total Conversations</p>
          <p className="text-3xl font-extrabold text-blue-900 mt-2">{metrics.totalConversations}</p>
        </div>
        
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
          <p className="text-sm text-orange-600 font-semibold uppercase tracking-wider">Ticket Volume</p>
          <p className="text-3xl font-extrabold text-orange-900 mt-2">{metrics.ticketVolume}</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <p className="text-sm text-green-600 font-semibold uppercase tracking-wider">Resolution Rate</p>
          <p className="text-3xl font-extrabold text-green-900 mt-2">{metrics.resolutionRate}</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <p className="text-sm text-purple-600 font-semibold uppercase tracking-wider">Customer Satisfaction</p>
          <p className="text-3xl font-extrabold text-purple-900 mt-2">{metrics.customerSatisfaction}</p>
        </div>
      </div>
    </div>
  );
}
