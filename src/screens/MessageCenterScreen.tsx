import React from 'react';
import { Text, FlatList, View, StyleSheet } from 'react-native';
import Insider from 'react-native-insider';
import { useAsync } from './Hooks.ts';

const MessageItem = ({ item }: { item: any }) => {
  return (
    <View style={styles.messageItem}>
      <Text style={styles.messageTitle}>{item.content?.title ?? "No Title"}</Text>
      <Text style={styles.messageBody}>{item.content?.description ?? "No Description"}</Text>
    </View>
  );
};

export default () => {
  const { loading, result, error } = useAsync(Insider.messageCenter.getInbox);

  if (loading) {
    return <Text>Loading...</Text>;
  } else if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <FlatList
      data={result?.messages ?? []}
      keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
      renderItem={({ item }) => <MessageItem item={item} />}
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
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
