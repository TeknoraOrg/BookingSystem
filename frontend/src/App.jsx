import { useState } from "react";
import UserBooking from "./components/UserBooking";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  const [view, setView] = useState('user'); // 'user' or 'admin'
  
  return (
    <div className="app-container">
      {view === 'user' ? (
        <div className="client-container">
          <header className="client-header">
            <h1>BookMe</h1>
            <div className="view-toggle">
              <button 
                className={view === 'user' ? 'active' : ''} 
                onClick={() => setView('user')}
              >
                Client View
              </button>
              <button 
                className={view === 'admin' ? 'active' : ''} 
                onClick={() => setView('admin')}
              >
                Admin Panel
              </button>
            </div>
          </header>
          
          <UserBooking />
        </div>
      ) : (
        <>
          <div className="admin-return">
            <button onClick={() => setView('user')}>Client View</button>
          </div>
          <AdminPanel />
        </>
      )}
    </div>
  );
}

export default App;