import { useEffect, useState } from 'react';
import { MainLayout } from './layout/MainLayout';
import { DataTable, FileUploader, InvoiceDetailsModal } from './components';
import './components/components.css'; // ensure components styles are loaded

export interface Invoice {
  id: number;
  vendor_name: string;
  total_amount: number;
  tax_amount: number;
  date: string;
  confidence_score: number;
  status: 'ready' | 'needs review' | 'duplicate suspected' | 'rejected';
  message: string;
  created_at: string;
}

function App() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      // The Vite proxy routes this to the backend
      const response = await fetch('/api/invoices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Assume data is { invoices: Invoice[] } or Invoice[] directly
      // Currently the python setup returns a list directly according to the endpoints
      setInvoices(Array.isArray(data) ? data : (data.invoices || []));
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <MainLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Accounting Inbox</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review and manage processed invoices from vendors.</p>
      </div>

      <FileUploader onUploadSuccess={fetchInvoices} />

      <DataTable 
        data={invoices} 
        isLoading={isLoading} 
        isError={isError} 
        onRowClick={(invoice) => setSelectedInvoice(invoice)}
      />

      <InvoiceDetailsModal 
        invoice={selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
      />
    </MainLayout>
  );
}

export default App;
