import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file below

const NGOEventExplorer = () => {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Events & Load LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('ngo-registrations');
    if (saved) setRegisteredIds(JSON.parse(saved));

    const fetchEvents = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
        const data = await response.json();
        
        const formattedEvents = data.map((post, index) => ({
          id: post.id,
          title: post.title.split(' ').slice(0, 5).join(' '), 
          date: `March ${12 + index}, 2026`,
          location: index % 2 === 0 ? "City Community Center" : "Virtual Meeting",
          category: index % 3 === 0 ? "Environment" : "Social Welfare"
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Sync registrations to LocalStorage
  useEffect(() => {
    localStorage.setItem('ngo-registrations', JSON.stringify(registeredIds));
  }, [registeredIds]);

  const handleRegister = (id) => {
    setRegisteredIds(prev => 
      prev.includes(id) ? prev.filter(regId => regId !== id) : [...prev, id]
    );
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="main-title">Impact Explorer 🤝</h1>
          <p className="subtitle">Discover and register for social impact events.</p>
        </div>
        <div className="stats-card">
          <span className="stats-label">Registered Events</span>
          <span className="stats-count">{registeredIds.length}</span>
        </div>
      </header>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search events by name..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map(event => {
            const isRegistered = registeredIds.includes(event.id);
            return (
              <div key={event.id} className="card">
                <span className="card-tag">{event.category}</span>
                <h3 className="card-title">{event.title}</h3>
                
                <div className="card-info">
                  <p className="info-item"><span>📅</span> {event.date}</p>
                  <p className="info-item"><span>📍</span> {event.location}</p>
                </div>

                <button
                  onClick={() => handleRegister(event.id)}
                  className={isRegistered ? "btn btn-registered" : "btn btn-primary"}
                >
                  {isRegistered ? "Registered ✅" : "Register Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="empty-state">
          <p>No events found matching "{searchText}"</p>
        </div>
      )}
    </div>
  );
};

export default NGOEventExplorer;