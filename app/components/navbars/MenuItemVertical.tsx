import clsx from 'clsx';
import Link from 'next/link';

interface IMenuItemProps {
  label: string;
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

const MenuItemVertical: React.FC<IMenuItemProps> = ({
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
        className={clsx('tooltip tooltip-right', active && 'bg-neutral')}>
        <Icon className='w-8 h-8' aria-hidden='true' />
      </Link>
    </li>
  );
};

export default MenuItemVertical;
