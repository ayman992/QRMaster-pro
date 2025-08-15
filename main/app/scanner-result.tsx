import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import { Copy, ExternalLink, Share2, CheckCircle } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScannerResultScreen() {
  const { data, type } = useLocalSearchParams<{ data: string; type: string }>();

  const isURL = data?.startsWith("http://") || data?.startsWith("https://");

  const handleCopy = async () => {
    if (data) {
      await Clipboard.setStringAsync(data);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Copied!", "Content copied to clipboard");
    }
  };

  const handleOpenLink = async () => {
    if (data && isURL) {
      const canOpen = await Linking.canOpenURL(data);
      if (canOpen) {
        await Linking.openURL(data);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    }
  };

  const handleShare = () => {
    Alert.alert("Share", "Sharing functionality requires backend integration.");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          style={styles.successHeader}
        >
          <CheckCircle size={60} color="#FFFFFF" />
          <Text style={styles.successTitle}>QR Code Scanned!</Text>
          <Text style={styles.successSubtitle}>Successfully decoded the QR code</Text>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <Text style={styles.label}>Content Type</Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{isURL ? "URL" : "Text"}</Text>
          </View>

          <Text style={styles.label}>Content</Text>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText} selectable>
              {data}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.actionButtonGradient}
              >
                <Copy size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Copy</Text>
              </LinearGradient>
            </TouchableOpacity>

            {isURL && (
              <TouchableOpacity style={styles.actionButton} onPress={handleOpenLink}>
                <LinearGradient
                  colors={["#3B82F6", "#2563EB"]}
                  style={styles.actionButtonGradient}
                >
                  <ExternalLink size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Open Link</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <LinearGradient
                colors={["#8B5CF6", "#7C3AED"]}
                style={styles.actionButtonGradient}
              >
                <Share2 size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Share</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => router.back()}
          >
            <Text style={styles.scanAgainText}>Scan Another Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
  },
  successHeader: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 15,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 5,
  },
  contentContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  typeTag: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  dataContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dataText: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  scanAgainButton: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6366F1",
    backgroundColor: "transparent",
  },
  scanAgainText: {
    color: "#6366F1",
    fontSize: 16,
    fontWeight: "600",
  },
});