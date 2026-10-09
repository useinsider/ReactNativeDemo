import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomButton from "../components/CustomButton";
import {
  InsiderAppFrame,
  InsiderAppFrameStatus,
  InsiderAppFramesError,
  isErrorStatus,
  isLoadingStatus,
  type InsiderAppFrameStatusType,
} from "react-native-insider";

/**
 * App Frames playground, mirroring ActivityAppFrames in the Android demo app: a placement id
 * field on top, then one card per placement with a status chip, an attach/detach toggle and a
 * delete button. New placements go in at the top and the list is persisted, exactly as Android
 * persists it in SharedPreferences.
 *
 * The seeded ids are Android's own defaults. They only resolve to content on a partner where
 * those placements exist — on any other partner they report UNAVAILABLE ("No content"), which is
 * a resting state and not an error. Type a placement id registered on your partner into the
 * field to see real content; that is what the field is for.
 */
const DEFAULT_PLACEMENT_IDS = ["placement_1", "placement_2", "placement_3", "placement_4"];

const STORAGE_KEY = "insider_app_frames_placement_ids";

// Same three signals the Android demo's chip uses, so a status reads the same on both.
const STATUS_COLORS = {
  loading: "#FF6B35",
  ready: "#2E9E5B",
  failed: "#D32F2F",
};

type ChipState = { text: string; color: string };

const INITIAL_CHIP: ChipState = { text: "Detached", color: STATUS_COLORS.loading };

/**
 * One placement: its own status chip, its own frame, and its own attach state.
 *
 * Attach/detach unmounts and remounts the frame rather than hiding it, which is what exercises
 * the SDK's subscribe-on-window-attach path — the same thing the Android demo's button does by
 * removing the view from its parent.
 */
function PlacementCard({
  placementId,
  onDelete,
}: {
  placementId: string;
  onDelete: () => void;
}) {
  const isDarkMode = useColorScheme() === "dark";
  const [attached, setAttached] = useState(true);
  const [chip, setChip] = useState<ChipState>(INITIAL_CHIP);
  const [height, setHeight] = useState<number | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          borderWidth: 1,
          borderColor: isDarkMode ? "#4A4A4A" : "#DDDDDD",
          borderRadius: 6,
          padding: 10,
          marginBottom: 12,
        },
        headerRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        placement: {
          fontSize: 15,
          fontWeight: "bold",
          color: isDarkMode ? "white" : "black",
          flexShrink: 1,
        },
        chipRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
        dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
        chipText: { fontSize: 12, color: isDarkMode ? "#CCCCCC" : "#555555", flexShrink: 1 },
        frameWrapper: { marginTop: 10 },
        buttonRow: { flexDirection: "row", marginTop: 6 },
      }),
    [isDarkMode],
  );

  const handleStatusChange = useCallback(
    (status: InsiderAppFrameStatusType, previousStatus: InsiderAppFrameStatusType) => {
      console.log(`[INSIDER][AppFrames] ${placementId}: ${previousStatus} -> ${status}`);

      if (isLoadingStatus(status)) {
        setChip({ text: "Loading…", color: STATUS_COLORS.loading });
        return;
      }

      if (status === InsiderAppFrameStatus.READY) {
        setChip({ text: "Ready", color: STATUS_COLORS.ready });
        return;
      }

      if (status === InsiderAppFrameStatus.UNAVAILABLE) {
        setChip({ text: "No content", color: STATUS_COLORS.loading });
        return;
      }

      if (status === InsiderAppFrameStatus.DISABLED) {
        setChip({ text: "App Frames disabled", color: STATUS_COLORS.failed });
        return;
      }

      if (status === InsiderAppFrameStatus.DISMISSED) {
        setChip({ text: "Dismissed", color: STATUS_COLORS.loading });
        return;
      }

      if (status === InsiderAppFrameStatus.DETACHED) {
        setChip({ text: "Detached", color: STATUS_COLORS.loading });
        return;
      }

      // The ERROR_* statuses arrive right after onLoadError, which already put the specific
      // reason on the chip — same ordering the Android demo relies on. Leave it alone.
      if (!isErrorStatus(status)) {
        setChip({ text: status, color: STATUS_COLORS.loading });
      }
    },
    [placementId],
  );

  const handleLoadError = useCallback(
    (error: InsiderAppFramesError) => {
      console.log(
        `[INSIDER][AppFrames] ${placementId}: ${error.code} — ${error.message}` +
          (error.cause ? ` (cause: ${error.cause})` : ""),
      );
      setChip({ text: `Failed — ${error.code}`, color: STATUS_COLORS.failed });
    },
    [placementId],
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.placement}>{`Placement: ${placementId}`}</Text>
      </View>

      <View style={styles.chipRow}>
        <View style={[styles.dot, { backgroundColor: chip.color }]} />
        <Text style={styles.chipText}>
          {chip.text}
          {height === null ? "" : ` · ${Math.round(height)}dp`}
        </Text>
      </View>

      {attached ? (
        <View style={styles.frameWrapper}>
          <InsiderAppFrame
            placementId={placementId}
            onStatusChange={handleStatusChange}
            onLoadError={handleLoadError}
            onHeightChange={setHeight}
            onDismissRequest={() =>
              setChip({ text: "Dismissed", color: STATUS_COLORS.loading })
            }
            onAction={(data) =>
              console.log(`[INSIDER][AppFrames] ${placementId} action: ${JSON.stringify(data)}`)
            }
          />
        </View>
      ) : null}

      <View style={styles.buttonRow}>
        <CustomButton
          text={attached ? "Detach" : "Attach"}
          onPress={() => setAttached((value) => !value)}
        />
        <CustomButton
          text="Delete"
          buttonStyle={{ backgroundColor: "#E57F74" }}
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

