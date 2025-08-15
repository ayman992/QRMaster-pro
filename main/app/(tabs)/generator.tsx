import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  Type,
  Link,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Save,
  Share2,
  Palette,
} from "lucide-react-native";
import { useQR } from "@/providers/QRProvider";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import ColorPicker from "@/components/ColorPicker";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type DataType = "text" | "url" | "phone" | "email" | "address" | "facebook" | "instagram" | "tiktok" | "twitter" | "snapchat";

interface DataTypeOption {
  type: DataType;
  label: string;
  icon: any;
  placeholder: string;
  prefix?: string;
}

const dataTypes: DataTypeOption[] = [
  { type: "text", label: "Text", icon: Type, placeholder: "Enter any text" },
  { type: "url", label: "URL", icon: Link, placeholder: "https://example.com" },
  { type: "phone", label: "Phone", icon: Phone, placeholder: "+1234567890" },
  { type: "email", label: "Email", icon: Mail, placeholder: "email@example.com" },
  { type: "address", label: "Address", icon: MapPin, placeholder: "123 Main St, City" },
  { type: "facebook", label: "Facebook", icon: Facebook, placeholder: "username", prefix: "https://facebook.com/" },
  { type: "instagram", label: "Instagram", icon: Instagram, placeholder: "username", prefix: "https://instagram.com/" },
  { type: "tiktok", label: "TikTok", icon: Type, placeholder: "username", prefix: "https://tiktok.com/@" },
  { type: "twitter", label: "Twitter", icon: Twitter, placeholder: "username", prefix: "https://twitter.com/" },
  { type: "snapchat", label: "Snapchat", icon: Type, placeholder: "username", prefix: "https://snapchat.com/add/" },
];

