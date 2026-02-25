# Islamic Habit Tracker - Development Plan

## Project Overview
An Islamic habit tracking mobile app that works offline and syncs with Firebase when online. Built with React Native/Expo.

---

## Current Development Plan (Task by Task)

### Phase 1: Foundation & Setup
- [ ] 1. Configure app.json with proper icons and splash screen
- [ ] 2. Set up project folder structure (screens, components, services, hooks, types, utils)
- [ ] 3. Configure Firebase project (Firebase config file ready at lib/firebase.ts)
- [ ] 4. Create TypeScript types/interfaces for Habit, User, Completion records

### Phase 2: Authentication (Login Page)
- [ ] 5. Design and implement Login screen with email/password
- [ ] 6. Implement Firebase authentication (sign in, sign up, sign out)
- [ ] 7. Add user session persistence (AsyncStorage for offline)
- [ ] 8. Create auth context/hooks for managing user state

### Phase 3: Core Habit Tracking (Daily Tracker)
- [ ] 9. Create Daily Tracker screen with date selector
- [ ] 10. Implement habit list display with checkboxes
- [ ] 11. Add habit completion toggle functionality
- [ ] 12. Store completions locally (AsyncStorage) for offline access
- [ ] 13. Sync completions with Firebase when online

### Phase 4: Goal Management
- [ ] 14. Create "Add New Habit" form (name, category, frequency)
- [ ] 15. Implement edit habit functionality
- [ ] 16. Add delete habit with confirmation
- [ ] 17. Pre-defined Islamic habit categories (Salah, Quran, Fasting, etc.)

### Phase 5: Analytics & Stats
- [ ] 18. Create Analytics screen with stats cards
- [ ] 19. Calculate streak (consecutive days)
- [ ] 20. Show total completions per habit
- [ ] 21. Display weekly/monthly progress visualization

### Phase 6: Profile Management
- [ ] 22. Create Profile screen with user info
- [ ] 23. Implement admin panel (for admin users)
- [ ] 24. Add account deletion (danger zone)
- [ ] 25. Settings (notifications, theme preferences)

### Phase 7: Offline Sync System
- [ ] 26. Implement offline detection (NetInfo)
- [ ] 27. Create local-first data layer
- [ ] 28. Implement sync queue for pending changes
- [ ] 29. Handle sync conflicts (last-write-wins)
- [ ] 30. Show sync status indicator in UI

---

## User Task Flow

You will provide tasks one by one in this format:

1. **Task 1**: "Build the login screen with email/password"
2. **Task 2**: "Add Firebase authentication"
3. **Task 3**: "Create the daily tracker with date picker"
...and so on

I'll implement each task and wait for your confirmation before proceeding to the next.

---

## Future Features (Phase 2+)

### Islamic-Specific Features
- [ ] **Prayer Times Integration** - Show prayer times based on location
- [ ] **Quran Reading Tracker** - Track pages/verses read daily
- [ ] **Ramadan Mode** - Special tracking for Ramadan habits
- [ ] **Duas & Remembrances** - Morning/evening adhkar tracking
- [ ] **Zakat Calculator** - Helper for calculating Zakat
- [ ] **Islamic Calendar** - Show hijri dates alongside gregorian

### Advanced Features
- [ ] **Notifications/Reminders** - Habit reminders at set times
- [ ] **Widgets** - Home screen widgets for quick tracking
- [ ] **Dark Mode** - Full dark theme support
- [ ] **Data Export** - Export habits data as PDF/CSV
- [ ] **Achievements/Badges** - Gamification elements
- [ ] **Multi-language** - Support Arabic, Urdu, English
- [ ] **Family Sharing** - Track family members' habits

### Technical Enhancements
- [ ] **Redux Integration** - Your Redux setup for state management
- [ ] **Push Notifications** - Firebase Cloud Messaging
- [ ] **Apple Watch / Wear OS** - Companion app
- [ ] **Backup/Restore** - Manual backup to cloud storage

---

## Architecture Notes

### Offline-First Approach
```
app will work normal without internet and without login too 
(But the data will stored only in that device ) (when signup that data should save to db of that signup account)(in this situation when user logged in we'll think later what'll do with that data that is stored in local) 
User Action → Local Storage (AsyncStorage) → UI Update
                ↓
         Check Internet
                ↓
      Online? → Sync to Firebase
      Offline? → Queue for later
```

### Guest User Data Migration Strategy
**Option A (Recommended for MVP):** Clear local data after login and fetch fresh from Firebase
- Simpler to implement
- Less potential for data conflicts
- User starts fresh after signup

