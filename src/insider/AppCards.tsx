import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  View,
  Modal,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewToken,
} from "react-native";
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from "react-native-safe-area-context";

import CustomButton from "../components/CustomButton";
import Card from "../components/Card";
import Insider from "react-native-insider";
import {
  InsiderAppCard,
  InsiderAppCardAction,
  InsiderAppCardDeeplinkAction,
} from "react-native-insider/src/InsiderAppCard";
import { colors, typography } from "../theme";

// Logs the action attached to a card or button, expanding deeplink details.
// Field/method names mirror the native SDK surface (mobileandroid / mobile-ios).
const logCardAction = (prefix: string, action?: InsiderAppCardAction | null) => {
  if (!action) {
    console.log(`${prefix} - no action`);
    return;
  }

  console.log(`${prefix} - type=${action.type}`);

  if (action.type === "deep_link") {
    const deeplink = action as InsiderAppCardDeeplinkAction;
    console.log(`${prefix} - deeplinkType=${deeplink.deeplinkType} url=${deeplink.url}`);
    if (deeplink.keysAndValues && deeplink.keysAndValues.length > 0) {
      console.log(`${prefix} - keysAndValues=${JSON.stringify(deeplink.keysAndValues)}`);
    }
    if (deeplink.json !== null && deeplink.json !== undefined) {
      console.log(`${prefix} - json=${JSON.stringify(deeplink.json)}`);
    }
  }
};

