'use client';

import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput from './MessageInput';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { CldUploadButton } from 'next-cloudinary';
import useChat from '@/app/hooks/useChat';

const Form = () => {
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
    axios.post('/api/messages', {
      ...data,
      chatId: chatId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result.info.secure_url,
      chatId: chatId,
    });
  };

  return (
    <div
      className='
        py-4
        px-4
        border-t
        border-neutral
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
        className='btn btn-circle btn-ghost border-neutral'>
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
          className='btn btn-circle btn-ghost border-neutral'>
          <HiPaperAirplane size={24} />
        </button>
      </form>
    </div>
  );
};

export default Form;
