import { IconType } from 'react-icons';

interface AuthProviderButtonProps {
  icon: IconType;
  onClick: () => void;
}

const AuthProviderButton: React.FC<AuthProviderButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='btn btn-neutral btn-block'>
      <Icon size={24} />
    </button>
  );
};

export default AuthProviderButton;
