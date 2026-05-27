import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const themes = {
  dark: {
    bg: "#0D0D12",
    surface: "#14141B",
    card: "#1B1B25",
    cardPressed: "#222230",
    border: "#262635",
    borderLight: "#1F1F2E",
    text: "#EEEDF6",
    textSecondary: "#918FA6",
    textMuted: "#56546A",
    accent: "#7C6FFF",
    accentSoft: "#A89EFF",
    accentBg: "#1C1836",
    accentGlow: "rgba(124,111,255,0.12)",
    categoryWork: "#3B82F6",
    categoryWorkBg: "rgba(59,130,246,0.12)",
    categoryPersonal: "#A78BFA",
    categoryPersonalBg: "rgba(167,139,250,0.12)",
    categoryTravel: "#F59E0B",
    categoryTravelBg: "rgba(245,158,11,0.12)",
    categoryDefault: "#6EE7B7",
    categoryDefaultBg: "rgba(110,231,183,0.12)",
    searchBg: "#1B1B25",
    headerOverlay: "rgba(13,13,18,0.80)",
    fabShadow: "rgba(124,111,255,0.45)",
    inputBorder: "#262635",
    switchTrackOff: "rgba(255,255,255,0.12)",
    switchTrackOn: "#332E5C",
    iconDefault: "#918FA6",
  },
  light: {
    bg: "#F8F7F4",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    cardPressed: "#F5F3FF",
    border: "#E9E7E2",
    borderLight: "#F0EEEA",
    text: "#1C1B24",
    textSecondary: "#65637A",
    textMuted: "#A09EB5",
    accent: "#5046E5",
    accentSoft: "#7C6FFF",
    accentBg: "#EDEBFF",
    accentGlow: "rgba(80,70,229,0.08)",
    categoryWork: "#3B82F6",
    categoryWorkBg: "rgba(59,130,246,0.08)",
    categoryPersonal: "#7C3AED",
    categoryPersonalBg: "rgba(124,58,237,0.08)",
    categoryTravel: "#D97706",
    categoryTravelBg: "rgba(217,119,6,0.08)",
    categoryDefault: "#059669",
    categoryDefaultBg: "rgba(5,150,105,0.08)",
    searchBg: "#F2F1ED",
    headerOverlay: "rgba(28,18,55,0.55)",
    fabShadow: "rgba(80,70,229,0.35)",
    inputBorder: "#E9E7E2",
    switchTrackOff: "rgba(0,0,0,0.12)",
    switchTrackOn: "#D8D4FF",
    iconDefault: "#65637A",
  },
};

type Theme = typeof themes.dark;

interface Note {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  category: string;
}

const NOTES_DATA: Note[] = [
  {
    id: 1,
    title: "React Native Interview Prep",
    content:
      "Covered React Native interview topics, including state management with Redux & Context API, navigation patterns using React Navigation, and performance optimization techniques like memo and useMemo.",
    timestamp: "2025-05-27 09:30:00",
    category: "work",
  },
  {
    id: 2,
    title: "Morning Journaling — Day 47",
    content:
      "Gratitude: woke up early, got the run done. Intention for today: stay present, avoid checking phone before 9am. Reflection on yesterday's wins.",
    timestamp: "2025-05-26 07:15:00",
    category: "personal",
  },
  {
    id: 3,
    title: "Trip to Ladakh — Packing List",
    content:
      "Thermal base layer ✓, Fleece jacket ✓, Altitude sickness tablets, Offline maps downloaded, Permit documents printed, Power bank charged.",
    timestamp: "2025-05-25 18:00:00",
    category: "travel",
  },
  {
    id: 4,
    title: "React Native Component Patterns",
    content:
      "StyleSheet.compose() for merging base + variant styles. useColorScheme() hook for adaptive theming. FlatList keyExtractor must return a stable string identifier.",
    timestamp: "2025-05-24 14:20:00",
    category: "work",
  },
  {
    id: 5,
    title: "Book Notes: Atomic Habits",
    content:
      "Identity-based habits > outcome-based habits. 1% better every day = 37x improvement in one year. The habit loop: Cue → Craving → Response → Reward.",
    timestamp: "2025-05-23 20:45:00",
    category: "personal",
  },
  {
    id: 6,
    title: "Fitness Plan — Week 12",
    content:
      "Monday: Upper body push. Wednesday: Lower body. Friday: Pull day. Weekend: Active recovery with yoga or swimming. Track progress in the app.",
    timestamp: "2025-05-22 08:00:00",
    category: "personal",
  },
  {
    id: 7,
    title: "API Design Checklist",
    content:
      "RESTful naming conventions, proper HTTP status codes, pagination with cursor-based approach, rate limiting headers, versioning strategy via URL prefix.",
    timestamp: "2025-05-21 11:30:00",
    category: "work",
  },
];


