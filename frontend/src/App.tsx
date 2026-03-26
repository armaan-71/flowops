
import { MainLayout } from './layout/MainLayout';
import { Card, CardHeader, CardContent, CardFooter, Badge, Button } from './components';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
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

const mockInvoices: Invoice[] = [
  {
    id: 1,
    vendor_name: 'Acme Corp',
    total_amount: 1500.00,
    tax_amount: 300.00,
    date: '2026-03-25',
    confidence_score: 0.95,
    status: 'ready',
    message: 'Processed successfully.',
    created_at: '2026-03-26T10:00:00Z',
  },
  {
    id: 2,
    vendor_name: 'Global Tech',
    total_amount: 450.50,
    tax_amount: 90.10,
    date: '2026-03-24',
    confidence_score: 0.72,
    status: 'needs review',
    message: 'Low confidence score (< 0.8).',
    created_at: '2026-03-26T10:15:00Z',
  },
  {
    id: 3,
    vendor_name: 'Office Supplies Inc',
    total_amount: 120.00,
    tax_amount: 24.00,
    date: '2026-03-20',
    confidence_score: 0.88,
    status: 'duplicate suspected',
    message: 'Potential duplicate of Invoice #1042.',
    created_at: '2026-03-26T10:30:00Z',
  }
];

const getStatusBadge = (status: Invoice['status']) => {
  switch (status) {
    case 'ready':
      return <Badge variant="success" className="flex items-center gap-1"><CheckCircle size={12}/> Ready</Badge>;
    case 'needs review':
      return <Badge variant="warning" className="flex items-center gap-1"><Clock size={12}/> Review</Badge>;
    case 'duplicate suspected':
      return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle size={12}/> Duplicate</Badge>;
    case 'rejected':
      return <Badge variant="danger" className="flex items-center gap-1"><XCircle size={12}/> Rejected</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

function App() {
  return (
    <MainLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Invoice Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage and review your extracted invoices.</p>
      </div>

      <div className="invoices-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {mockInvoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{invoice.vendor_name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{invoice.date}</p>
              </div>
              {getStatusBadge(invoice.status)}
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Amount</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>€{invoice.total_amount.toFixed(2)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Confidence</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 500, color: invoice.confidence_score >= 0.8 ? 'var(--success)' : 'var(--warning)' }}>
                    {(invoice.confidence_score * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              {invoice.message && (
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {invoice.message}
                </div>
              )}
            </CardContent>
            <CardFooter style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="primary" fullWidth>Review Details</Button>
              <Button variant="secondary" fullWidth>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}

export default App;
