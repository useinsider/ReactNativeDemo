import React, { useState, useCallback, useEffect } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Insider from 'react-native-insider';
import { InsiderMessageCenterMessage } from 'react-native-insider/src/InsiderMessageCenterMessage';

const MessageItem = ({
  item,
  onToggleRead,
  onDelete,
}: {
  item: InsiderMessageCenterMessage;
  onToggleRead: (item: InsiderMessageCenterMessage) => void;
  onDelete: (item: InsiderMessageCenterMessage) => void;
}) => {
  item.view();

  const confirmDelete = () => {
    Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item) },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={() => item.click()}
      onLongPress={confirmDelete}
    >
      <View style={[styles.messageItem, !item.isRead && styles.unreadMessage]}>
        <View style={styles.messageHeader}>
          {!item.isRead && <View style={styles.unreadIndicator} />}
          <Text style={[styles.messageTitle, !item.isRead && styles.unreadText]}>
            {item.content?.title ?? 'No Title'}
          </Text>
        </View>
        <Text style={styles.messageBody}>{item.content?.description ?? 'No Description'}</Text>
        {item.buttons && item.buttons.length > 0 && (
          <View style={styles.buttonsContainer}>
            {item.buttons.map((button) => (
              <TouchableOpacity
                key={button.buttonId}
                style={styles.actionButton}
                onPress={() => button.click()}
              >
                <Text style={styles.actionButtonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.toggleButton} onPress={() => onToggleRead(item)}>
            <Text style={styles.toggleButtonText}>{item.isRead ? 'Mark Unread' : 'Mark Read'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<InsiderMessageCenterMessage[]>([]);

  const refreshMessages = useCallback(async () => {
    try {
      const inbox = await Insider.messageCenter.getInbox();
      if (inbox?.messages) {
        setMessages(inbox.messages);
      }
    } catch (err) {
      console.error('Failed to refresh messages:', err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Insider.messageCenter.getInbox((err, result) => {
      setLoading(false);
      if (err || !result) setError(err ?? new Error('Unknown error.'));
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
      await refreshMessages();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update message status');
    }
  }, [refreshMessages]);

  const handleDelete = useCallback(async (item: InsiderMessageCenterMessage) => {
    try {
      await item.delete();
      Alert.alert('Success', 'Message deleted');
      await refreshMessages();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete message');
    }
  }, [refreshMessages]);

  const handleRemoveAll = useCallback(() => {
    if (messages.length === 0) {
      Alert.alert('Info', 'No messages to delete');
      return;
    }
    Alert.alert(
      'Remove All Messages',
      `Are you sure you want to delete all ${messages.length} messages?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              const ids = messages.map(m => m.messageId);
              await Insider.messageCenter.deleteMessages(ids);
              Alert.alert('Success', 'All messages deleted');
              await refreshMessages();
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to delete messages');
            }
          },
        },
      ],
    );
  }, [messages, refreshMessages]);

  if (loading) {
    return <Text>Loading...</Text>;
  } else if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {messages.length > 0 && (
        <TouchableOpacity style={styles.removeAllButton} onPress={handleRemoveAll}>
          <Text style={styles.removeAllText}>Remove All</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={messages}
        keyExtractor={item => item.messageId}
        renderItem={({ item }) => (
          <MessageItem item={item} onToggleRead={handleToggleRead} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  removeAllButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
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
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#D32F2F',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