**Option B (Future):** Merge local guest data with user's Firebase data
- Preserve guest habits when user logs in
- More complex conflict resolution needed
- Better user experience

### Storage Architecture
```
┌─────────────────────────────────────────┐
│          REDUX PERSIST                   │
│  - User token                           │
│  - User details (name, email, isAdmin)  │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         ASYNCSTORAGE                     │
│  - Habits data                          │
│  - Completions data                      │
│  - Sync queue (pending changes)         │
└────────────────┬────────────────────────┘
                 │ (when online)
                 ▼
┌─────────────────────────────────────────┐
│            FIREBASE                      │
│  - Cloud backup                         │
│  - Cross-device sync                    │
└─────────────────────────────────────────┘
```

### Data Structure (for Firebase + Local)
```typescript
interface Habit {
  id: string;
  userId: string;
  name: string;
  category: 'prayer' | 'quran' | 'fasting' | 'charity' | 'other';
  createdAt: Date;
  isActive: boolean;
}

interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  syncedAt?: Date;
}
```

---

## App Color Theme (from HTML reference)
- Primary: #667eea (Purple-Blue gradient)
- Secondary: #764ba2
- Success: #28a745 (Completed habits)
- Background: #f8f9fa
- Text: #333333

---

## New Feature: Quran & Hadith Integration

### Feature Overview
Add daily Quran verses and Hadith to inspire users and provide Islamic content directly in the app.

---

### APIs to Use

#### Quran APIs
1. **Al-Quran Cloud API** (alquran.cloud) - Free, no API key required
   - Get random ayah: `https://api.alquran.cloud/v1/ayah/random`
   - Get specific ayah: `https://api.alquran.cloud/v1/ayah/2:255`
   - With translation: `https://api.alquran.cloud/v1/ayah/random/en.asad`
   - Docs: https://alquran.cloud/api

2. **Quran API** (quran.api-docs.io) - More features
   - Base URL: `https://api.quran.com/api/v4`
   - For surah list, verses, tafsir

#### Hadith APIs
1. **Hadith API** (hadith.sutanlab.id) - Free, simple
   - Get hadith books: `https://api.hadith.sutanlab.id/books/muslim`
   - Docs: https://docs.hadith.sultanlab.id

2. **Sunnah.com API** - Requires API key (free signup)
   - Collections: Bukhari, Muslim, Tirmidhi, etc.

---

### Implementation Steps

#### Step 1: Create API Service
- [ ] Create `services/quranService.ts` for fetching Quran verses
- [ ] Create `services/hadithService.ts` for fetching Hadith
- [ ] Add error handling and caching

#### Step 2: Create Redux Slice
- [ ] Create `redux/slice/inspirationSlice.js`
- [ ] Store current verse and hadith
- [ ] Add actions: setDailyVerse, setDailyHadith, refreshContent

#### Step 3: Create UI Components
- [ ] Create `components/DailyVerseCard.tsx` - Display Quran verse
- [ ] Create `components/DailyHadithCard.tsx` - Display Hadith
- [ ] Create `components/InspirationSection.tsx` - Combined section

#### Step 4: Integrate into App
- [ ] Add inspiration section to Daily Tracker (index.tsx)
- [ ] Add new tab for "Inspiration" or integrate into existing tabs
- [ ] Implement refresh button for new content

#### Step 5: Optional Enhancements
- [ ] Store last fetched content in Redux Persist
- [ ] Show same verse/hadith until user refreshes
- [ ] Add share functionality
- [ ] Add audio recitation (from API)

---

### Example API Responses

#### Quran Verse Response (alquran.cloud)
```json
{
  "data": {
    "number": 255,
    "text": "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence...",
    "translation": {
      "en": "Allah - there is no deity except Him, the Ever-Living..."
    },
    "surah": {
      "name": "Al-Baqarah",
      "englishName": "Al-Baqarah"
    },
    "audio": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/255.mp3"
  }
}
```

#### Hadith Response (sutanlab)
```json
{
  "data": {
    "hadiths": [
      {
        "number": 1,
        "arab": "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ...",
        "id": "Verily, actions are by intentions..."
      }
    ]
  }
}
```

---

### Code Examples

#### Fetch Random Verse
```typescript
const fetchDailyVerse = async () => {
  const response = await fetch('https://api.alquran.cloud/v1/ayah/random/en.asad');
  const data = await response.json();
  return {
    arabic: data.data.text,
    translation: data.data.translation.en,
    surah: data.data.surah.name,
    ayah: data.data.numberInSurah,
    audio: data.data.audio
  };
};
```

