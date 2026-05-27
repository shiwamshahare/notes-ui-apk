# 📓 Notes App — React Native + Expo

A clean, professional Notes application built with **React Native** and **Expo**, featuring two fully functional UI screens, dark/light theme support, responsive layouts, and vector icons throughout.

---

## 🔗 Links

| | |
|---|---|
| **GitHub Repository** | https://github.com/shiwamshahare/notes-ui-apk |
| **Demo Video** | https://drive.google.com/file/d/1at9Oq_hV2CEcMT7KWEJUiPdDH_WrGS86/view?usp=drivesdk |

---

## 📱 Screens

### View 1 — Notes Listing Screen
- Scrollable list of notes using `FlatList`
- Each card shows: **title**, **content preview**, **timestamp**, and **category icon**
- Real-time **search/filter** by title and content
- **Dark / Light mode** toggle switch in the header
- `ImageBackground` in the header section
- Color-coded categories: Work, Personal, Travel
- Floating Action Button (FAB) to create a new note
- Responsive **2-column grid on tablets** via `useWindowDimensions()`

### View 2 — Note Editor Screen
- `TextInput` for note **title**
- Multiline `TextInput` for note **body/content**
- `KeyboardAvoidingView` — keyboard never overlaps input fields
- `ImageBackground` in the header
- **Back** button (Pressable) — returns to listing
- **Save** button (Pressable) — saves or updates the note
- Live **character count** display
- Date display in the header

---

## ⚛️ React Native Core Components Used

| Component | Usage |
|---|---|
| `FlatList` | Renders scrollable note list (supports 1 or 2 columns) |
| `ImageBackground` | Decorative header on **both** screens |
| `KeyboardAvoidingView` | Prevents keyboard from overlapping inputs in View 2 |
| `Pressable` | Note cards, FAB, Back button, Save button, search clear |
| `ScrollView` | Scrollable body of the Note Editor |
| `Switch` | Dark / Light mode manual toggle |
| `TextInput` | Search bar, note title input, multiline content input |
| `Text` | All text labels, titles, snippets, dates |
| `View` | All layout containers |
| `SafeAreaView` | Root container for safe area insets on both screens |
| `StyleSheet` | All styles via `create()`, `compose()`, `flatten()` |

---

## 🪝 Hooks Used

| Hook | Purpose |
|---|---|
| `useColorScheme()` | Detects system dark/light theme automatically |
| `useWindowDimensions()` | Responsive layout — phone vs tablet (`width > 600`) |
| `useState` | Notes list, search query, current view, editing note, theme override |
| `useCallback` | Memoizes `renderNoteCard` to prevent unnecessary FlatList re-renders |

### StyleSheet APIs — all three demonstrated

```ts
// StyleSheet.create() — all styles in named stylesheets
const listStyles = StyleSheet.create({ ... });
const editorStyles = StyleSheet.create({ ... });

// StyleSheet.compose() — merges base style with tablet override
const headerRowStyle = StyleSheet.compose(
  listStyles.headerRow,
  isTablet && listStyles.headerRowTablet
) as ViewStyle;

// StyleSheet.flatten() — merges dynamic theme colors into base style
const noteCardBase = StyleSheet.flatten([
  listStyles.noteCard,
  { backgroundColor: theme.card, borderColor: theme.border },
]) as ViewStyle;
```

---



## ✨ Additional Improvements & UI Enhancements

### 1. 🔍 Functional Real-Time Search Filter
The search `TextInput` filters notes instantly by **title and content** as the user types. Includes a one-tap clear button using `Ionicons: close-circle`.

### 2. 🏷️ Color-Coded Note Categories
Each note has a `category` (`work`, `personal`, `travel`). Cards display a unique **Ionicons** icon, tinted badge background, and colored left **accent strip**.

### 3. 📱 Responsive Tablet Layout
Uses `useWindowDimensions()` to switch the `FlatList` to a **2-column grid** on screens wider than 600px. Padding and spacing also adapt per screen size.

### 4. 🕐 Dynamic Time-Aware Greeting
The header greeting automatically shows **"Good Morning"**, **"Good Afternoon"**, or **"Good Evening"** based on the current device time.

### 5. ✏️ Create & Edit Notes
Tapping a note card opens it in the editor pre-filled with its content. Saving updates the existing note with a fresh timestamp. Tapping the FAB opens a blank editor for a new note.

### 6. 🌗 Refined Dark / Light Themes
Both themes use **20+ semantic color tokens** — background, surface, card, border, text hierarchy, category-specific accent colors, glow, and shadow — for a polished, consistent look in both modes.

### 7. 👆 Pressable Press Animations
All `Pressable` elements (cards, FAB, Back, Save) have press feedback via **scale transform** and **opacity change** for a responsive, tactile feel.

### 8. 📝 Structured Editor Field Labels
The Note Editor uses uppercase section labels (`TITLE`, `CONTENT`) with icons for a clean, form-like layout. A **live character count** updates next to the content label.

### 9. 🫙 Polished Empty State
When no notes match the search, a polished empty state renders with a large icon in a soft circular background, a title, and a contextual subtitle message.

---

## 🗂️ Project Structure

```
notes/
├── src/
│   └── app/
│       ├── _layout.tsx        # Expo Router root layout
│       └── index.tsx          # Main file — both screens + all styles
├── assets/
│   └── images/
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🚀 Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/shiwamshahare/notes-ui-apk.git

# 2. Navigate into the project folder
cd notes-ui-apk

# 3. Install dependencies
npm install

# 4. Start the Expo dev server
npx expo start
```

Then in the terminal:
- Press **`a`** — open on Android emulator
- Press **`i`** — open on iOS simulator
- **Scan the QR code** with the [Expo Go](https://expo.dev/go) app on your phone

---
