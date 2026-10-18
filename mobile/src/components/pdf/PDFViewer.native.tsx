// mobile/src/components/pdf/PDFViewer.native.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

interface PDFViewerProps {
  streamUrl: string;
  viewUrl?: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ streamUrl, viewUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Safety timer to ensure loader never hangs indefinitely
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const targetUrl = viewUrl || streamUrl;

  const handleOpenExternal = () => {
    Linking.openURL(streamUrl).catch(() => {});
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#E7C65A" />
          <Text style={styles.loadingText}>దస్త్రం తెరవబడుతోంది... (Loading PDF)</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>దస్త్రాన్ని తెరవడంలో ఆలస్యం జరుగుతోంది</Text>
          <Pressable onPress={handleOpenExternal} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>⬇️ PDF ను డౌన్‌లోడ్ చేసి చూడండి</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ uri: targetUrl }}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          scalesPageToFit={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1C0D04',
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1A0D05',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1C0D04',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#FFE58F',
    marginTop: 12,
    fontSize: 13,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    color: '#FFA39E',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4E270A',
    borderWidth: 1,
    borderColor: '#75451F',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFE58F',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
