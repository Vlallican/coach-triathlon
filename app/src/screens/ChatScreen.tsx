import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SendIcon } from '../components/TabIcons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { aiReplies, initialChatMessages, quickReplies } from '../data/mockData';
import type { ChatMessage } from '../data/types';

let messageSeq = 1;
function nextId() {
  messageSeq += 1;
  return `m-${Date.now()}-${messageSeq}`;
}

export function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState('');
  const replyCounter = useRef(0);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const pushMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: nextId(), from: 'user', text: trimmed }]);
    setInput('');
    const reply = aiReplies[replyCounter.current % aiReplies.length];
    replyCounter.current += 1;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId(), from: 'ai', text: reply }]);
    }, 800);
  }, []);

  const sendChat = useCallback(() => pushMessage(input), [input, pushMessage]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Text style={styles.title}>Coach IA</Text>
        <Text style={styles.subtitle}>Toujours disponible</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, { justifyContent: item.from === 'user' ? 'flex-end' : 'flex-start' }]}>
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: item.from === 'user' ? colors.accent : colors.card,
                },
              ]}
            >
              <Text style={[styles.bubbleText, { color: item.from === 'user' ? colors.onAccent : colors.textMuted85 }]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.quickReplies}>
        {quickReplies.map((q) => (
          <TouchableOpacity key={q} activeOpacity={0.8} style={styles.quickChip} onPress={() => pushMessage(q)}>
            <Text style={styles.quickChipText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendChat}
          placeholder="Écrire un message…"
          placeholderTextColor={colors.textMuted40}
          style={styles.input}
          returnKeyType="send"
        />
        <TouchableOpacity activeOpacity={0.85} style={styles.sendButton} onPress={sendChat}>
          <SendIcon />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  title: {
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12.5,
    color: colors.textMuted45,
    marginTop: 2,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    lineHeight: 19,
  },
  quickReplies: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  quickChipText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted75,
  },
  inputRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 16,
    color: colors.text,
    fontFamily: fonts.body,
    fontSize: 13.5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
