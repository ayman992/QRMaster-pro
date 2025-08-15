import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Clock, Trash2, Share2, QrCode, Scan, ExternalLink } from "lucide-react-native";
import { useQR } from "@/providers/QRProvider";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";

export default function HistoryScreen() {
  const { history, clearHistory, removeFromHistory } = useQR();

  const handleClearAll = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearHistory();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          },
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    removeFromHistory(id);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleShare = (item: any) => {
    Alert.alert("Share", "Sharing functionality requires backend integration.");
  };

  const handleOpenLink = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open this link");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getDataTypeLabel = (dataType: string) => {
    return dataType.charAt(0).toUpperCase() + dataType.slice(1);
  };

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.emptyContainer}>
          <Clock size={80} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptyText}>
            Your scanned and generated QR codes will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            style={styles.clearButtonGradient}
          >
            <Trash2 size={18} color="#FFFFFF" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </LinearGradient>
        </TouchableOpacity>

        {history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTypeContainer}>
                {item.type === "scanned" ? (
                  <Scan size={20} color="#6366F1" />
                ) : (
                  <QrCode size={20} color="#10B981" />
                )}
                <Text style={styles.itemType}>
                  {item.type === "scanned" ? "Scanned" : "Generated"}
                </Text>
              </View>
              <Text style={styles.itemDate}>{formatDate(item.timestamp)}</Text>
            </View>

            <View style={styles.itemContent}>
              {item.type === "generated" && (
                <View style={styles.qrPreview}>
                  <QRCodeDisplay
                    value={item.data}
                    size={100}
                    color={item.color || "#000000"}
                    backgroundColor={item.bgColor || "#FFFFFF"}
                  />
                </View>
              )}
              
              <View style={styles.itemDetails}>
                <Text style={styles.dataTypeLabel}>
                  {getDataTypeLabel(item.dataType)}
                </Text>
                <Text style={styles.dataText} numberOfLines={2}>
                  {item.data}
                </Text>
                
                <View style={styles.itemActions}>
                  {item.data.startsWith("http") && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleOpenLink(item.data)}
                    >
                      <ExternalLink size={16} color="#3B82F6" />
                      <Text style={styles.actionButtonText}>Open</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleShare(item)}
                  >
                    <Share2 size={16} color="#3B82F6" />
                    <Text style={styles.actionButtonText}>Share</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  clearButton: {
    alignSelf: "flex-end",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  clearButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 5,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  historyItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  itemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  itemDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  itemContent: {
    flexDirection: "row",
    gap: 15,
  },
  qrPreview: {
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
  },
  dataTypeLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  dataText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
    lineHeight: 20,
  },
  itemActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    gap: 5,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
  },
  deleteButtonText: {
    color: "#EF4444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});