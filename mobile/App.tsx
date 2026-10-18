// mobile/App.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { HomeScreen } from './src/screens/HomeScreen';
import { PDFReaderScreen } from './src/components/pdf/PDFReaderScreen';
import { Subtopic } from './src/types';

export default function App() {
  const [fontsLoaded] = useFonts({
    'NotoSansTelugu-Regular': require('./assets/fonts/NotoSansTelugu-Regular.ttf'),
  });

  // Preserve navigation state between reader and home screen - defaulted to category 1 and chapter 1 for instant frame-0 render
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(1);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(1);
  const [activePdfSubtopic, setActivePdfSubtopic] = useState<Subtopic | null>(null);

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="light" backgroundColor="#2B150A" />
      {activePdfSubtopic ? (
        <PDFReaderScreen
          subtopic={activePdfSubtopic}
          onBack={() => setActivePdfSubtopic(null)}
        />
      ) : (
        <HomeScreen
          onOpenPdf={sub => setActivePdfSubtopic(sub)}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={id => setSelectedCategoryId(id)}
          selectedChapterId={selectedChapterId}
          onSelectChapter={id => setSelectedChapterId(id)}
        />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C0D04',
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: '#2B150A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFE58F',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
});
