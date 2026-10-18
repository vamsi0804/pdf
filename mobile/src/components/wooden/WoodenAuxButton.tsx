// mobile/src/components/wooden/WoodenAuxButton.tsx
import React, { useState } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../../constants/theme';

interface WoodenAuxButtonProps {
  title: string;
  onPress: () => void;
}

export const WoodenAuxButton: React.FC<WoodenAuxButtonProps> = ({ title, onPress }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={({ pressed: isPressing }) => [
        styles.container,
        (isPressing || pressed) && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={['#6E3C16', '#4A250B', '#331705']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.pill}
      >
        <Text numberOfLines={1} style={styles.text}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 2,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#241005',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E8D2A0',
    fontFamily: THEME.fonts.telugu,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