const HEADER_BG = {
  uri: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
};


function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)
    return date.toLocaleDateString("en-US", { weekday: "long" });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCategoryIcon(
  category: string,
  theme: Theme
): {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  bg: string;
} {
  switch (category) {
    case "work":
      return {
        name: "briefcase-outline",
        color: theme.categoryWork,
        bg: theme.categoryWorkBg,
      };
    case "personal":
      return {
        name: "heart-outline",
        color: theme.categoryPersonal,
        bg: theme.categoryPersonalBg,
      };
    case "travel":
      return {
        name: "airplane-outline",
        color: theme.categoryTravel,
        bg: theme.categoryTravelBg,
      };
    default:
      return {
        name: "document-text-outline",
        color: theme.categoryDefault,
        bg: theme.categoryDefaultBg,
      };
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}


interface NotesListingScreenProps {
  notes: Note[];
  theme: Theme;
  isDark: boolean;
  isTablet: boolean;
  onToggleTheme: (value: boolean) => void;
  onCreateNote: () => void;
  onSelectNote: (note: Note) => void;
}

function NotesListingScreen({
  notes,
  theme,
  isDark,
  isTablet,
  onToggleTheme,
  onCreateNote,
  onSelectNote,
}: NotesListingScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });


  const headerRowStyle = StyleSheet.compose(
    listStyles.headerRow,
    isTablet && listStyles.headerRowTablet
  ) as ViewStyle;

  const searchWrapperStyle = StyleSheet.compose(
    listStyles.searchWrapper,
    isTablet && listStyles.searchWrapperTablet
  ) as ViewStyle;

  const sectionHeaderStyle = StyleSheet.compose(
    listStyles.sectionHeader,
    isTablet && listStyles.sectionHeaderTablet
  ) as ViewStyle;

  const listContentStyle = StyleSheet.compose(
    listStyles.listContent,
    isTablet && listStyles.listContentTablet
  ) as ViewStyle;

  const noteCardBase = StyleSheet.flatten([
    listStyles.noteCard,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
    },
  ]) as ViewStyle;

  const containerStyle = StyleSheet.flatten([
    listStyles.container,
    { backgroundColor: theme.bg },
  ]) as ViewStyle;
  const renderNoteCard = useCallback(
    ({ item }: { item: Note }) => {
      const cardFinal = StyleSheet.compose(
        noteCardBase,
        isTablet && { flex: 1 }
      ) as ViewStyle;

      const catIcon = getCategoryIcon(item.category, theme);

      return (
        <Pressable
          style={({ pressed }) =>
            [
              cardFinal,
              pressed && {
                backgroundColor: theme.cardPressed,
                transform: [{ scale: 0.985 }],
              },
            ] as ViewStyle[]
          }
          onPress={() => onSelectNote(item)}
        >
          <View
            style={[
              listStyles.cardAccentStrip,
              { backgroundColor: catIcon.color },
            ]}
          />

          <View style={listStyles.cardBody}>
            <View style={listStyles.cardTopRow}>
              <View style={listStyles.cardTitleRow}>
                <View
                  style={[
                    listStyles.categoryBadge,
                    { backgroundColor: catIcon.bg },
                  ]}
                >
                  <Ionicons
                    name={catIcon.name}
                    size={16}
                    color={catIcon.color}
                  />
                </View>
                <Text
                  style={[listStyles.noteTitle, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </View>
              <View style={listStyles.dateRow}>
                <Feather
                  name="clock"
                  size={11}
                  color={theme.textMuted}
                  style={listStyles.dateIcon}
                />
                <Text
                  style={[listStyles.noteDate, { color: theme.textMuted }]}
                >
                  {formatDate(item.timestamp)}
                </Text>
              </View>
            </View>

            <Text
              style={[listStyles.noteSnippet, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {item.content}
            </Text>

            <View style={listStyles.cardFooter}>
              <Feather
                name="chevron-right"
                size={14}
                color={theme.textMuted}
              />
            </View>
          </View>
        </Pressable>
      );
    },
    [noteCardBase, isTablet, theme, onSelectNote]
  );

  return (
    <SafeAreaView style={containerStyle}>
      <ImageBackground
        source={HEADER_BG}
        style={listStyles.headerBg}
        imageStyle={listStyles.headerBgImage}
        resizeMode="cover"
      >
        <View
          style={[
            listStyles.headerOverlay,
            { backgroundColor: theme.headerOverlay },
          ]}
        >
          <View style={headerRowStyle}>
            <View style={listStyles.titleArea}>
              <View style={listStyles.greetingRow}>
                <Feather
                  name="sun"
                  size={13}
                  color="rgba(255,255,255,0.6)"
                  style={listStyles.greetingIcon}
                />
                <Text style={listStyles.greeting}>{getGreeting()}</Text>
              </View>
              <View style={listStyles.appNameRow}>
                <MaterialCommunityIcons
                  name="notebook-outline"
                  size={28}
                  color="#FFFFFF"
                  style={listStyles.appIcon}
                />
                <Text style={listStyles.appNameMy}>My</Text>
                <Text
                  style={[
                    listStyles.appNameNotes,
                    { color: theme.accentSoft },
                  ]}
                >
                  Notes
                </Text>
              </View>
            </View>

            <View style={listStyles.themeTogglePill}>
              <Ionicons
                name={isDark ? "moon" : "sunny"}
                size={16}
                color={isDark ? "#BFB8FF" : "#FFD93D"}
              />
              <Switch
                value={isDark}
                onValueChange={onToggleTheme}
                trackColor={{
                  false: theme.switchTrackOff,
                  true: theme.switchTrackOn,
                }}
                thumbColor={isDark ? theme.accent : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
      </ImageBackground>

      <View style={searchWrapperStyle}>
        <View
          style={[
            listStyles.searchBar,
            {
              backgroundColor: theme.searchBg,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.textMuted}
          />
          <TextInput
            style={[listStyles.searchInput, { color: theme.text }]}
            placeholder="Search your notes..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.textMuted}
              />
            </Pressable>
          )}
        </View>
      </View>

      
      <View style={sectionHeaderStyle}>
        <View style={listStyles.sectionTitleRow}>
          <Ionicons
            name={searchQuery ? "search" : "documents-outline"}
            size={18}
            color={theme.accent}
            style={listStyles.sectionIcon}
          />
          <Text style={[listStyles.sectionTitle, { color: theme.text }]}>
            {searchQuery ? "Search Results" : "All Notes"}
          </Text>
        </View>
        <View
          style={[listStyles.countBadge, { backgroundColor: theme.accentBg }]}
        >
          <Text style={[listStyles.countText, { color: theme.accent }]}>
            {filteredNotes.length}
          </Text>
        </View>
      </View>

      
      {filteredNotes.length === 0 ? (
        <View style={listStyles.emptyState}>
          <View
            style={[
              listStyles.emptyIconCircle,
              { backgroundColor: theme.accentGlow },
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={40}
              color={theme.accent}
            />
          </View>
          <Text style={[listStyles.emptyTitle, { color: theme.text }]}>
            No notes found
          </Text>
          <Text
            style={[listStyles.emptySubtitle, { color: theme.textSecondary }]}
          >
            {searchQuery
              ? "Try a different search term"
              : "Tap the button below to create your first note"}
          </Text>
        </View>
      ) : (
        <FlatList
          key={isTablet ? "tablet-grid" : "phone-list"}
          data={filteredNotes}
          numColumns={isTablet ? 2 : 1}
          contentContainerStyle={listContentStyle}
          columnWrapperStyle={isTablet ? { gap: 14 } : undefined}
          showsVerticalScrollIndicator={false}
          renderItem={renderNoteCard}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      
      <Pressable
        style={({ pressed }) =>
          [
            listStyles.fab,
            {
              backgroundColor: theme.accent,
              shadowColor: theme.fabShadow,
            },
            pressed && {
              transform: [{ scale: 0.92 }],
              opacity: 0.9,
            },
          ] as ViewStyle[]
        }
        onPress={onCreateNote}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}





interface NoteEditorScreenProps {
  theme: Theme;
  isDark: boolean;
  isTablet: boolean;
  editingNote: Note | null;
  onSave: (title: string, content: string) => void;
  onBack: () => void;
}

function NoteEditorScreen({
  theme,
  isDark,
  isTablet,
  editingNote,
  onSave,
  onBack,
}: NoteEditorScreenProps) {
  const [title, setTitle] = useState(editingNote?.title ?? "");
  const [content, setContent] = useState(editingNote?.content ?? "");

  const handleSave = () => {
    onSave(title, content);
  };

  
  const editorBodyStyle = StyleSheet.compose(
    editorStyles.editorBody,
    isTablet && editorStyles.editorBodyTablet
  ) as ViewStyle;

  
  const overlayStyle = StyleSheet.flatten([
    editorStyles.editorHeaderOverlay,
    {
      backgroundColor: isDark
        ? "rgba(13,13,18,0.84)"
        : "rgba(28,18,55,0.58)",
    },
  ]) as ViewStyle;

  const containerStyle = StyleSheet.flatten([
    editorStyles.container,
    { backgroundColor: theme.bg },
  ]) as ViewStyle;

  
  const hasContent = title.trim().length > 0 || content.trim().length > 0;

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        style={editorStyles.kavWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        
        <ImageBackground
          source={HEADER_BG}
          style={editorStyles.editorHeaderBg}
          imageStyle={editorStyles.editorHeaderBgImage}
          resizeMode="cover"
        >
          <View style={overlayStyle}>
            <View
              style={[
                editorStyles.editorHeaderRow,
                isTablet && editorStyles.editorHeaderRowTablet,
              ]}
            >
              
              <Pressable
                onPress={onBack}
                style={({ pressed }) => [
                  editorStyles.backBtn,
                  pressed && { opacity: 0.6 },
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={theme.accentSoft}
                />
                <Text
                  style={[
                    editorStyles.backLabel,
                    { color: theme.accentSoft },
                  ]}
                >
                  Back
                </Text>
              </Pressable>

              
              <View style={editorStyles.editorTitleRow}>
                <Feather
                  name={editingNote ? "edit-3" : "file-plus"}
                  size={17}
                  color="#FFFFFF"
                  style={editorStyles.editorTitleIcon}
                />
                <Text style={editorStyles.editorScreenTitle}>
                  {editingNote ? "Edit Note" : "New Note"}
                </Text>
              </View>

              
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                  editorStyles.saveBtn,
                  {
                    backgroundColor: hasContent
                      ? theme.accent
                      : theme.textMuted,
                  },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="check" size={16} color="#FFFFFF" />
                <Text style={editorStyles.saveBtnText}>Save</Text>
              </Pressable>
            </View>

            
            <View
              style={[
                editorStyles.editorMeta,
                isTablet && editorStyles.editorMetaTablet,
              ]}
            >
              <View style={editorStyles.metaRow}>
                <Feather
                  name="calendar"
                  size={13}
                  color="rgba(255,255,255,0.55)"
                  style={editorStyles.metaIcon}
                />
                <Text style={editorStyles.editorMetaText}>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        
        <ScrollView
          style={editorBodyStyle}
          contentContainerStyle={editorStyles.editorScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          <View style={editorStyles.inputGroup}>
            <View style={editorStyles.inputLabelRow}>
              <MaterialCommunityIcons
                name="format-title"
                size={16}
                color={theme.textMuted}
              />
              <Text
                style={[editorStyles.inputLabel, { color: theme.textMuted }]}
              >
                TITLE
              </Text>
            </View>
            <TextInput
              style={[
                editorStyles.titleInput,
                {
                  color: theme.text,
                  borderBottomColor: theme.inputBorder,
                },
              ]}
              placeholder="Give your note a title..."
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus={!editingNote}
              returnKeyType="next"
              maxLength={120}
            />
          </View>

          
          <View style={editorStyles.inputGroup}>
            <View style={editorStyles.inputLabelRow}>
              <Feather
                name="align-left"
                size={14}
                color={theme.textMuted}
              />
              <Text
                style={[editorStyles.inputLabel, { color: theme.textMuted }]}
              >
                CONTENT
              </Text>
              <View style={editorStyles.charCountWrap}>
                <Text
                  style={[editorStyles.charHint, { color: theme.textMuted }]}
                >
                  {content.length} chars
                </Text>
              </View>
            </View>
            <TextInput
              style={[editorStyles.contentInput, { color: theme.text }]}
              placeholder="Start writing something amazing..."
              placeholderTextColor={theme.textMuted}
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}





export default function Index() {
  const systemTheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 600;

  const [manualDark, setManualDark] = useState<boolean | null>(null);
  const isDark = manualDark !== null ? manualDark : systemTheme === "dark";
  const theme = isDark ? themes.dark : themes.light;

  const [notes, setNotes] = useState<Note[]>(NOTES_DATA);
  const [currentView, setCurrentView] = useState<"listing" | "editor">(
    "listing"
  );
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleCreateNote = () => {
    setEditingNote(null);
    setCurrentView("editor");
  };

  const handleSelectNote = (note: Note) => {
    setEditingNote(note);
    setCurrentView("editor");
  };

  const handleBack = () => {
    setEditingNote(null);
    setCurrentView("listing");
  };

  const handleSave = (title: string, content: string) => {
    if (title.trim() === "" && content.trim() === "") {
      handleBack();
      return;
    }

    if (editingNote) {
      
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                title: title || "Untitled Note",
                content: content || "No content",
                timestamp: new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19),
              }
            : n
        )
      );
    } else {
      
      const newNote: Note = {
        id: Date.now(),
        title: title || "Untitled Note",
        content: content || "No content",
        timestamp: new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
        category: "personal",
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    handleBack();
  };

  
  if (currentView === "listing") {
    return (
      <NotesListingScreen
        notes={notes}
        theme={theme}
        isDark={isDark}
        isTablet={isTablet}
        onToggleTheme={setManualDark}
        onCreateNote={handleCreateNote}
        onSelectNote={handleSelectNote}
      />
    );
  }

  
  return (
    <NoteEditorScreen
      theme={theme}
      isDark={isDark}
      isTablet={isTablet}
      editingNote={editingNote}
      onSave={handleSave}
      onBack={handleBack}
    />
  );
}





const listStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  
  headerBg: {
    width: "100%",
  },
  headerBgImage: {
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  headerOverlay: {
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingTop: 14,
    paddingBottom: 22,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
  },
  headerRowTablet: {
    paddingHorizontal: 44,
  },

  
  titleArea: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  greetingIcon: {
    marginRight: 5,
  },
  greeting: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  appNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  appIcon: {
    marginRight: 2,
  },
  appNameMy: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  appNameNotes: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  
  themeTogglePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.28)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  
  searchWrapper: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 4,
  },
  searchWrapperTablet: {
    paddingHorizontal: 44,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 30,
    borderWidth: 2,
    borderColor:"#747474ff",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionHeaderTablet: {
    paddingHorizontal: 44,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 100,
  },
  listContentTablet: {
    paddingHorizontal: 44,
  },

  noteCard: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardAccentStrip: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  categoryBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    letterSpacing: -0.2,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  dateIcon: {
    marginRight: 4,
  },
  noteDate: {
    fontSize: 11,
    fontWeight: "500",
  },
  noteSnippet: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
    marginLeft: 44,
  },
  cardFooter: {
    alignItems: "flex-end",
    marginTop: 6,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 21,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
});


const editorStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kavWrapper: {
    flex: 1,
  },

  editorHeaderBg: {
    width: "100%",
  },
  editorHeaderBgImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  editorHeaderOverlay: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 18,
  },
  editorHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  editorHeaderRowTablet: {
    paddingHorizontal: 60,
  },

  
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 70,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  
  editorTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  editorTitleIcon: {
    marginRight: 6,
  },
  editorScreenTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 70,
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  
  editorMeta: {
    paddingHorizontal: 22,
  },
  editorMetaTablet: {
    paddingHorizontal: 64,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    marginRight: 6,
  },
  editorMetaText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 0.2,
  },

  
  editorBody: {
    flex: 1,
    paddingHorizontal: 22,
  },
  editorBodyTablet: {
    paddingHorizontal: 100,
  },
  editorScrollContent: {
    paddingTop: 24,
    paddingBottom: 80,
  },

  
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    flex: 1,
  },
  charCountWrap: {
    marginLeft: "auto",
  },

  
  titleInput: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },

  
  charHint: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  
  contentInput: {
    fontSize: 16,
    lineHeight: 27,
    fontWeight: "400",
    minHeight: 300,
    letterSpacing: 0.1,
  },
});
