import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText } from 'lucide-react';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

export const FileUploader = ({ onUploadSuccess }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/invoices/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onUploadSuccess();
    } catch (err) {
      console.error(err);
      setError('Failed to process invoice. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  return (
    <div className="uploader-container">
      <div 
        className={`file-uploader ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleChange} 
          accept="application/pdf" 
          style={{ display: 'none' }} 
        />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            >
              <div className="scanning-container" style={{ marginBottom: '1rem' }}>
                <FileText size={48} style={{ color: 'var(--text-tertiary)' }} />
                <motion.div 
                  className="scanning-line"
                  animate={{ y: [0, 48, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </div>
              <p style={{ fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>AI is extracting data...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            >
              <UploadCloud size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Drag & Drop Invoice</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>or click to browse PDF files</p>
              {error && <p style={{ fontSize: '0.875rem', color: 'var(--danger)', marginTop: '0.75rem', fontWeight: 500 }}>{error}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
