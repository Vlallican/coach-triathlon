import { useCallback, useEffect, useRef, useState } from 'react';
import { aiReplies } from '../data/mockData';
import type { ChatMessageRow } from '../data/db-types';
import { mapChatMessageRow } from '../data/mappers';
import type { ChatMessage } from '../data/types';
import { supabase } from '../lib/supabase';

/** Messages du chat de l'utilisateur, persistés dans `chat_messages`. */
export function useChatMessages(userId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const replyCounter = useRef(0);

  const load = useCallback(async () => {
    if (!userId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    setMessages(((data ?? []) as ChatMessageRow[]).map(mapChatMessageRow));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !userId) return;

      const { data: inserted } = await supabase
        .from('chat_messages')
        .insert({ user_id: userId, from_role: 'user', text: trimmed })
        .select()
        .single();
      if (inserted) setMessages((prev) => [...prev, mapChatMessageRow(inserted as ChatMessageRow)]);

      const reply = aiReplies[replyCounter.current % aiReplies.length];
      replyCounter.current += 1;
      setTimeout(async () => {
        const { data: aiInserted } = await supabase
          .from('chat_messages')
          .insert({ user_id: userId, from_role: 'ai', text: reply })
          .select()
          .single();
        if (aiInserted) setMessages((prev) => [...prev, mapChatMessageRow(aiInserted as ChatMessageRow)]);
      }, 800);
    },
    [userId]
  );

  return { messages, loading, sendMessage };
}
