import { useState } from 'react';
import Header from '../../components/utils/header';
import Container from '../../components/utils/Container';
import toast, { Toaster } from 'react-hot-toast';
import AuthService from '../../services/auth.service';

function Export() {
    const [exportData, setExportData] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        type: 'ALL'
    });
    const [exporting, setExporting] = useState(false);

    const exportWithFilters = async (format) => {
        setExporting(true);
        try {
            const authHeaders = AuthService.authHeader();
            const params = new URLSearchParams({
                startDate: exportData.startDate,
                endDate: exportData.endDate,
                type: exportData.type
            });

            const response = await fetch(`http://localhost:8080/api/export/filtered/${format}?${params}`, {
                method: 'GET',
                headers: authHeaders
            });
            
            if (!response.ok) {
                throw new Error('Export failed');
            }
            
            let blob, filename;
            
            if (format === 'csv') {
                const csvData = await response.text();
                blob = new Blob([csvData], { type: 'text/csv' });
                filename = `transactions_${exportData.startDate}_to_${exportData.endDate}.csv`;
            } else if (format === 'pdf') {
                blob = await response.blob();
                filename = `transactions_${exportData.startDate}_to_${exportData.endDate}.pdf`;
            } else if (format === 'json') {
                const jsonData = await response.json();
                blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                filename = `transactions_${exportData.startDate}_to_${exportData.endDate}.json`;
            }
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success(`${format.toUpperCase()} exported successfully!`);
        } catch (error) {
            toast.error(`Failed to export ${format.toUpperCase()}`);
        } finally {
            setExporting(false);
        }
    };

    return (
        <Container activeNavId={15}>
            <Header title="Export Data" />
            <Toaster />
            
            <div className="export-wrapper">
                <div className="export-card">
                    <div className="export-header-section">
                        <i className="fas fa-download" style={{fontSize: '3rem', color: '#6366f1'}}></i>
                        <h2>Export Your Transaction Data</h2>
                        <p>Download your transaction history in your preferred format with custom filters</p>
                    </div>

                    <div className="export-form-section">
                        <div className="form-group">
                            <label>Transaction Type</label>
                            <select 
                                value={exportData.type} 
                                onChange={(e) => setExportData({...exportData, type: e.target.value})}
                                disabled={exporting}
                            >
                                <option value="ALL">All Transactions</option>
                                <option value="TYPE_EXPENSE">Expenses Only</option>
                                <option value="TYPE_INCOME">Income Only</option>
                            </select>
                        </div>

                        <div className="date-range">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input 
                                    type="date" 
                                    value={exportData.startDate} 
                                    onChange={(e) => setExportData({...exportData, startDate: e.target.value})}
                                    disabled={exporting}
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input 
                                    type="date" 
                                    value={exportData.endDate} 
                                    onChange={(e) => setExportData({...exportData, endDate: e.target.value})}
                                    disabled={exporting}
                                />
                            </div>
                        </div>

                        <div className="export-buttons">
                            <button 
                                className="export-btn pdf" 
                                onClick={() => exportWithFilters('pdf')}
                                disabled={exporting}
                            >
                                <i className="fas fa-file-pdf"></i>
                                <span>Export as PDF</span>
                            </button>
                            <button 
                                className="export-btn csv" 
                                onClick={() => exportWithFilters('csv')}
                                disabled={exporting}
                            >
                                <i className="fas fa-file-csv"></i>
                                <span>Export as CSV</span>
                            </button>
                            <button 
                                className="export-btn json" 
                                onClick={() => exportWithFilters('json')}
                                disabled={exporting}
                            >
                                <i className="fas fa-file-code"></i>
                                <span>Export as JSON</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .export-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                .export-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                }

                .export-header-section {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                }

                .export-header-section h2 {
                    margin: 16px 0 8px;
                    font-size: 2rem;
                    font-weight: 800;
                }

                .export-header-section p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 1.1rem;
                }

                .export-form-section {
                    padding: 40px;
                }

                .form-group {
                    margin-bottom: 24px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                }

                .form-group select,
                .form-group input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                }

                .form-group select:focus,
                .form-group input:focus {
                    outline: none;
                    border-color: #6366f1;
                }

                .form-group select:disabled,
                .form-group input:disabled {
                    background-color: #f9fafb;
                    cursor: not-allowed;
                }

                .date-range {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .export-buttons {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-top: 32px;
                }

                .export-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 24px;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 600;
                }

                .export-btn i {
                    font-size: 2.5rem;
                }

                .export-btn:hover:not(:disabled) {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }

                .export-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .export-btn.pdf {
                    border-color: #ef4444;
                    color: #ef4444;
                }

                .export-btn.pdf:hover:not(:disabled) {
                    background: #fef2f2;
                    border-color: #dc2626;
                }

                .export-btn.csv {
                    border-color: #10b981;
                    color: #10b981;
                }

                .export-btn.csv:hover:not(:disabled) {
                    background: #f0fdf4;
                    border-color: #059669;
                }

                .export-btn.json {
                    border-color: #22c55e;
                    color: #22c55e;
                }

                .export-btn.json:hover:not(:disabled) {
                    background: #f0fdf4;
                    border-color: #16a34a;
                }

                @media (max-width: 768px) {
                    .date-range {
                        grid-template-columns: 1fr;
                    }

                    .export-buttons {
                        grid-template-columns: 1fr;
                    }

                    .export-wrapper {
                        padding: 10px;
                    }

                    .export-form-section {
                        padding: 20px;
                    }

                    .export-header-section {
                        padding: 30px 20px;
                    }

                    .export-header-section h2 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </Container>
    );
}

export default Export;