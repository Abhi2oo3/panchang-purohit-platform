# Panchang Domain Model

This document outlines the core domain model for the Panchang/Purohit Platform, derived from the golden reference dataset (the daily WhatsApp messages) and the established workflow of the domain expert (Varanasi Purohit). 

## 1. Core Entities and Aggregate Roots

### **DailyPanchang (Aggregate Root)**
Represents the complete set of astronomical, astrological, and editorial data published for a single day.
- **Identity**: The Gregorian Date (e.g., `2026-10-04`).
- **State**: A composition of multiple Value Objects and Curated Lists.

## 2. Provenance Classifications
Every important Panchang value is classified by its data provenance:
- **calculated**: Derived mathematically by the system.
- **source-referenced**: Drawn directly from the primary Ganesh Apa Panchang reference.
- **externally sourced**: Fetched from a third-party (e.g., AstroSage).
- **editorial**: Added manually for personal or stylistic reasons.
- **Purohit-approved/decided**: Values resulting from a PurohitDecision after a discrepancy is flagged during PurohitReview.

## 3. Value Objects

### 3.1 Era & Time Cycles (Provenance: calculated / source-referenced)
- **Yugabda**: E.g., 5127.
- **VikramSamvat**: E.g., 2083.
- **ShakaSamvat**: E.g., 1948.
- **Samvatsar**: The annual cycle name (e.g., Raudra).
- **Ayana**: Solar half-year (e.g., Yamyayana / Dakshinayan).
- **Gola**: Hemisphere of the sun (e.g., Saumyagola).
- **Ritu**: Season (e.g., Sharad).
- **Maas**: Lunar month (e.g., Ashvin).
- **Paksha**: Lunar fortnight (Shukla or Krishna).

### 3.2 The Five Limbs (Panchang Elements) (Provenance: calculated / source-referenced)
Each element has a current state, and optionally, a Transition state (if it changes during the day).
- **Vaar**: Day of the week (e.g., Sunday / Bhanu).
- **Tithi**: Lunar day. Includes Transition ending time (e.g., Ashtami ends at 07:22 AM, then Navami).
- **Nakshatra**: Lunar mansion. Includes Transition ending time.
- **Yoga**: Luni-solar angle. Includes Transition ending time.
- **Karana**: Half-tithi. (Karana is the core Panchanga element, related to but distinct from Bhadra).
- **AnandadiYoga**: Daily auspicious/inauspicious yoga based on Vaar and Nakshatra.

### 3.3 Planetary Data (Provenance: calculated / source-referenced)
- **Pakshika Surya**: The Sun's position for the fortnight, defined by its Nakshatra and Rashi.
- **Chandrama (Moon)**: Current Rashi. If transitioning during the day, includes the exact Transition time.
- **Guru (Jupiter)**: Current Rashi (e.g., Karka). Highly significant for daily Jyotish rules.
- *(Note: Other planets are excluded from the daily broadcast but may support future features).*

### 3.4 Timings & Coordinates
- **ReferenceLocation**: Fixed to Kashi/Varanasi (Coordinates: 25.3176° N, 82.9739° E).
- **Sunrise/Sunset**: Precise local timings. (Provenance: calculated / source-referenced).

### 3.5 Inauspicious Timings
- **RahuKaal**: (Provenance: externally sourced from AstroSage).
- **DishaShool**: Inauspicious direction for travel, based on Vaar.

## 4. Observances and Special Events ("Aaj Vishesh")

This is a curated list of events occurring on this date.
- **Vrat & Parva**: Fasting days and festivals (Provenance: source-referenced).
- **Shraddha**: Ancestral offerings (Provenance: source-referenced).
- **Bhadra**: Bhadra is the significant Vishti period/interpretation that must be explicitly surfaced with exact start/end times when applicable. (Distinct from the base Karana element).
- **Parana**: The specific time window for breaking a fast from the previous day.

## 5. Editorial Content

- **Suvichar**: A daily quote or moral thought. (Provenance: editorial).
- **Sign-off**: Standard signature (Provenance: editorial).

## 6. Invariants & Rules

1. **Conflict Resolution & Purohit Decision**: Ganesh Apa Panchang is the primary project reference. Discrepancies between system calculations and Ganesh Apa are not automatically overridden; instead, they must be flagged for PurohitReview, and the PurohitDecision determines the final accepted value (Provenance: Purohit-approved/decided).
2. **Transition Formatting**: If a Tithi, Nakshatra, Yoga, or Moon Rashi changes, the output must show the current element, its Transition end time, and the "Next" (आगे) element.
3. **Bhadra Visibility**: If applicable, Bhadra must trigger a mandatory explicit warning in the "Aaj Vishesh" list with precise timings.
4. **Message Format**: The fixed section order and Hindi terminology of the GoldenReferenceDataset are invariant. Presentation decorations (like emojis) can vary.

## 7. Workflow

1. **Generation**: The system calculates/fetches base values and classifies their Provenance.
2. **PurohitReview**: The domain expert reviews the drafted data against the physical Ganesh Apa Panchang.
3. **PurohitDecision**: The domain expert resolves any flagged discrepancies.
4. **Golden Reference Validation**: The final output is checked against the GoldenReferenceDataset to ensure structural and terminology compliance.

## 8. Remaining Technical Unknowns

1. **Sunrise Epoch / Day Boundary**: The exact day-boundary and calculation convention is currently a technical/domain research unknown and must be confirmed by domain evidence.
2. **Time Representation**: The GoldenReferenceDataset uses relative Hindi time phrases (प्रातः, दिन, सायं, रात्रि). These are currently modeled as source/display conventions until further researched; do not assume fixed universal clock ranges.
3. **AstroSage RahuKaal**: Is Rahu Kaal manually copied daily, or do we need to scrape/API-integrate AstroSage to automate it?
4. **Ganesh Apa Digitization**: It is an unresolved technical research question how Ganesh Apa rulings will be digitized. We do not yet assume manual data entry is strictly required nor that open-source APIs cannot reproduce these rulings.
