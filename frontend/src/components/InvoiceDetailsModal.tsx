import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Clock, XCircle, FileText, Building, Calculator, Calendar } from 'lucide-react';
import type { Invoice } from '../App';
import { Badge } from './Badge';

interface InvoiceDetailsModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoiceDetailsModal = ({ invoice, onClose }: InvoiceDetailsModalProps) => {
  if (!invoice) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={24} style={{ color: 'var(--success)' }} />;
      case 'needs review': return <Clock size={24} style={{ color: 'var(--warning)' }} />;
      case 'duplicate suspected': return <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />;
      case 'rejected': return <XCircle size={24} style={{ color: 'var(--danger)' }} />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content glass-panel"
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="flex items-center" style={{ gap: '0.75rem' }}>
              {getStatusIcon(invoice.status)}
              <h2 className="text-xl font-bold m-0" style={{ fontSize: '1.25rem' }}>Invoice Details</h2>
            </div>
            <button className="icon-btn" onClick={onClose}><X size={20} /></button>
          </div>
          
          <div className="modal-body">
            <div className="detail-cards-grid">
              <div className="detail-card glass-card">
                <Building size={18} className="detail-icon" style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
                <div className="detail-content">
                  <span className="detail-label">Vendor</span>
                  <span className="detail-value">{invoice.vendor_name}</span>
                </div>
              </div>
              <div className="detail-card glass-card">
                <Calendar size={18} className="detail-icon" style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
                <div className="detail-content">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{invoice.date}</span>
                </div>
              </div>
              <div className="detail-card glass-card">
                <Calculator size={18} className="detail-icon" style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
                <div className="detail-content">
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value font-mono">€{invoice.total_amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="detail-card glass-card">
                <FileText size={18} className="detail-icon" style={{ color: 'var(--primary)', marginTop: '0.2rem' }} />
                <div className="detail-content">
                  <span className="detail-label">Tax Amount</span>
                  <span className="detail-value font-mono">€{invoice.tax_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="reasoning-section" style={{ marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>System Reasoning</h3>
              <div className="reasoning-box glass-card" style={{ padding: '1rem' }}>
                <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                  <Badge variant={invoice.confidence_score >= 0.8 ? 'success' : 'warning'}>
                    Confidence: {(invoice.confidence_score * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant={invoice.status === 'ready' ? 'success' : invoice.status === 'rejected' ? 'danger' : 'warning'}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginTop: '0.75rem', color: 'var(--text-primary)' }}>
                  {invoice.message || "No reasoning provided by the system."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            {invoice.status !== 'ready' && invoice.status !== 'rejected' && (
               <button className="btn btn-primary">Approve Manually</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
