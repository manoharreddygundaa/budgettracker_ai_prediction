import React from 'react';

const ExportTest = () => {
    const handleExportCSV = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/export/csv', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const csvData = await response.text();
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Export failed:', response.status);
            }
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const handleExportJSON = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/export/json', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const jsonData = await response.json();
                const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.json';
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error('Export failed:', response.status);
            }
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Export Test</h2>
            <button onClick={handleExportCSV} style={{ margin: '10px', padding: '10px 20px' }}>
                Export CSV
            </button>
            <button onClick={handleExportJSON} style={{ margin: '10px', padding: '10px 20px' }}>
                Export JSON
            </button>
        </div>
    );
};

export default ExportTest;