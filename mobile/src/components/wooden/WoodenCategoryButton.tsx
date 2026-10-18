// mobile/src/components/wooden/WoodenCategoryButton.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

interface WoodenCategoryButtonProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const WoodenCategoryButton: React.FC<WoodenCategoryButtonProps> = ({
  title,
  isSelected,
  onPress,
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ pressed: isPressing }) => [
        styles.container,
        (isPressing || pressed) && styles.pressed,
        isSelected && styles.selectedContainer,
      ]}
    >
      {/* Decorative Wooden Support Stakes / Pegs at top and bottom */}
      <View style={[styles.peg, styles.pegTopLeft]} />
      <View style={[styles.peg, styles.pegTopRight]} />
      <View style={[styles.peg, styles.pegBottomLeft]} />
      <View style={[styles.peg, styles.pegBottomRight]} />

      {/* Main Wooden Signboard Body */}
      <LinearGradient
        colors={
          isSelected
            ? ['#9E5E26', '#75451F', '#4A260E']
            : ['#7A441B', '#5A3011', '#3B1E0A']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.signboard,
          isSelected ? styles.selectedSignboard : styles.unselectedSignboard,
        ]}
      >
        {/* Subtle Top Inset Highlight */}
        <View style={styles.topHighlight} />

        {/* Telugu Signboard Label */}
        <Text
          numberOfLines={1}
          style={[
            styles.titleText,
            isSelected ? styles.selectedTitleText : styles.unselectedTitleText,
          ]}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 2,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  selectedContainer: {
    shadowColor: '#FFE58F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  // Wooden support pegs protruding from corners
  peg: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#1E0E05',
    borderColor: '#0D0502',
    borderWidth: 1,
    borderRadius: 1,
    zIndex: 1,
  },
  pegTopLeft: {
    top: -3,
    left: 8,
  },
  pegTopRight: {
    top: -3,
    right: 8,
  },
  pegBottomLeft: {
    bottom: -3,
    left: 8,
  },
  pegBottomRight: {
    bottom: -3,
    right: 8,
  },
  signboard: {
    width: '100%',
    minHeight: 46,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedSignboard: {
    borderColor: '#FFE58F',
    borderWidth: 2,
  },
  unselectedSignboard: {
    borderColor: '#241005',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 235, 175, 0.4)',
  },
  titleText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: THEME.fonts.telugu,
  },
  selectedTitleText: {
    color: '#FFF8D6',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  unselectedTitleText: {
    color: '#FFE58F',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
