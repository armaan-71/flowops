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
              className="uploading-state flex flex-col items-center justify-center p-4"
            >
              <div className="scanning-container">
                <FileText size={48} className="text-secondary opacity-50 mb-2" />
                <motion.div 
                  className="scanning-line"
                  animate={{ y: [0, 48, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              </div>
              <p className="mt-4 font-medium text-gradient">AI is extracting data...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="idle-state flex flex-col items-center justify-center p-4"
            >
              <UploadCloud size={48} className="mb-4 mx-auto" style={{ color: 'var(--primary)' }} />
              <h3 className="text-lg font-semibold mb-2">Drag & Drop Invoice</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>or click to browse PDF files</p>
              {error && <p className="text-sm mt-3 font-medium" style={{ color: 'var(--danger)' }}>{error}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
