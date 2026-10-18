// mobile/src/components/pdf/PDFReaderScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Subtopic } from '../../types';
import { mobileApi, getSubtopicScriptureContent } from '../../services/api';
import { THEME } from '../../constants/theme';
import { PDFViewer } from './PDFViewer';

interface PDFReaderScreenProps {
  subtopic: Subtopic;
  onBack: () => void;
}

export const PDFReaderScreen: React.FC<PDFReaderScreenProps> = ({ subtopic, onBack }) => {
  // Directly open PDF view by default when clicking on subtopic
  const [viewMode, setViewMode] = useState<'pdf' | 'scripture'>('pdf');
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  const scripture = getSubtopicScriptureContent(subtopic.title, subtopic.description);

  // Document ID resolution
  const docId = subtopic.document_id || (subtopic.has_document ? subtopic.id : 1);
  const streamUrl = docId ? mobileApi.getDocumentStreamUrl(docId) : null;
  const viewUrl = docId ? mobileApi.getDocumentViewUrl(docId) : null;
  const hasDocument = Boolean(subtopic.has_document === 1 || subtopic.document_id || streamUrl);

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomScale(1.0);
  };

  const handleDownload = () => {
    if (streamUrl) {
      Linking.openURL(`${streamUrl}?download=1`).catch(err => {
        console.warn('Could not open download link', err);
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header Area with Generous Safe Margins */}
      <View style={styles.topContainer}>
        <LinearGradient
          colors={['#4E270A', '#2B150A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerBar}
        >
          {/* Back Button */}
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.headerButtonPressed]}
            hitSlop={8}
          >
            <Text style={styles.backButtonArrow}>←</Text>
            <Text style={styles.backButtonText}>వెనుకకు</Text>
          </Pressable>

          {/* Document Title & Chapter */}
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {subtopic.title}
            </Text>
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {subtopic.chapter_title || 'వేద సాంప్రదాయిక గ్రంథం'}
            </Text>
          </View>

          {/* Action Controls: Mode Switcher & Download */}
          <View style={styles.controlsRow}>
            {/* View Mode Toggle: Direct PDF vs Text Commentary */}
            <Pressable
              onPress={() => setViewMode(prev => (prev === 'pdf' ? 'scripture' : 'pdf'))}
              style={({ pressed }) => [
                styles.modeToggleButton,
                viewMode === 'pdf' ? styles.modeToggleActive : styles.modeToggleInactive,
                pressed && styles.headerButtonPressed,
              ]}
              hitSlop={6}
            >
              <Text style={styles.modeToggleText}>
                {viewMode === 'pdf' ? '📜 వివరణ' : '📄 PDF'}
              </Text>
            </Pressable>

            {/* Direct PDF Download / Open Button */}
            {streamUrl && (
              <Pressable
                onPress={handleDownload}
                style={({ pressed }) => [
                  styles.downloadButton,
                  pressed && styles.headerButtonPressed,
                ]}
                hitSlop={6}
                title="Download PDF"
              >
                <Text style={styles.downloadText}>↓</Text>
              </Pressable>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Main Document Reading Area */}
      <View style={styles.documentViewport}>
        {!hasDocument ? (
          /* Empty State when subtopic has no document */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>📜</Text>
            </View>
            <Text style={styles.emptyTitle}>ఈ విషయానికి దస్త్రం (PDF) ఇంకా జోడించబడలేదు</Text>
            <Text style={styles.emptySubtitle}>
              నిర్వాహక వేదిక (Admin Console) నుండి ఈ ఉప-విషయానికి PDF ను సులభంగా అప్‌లోడ్ చేయవచ్చు.
            </Text>
            <Pressable onPress={onBack} style={styles.emptyBackButton}>
              <Text style={styles.emptyBackButtonText}>విషయాల జాబితాకు తిరిగి వెళ్లండి</Text>
            </Pressable>
          </View>
        ) : viewMode === 'pdf' && (streamUrl || viewUrl) ? (
          /* DIRECT PDF VIEWER: Opens immediately when subtopic is tapped */
          <View style={styles.directPdfContainer}>
            <PDFViewer
              streamUrl={streamUrl || ''}
              viewUrl={viewUrl || undefined}
              title={subtopic.title}
            />
          </View>
        ) : (
          /* SCRIPTURE TEXT COMMENTARY VIEW */
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            maximumZoomScale={3.0}
            minimumZoomScale={0.7}
            showsVerticalScrollIndicator={true}
          >
            <View
              style={[
                styles.documentPage,
                { transform: [{ scale: zoomScale }] },
              ]}
            >
              {/* Traditional Ornamental Page Header */}
              <View style={styles.pageHeader}>
                <Text style={styles.samhitaTag}>
                  {scripture.sectionTag}
                </Text>
                <Text style={styles.pageDocTitle}>
                  {subtopic.document_title || `${subtopic.title} - మంత్రార్పణ`}
                </Text>
                <View style={styles.fileSizeRow}>
                  <Text style={styles.fileSizeBadge}>
                    దస్త్ర పరిమాణం: {Math.round((subtopic.document_file_size || 148500) / 1024)} KB
                  </Text>
                </View>
                <View style={styles.ornamentalDivider} />
              </View>

              {/* Sacred Mantra Box */}
              <View style={styles.mantraBox}>
                <Text style={styles.mantraOm}>॥ శ్రీ గురుభ్యో నమః హరిః ఓమ్ ॥</Text>
                <Text style={styles.mantraBody}>
                  {scripture.mantraText}
                </Text>
              </View>

              {/* Meaning & Commentary */}
              <View style={styles.commentarySection}>
                <Text style={styles.sectionHeading}>ప్రతిపదార్థం & భావ తాత్పర్యం</Text>
                <Text style={styles.commentaryText}>
                  {scripture.tatparyam}
                </Text>

                <Text style={styles.sectionHeading}>ఆచరణాత్మక వినియోగం & వైశిష్ట్యం</Text>
                <Text style={styles.commentaryText}>
                  {scripture.application}
                </Text>
              </View>

              {/* Switch to Direct PDF button */}
              {streamUrl && (
                <Pressable
                  onPress={() => setViewMode('pdf')}
                  style={styles.openOriginalButton}
                >
                  <Text style={styles.openOriginalText}>
                    📄 నేరుగా PDF దస్త్రాన్ని వీక్షించండి (Direct PDF Reader)
                  </Text>
                </Pressable>
              )}

              {/* Page Footer */}
              <View style={styles.pageFooter}>
                <Text style={styles.pageNumberText}>పుట 1 / 1</Text>
                <Text style={styles.pageCreditText}>
                  సాంప్రదాయిక జ్ఞాన గ్రంథాలయం • V B S Sarma Kompella
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Bottom Bar with Enhanced Safe Margins & Quick Actions */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfoColumn}>
          <Text style={styles.bottomDocTitle} numberOfLines={1}>
            {subtopic.title}
          </Text>
          <Text style={styles.bottomModeStatus}>
            {viewMode === 'pdf' ? '📄 PDF ప్రత్యక్ష వీక్షణ' : '📜 పాఠ్య వివరణ వీక్షణ'}
          </Text>
        </View>

        <View style={styles.bottomActionsRow}>
          {viewMode === 'scripture' && (
            <View style={styles.zoomControls}>
              <Pressable onPress={handleZoomOut} style={styles.zoomButton}>
                <Text style={styles.zoomText}>−</Text>
              </Pressable>
              <Pressable onPress={handleResetZoom} style={styles.zoomResetButton}>
                <Text style={styles.zoomResetText}>{Math.round(zoomScale * 100)}%</Text>
              </Pressable>
              <Pressable onPress={handleZoomIn} style={styles.zoomButton}>
                <Text style={styles.zoomText}>+</Text>
              </Pressable>
            </View>
          )}

          {streamUrl && (
            <Pressable
              onPress={handleDownload}
              style={({ pressed }) => [
                styles.bottomDownloadAction,
                pressed && styles.headerButtonPressed,
              ]}
            >
              <Text style={styles.bottomDownloadText}>⬇ డౌన్‌లోడ్</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1C0D04',
  },
  topContainer: {
    paddingTop: Platform.OS === 'web' ? 14 : 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  headerBar: {
    minHeight: 56,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#6E3C14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: '#75451F',
  },
  headerButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  backButtonArrow: {
    color: '#FFE58F',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  backButtonText: {
    color: '#FFE58F',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF5D0',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
  headerSubtitle: {
    color: '#C89B3C',
    fontSize: 9,
    marginTop: 1,
    fontFamily: THEME.fonts.telugu,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeToggleButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  modeToggleActive: {
    backgroundColor: '#3D2010',
    borderColor: '#E7C65A',
  },
  modeToggleInactive: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderColor: '#75451F',
  },
  modeToggleText: {
    color: '#FFE58F',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#168FA8',
    borderWidth: 1,
    borderColor: '#0B4B5A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  documentViewport: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#4A2810',
    backgroundColor: '#140A04',
  },
  directPdfContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1C0D04',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  documentPage: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#FFFDF5',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#D9C4A1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  pageHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#75451F',
    paddingBottom: 12,
    marginBottom: 16,
  },
  samhitaTag: {
    color: '#A66A32',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: THEME.fonts.telugu,
  },
  pageDocTitle: {
    color: '#4E270A',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: THEME.fonts.telugu,
  },
  fileSizeRow: {
    marginTop: 4,
  },
  fileSizeBadge: {
    color: '#666666',
    fontSize: 10,
    fontFamily: THEME.fonts.telugu,
  },
  ornamentalDivider: {
    height: 1,
    backgroundColor: '#E8D9B5',
    marginTop: 10,
  },
  mantraBox: {
    backgroundColor: '#FAF3E0',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8D9B5',
    marginBottom: 16,
  },
  mantraOm: {
    color: '#75451F',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: THEME.fonts.telugu,
  },
  mantraBody: {
    color: '#422514',
    fontSize: 13,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: THEME.fonts.telugu,
  },
  commentarySection: {
    marginBottom: 16,
  },
  sectionHeading: {
    color: '#5A2F0F',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
    fontFamily: THEME.fonts.telugu,
  },
  commentaryText: {
    color: '#2B150A',
    fontSize: 11,
    lineHeight: 18,
    fontFamily: THEME.fonts.telugu,
  },
  openOriginalButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#75451F',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openOriginalText: {
    color: '#FFF5D0',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
  pageFooter: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8D9B5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageNumberText: {
    color: '#888888',
    fontSize: 10,
    fontFamily: THEME.fonts.telugu,
  },
  pageCreditText: {
    color: '#888888',
    fontSize: 9,
    fontFamily: THEME.fonts.telugu,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(117, 69, 31, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 28,
  },
  emptyTitle: {
    color: '#FFE58F',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: THEME.fonts.telugu,
  },
  emptySubtitle: {
    color: '#D2AC82',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    fontFamily: THEME.fonts.telugu,
  },
  emptyBackButton: {
    backgroundColor: '#75451F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyBackButtonText: {
    color: '#FFF5D0',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
  bottomBar: {
    marginTop: 8,
    marginBottom: Platform.OS === 'ios' ? 24 : 14,
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#2B150A',
    borderWidth: 1.5,
    borderColor: '#6E3C14',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  bottomInfoColumn: {
    flex: 1,
    paddingRight: 8,
  },
  bottomDocTitle: {
    color: '#FFE58F',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
  bottomModeStatus: {
    color: '#D2AC82',
    fontSize: 10,
    marginTop: 1,
    fontFamily: THEME.fonts.telugu,
  },
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  zoomButton: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#3D2010',
    borderWidth: 1,
    borderColor: '#75451F',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  zoomText: {
    color: '#FFE58F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  zoomResetButton: {
    paddingHorizontal: 5,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#3D2010',
    borderWidth: 1,
    borderColor: '#75451F',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  zoomResetText: {
    color: '#D2AC82',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomDownloadAction: {
    backgroundColor: '#168FA8',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0B4B5A',
  },
  bottomDownloadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.telugu,
  },
});
