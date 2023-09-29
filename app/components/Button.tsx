import clsx from 'clsx';

interface IButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  type = 'button',
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        'btn',
        fullWidth && 'btn-block',
        secondary && 'btn-accent',
        danger && 'btn-error',
        !secondary && !danger && 'btn-primary'
      )}>
      {children}
    </button>
  );
};

export default Button;
