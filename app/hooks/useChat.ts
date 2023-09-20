import { useParams } from 'next/navigation';
import { useMemo } from 'react';

type ChatData = {
  isOpen: boolean;
  chatId: string;
};

const useChat = (): ChatData => {
  const params = useParams();

  const chatId = useMemo(() => {
    if (!params?.chatId) {
      return '';
    }

    return params.chatId as string;
  }, [params?.chatId]);

  const isOpen = useMemo(() => !!chatId, [chatId]);

  return useMemo(
    () => ({
      isOpen,
      chatId,
    }),
    [isOpen, chatId]
  );
};

export default useChat;
