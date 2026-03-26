import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`];
  if (fullWidth) classes.push('btn-full');
  if (className) classes.push(className);

  return (
    <button className={classes.join(' ')} {...props}>
      {children}
    </button>
  );
};
