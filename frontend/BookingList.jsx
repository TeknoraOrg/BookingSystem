// BookingList.jsx
import { useState, useEffect } from "react";

function BookingList() {
  // Mock data for bookings - in real app, fetch from backend
  const [bookings, setBookings] = useState([
    { 
      id: 1, 
      name: "Jane Smith", 
      email: "jane@example.com", 
      phone: "555-123-4567",
      date: new Date(2025, 2, 15, 10, 0), // March 15, 2025, 10:00 AM
      status: "confirmed",
      notes: "First-time client, corporate law consultation"
    },
    { 
      id: 2, 
      name: "John Doe", 
      email: "john@example.com", 
      phone: "555-987-6543",
      date: new Date(2025, 2, 16, 14, 30), // March 16, 2025, 2:30 PM
      status: "pending",
      notes: "Returning client, real estate contract review"
    },
    { 
      id: 3, 
      name: "Alice Johnson", 
      email: "alice@example.com", 
      phone: "555-567-8901",
      date: new Date(2025, 2, 17, 11, 0), // March 17, 2025, 11:00 AM
      status: "cancelled",
      notes: "Cancelled due to scheduling conflict"
    },
    { 
      id: 4, 
      name: "Bob Wilson", 
      email: "bob@example.com", 
      phone: "555-234-5678",
      date: new Date(2025, 2, 18, 9, 0), // March 18, 2025, 9:00 AM
      status: "confirmed",
      notes: "Estate planning discussion"
    },
    { 
      id: 5, 
      name: "Charlie Brown", 
      email: "charlie@example.com", 
      phone: "555-876-5432",
      date: new Date(2025, 2, 19, 13, 0), // March 19, 2025, 1:00 PM
      status: "confirmed",
      notes: "Business incorporation consultation"
    }
  ]);
  
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Filtered and sorted bookings
  const filteredBookings = bookings
    .filter(booking => {
      // Filter by status
      if (filterStatus !== "all" && booking.status !== filterStatus) {
        return false;
      }
      
      // Filter by search term
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          booking.name.toLowerCase().includes(searchLower) ||
          booking.email.toLowerCase().includes(searchLower) ||
          booking.phone.includes(search)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected field and direction
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === "date") {
        return sortDirection === "asc" 
          ? a.date - b.date 
          : b.date - a.date;
      } else if (sortField === "status") {
        return sortDirection === "asc" 
          ? a.status.localeCompare(b.status) 
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="w-full p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <label className="mr-2 text-sm">Status:</label>
          <select 
            className="p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th 
                className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {sortField === "name" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "transform rotate-180"}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th 
                className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date & Time
                  {sortField === "date" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "transform rotate-180"}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {sortField === "status" && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "" : "transform rotate-180"}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  No bookings found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 border-b">{booking.name}</td>
                  <td className="py-4 px-4 border-b">
                    <div>{booking.email}</div>
                    <div className="text-sm text-gray-600">{booking.phone}</div>
                  </td>
                  <td className="py-4 px-4 border-b">{formatDate(booking.date)}</td>
                  <td className="py-4 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 border-b">
                    <div className="text-sm text-gray-600">{booking.notes || "No notes"}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingList;