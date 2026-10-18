// mobile/src/components/pdf/PDFViewer.web.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface PDFViewerProps {
  streamUrl: string;
  viewUrl?: string;
  title: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ streamUrl, viewUrl, title }) => {
  const [loading, setLoading] = useState(true);

  // Safety timer to prevent permanent loader lock
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const targetUrl = viewUrl || streamUrl;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#E7C65A" />
          <Text style={styles.loadingText}>దస్త్రం తెరవబడుతోంది... (Loading PDF)</Text>
        </View>
      )}
      <iframe
        src={targetUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#1A0D05',
        }}
        title={title}
        onLoad={() => setLoading(false)}
      />
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
});