function AppFramesPlayground() {
  const isDarkMode = useColorScheme() === "dark";
  const [placementIds, setPlacementIds] = useState<string[]>(DEFAULT_PLACEMENT_IDS);
  const [draft, setDraft] = useState("");
  // Nothing is written back until the stored list has been read, so a save racing the initial
  // load cannot overwrite it with the defaults.
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        // Absence of the key — not emptiness — is what seeds the defaults, matching Android:
        // deleting every card must not resurrect them on the next visit.
        if (stored === null) {
          return;
        }
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPlacementIds(parsed.filter((id) => typeof id === "string" && id.length > 0));
        }
      })
      .catch(() => {
        // A corrupt value in a debug playground is not worth crashing over: defaults stand.
      })
      .finally(() => {
        loaded.current = true;
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(placementIds)).catch(() => {});
  }, [placementIds]);

  const addPlacement = useCallback(() => {
    const placementId = draft.trim();
    setDraft("");

    if (!placementId) {
      return;
    }

    // Newest first, and never twice — the same two rules Android's addPlacementFromInput applies.
    setPlacementIds((current) =>
      current.includes(placementId) ? current : [placementId, ...current],
    );
  }, [draft]);

  const deletePlacement = useCallback((placementId: string) => {
    setPlacementIds((current) => current.filter((id) => id !== placementId));
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        addRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
        input: {
          flex: 1,
          height: 40,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: isDarkMode ? "#4A4A4A" : "#DDDDDD",
          borderRadius: 5,
          color: isDarkMode ? "white" : "black",
        },
        empty: { color: isDarkMode ? "#CCCCCC" : "#555555", marginBottom: 12 },
      }),
    [isDarkMode],
  );

  return (
    <View>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={addPlacement}
          placeholder="Placement id"
          placeholderTextColor={isDarkMode ? "#888888" : "#999999"}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
        <CustomButton text="Add Placement" onPress={addPlacement} buttonStyle={{ flex: 0 }} />
      </View>

      {placementIds.length === 0 ? (
        <Text style={styles.empty}>No placements. Add one above.</Text>
      ) : (
        placementIds.map((placementId) => (
          <PlacementCard
            key={placementId}
            placementId={placementId}
            onDelete={() => deletePlacement(placementId)}
          />
        ))
      )}
    </View>
  );
}

/**
 * Full-screen chrome for the playground, matching the App Cards section: a themed SafeAreaView
 * with a title and a Close control. SafeAreaProvider is re-established inside the Modal because
 * the safe-area context does not cross the Modal boundary on iOS.
 */
function AppFrames() {
  const isDarkMode = useColorScheme() === "dark";
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <CustomButton text="Show App Frames" onPress={() => setVisible(true)} />

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: isDarkMode ? "#000000" : "#FFFFFF" }}
            edges={["top", "bottom"]}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: isDarkMode ? "#333333" : "#F3F3F3",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                App Frames
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={{ fontSize: 20, color: isDarkMode ? "#FFFFFF" : "#000000" }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <AppFramesPlayground />
            </ScrollView>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </View>
  );
}

export default AppFrames;
