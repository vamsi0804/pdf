// mobile/src/components/wooden/WoodenSubtopicButton.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, RadialGradient, Defs, Stop, Path } from 'react-native-svg';
import { THEME } from '../../constants/theme';

interface WoodenSubtopicButtonProps {
  title: string;
  description?: string;
  hasDocument?: boolean;
  onPress: () => void;
}

export const WoodenSubtopicButton: React.FC<WoodenSubtopicButtonProps> = ({
  title,
  description,
  hasDocument = true,
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
      ]}
    >
      {/* Decorative Turquoise / Cyan Circular Rivet on Left */}
      <View style={styles.rivetContainer}>
        <Svg width="14" height="14" viewBox="0 0 14 14">
          <Defs>
            <RadialGradient id="rivetGrad" cx="35%" cy="35%" r="65%">
              <Stop offset="0%" stopColor="#7DE5F7" />
              <Stop offset="55%" stopColor="#168FA8" />
              <Stop offset="100%" stopColor="#084350" />
            </RadialGradient>
          </Defs>
          <Circle
            cx="7"
            cy="7"
            r="6"
            fill="url(#rivetGrad)"
            stroke="#062830"
            strokeWidth="1"
          />
        </Svg>
      </View>

      {/* Main Wide Wooden Plank with Rounded Right Edge */}
      <LinearGradient
        colors={['#7E491F', '#562E12', '#3C1E0A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.plank}
      >
        {/* Top subtle highlight line */}
        <View style={styles.topBevel} />

        {/* Content Row: Title + Description on left, PDF Icon on right */}
        <View style={styles.contentRow}>
          <View style={styles.textContainer}>
            {/* Telugu Subtopic Title */}
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.titleText}
            >
              {title}
            </Text>

            {/* Subtopic Description (matching Admin preview) */}
            {description ? (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.descText}
              >
                {description}
              </Text>
            ) : null}
          </View>

          {/* Golden PDF Indicator Icon on right */}
          {hasDocument && (
            <View style={styles.pdfIconContainer}>
              <Svg width="13" height="15" viewBox="0 0 14 16">
                <Path
                  d="M2 1h7l4 4v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"
                  fill="none"
                  stroke="#E7C65A"
                  strokeWidth="1.2"
                />
                <Path d="M9 1v4h4" fill="none" stroke="#E7C65A" strokeWidth="1.2" />
                <Path d="M4 8h6M4 11h4" stroke="#E7C65A" strokeWidth="1" strokeLinecap="round" />
              </Svg>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3.5,
    position: 'relative',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  rivetContainer: {
    position: 'absolute',
    left: -7,
    zIndex: 20,
    shadowColor: '#168FA8',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  plank: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 6,
    paddingLeft: 14,
    paddingRight: 10,
    borderWidth: 2,
    borderColor: '#241105',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.65,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  topBevel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 235, 175, 0.3)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 6,
  },
  titleText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: '#D8E8A0', // Authentic pale sage green from reference
    fontFamily: THEME.fonts.telugu,
    lineHeight: 19,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descText: {
    fontSize: 9.5,
    color: '#E8D9B5',
    fontFamily: THEME.fonts.telugu,
    opacity: 0.85,
    marginTop: 1,
    lineHeight: 13,
  },
  pdfIconContainer: {
    paddingLeft: 4,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
