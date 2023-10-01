'use client';

import React, { useState } from 'react';
import { HiUserGroup } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';

import Input from '../inputs/Input';
import Select from '../inputs/Select';
import Modal from './Modal';
import { toast } from 'react-hot-toast';

interface IGroupChatModalProps {
  users: User[];
}

const GroupChatModal: React.FC<IGroupChatModalProps> = ({ users = [] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = watch('members');

  const closeModal = () => {
    (document.getElementById('group_chat_modal') as HTMLFormElement).close();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          isGroup: true,
        }),
      });

      if (response.ok) {
        router.refresh();
        closeModal();
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal id='group_chat_modal'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-neutral pb-12'>
            <div className='flex flex-row items-center'>
              <HiUserGroup
                className='text-2xl text-warning'
                aria-hidden='true'
              />
              <div className='ml-4 text-2xl text-warning'>
                Create a group chat
              </div>
            </div>
            <p className='mt-1 text-sm leading-6'>
              Create a chat with more than 2 people.
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <Input
                disabled={isLoading}
                label='Name'
                id='name'
                errors={errors}
                required
                register={register}
              />
              <Select
                id='react_select'
                disabled={isLoading}
                label='Members'
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue('members', value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            onClick={closeModal}
            className='btn btn-outline btn-error'
            disabled={isLoading}>
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='btn btn-outline btn-info'>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
