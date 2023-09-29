'use client';

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface IMessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
}

const MessageInput: React.FC<IMessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
}) => {
  return (
    <div className='relative w-full'>
      <input
        id={id}
        type={type}
        autoComplete='on'
        {...register(id, { required })}
        placeholder={placeholder}
        className='
        input
        input-bordered
        rounded-full
        w-full
        font-light
        focus:outline-none
        '
      />
    </div>
  );
};

export default MessageInput;
