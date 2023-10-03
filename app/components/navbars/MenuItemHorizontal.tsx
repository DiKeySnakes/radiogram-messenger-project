import clsx from 'clsx';
import Link from 'next/link';

interface IMenuItemProps {
  label: string;
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MenuItemHorizontal: React.FC<IMenuItemProps> = ({
  label,
  href,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick} key={label}>
      <Link
        href={href}
        data-tip={label}
        className={clsx('tooltip', active && 'bg-base-300 shadow-lg')}>
        <Icon className='w-8 h-8' aria-hidden='true' />
      </Link>
    </li>
  );
};

export default MenuItemHorizontal;
