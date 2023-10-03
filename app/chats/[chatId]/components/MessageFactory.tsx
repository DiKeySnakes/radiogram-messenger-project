'use client';

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CldUploadButton } from 'next-cloudinary';
import useChat from '@/app/hooks/useChat';

const MessageFactory = () => {
  const { chatId } = useChat();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('message', '', { shouldValidate: true });

    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        chatId: chatId,
      }),
    });
  };

  const handleUpload = async (result: any) => {
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: result.info.secure_url,
        chatId: chatId,
      }),
    });
  };

  return (
    <div
      className='
        py-4
        px-4
        border-t
        border-base-300
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      '>
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET}
        className='btn btn-circle btn-ghost border-base-300'>
        <HiPhoto size={30} />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex items-center gap-2 lg:gap-4 w-full'>
        <MessageInput
          id='message'
          register={register}
          errors={errors}
          required
          placeholder='Write a message'
        />
        <button
          type='submit'
          className='btn btn-circle btn-ghost border-base-300'>
          <HiPaperAirplane size={24} />
        </button>
      </form>
    </div>
  );
};

export default MessageFactory;
