// mobile/src/components/wooden/ChevronIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

export const ChevronIndicator: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width="42" height="38" viewBox="0 0 42 38">
        {/* Top Chevron */}
        <Polygon
          points="6,4 21,14 36,4 36,9 21,19 6,9"
          fill="#D4A745"
          stroke="#5A340F"
          strokeWidth="1"
        />
        {/* Middle Chevron */}
        <Polygon
          points="6,13 21,23 36,13 36,18 21,28 6,18"
          fill="#B07C2E"
          stroke="#42250B"
          strokeWidth="1"
        />
        {/* Bottom Chevron */}
        <Polygon
          points="6,22 21,32 36,22 36,27 21,37 6,27"
          fill="#8A581F"
          stroke="#2A1608"
          strokeWidth="1"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    opacity: 0.9,
  },
});
