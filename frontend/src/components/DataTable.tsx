import { motion } from 'framer-motion';
import { Badge } from './Badge';
import { Button } from './Button';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { Invoice } from '../App';

interface DataTableProps {
  data: Invoice[];
  isLoading: boolean;
  isError?: boolean;
  onRowClick?: (invoice: Invoice) => void;
}

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

const tableVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const DataTable = ({ data, isLoading, isError, onRowClick }: DataTableProps) => {
  if (isLoading) {
    return (
      <div className="table-container empty-state">
        <div className="spinner"></div>
        <p>Loading invoices...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="table-container empty-state">
        <AlertTriangle size={32} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <p>Failed to load invoices. Please try again.</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container empty-state">
        <p>No invoices found. They will appear here once processed.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Confidence</th>
            <th>Actions</th>
          </tr>
        </thead>
        <motion.tbody
          variants={tableVariants}
          initial="hidden"
          animate="show"
        >
          {data.map((invoice) => (
            <motion.tr 
              key={invoice.id} 
              variants={rowVariants}
              className={onRowClick ? "clickable-row" : ""}
              onClick={() => onRowClick?.(invoice)}
            >
              <td style={{ fontWeight: 500 }}>{invoice.vendor_name}</td>
              <td>€{invoice.total_amount.toFixed(2)}</td>
              <td style={{ color: 'var(--text-secondary)' }}>{invoice.date}</td>
              <td>{getStatusBadge(invoice.status)}</td>
              <td>
                <span style={{ 
                  color: invoice.confidence_score >= 0.8 ? 'var(--success)' : 'var(--warning)',
                  fontWeight: 500 
                }}>
                  {(invoice.confidence_score * 100).toFixed(0)}%
                </span>
              </td>
              <td>
                <Button variant="secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>View</Button>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};
