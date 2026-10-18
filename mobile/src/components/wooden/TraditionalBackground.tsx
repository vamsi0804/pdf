// mobile/src/components/wooden/TraditionalBackground.tsx
import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TraditionalBackgroundProps {
  children: React.ReactNode;
}

export const TraditionalBackground: React.FC<TraditionalBackgroundProps> = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../../assets/traditional_bg.jpg')}
      style={styles.background}
      resizeMode="cover"
      fadeDuration={0}
    >
      {/* Devotional traditional gradient overlay for button contrast */}
      <LinearGradient
        colors={[
          'rgba(26, 13, 5, 0.35)',
          'rgba(243, 217, 160, 0.05)',
          'rgba(26, 13, 5, 0.65)',
        ]}
        locations={[0, 0.4, 1]}
        style={styles.overlay}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1E0D2C',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
