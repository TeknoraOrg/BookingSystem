// AdminPanel.jsx
import { useState } from "react";

function AdminPanel() {
  // Mock data for bookings
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "555-123-4567",
      date: "2025-03-15",
      time: "10:00 AM",
      notes: "First-time consultation about corporate law",
      status: "confirmed",
      createdAt: "2025-03-01T15:30:00Z"
    },
    { 
      id: 2, 
      name: "John Doe", 
      email: "john@example.com", 
      phone: "555-987-6543",
      date: "2025-03-16",
      time: "2:30 PM",
      notes: "Follow-up on contract review",
      status: "pending",
      createdAt: "2025-03-02T09:15:00Z"
    },
    { 
      id: 3, 
      name: "Alice Johnson", 
      email: "alice@example.com", 
      phone: "555-567-8901",
      date: "2025-03-17",
      time: "11:00 AM",
      notes: "Needs help with property transaction",
      status: "cancelled",
      createdAt: "2025-03-03T14:45:00Z"
    },
    { 
      id: 4, 
      name: "Bob Wilson", 
      email: "bob@example.com", 
      phone: "555-234-5678",
      date: "2025-03-18",
      time: "9:00 AM",
      notes: "Estate planning consultation",
      status: "confirmed",
      createdAt: "2025-03-04T11:20:00Z"
    },
    { 
      id: 5, 
      name: "Sarah Brown", 
      email: "sarah@example.com", 
      phone: "555-876-5432",
      date: "2025-03-19",
      time: "1:00 PM",
      notes: "Business incorporation questions",
      status: "confirmed",
      createdAt: "2025-03-05T16:10:00Z"
    },
    { 
      id: 6, 
      name: "Michael Lee", 
      email: "michael@example.com", 
      phone: "555-345-6789",
      date: "2025-03-20",
      time: "3:00 PM",
      notes: "Tax law consultation",
      status: "pending",
      createdAt: "2025-03-06T10:05:00Z"
    },
    { 
      id: 7, 
      name: "Emily Clark", 
      email: "emily@example.com", 
      phone: "555-654-3210",
      date: "2025-03-21",
      time: "10:30 AM",
      notes: "Family law matter",
      status: "confirmed",
      createdAt: "2025-03-07T13:25:00Z"
    }
  ]);
  
  // Mock data for dashboard stats
  const dashboardStats = {
    todayAppointments: 3,
    pendingConfirmations: 2,
    totalMonthlyBookings: 24,
    monthlyRevenue: 3600
  };
  
  // State for filtering and selected booking
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Handle searching and filtering
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (filterStatus !== "all" && booking.status !== filterStatus) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        booking.name.toLowerCase().includes(search) ||
        booking.email.toLowerCase().includes(search) ||
        booking.phone.includes(search)
      );
    }
    
    return true;
  });
  
  // Handle status update
  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
    
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };
  
  // Handle booking deletion
  const handleDeleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(bookings.filter(booking => booking.id !== id));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(null);
      }
    }
  };
  
  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Today's Appointments</h3>
          <p className="text-2xl font-bold mt-2">{dashboardStats.todayAppointments}</p>
          <p className="text-xs text-green-500 mt-1">+1 from yesterday</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Pending Confirmations</h3>
          <p className="text-2xl font-bold mt-2">{dashboardStats.pendingConfirmations}</p>
          <p className="text-xs text-red-500 mt-1">+2 from yesterday</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Total Bookings (Month)</h3>
          <p className="text-2xl font-bold mt-2">{dashboardStats.totalMonthlyBookings}</p>
          <p className="text-xs text-green-500 mt-1">+15% vs last month</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Revenue (Month)</h3>
          <p className="text-2xl font-bold mt-2">${dashboardStats.monthlyRevenue}</p>
          <p className="text-xs text-green-500 mt-1">+8% vs last month</p>
        </div>
      </div>
      
      {/* Bookings Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Appointment
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select 
                className="p-2 border rounded w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-3 px-4 text-center text-gray-500">No bookings found</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{booking.name}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{formatDate(booking.date)}</div>
                      <div className="text-sm text-gray-500">{booking.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3 text-sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal for booking details */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Booking Details</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedBooking(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold">Customer Information</p>
              <p className="mb-1">Name: {selectedBooking.name}</p>
              <p className="mb-1">Email: {selectedBooking.email}</p>
              <p className="mb-1">Phone: {selectedBooking.phone}</p>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold">Appointment Details</p>
              <p className="mb-1">Date: {formatDate(selectedBooking.date)}</p>
              <p className="mb-1">Time: {selectedBooking.time}</p>
              <p className="mb-1">Status: {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}</p>
              <p>Notes: {selectedBooking.notes || "No notes provided"}</p>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold mb-2">Update Status</p>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded text-sm ${selectedBooking.status === 'confirmed' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                  onClick={() => handleStatusChange(selectedBooking.id, "confirmed")}
                >
                  Confirm
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${selectedBooking.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
                  onClick={() => handleStatusChange(selectedBooking.id, "pending")}
                >
                  Pending
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm ${selectedBooking.status === 'cancelled' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                  onClick={() => handleStatusChange(selectedBooking.id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                onClick={() => handleDeleteBooking(selectedBooking.id)}
              >
                Delete
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Availability Settings Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Availability Settings</h2>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-md font-medium mb-3">Weekly Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{day}</span>
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={day !== 'Saturday' && day !== 'Sunday'} 
                        readOnly
                      />
                      <span className="ml-2 text-sm">Open</span>
                    </label>
                  </div>
                  
                  {day !== 'Saturday' && day !== 'Sunday' && (
                    <div className="text-sm text-gray-500">
                      9:00 AM - 5:00 PM (1 hour slots)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium">Special Dates</h3>
              <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Special Date
              </button>
            </div>
            
            <div className="border rounded p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="font-medium">March 17, 2025</span>
                  <p className="text-sm text-gray-500">Company Holiday</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Closed</span>
              </div>
              
              <div className="border-t pt-3 mt-3 flex justify-between items-center">
                <div>
                  <span className="font-medium">March 20, 2025</span>
                  <p className="text-sm text-gray-500">Extended Hours</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Open</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;