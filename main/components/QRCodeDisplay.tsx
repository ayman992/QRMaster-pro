import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface QRCodeDisplayProps {
  value: string;
  size: number;
  color: string;
  backgroundColor: string;
}

export default function QRCodeDisplay({ value, size, color, backgroundColor }: QRCodeDisplayProps) {
  // This is a placeholder QR code visualization
  // In a real app, you would use a QR code generation library
  const cellSize = size / 25;
  
  // Generate a simple pattern based on the value (not a real QR code)
  const generatePattern = () => {
    const pattern = [];
    const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Create corner patterns (QR code markers)
        if (
          (i < 7 && j < 7) || // Top-left
          (i < 7 && j >= 18) || // Top-right
          (i >= 18 && j < 7) // Bottom-left
        ) {
          // Draw corner patterns
          if (
            (i === 0 || i === 6 || j === 0 || j === 6) ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            pattern.push({ x: j * cellSize, y: i * cellSize, filled: true });
          }
        } else {
          // Generate pseudo-random pattern for data area
          const shouldFill = ((hash + i * 25 + j) * 9973) % 3 !== 0;
          if (shouldFill) {
            pattern.push({ x: j * cellSize, y: i * cellSize, filled: true });
          }
        }
      }
    }
    return pattern;
  };

  const pattern = generatePattern();

  return (
    <View style={[styles.container, { width: size, height: size, backgroundColor }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {pattern.map((cell, index) => (
          <Rect
            key={index}
            x={cell.x}
            y={cell.y}
            width={cellSize}
            height={cellSize}
            fill={color}
          />
        ))}
      </Svg>
      <Text style={styles.placeholder}>QR Code</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    position: "absolute",
    fontSize: 10,
    color: "#999",
    opacity: 0.3,
  },
});