import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { X } from "lucide-react-native";

interface ColorPickerProps {
  currentColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
  "#FFC0CB", "#A52A2A", "#808080", "#000080", "#008000",
  "#6366F1", "#8B5CF6", "#EC4899", "#EF4444", "#F59E0B",
  "#10B981", "#3B82F6", "#6B7280", "#111827", "#F3F4F6",
];

export default function ColorPicker({ currentColor, onColorSelect, onClose }: ColorPickerProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Color</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.currentColorContainer}>
            <Text style={styles.label}>Current Color</Text>
            <View style={[styles.currentColor, { backgroundColor: currentColor }]} />
            <Text style={styles.colorCode}>{currentColor.toUpperCase()}</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.colorsGrid}
            showsVerticalScrollIndicator={false}
          >
            {PRESET_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  color === currentColor && styles.selectedColor,
                  color === "#FFFFFF" && styles.whiteColor,
                ]}
                onPress={() => onColorSelect(color)}
                testID={`color-${color}`}
              />
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  currentColorContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  currentColor: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  colorCode: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 15,
    justifyContent: "center",
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#6366F1",
  },
  whiteColor: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});