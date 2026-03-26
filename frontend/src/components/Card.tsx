import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div className={`glass-card ${className}`} style={style}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', style }) => (
  <div className={`card-header ${className}`} style={{ padding: '1.25rem', borderBottom: '1px solid var(--glass-border)', ...style }}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className = '', style }) => (
  <div className={`card-content ${className}`} style={{ padding: '1.25rem', ...style }}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className = '', style }) => (
  <div className={`card-footer ${className}`} style={{ padding: '1.25rem', borderTop: '1px solid var(--glass-border)', ...style }}>
    {children}
  </div>
);