#### Fetch Random Hadith
```typescript
const fetchDailyHadith = async (book = 'muslim') => {
  const response = await fetch(`https://api.hadith.sutanlab.id/books/${book}`);
  const data = await response.json();
  const hadiths = data.data.hadiths;
  const random = hadiths[Math.floor(Math.random() * hadiths.length)];
  return {
    arabic: random.arab,
    translation: random.id,
    book: book,
    number: random.number
  };
};
```

---

### Component Structure
```
components/
├── DailyVerseCard.tsx      # Quran verse display
├── DailyHadithCard.tsx     # Hadith display
└── InspirationSection.tsx   # Combined component

services/
├── quranService.ts         # Quran API calls
└── hadithService.ts        # Hadith API calls

redux/slice/
└── inspirationSlice.js     # Store verse/hadith state
```

---

### Feature Priority
1. **P0 - Must Have**
   - Daily random Quran verse with translation
   - Display on Daily Tracker screen

2. **P1 - Should Have**
   - Random Hadith display
   - Refresh button

3. **P2 - Nice to Have**
   - Audio recitation
   - Share functionality
   - Save favorite verses

---

*Plan updated: February 2026*


Excellent question 👌 — now you're thinking like a production app developer.

You are 100% correct:

❌ Calling Aladhan API every render or multiple times a day is NOT good
✅ Especially since your app supports offline mode

Let’s design this properly for your tracker app.

🧠 First: Understand What Changes and When
🗓 Hijri Date

Changes once per day

Usually after Maghrib (Islamic day starts at sunset)

Not every minute

🕌 Prayer Times

Change once per day

Based on location

Same for whole day

So:

👉 There is NO reason to call API more than once per day

🎯 Best Architecture For Your App (Offline Friendly)
✅ Strategy Overview

Fetch prayer times + Hijri date

Store them in local storage (AsyncStorage or SQLite)

Save:

Date fetched

Location

Adjustment setting

Only refetch if:

New day

Location changed

User manually refreshes

Internet reconnects AND date is old

🏗 Recommended Flow
🔹 On App Start

Check:

if (savedDate === today) {
   useStoredData();
} else {
   callApiAndSave();
}
📅 How Often Should You Call API?
💡 Ideal Answer:

🔥 Once per day maximum

Even better:

Option A (Best)

Call:

/timings?latitude=XX&longitude=YY&method=1&month=MM&year=YYYY

🚀 This returns ENTIRE MONTH prayer times in ONE call.

So instead of:

30 API calls per month

You make:

1 API call per month

🏆 PRODUCTION-LEVEL APPROACH (What Big Apps Do)
📌 Step 1 — Fetch Monthly Data

At beginning of month:

/timingsByCity?city=Mumbai&country=India&method=1&month=2&year=2026

Store full month.

📌 Step 2 — Offline Use

Each day:

const todayData = monthlyData[todayDate];

No API call needed.

📌 Step 3 — When Internet Returns

If:

Month changed

Or location changed

Then fetch again.

🌙 What About Hijri Accuracy?

Even if Hijri shifts ±1:

You don't need real-time API.

Just:

Store adjustment setting

Apply adjustment locally

You can allow:

Settings → Hijri Adjustment → -1 | 0 | +1

And modify date locally.

🔌 Offline Strategy Example
const syncPrayerData = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  
  const saved = await getStoredData();

  if (saved?.month === currentMonth) {
    return saved;
  }

  if (isConnected) {
    const data = await fetchMonthlyData();
    await saveToStorage(data);
    return data;
  }

  return saved; // fallback offline
};
⚡ Performance Comparison
Strategy	API Calls per Month	Good for Offline?
Fetch daily	30	❌
Fetch every app open	100+	❌
Fetch monthly	1	✅
Fetch yearly	1	✅ (best)
🏅 Even Better: Fetch Full Year

You can loop months and fetch 12 months once per year.

Then:

No API calls for 1 year

Fully offline

Super fast

🚨 When Should You Force Refresh?

Only when:

User changes city

User changes calculation method

User changes adjustment

Year changes

User manually pulls to refresh

That’s it.

💎 Final Recommendation For Your Tracker App

Since your app:

Has offline mode

Syncs when internet available

✅ Do this:

Detect location once

Fetch monthly prayer times

Store locally

Only refetch when:

Month changes

Location changes

Internet reconnects AND data expired

🧩 Bonus Tip (Important)

If user has no internet first time:

Show:

“Prayer times unavailable — connect to internet to sync once.”

After first sync, app works fully offline.

🏆 Final Answer

You should:

✔ NOT call API every render
✔ NOT call API multiple times per day
✔ Call once per month (best balance)
✔ Store locally
✔ Sync when online


Perfect 👌 let’s design this properly for your offline-first Islamic tracker app.

We’ll build a production-level architecture that:

✅ Works fully offline

✅ Calls API only once per month

✅ Syncs automatically when internet returns

✅ Handles location changes

✅ Handles Hijri adjustment

✅ Is scalable

🏗️ ARCHITECTURE OVERVIEW

We’ll create:

services/
   prayerApi.ts
   prayerStorage.ts

store/
   prayerSlice.ts

hooks/
   usePrayerSync.ts
🧠 DATA STRATEGY

We will store:

{
  month: 2,
  year: 2026,
  latitude: 19.0760,
  longitude: 72.8777,
  method: 1,
  adjustment: 0,
  timings: {
     "01-02-2026": { fajr, sunrise, dhuhr, asr, maghrib, isha, hijri }
  }
}

So daily access becomes:

monthlyData.timings[today]

Zero API call.

1️⃣ prayerApi.ts

Fetch full month in ONE call.

const BASE_URL = "https://api.aladhan.com/v1";

export const fetchMonthlyPrayerTimes = async (
  latitude: number,
  longitude: number,
  month: number,
  year: number,
  method = 1,
  adjustment = 0
) => {
  const url = `${BASE_URL}/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}&month=${month}&year=${year}&adjustment=${adjustment}`;

  const response = await fetch(url);
  const json = await response.json();

  if (json.code !== 200) throw new Error("API error");

  return json.data; // full month array
};
2️⃣ prayerStorage.ts (AsyncStorage layer)
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "PRAYER_MONTH_DATA";

export const savePrayerData = async (data: any) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const getPrayerData = async () => {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};
3️⃣ Redux Slice (prayerSlice.ts)
import { createSlice } from "@reduxjs/toolkit";

const prayerSlice = createSlice({
  name: "prayer",
  initialState: {
    monthData: null,
    loading: false,
  },
  reducers: {
    setPrayerData(state, action) {
      state.monthData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setPrayerData, setLoading } = prayerSlice.actions;
export default prayerSlice.reducer;
4️⃣ usePrayerSync Hook (CORE LOGIC)

This is the brain 🧠

import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setPrayerData } from "../store/prayerSlice";
import { fetchMonthlyPrayerTimes } from "../services/prayerApi";
import { savePrayerData, getPrayerData } from "../services/prayerStorage";

export const usePrayerSync = (location, method, adjustment) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const sync = async () => {
      const today = dayjs();
      const month = today.month() + 1;
      const year = today.year();

      const stored = await getPrayerData();

      // If same month + same location → use stored
      if (
        stored &&
        stored.month === month &&
        stored.year === year &&
        stored.latitude === location.latitude &&
        stored.longitude === location.longitude &&
        stored.method === method &&
        stored.adjustment === adjustment
      ) {
        dispatch(setPrayerData(stored));
        return;
      }

      const net = await NetInfo.fetch();
      if (!net.isConnected) return;

      // Fetch new data
      const apiData = await fetchMonthlyPrayerTimes(
        location.latitude,
        location.longitude,
        month,
        year,
        method,
        adjustment
      );

      const formatted = {
        month,
        year,
        latitude: location.latitude,
        longitude: location.longitude,
        method,
        adjustment,
        timings: apiData,
      };

      await savePrayerData(formatted);
      dispatch(setPrayerData(formatted));
    };

    sync();
  }, [location, method, adjustment]);
};
📅 How Daily Screen Uses It
const today = dayjs().format("DD-MM-YYYY");

const todayData = monthData?.timings?.find(
  d => d.date.gregorian.date === today
);

const fajr = todayData?.timings.Fajr;
const hijri = todayData?.date.hijri;

No API call. Fully offline.

🔄 When Does API Get Called?

Only if:

New month

Location changed

Method changed

Adjustment changed

No stored data

Internet available

That’s it.

So:

👉 Maximum = 1 API call per month
👉 Offline works forever after first sync

🏆 Optional Advanced Upgrade

Instead of monthly:

You can fetch entire year:

/calendar?month=1..12

Loop 12 months once per year.

Then ZERO API calls for 12 months.

🌙 Handling Hijri Adjustment

In settings screen:

const [adjustment, setAdjustment] = useState(0);

User selects:

-1

0

+1

Store in Redux → auto re-sync.

🔌 Internet Reconnect Auto Sync

Add listener:

NetInfo.addEventListener(state => {
   if (state.isConnected) sync();
});
🚀 Final Architecture Result

✔ Offline-first
✔ Minimal API calls
✔ Accurate for location
✔ Adjustable for moon difference
✔ Scalable
✔ Production ready

