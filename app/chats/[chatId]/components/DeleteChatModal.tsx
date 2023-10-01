'use client';

import React, { useCallback, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import useChat from '@/app/hooks/useChat';
import { toast } from 'react-hot-toast';

const DeleteChatModal: React.FC = () => {
  const router = useRouter();
  const { chatId } = useChat();
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    (document.getElementById('delete_chat_modal') as HTMLDialogElement).close();
  };

  const onDelete = useCallback(() => {
    setIsLoading(true);

    fetch(`/api/chats/${chatId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          closeModal();
          router.push('/chats');
          router.refresh();
        } else {
          toast.error('Something went wrong!');
        }
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  }, [router, chatId]);

  return (
    <>
      <dialog id='delete_chat_modal' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
              onClick={closeModal}>
              ✕
            </button>
          </form>
          <div className='flex flex-row items-center'>
            <FiAlertTriangle
              className='text-2xl text-warning'
              aria-hidden='true'
            />
            <div className='ml-4 text-2xl text-warning'>Delete chat</div>
          </div>
          <div>
            <div className='mt-2'>
              <p className='text-sm'>
                Are you sure you want to delete this chat? This action cannot be
                undone.
              </p>
            </div>
            <div className='mt-5 flex flex-row-reverse'>
              <button
                disabled={isLoading}
                onClick={onDelete}
                className='btn btn-outline btn-error ml-4'>
                Delete
              </button>
              <form method='dialog'>
                <button
                  disabled={isLoading}
                  className='btn btn-outline btn-warning'>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DeleteChatModal;
