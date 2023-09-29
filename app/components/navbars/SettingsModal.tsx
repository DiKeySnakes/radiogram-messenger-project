'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { CldUploadButton } from 'next-cloudinary';

import Input from '../inputs/Input';
import Modal from '../modals/Modal';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ISettingsModalProps {
  currentUser: User;
}

const SettingsModal: React.FC<ISettingsModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  console.log('CURRENT_USER: ', currentUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch('image');

  const handleUpload = (result: any) => {
    setValue('image', result.info.secure_url, {
      shouldValidate: true,
    });
  };

  const closeModal = () => {
    (document.getElementById('settings_modal') as HTMLFormElement).close();
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post('/api/settings', data)
      .then(() => {
        router.refresh();
        closeModal();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal id='settings_modal'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-neutral pb-12'>
            <h1 className='text-2xl text-warning'>Profile</h1>
            <p className='mt-1 text-sm leading-6'>
              Edit your public information.
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
              <div>
                <span className='block text-sm font-medium leading-6'>
                  Photo
                </span>
                <div className='mt-2 flex items-center gap-x-3'>
                  <Image
                    width='48'
                    height='48'
                    className='rounded-full w-12 h-12'
                    src={
                      image || currentUser?.image || '/images/placeholder.jpg'
                    }
                    alt='Avatar'
                  />
                  <div onClick={closeModal}>
                    <CldUploadButton
                      options={{ maxFiles: 1 }}
                      onUpload={handleUpload}
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET
                      }
                      className='btn btn-outline btn-warning'>
                      Change
                    </CldUploadButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            onClick={closeModal}
            disabled={isLoading}
            className='btn btn-outline btn-error'>
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className='btn btn-outline btn-info'>
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
