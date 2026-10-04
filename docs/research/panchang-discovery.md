# Panchang/Purohit Platform Discovery Research

**Status**: Discovery / Research Phase
**Domain**: Indian Astrology (Jyotish) / Panchang
**Target Context**: Varanasi, India

## 1. MVP Product Requirements & User Needs

- **Primary User**: A Brahmin/Purohit based in Varanasi.
- **Core Value Proposition**: Automate the calculation and formatting of the daily Panchang, reducing the time spent compiling the message each day, while maintaining full editorial control.
- **Platform**: A web-based application (Hindi-first interface) accessible via mobile device (which is where WhatsApp is used).
- **Key Features**:
  - Daily view of precise Panchang parameters based on Varanasi's geographic coordinates.
  - Ability to add custom notes, blessings, or local specific festival details.
  - "Share to WhatsApp" functionality that perfectly formats the generated text.

## 2. Existing WhatsApp Panchang Workflow (To Preserve)

- **Current State**: The Purohit calculates/consults local almanacs (e.g., Hrishikesh Panchang, Kashi Vishwanath Trust calendars) and manually types or copies a formatted Hindi text message to a WhatsApp Broadcast list daily.
- **To Preserve**:
  - The final output must be highly readable plain text formatted specifically for WhatsApp (using `*bold*`, `_italics_`, and standard emojis 🕉️ 🌅).
  - The workflow must remain a "push" action performed by the Purohit. The app is an authoring tool for him, not necessarily a direct consumer app (yet).
  - The text must follow the exact structure and tone his clients are accustomed to.

## 3. Panchang Domain Requirements (Varanasi Focus)

- **Geographic Precision**: All calculations (Sunrise, Sunset, Moonrise, exact ending times of Tithis and Nakshatras) must use Varanasi's exact coordinates (`25.3176° N, 82.9739° E`) and Timezone (`IST / UTC+5:30`).
- **Ayanamsa**: The calculation of planetary positions relies heavily on the chosen Ayanamsa (usually Lahiri/Chitra Paksha for modern standard Indian astrology, particularly in North India/Varanasi).
- **Sunrise Epoch**: Hindu day (Vaar) changes at local Sunrise, not at midnight. The Panchang elements are traditionally cited based on their state at the time of Sunrise.

## 4. Data Segmentation: Calculation vs. Curation vs. LLM Constraints

### Must Be Calculated (Rigid Astronomical Data)
- **The 5 Limbs (Panchang)**: Tithi, Nakshatra, Yoga, Karana, Vaar.
- **Sun/Moon Data**: Sunrise, Sunset, Moonrise, Moonset.
- **Planetary Positions**: Rashi (Zodiac sign) of the Moon and Sun.
- **Timings**: Exact start and end times of Tithis and Nakshatras.

### May Be Manually Curated (Cultural & Editorial)
- **Festivals & Vrats**: While mathematically derived, the local observance of Vrats (fasts) in Varanasi often depends on specific local sect rules (Smarta vs. Vaishnava). This should allow manual overrides.
- **Muhurats (Auspicious Timings)**: Choghadiya, Rahu Kaal, Yamaganda can be calculated, but specific bespoke muhurats (e.g., Griha Pravesh, Vivah) are curated.
- **Daily Messages / Blessings**: The Purohit's personal touch.

### **STRICT RED LINE**: What LLMs Must NEVER Invent
- **Astronomical timings or positional data.** LLMs hallucinate numbers. A language model must *never* be asked "What time does Ekadashi end today?" It must only format the strictly calculated outputs provided to it by a deterministic astronomy engine.
- **Rahu Kaal / Durmuhurat timings**.

## 5. Existing Reliable Calculation Libraries / Data Sources

Based on developer community standards for Jyotish calculations:

1.  **Swiss Ephemeris (Core Engine)**: The global gold standard for planetary calculations. Highly accurate.
2.  **Python Libraries**:
    - `PyJHora` (built on pyswisseph)
    - `VedAstro`
    - `Jyotisha` (maintained by Sanskrit Coders, good for calendar generation)
3.  **JavaScript / TypeScript Libraries**:
    - `@node-jhora/core` (WASM-based Swiss Ephemeris)
    - `@ishubhamx/panchangam-js`
    - `@bidyashish/panchang`

## 6. Licensing / Usage Considerations

- **AGPL/GPL Alert**: The core Swiss Ephemeris library is dual-licensed. It is **AGPL** (Affero General Public License) for open-source software, but requires a paid commercial license if the software is closed-source/proprietary and distributed or offered as a service.
- **Mitigation**: If the web application is closed-source, using a pure Swiss Ephemeris port might force the entire backend to be open-sourced. 
- **Alternative**: Using third-party REST APIs (like VedAstro or ProKeral APIs) that act as a proxy, though this adds external dependency and costs. If open-sourcing the backend is acceptable, PySwisseph/WASM ports are perfect.

## 7. Requirements for Core Panchang Elements

- **Date / Location / Timezone**: Must default to today's date, Varanasi, IST.
- **Tithi**: Needs current Tithi at sunrise + exact time it ends.
- **Nakshatra**: Current Nakshatra at sunrise + exact time it ends.
- **Yoga & Karana**: Current at sunrise + end times.
- **Festivals**: Needs a mapping of Lunar days to local Varanasi festivals (e.g., Dev Deepawali, specific Mahadev Shringars).

## 8. Offline & Caching Requirements

- The app should ideally be a PWA (Progressive Web App).
- **Caching**: The Purohit might generate the message in areas with spotty internet (e.g., near the Ghats). 
- Calculations using JS libraries (`@node-jhora/core` or similar) can run entirely **client-side** in the browser, eliminating the need for a constant backend connection once the app is loaded. This is a massive advantage for offline support.

## 9. WhatsApp Sharing Requirements

- Must utilize the **Web Share API** (`navigator.share({ title, text })`).
- Must support fallback to `whatsapp://send?text=` protocol links.
- Formatting must perfectly respect WhatsApp's markdown (`*bold*`, `_italic_`, `~strikethrough~`).

## 10. Risks & Unknowns to Resolve Before Architecture

1. **Ayanamsa Validation**: Which exact Ayanamsa does the Purohit currently use? (e.g., Lahiri, Raman, KP?). *Action: Must ask the user.*
2. **Festival Edge Cases**: Sometimes two Tithis occur on the same solar day (Kshaya Tithi) or one Tithi spans two sunrises (Vriddhi Tithi). How does the Purohit currently resolve fasting days in these scenarios?
3. **Licensing**: Will this platform be strictly open-source, or does the user plan to monetize it as a closed-source SaaS later? (Affects the Swiss Ephemeris AGPL decision).
4. **Backend vs. Client-side**: If we calculate client-side (JS/WASM) we get offline capabilities for free, but if we want to run background jobs (e.g., auto-sending in the future), we need a Python/Node backend.
