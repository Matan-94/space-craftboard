import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [transmissions, setTransmissions] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredTransmissions, setFilteredTransmissions] = useState([]);

    useEffect(() => {
        const fetchTransmissions = async () => {
            const response = await axios.get('http://localhost:5000/transmissions');
            setTransmissions(response.data);
        };
        fetchTransmissions();
        const interval = setInterval(fetchTransmissions, 60000); // Polling every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (search) {
            setFilteredTransmissions(
                transmissions.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
            );
        } else {
            setFilteredTransmissions([]);
        }
    }, [search, transmissions]);

    return (
        <div className="app">
            <h1>🚀 תחנת ממסר חלל</h1>
            <input
                type="text"
                placeholder="חפש חללית..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            <div className="transmissions">
                {search && filteredTransmissions.length === 0 && <p>לא נמצאו תשדורות</p>}
                {filteredTransmissions.map(spacecraft => (
                    <div key={spacecraft.name} className="transmission">
                        <h2>{spacecraft.name}</h2>
                        {spacecraft.transmissions.map((t, index) => (
                            <p key={index}>{t.timestamp}: {t.message}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default App;