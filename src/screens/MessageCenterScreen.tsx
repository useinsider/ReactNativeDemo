import React, { useState, useCallback, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Insider from 'react-native-insider';
import { InsiderMessageCenterMessage } from 'react-native-insider/src/InsiderMessageCenterMessage';

const MessageItem = ({
  item,
  onToggleRead,
}: {
  item: InsiderMessageCenterMessage;
  onToggleRead: (item: InsiderMessageCenterMessage) => void;
}) => {
  return (
    <View style={[styles.messageItem, !item.isRead && styles.unreadMessage]}>
      <View style={styles.messageHeader}>
        {!item.isRead && <View style={styles.unreadIndicator} />}
        <Text style={[styles.messageTitle, !item.isRead && styles.unreadText]}>
          {item.content?.title ?? 'No Title'}
        </Text>
        <TouchableOpacity style={styles.toggleButton} onPress={() => onToggleRead(item)}>
          <Text style={styles.toggleButtonText}>{item.isRead ? 'Mark As Unread' : 'Mark As Read'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.messageBody}>{item.content?.description ?? 'No Description'}</Text>
    </View>
  );
};

export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<InsiderMessageCenterMessage[]>([]);

  useEffect(() => {
    setLoading(true);
    Insider.messageCenter.getInbox((error, result) => {
      setLoading(false);
      if (error || !result) setError(error ?? new Error('Unknown error.'));
      else setMessages(result.messages);
    });
  }, []);

  const handleToggleRead = useCallback(async (item: InsiderMessageCenterMessage) => {
    try {
      if (item.isRead) {
        await item.markAsUnread();
      } else {
        await item.markAsRead();
      }

      const updatedInbox = await Insider.messageCenter.getInbox();
      if (updatedInbox?.messages) {
        setMessages(updatedInbox.messages);
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update message status');
    }
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  } else if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={item => item.messageId}
      renderItem={({ item }) => <MessageItem item={item} onToggleRead={handleToggleRead} />}
      ListEmptyComponent={<Text style={styles.emptyText}>No messages</Text>}
    />
  );
};

const styles = StyleSheet.create({
  messageItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  unreadMessage: {
    backgroundColor: '#f0f8ff',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  unreadText: {
    color: '#000',
  },
  toggleButton: {
    padding: 8,
    marginLeft: 8,
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  messageBody: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});