export default function GeneratorScreen() {
  const [selectedType, setSelectedType] = useState<DataType>("text");
  const [inputValue, setInputValue] = useState("");
  const [qrData, setQrData] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [qrSize, setQrSize] = useState<"small" | "medium" | "large">("medium");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<"qr" | "bg">("qr");
  const { addToHistory } = useQR();

  const selectedDataType = dataTypes.find(dt => dt.type === selectedType)!;

  useEffect(() => {
    generateQRData();
  }, [inputValue, selectedType]);

  const generateQRData = () => {
    if (!inputValue) {
      setQrData("");
      return;
    }

    let data = inputValue;
    const prefix = selectedDataType.prefix;
    
    if (prefix) {
      data = prefix + inputValue;
    } else if (selectedType === "phone") {
      data = `tel:${inputValue}`;
    } else if (selectedType === "email") {
      data = `mailto:${inputValue}`;
    }
    
    setQrData(data);
  };

  const handleGenerate = () => {
    if (!inputValue) {
      Alert.alert("Error", "Please enter some data to generate QR code");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    addToHistory({
      type: "generated",
      data: qrData,
      timestamp: Date.now(),
      dataType: selectedType,
      color: qrColor,
      bgColor,
      size: qrSize,
    });

    Alert.alert("Success", "QR Code generated successfully!");
  };

  const handleSave = async () => {
    if (!qrData) {
      Alert.alert("Error", "Please generate a QR code first");
      return;
    }

    Alert.alert("Save QR Code", "QR code saving functionality requires backend integration. The QR code has been added to your history.");
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleShare = async () => {
    if (!qrData) {
      Alert.alert("Error", "Please generate a QR code first");
      return;
    }

    Alert.alert("Share QR Code", "QR code sharing functionality requires backend integration. The QR code has been added to your history.");
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const getSizeValue = () => {
    switch (qrSize) {
      case "small": return 150;
      case "medium": return 200;
      case "large": return 250;
      default: return 200;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.typeSelector}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeSelectorContent}
            >
              {dataTypes.map((dataType) => {
                const Icon = dataType.icon;
                const isSelected = selectedType === dataType.type;
                return (
                  <TouchableOpacity
                    key={dataType.type}
                    style={[styles.typeButton, isSelected && styles.typeButtonSelected]}
                    onPress={() => {
                      setSelectedType(dataType.type);
                      setInputValue("");
                      if (Platform.OS !== "web") {
                        Haptics.selectionAsync();
                      }
                    }}
                    testID={`type-${dataType.type}`}
                  >
                    <Icon size={20} color={isSelected ? "#FFFFFF" : "#6B7280"} />
                    <Text style={[styles.typeButtonText, isSelected && styles.typeButtonTextSelected]}>
                      {dataType.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter {selectedDataType.label}</Text>
            {selectedDataType.prefix && (
              <Text style={styles.prefixText}>{selectedDataType.prefix}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={selectedDataType.placeholder}
              placeholderTextColor="#9CA3AF"
              value={inputValue}
              onChangeText={setInputValue}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={
                selectedType === "phone" ? "phone-pad" :
                selectedType === "email" ? "email-address" :
                selectedType === "url" ? "url" : "default"
              }
              testID="qr-input"
            />
          </View>

          <View style={styles.customizationContainer}>
            <Text style={styles.sectionTitle}>Customization</Text>
            
            <View style={styles.colorRow}>
              <TouchableOpacity
                style={styles.colorButton}
                onPress={() => {
                  setColorPickerTarget("qr");
                  setShowColorPicker(true);
                }}
                testID="qr-color-picker"
              >
                <View style={[styles.colorPreview, { backgroundColor: qrColor }]} />
                <Text style={styles.colorButtonText}>QR Color</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.colorButton}
                onPress={() => {
                  setColorPickerTarget("bg");
                  setShowColorPicker(true);
                }}
                testID="bg-color-picker"
              >
                <View style={[styles.colorPreview, { backgroundColor: bgColor, borderWidth: 1, borderColor: "#E5E7EB" }]} />
                <Text style={styles.colorButtonText}>Background</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sizeRow}>
              {(["small", "medium", "large"] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeButton, qrSize === size && styles.sizeButtonSelected]}
                  onPress={() => {
                    setQrSize(size);
                    if (Platform.OS !== "web") {
                      Haptics.selectionAsync();
                    }
                  }}
                  testID={`size-${size}`}
                >
                  <Text style={[styles.sizeButtonText, qrSize === size && styles.sizeButtonTextSelected]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {qrData ? (
            <View style={styles.previewContainer}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={styles.qrWrapper}>
                <QRCodeDisplay
                  value={qrData}
                  size={getSizeValue()}
                  color={qrColor}
                  backgroundColor={bgColor}
                />
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.actionButtonGradient}
                  >
                    <Save size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                  <LinearGradient
                    colors={["#3B82F6", "#2563EB"]}
                    style={styles.actionButtonGradient}
                  >
                    <Share2 size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Share</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : inputValue ? (
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
              <LinearGradient
                colors={["#6366F1", "#8B5CF6"]}
                style={styles.generateButtonGradient}
              >
                <Text style={styles.generateButtonText}>Generate QR Code</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {showColorPicker && (
        <ColorPicker
          currentColor={colorPickerTarget === "qr" ? qrColor : bgColor}
          onColorSelect={(color) => {
            if (colorPickerTarget === "qr") {
              setQrColor(color);
            } else {
              setBgColor(color);
            }
            setShowColorPicker(false);
          }}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  typeSelector: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  typeSelectorContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 10,
    gap: 5,
  },
  typeButtonSelected: {
    backgroundColor: "#6366F1",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  typeButtonTextSelected: {
    color: "#FFFFFF",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  prefixText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  customizationContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 15,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  colorButton: {
    alignItems: "center",
    gap: 8,
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  colorButtonText: {
    fontSize: 14,
    color: "#6B7280",
  },
  sizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  sizeButtonSelected: {
    backgroundColor: "#6366F1",
  },
  sizeButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  sizeButtonTextSelected: {
    color: "#FFFFFF",
  },
  previewContainer: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  qrWrapper: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  generateButton: {
    margin: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  generateButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});