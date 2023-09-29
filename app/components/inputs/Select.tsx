'use client';

import ReactSelect from 'react-select';

interface ISelectProps {
  id: string;
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

const Select: React.FC<ISelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div className='form-control w-full'>
      <div className='label'>
        <span className='label-text'>{label}</span>
      </div>
      <div className='mt-2'>
        <ReactSelect
          instanceId={id}
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
        />
      </div>
    </div>
  );
};

export default Select;
