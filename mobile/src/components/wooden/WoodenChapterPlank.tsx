// mobile/src/components/wooden/WoodenChapterPlank.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

interface WoodenChapterPlankProps {
  title: string;
  chapterNumber: number;
  isSelected: boolean;
  onPress: () => void;
}

export const WoodenChapterPlank: React.FC<WoodenChapterPlankProps> = ({
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
      <LinearGradient
        colors={
          isSelected
            ? ['#7E451C', '#5C3212', '#452309']
            : ['#4A250B', '#3B1D08', '#2D1505']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.plank,
          isSelected ? styles.selectedPlank : styles.unselectedPlank,
        ]}
      >
        {/* Subtle wood plank top & bottom bevels */}
        <View style={styles.topBevel} />
        <View style={styles.bottomBevel} />

        {/* Telugu Chapter Title */}
        <Text
          numberOfLines={2}
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
    width: '100%',
    marginVertical: 2,
    borderRadius: 2,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  selectedContainer: {
    shadowColor: '#FFE58F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  plank: {
    width: '100%',
    minHeight: 46,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedPlank: {
    borderColor: '#FFE58F',
    borderWidth: 1.5,
  },
  unselectedPlank: {
    borderColor: '#1F0D03',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 230, 160, 0.25)',
  },
  bottomBevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  titleText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: THEME.fonts.telugu,
  },
  selectedTitleText: {
    color: '#FFF8D6',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  unselectedTitleText: {
    color: '#E8D2A0',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
