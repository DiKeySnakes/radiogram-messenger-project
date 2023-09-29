'use client';

import clsx from 'clsx';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  register,
  required,
  errors,
  type = 'text',
  disabled,
}) => {
  return (
    <div className='form-control w-full'>
      <label htmlFor={id} className='label'>
        <span className='label-text'>{label}</span>
      </label>
      <input
        id={id}
        type={type}
        autoComplete='on'
        disabled={disabled}
        className={clsx(
          'input input-bordered w-full focus:outline-none',
          errors[id] && 'input-error'
        )}
        {...register(id, { required })}
      />
    </div>
  );
};

export default Input;
