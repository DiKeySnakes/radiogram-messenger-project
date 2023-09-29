import { useParams } from 'next/navigation';
import { useMemo } from 'react';

type ChatData = {
  chatIsActive: boolean;
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

  const chatIsActive = useMemo(() => !!chatId, [chatId]);

  return useMemo(
    () => ({
      chatIsActive,
      chatId,
    }),
    [chatIsActive, chatId]
  );
};

export default useChat;