const AppCardItem = ({
  item,
  onOpenDetail,
  onToggleRead,
  onDelete,
}: {
  item: InsiderAppCard;
  onOpenDetail: (item: InsiderAppCard) => void;
  onToggleRead: (item: InsiderAppCard) => void;
  onDelete: (item: InsiderAppCard) => void;
}) => {
  const confirmDelete = () => {
    Alert.alert("Delete Message", "Are you sure you want to delete this message?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(item) },
    ]);
  };

  return (
    <TouchableOpacity onPress={() => onOpenDetail(item)} onLongPress={confirmDelete}>
      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          {!item.isRead && <View style={styles.unreadIndicator} />}
          <Text style={styles.cardTitle}>{item.content?.title ?? "No Title"}</Text>
        </View>
        <Text style={styles.cardBody} numberOfLines={2}>
          {item.content?.description ?? "No Description"}
        </Text>

        <View style={styles.buttonRow}>
          <CustomButton
            text={item.isRead ? "Mark Unread" : "Mark Read"}
            onPress={() => onToggleRead(item)}
          />
          <CustomButton
            text="Delete"
            buttonStyle={{ backgroundColor: colors.orangeDark }}
            onPress={confirmDelete}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// Full-screen modal chrome shared by the App Cards inbox and the card detail
// view: a themed SafeAreaView with a header (title + Close). SafeAreaProvider is
// re-established here because the safe-area context does not cross the Modal
// boundary on iOS.
const ModalScreen = ({
  visible = true,
  title,
  onClose,
  children,
}: {
  visible?: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <SafeAreaView style={styles.modalContainer} edges={["top", "bottom"]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  </Modal>
);

// Full-screen detail view, rendered inside the shared ModalScreen chrome so it
// matches the App Cards inbox (same header + Close) and the rest of the demo.
const CardDetail = ({
  card,
  onClose,
  onToggleRead,
  onDelete,
}: {
  card: InsiderAppCard;
  onClose: () => void;
  onToggleRead: (item: InsiderAppCard) => void;
  onDelete: (item: InsiderAppCard) => void;
}) => {
  const imageUrl = card.images && card.images.length > 0 ? card.images[0].url : null;

  return (
    <ModalScreen title="Message" onClose={onClose}>
      <ScrollView contentContainerStyle={styles.detailScroll}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.detailImage} resizeMode="cover" />
        )}
        <Text style={styles.detailTitle}>{card.content?.title ?? "No Title"}</Text>
        <Text style={styles.detailBody}>{card.content?.description ?? "No Description"}</Text>

        {card.buttons && card.buttons.length > 0 && (
          <View style={styles.detailCardButtons}>
            {card.buttons.map((button) => (
              <CustomButton
                key={button.buttonId}
                text={button.text}
                buttonStyle={{ backgroundColor: colors.navy }}
                onPress={() => {
                  logCardAction(
                    `[INSIDER][AppCardButtonClick]: card=${button.appCardId} button=${button.buttonId}`,
                    button.action
                  );
                  button.click();
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.detailFooter}>
        {card.action && (
          <View style={styles.buttonRow}>
            <CustomButton
              text="Open"
              onPress={() => {
                logCardAction(`[INSIDER][AppCardItemClick]: card=${card.appCardId}`, card.action);
                card.click();
              }}
            />
          </View>
        )}
        <View style={styles.buttonRow}>
          <CustomButton
            text={card.isRead ? "Mark Unread" : "Mark Read"}
            onPress={() => {
              onToggleRead(card);
              onClose();
            }}
          />
          <CustomButton
            text="Delete"
            buttonStyle={{ backgroundColor: colors.orangeDark }}
            onPress={() => {
              onDelete(card);
              onClose();
            }}
          />
        </View>
      </View>
    </ModalScreen>
  );
};

// The App Cards inbox. Mounted only while the modal is open, so campaigns are
// fetched on open rather than on app start.
const AppCardsInbox = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<InsiderAppCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<InsiderAppCard | null>(null);

  // Single source of truth for loading campaigns into state; callers layer
  // their own loading/error handling on top (full-screen on first load,
  // silent-with-Alert on refresh after a mutation).
  const fetchCampaigns = useCallback(async () => {
    const inbox = await Insider.appCards.getCampaigns();
    const cards = inbox?.appCards ?? [];
    console.log("[INSIDER][AppCards]: Received " + cards.length + " cards");
    setMessages(cards);
  }, []);

  const refreshMessages = useCallback(async () => {
    try {
      await fetchCampaigns();
    } catch (err) {
      console.log("[INSIDER][AppCards]: Error loading cards: " + err);
    }
  }, [fetchCampaigns]);

  useEffect(() => {
    setLoading(true);
    fetchCampaigns()
      .catch((err) => {
        console.log("[INSIDER][AppCards]: Error loading cards: " + err);
        setError(err instanceof Error ? err : new Error("Unknown error."));
      })
      .finally(() => setLoading(false));
  }, [fetchCampaigns]);

  const handleOpenDetail = useCallback((item: InsiderAppCard) => {
    console.log("[INSIDER][AppCardItem]: Opening detail: " + item.appCardId);
    setSelectedCard(item);
  }, []);

  const handleToggleRead = useCallback(
    async (item: InsiderAppCard) => {
      try {
        if (item.isRead) {
          console.log("[INSIDER][AppCardItem]: Marking card as unread: " + item.appCardId);
          await item.markAsUnread();
        } else {
          console.log("[INSIDER][AppCardItem]: Marking card as read: " + item.appCardId);
          await item.markAsRead();
        }
        await refreshMessages();
      } catch (err) {
        const action = item.isRead ? "unread" : "read";
        console.log("[INSIDER][AppCardItem]: Error marking as " + action + ": " + err);
        Alert.alert("Error", err instanceof Error ? err.message : "Failed to update message status");
      }
    },
    [refreshMessages]
  );

  const handleDelete = useCallback(
    async (item: InsiderAppCard) => {
      try {
        console.log("[INSIDER][AppCardItem]: Deleting card: " + item.appCardId);
        await item.delete();
        Alert.alert("Success", "Message deleted");
        await refreshMessages();
      } catch (err) {
        console.log("[INSIDER][AppCardItem]: Error deleting card: " + err);
        Alert.alert("Error", err instanceof Error ? err.message : "Failed to delete message");
      }
    },
    [refreshMessages]
  );

  const handleRemoveAll = useCallback(() => {
    if (messages.length === 0) {
      Alert.alert("Info", "No messages to delete");
      return;
    }
    Alert.alert(
      "Remove All Messages",
      `Are you sure you want to delete all ${messages.length} messages?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const ids = messages.map((m) => m.appCardId);
              console.log("[INSIDER][AppCards]: Deleting all " + ids.length + " cards");
              await Insider.appCards.delete(ids);
              Alert.alert("Success", "All messages deleted");
              await refreshMessages();
            } catch (err) {
              console.log("[INSIDER][AppCards]: Error deleting all cards: " + err);
              Alert.alert("Error", err instanceof Error ? err.message : "Failed to delete messages");
            }
          },
        },
      ]
    );
  }, [messages, refreshMessages]);

  const viewedRef = useRef<Set<string>>(new Set());
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    viewableItems.forEach(({ item }) => {
      const card = item as InsiderAppCard;
      if (card && !viewedRef.current.has(card.appCardId)) {
        viewedRef.current.add(card.appCardId);
        console.log("[INSIDER][AppCardItem]: View tracked: " + card.appCardId);
        card.view();
      }
    });
  }).current;

  if (loading) {
    return <Text style={styles.stateText}>Loading...</Text>;
  } else if (error) {
    return <Text style={styles.stateText}>{error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      {messages.length > 0 && (
        <View style={styles.removeAllWrapper}>
          <CustomButton
            text="Remove All"
            buttonStyle={{ backgroundColor: colors.orangeDark }}
            onPress={handleRemoveAll}
          />
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.appCardId}
        renderItem={({ item }) => (
          <AppCardItem
            item={item}
            onOpenDetail={handleOpenDetail}
            onToggleRead={handleToggleRead}
            onDelete={handleDelete}
          />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListEmptyComponent={<Text style={styles.emptyText}>No messages</Text>}
      />

      {selectedCard && (
        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
        />
      )}
    </View>
  );
};

function AppCards() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <CustomButton text="Show App Cards" onPress={() => setVisible(true)} />

      <ModalScreen visible={visible} title="App Cards" onClose={() => setVisible(false)}>
        {visible && <AppCardsInbox />}
      </ModalScreen>
    </View>
  );
}

export default AppCards;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  modalTitle: {
    ...typography.title,
    color: colors.onSurface,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 22,
    color: colors.onSurface,
  },
  stateText: {
    ...typography.body,
    textAlign: "center",
    marginTop: 20,
    color: colors.onSurfaceVariant,
  },
  container: {
    flex: 1,
  },
  removeAllWrapper: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  card: {
    marginHorizontal: 15,
    marginTop: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.navy,
    marginRight: 8,
  },
  cardTitle: {
    ...typography.title,
    fontSize: 18,
    flex: 1,
    color: colors.onSurface,
  },
  cardBody: {
    ...typography.body,
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
    marginTop: 20,
    color: colors.onSurfaceVariant,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  // --- Detail screen ---
  detailScroll: {
    padding: 20,
  },
  detailImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailTitle: {
    ...typography.title,
    color: colors.onSurface,
  },
  detailBody: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    color: colors.onSurfaceVariant,
  },
  detailCardButtons: {
    marginTop: 16,
  },
  detailFooter: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
});
