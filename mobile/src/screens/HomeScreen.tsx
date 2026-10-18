// mobile/src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
  Platform,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Chapter, Subtopic, AppSettings } from '../types';
import { mobileApi } from '../services/api';
import { WoodenCategoryButton } from '../components/wooden/WoodenCategoryButton';
import { ChevronIndicator } from '../components/wooden/ChevronIndicator';
import { WoodenChapterPlank } from '../components/wooden/WoodenChapterPlank';
import { WoodenSubtopicButton } from '../components/wooden/WoodenSubtopicButton';
import { WoodenAuxButton } from '../components/wooden/WoodenAuxButton';
import { TraditionalBackground } from '../components/wooden/TraditionalBackground';
import { THEME } from '../constants/theme';

interface HomeScreenProps {
  onOpenPdf: (subtopic: Subtopic) => void;
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
  selectedChapterId: number | null;
  onSelectChapter: (id: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenPdf,
  selectedCategoryId,
  onSelectCategory,
  selectedChapterId,
  onSelectChapter,
}) => {
  const { width } = useWindowDimensions();
  // Pre-initialize state from in-memory cache for instant Frame-0 render (0ms delay)
  const [categories, setCategories] = useState<Category[]>(() => mobileApi.getCachedCategories());
  const [chapters, setChapters] = useState<Chapter[]>(() => mobileApi.getCachedChapters(selectedCategoryId || 1));
  const [subtopics, setSubtopics] = useState<Subtopic[]>(() => mobileApi.getCachedSubtopics(selectedChapterId || 1));
  const [settings, setSettings] = useState<AppSettings>({
    app_title: 'సాంప్రదాయిక జ్ఞాన తరంగిణి',
    footer_credit: 'V B S Sarma Kompella',
  });
  const [loadingCats, setLoadingCats] = useState<boolean>(false);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Primary data fetcher function with parallel fetching for ultra-fast sync
  const fetchAllData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const activeCatId = selectedCategoryId || 1;
      const activeChapId = selectedChapterId || 1;

      // Parallel fetch cuts round-trip time by 70%
      const [cats, chaps, subs, setts] = await Promise.all([
        mobileApi.getCategories(),
        mobileApi.getChapters(activeCatId),
        mobileApi.getSubtopics(activeChapId),
        mobileApi.getSettings(),
      ]);

      if (cats && cats.length > 0) {
        setCategories(cats);
        const validCatId = selectedCategoryId && cats.some(c => c.id === selectedCategoryId)
          ? selectedCategoryId
          : cats[0].id;

        if (validCatId !== selectedCategoryId) {
          onSelectCategory(validCatId);
        }
      }

      if (chaps && chaps.length > 0) {
        setChapters(chaps);
        const validChapId = selectedChapterId && chaps.some(c => c.id === selectedChapterId)
          ? selectedChapterId
          : chaps[0].id;

        if (validChapId !== selectedChapterId) {
          onSelectChapter(validChapId);
        }
      }

      if (subs && subs.length > 0) {
        setSubtopics(subs);
      }

      if (setts) {
        setSettings(setts);
      }
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.log('[HomeScreen] Live sync error:', err);
    } finally {
      setLoadingCats(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, [selectedCategoryId, selectedChapterId, onSelectCategory, onSelectChapter]);

  // Initial silent background load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Periodic Auto-Sync with Admin Dashboard (Every 8 seconds)
  useEffect(() => {
    const syncTimer = setInterval(() => {
      if (!refreshing && !loadingSubs) {
        // Silently sync latest categories, chapters, subtopics, and settings
        mobileApi.getCategories().then(liveCats => {
          if (liveCats && liveCats.length > 0) {
            setCategories(liveCats);
          }
        }).catch(() => {});

        if (selectedCategoryId) {
          mobileApi.getChapters(selectedCategoryId).then(liveChaps => {
            if (liveChaps && liveChaps.length > 0) {
              setChapters(liveChaps);
            }
          }).catch(() => {});
        }

        if (selectedChapterId) {
          mobileApi.getSubtopics(selectedChapterId).then(liveSubs => {
            if (liveSubs && liveSubs.length > 0) {
              setSubtopics(liveSubs);
            }
          }).catch(() => {});
        }
      }
    }, 8000);

    return () => clearInterval(syncTimer);
  }, [selectedCategoryId, selectedChapterId, refreshing, loadingSubs]);

  // When category changes, instantly show cached chapters then revalidate
  useEffect(() => {
    if (!selectedCategoryId) return;
    const cachedChaps = mobileApi.getCachedChapters(selectedCategoryId);
    if (cachedChaps && cachedChaps.length > 0) {
      setChapters(cachedChaps);
      const stillValid = cachedChaps.find(c => c.id === selectedChapterId);
      if (!stillValid) {
        onSelectChapter(cachedChaps[0].id);
      }
    }
    mobileApi.getChapters(selectedCategoryId).then(chaps => {
      if (chaps && chaps.length > 0) {
        setChapters(chaps);
        const stillValid = chaps.find(c => c.id === selectedChapterId);
        if (!stillValid) {
          onSelectChapter(chaps[0].id);
        }
      } else {
        setSubtopics([]);
      }
    }).catch(() => {});
  }, [selectedCategoryId]);

  // When chapter changes, instantly show cached subtopics then revalidate
  useEffect(() => {
    if (!selectedChapterId) {
      setSubtopics([]);
      return;
    }
    const cachedSubs = mobileApi.getCachedSubtopics(selectedChapterId);
    if (cachedSubs && cachedSubs.length > 0) {
      setSubtopics(cachedSubs);
    } else {
      setLoadingSubs(true);
    }
    mobileApi
      .getSubtopics(selectedChapterId)
      .then(subs => {
        if (subs && subs.length > 0) {
          setSubtopics(subs);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSubs(false));
  }, [selectedChapterId]);

  // Responsive column widths: ~31% for left, ~69% for right
  const leftColWidth = Math.max(Math.round(width * 0.31), 95);

  const handleAuxPress = (title: string, desc: string) => {
    Alert.alert(title, desc);
  };

  return (
    <TraditionalBackground>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* LEVEL 1: Header Area with Three Wooden Category Signboards & Live Sync */}
        <View style={styles.headerContainer}>
          {/* Subtle Live Sync Row */}
          <View style={styles.syncHeaderRow}>
            <Text style={styles.syncStatusText}>
              సాంప్రదాయిక విజ్ఞాన దర్శిని
            </Text>
            <Pressable
              onPress={() => fetchAllData(true)}
              style={({ pressed }) => [
                styles.syncButton,
                pressed && styles.syncButtonPressed,
              ]}
              hitSlop={8}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#FFE58F" />
              ) : (
                <Text style={styles.syncButtonText}>🔄 తాజాకరించు (Sync)</Text>
              )}
            </Pressable>
          </View>

          {/* Three Wooden Signboard Categories */}
          <View style={styles.categoriesRow}>
            {categories.slice(0, 3).map(cat => (
              <WoodenCategoryButton
                key={cat.id}
                title={cat.title}
                isSelected={cat.id === selectedCategoryId}
                onPress={() => onSelectCategory(cat.id)}
              />
            ))}
          </View>
        </View>

        {/* MAIN CONTENT AREA: Two-Column Layout with Enhanced Margins */}
        <View style={styles.mainContent}>
          {/* LEFT COLUMN: Numbered Wooden Chapter Planks (~31% Width) */}
          <View style={[styles.leftColumn, { width: leftColWidth }]}>
            {/* Traditional Chevron Motif */}
            <ChevronIndicator />

            {/* Scrollable Chapter Planks with Pull-to-Refresh */}
            <ScrollView
              style={styles.chapterScrollView}
              contentContainerStyle={styles.chapterScrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchAllData(true)}
                  tintColor="#FFE58F"
                  colors={['#FFE58F', '#168FA8']}
                />
              }
            >
              {chapters.map(chap => (
                <WoodenChapterPlank
                  key={chap.id}
                  title={chap.title}
                  chapterNumber={chap.chapter_number}
                  isSelected={chap.id === selectedChapterId}
                  onPress={() => onSelectChapter(chap.id)}
                />
              ))}

              {chapters.length === 0 && !loadingCats && (
                <View style={styles.emptyNotice}>
                  <Text style={styles.emptyNoticeText}>అధ్యాయాలు లేవు</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* RIGHT COLUMN: Wooden Subtopic Buttons (~69% Width) */}
          <View style={styles.rightColumn}>
            {/* Dark Wooden Vertical Spine on the Left Edge */}
            <View style={styles.verticalSpine} />

            {/* Scrollable Subtopic Buttons with Pull-to-Refresh */}
            <ScrollView
              style={styles.subtopicScrollView}
              contentContainerStyle={styles.subtopicScrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchAllData(true)}
                  tintColor="#FFE58F"
                  colors={['#FFE58F', '#168FA8']}
                />
              }
            >
              {loadingSubs ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#E7C65A" />
                  <Text style={styles.loadingText}>విషయాలు లోడ్ అవుతున్నాయి...</Text>
                </View>
              ) : (
                subtopics.map(sub => (
                  <WoodenSubtopicButton
                    key={sub.id}
                    title={sub.title}
                    description={sub.description}
                    hasDocument={sub.has_document === 1 || Boolean(sub.document_id)}
                    onPress={() => onOpenPdf(sub)}
                  />
                ))
              )}

              {subtopics.length === 0 && !loadingSubs && (
                <View style={styles.emptySubtopicNotice}>
                  <Text style={styles.emptySubtopicTitle}>ఈ అధ్యాయంలో విషయాలు లేవు</Text>
                  <Text style={styles.emptySubtopicDesc}>
                    నిర్వాహక వేదిక (Admin Panel) లో వివరాలు చేర్చిన వెంటనే ఇక్కడ కనిపిస్తాయి.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* BOTTOM AREA: Traditional Auxiliary Signboard Buttons with Enhanced Margins */}
        <View style={styles.bottomContainer}>
          <View style={styles.auxButtonsRow}>
            <WoodenAuxButton
              title="ప్రాతిశాఖ్య"
              onPress={() =>
                handleAuxPress(
                  'ప్రాతిశాఖ్య',
                  'వైదిక స్వర శాస్త్రం, ఛందస్సు మరియు వర్ణోచ్ఛారణ నియమ గ్రంథం.'
                )
              }
            />
            <WoodenAuxButton
              title="ప్రశ్నల వివరములు"
              onPress={() =>
                handleAuxPress(
                  'ప్రశ్నల వివరములు',
                  'వేద మంత్ర పాఠ్య విభాగములు, కాండలు, మరియు ప్రపాఠకముల సమాచారం.'
                )
              }
            />
            <WoodenAuxButton
              title="అనధ్యాయములు"
              onPress={() =>
                handleAuxPress(
                  'అనధ్యాయములు',
                  'వేద అధ్యయనం నిషిద్ధమైన అమావాస్య, పౌర్ణమి, అష్టమి తదితర పర్వదినాలు.'
                )
              }
            />
          </View>

          {/* Author / Tradition Credit */}
          <View style={styles.authorBar}>
            <Text style={styles.authorText}>
              {settings.footer_credit || 'V B S Sarma Kompella'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TraditionalBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 14 : 4,
    paddingBottom: Platform.OS === 'web' ? 12 : 2,
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'web' ? 16 : 10, // Increased top margin
    paddingBottom: 10,
    zIndex: 10,
  },
  syncHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  syncStatusText: {
    fontSize: 10.5,
    color: '#FFE58F',
    fontWeight: '700',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 7,
    backgroundColor: 'rgba(54, 25, 9, 0.75)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7E451C',
  },
  syncButtonPressed: {
    opacity: 0.7,
    backgroundColor: '#5C3212',
  },
  syncButtonText: {
    fontSize: 9.5,
    color: '#FFE58F',
    fontWeight: '600',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginVertical: 6, // Increased vertical breathing room
    overflow: 'hidden',
  },
  leftColumn: {
    paddingRight: 4,
    borderRightWidth: 1,
    borderRightColor: 'rgba(74, 38, 14, 0.4)',
  },
  chapterScrollView: {
    flex: 1,
  },
  chapterScrollContent: {
    paddingBottom: 12,
  },
  rightColumn: {
    flex: 1,
    paddingLeft: 6,
    position: 'relative',
  },
  verticalSpine: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 3.5,
    backgroundColor: '#381C08',
    borderColor: '#1C0D04',
    borderWidth: 0.5,
    borderRadius: 1.5,
    zIndex: 1,
  },
  subtopicScrollView: {
    flex: 1,
  },
  subtopicScrollContent: {
    paddingLeft: 10,
    paddingRight: 4,
    paddingBottom: 14,
    paddingTop: 2,
  },
  emptyNotice: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyNoticeText: {
    color: '#FFE58F',
    fontSize: 10,
    fontFamily: THEME.fonts.telugu,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#D8E8A0',
    fontSize: 11,
    marginTop: 8,
    fontFamily: THEME.fonts.telugu,
  },
  emptySubtopicNotice: {
    backgroundColor: 'rgba(43, 21, 10, 0.65)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#52290D',
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  emptySubtopicTitle: {
    color: '#FFE58F',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: THEME.fonts.telugu,
  },
  emptySubtopicDesc: {
    color: '#D2AC82',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: THEME.fonts.telugu,
  },
  bottomContainer: {
    paddingHorizontal: 12,
    paddingTop: 12, // Increased top margin of bottom bar
    paddingBottom: Platform.OS === 'ios' ? 24 : 16, // Increased bottom margin away from home indicator / bezel
    marginBottom: Platform.OS === 'web' ? 6 : 2,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(74, 38, 14, 0.55)',
  },
  auxButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8, // Increased space between buttons and author text
  },
  authorBar: {
    paddingLeft: 4,
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center',
  },
  authorText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2B150A',
    letterSpacing: 0.5,
  },
});
