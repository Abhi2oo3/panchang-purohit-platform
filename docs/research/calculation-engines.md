# Panchang Calculation Engine Research

**Status**: Research Phase
**Goal**: Determine how to technically reproduce the Ganesh Apa Panchang values for Kashi/Varanasi, using the Golden Reference Dataset (25 Sep–4 Oct 2026) as the validation target.

## 1. Ganesh Apa Panchang Methodology
- **Verified Facts**: Established in 1857 by Pandit Ganesh Apa in Varanasi. It represents a specific, regional family lineage of Vedic calculation.
- **Unknowns**: It is not publicly documented whether the modern Ganesh Apa Panchang uses pure traditional *Surya Siddhanta*, a modified Siddhanta with *Bija* (seed) corrections, or if it has transitioned to modern *Drik* (observational) calculations.
- **API Availability**: There is no official digital API or data source provided by the Ganesh Apa publishers.

## 2. Surya Siddhanta vs. Modern Drik Approaches
- **Surya Siddhanta**: An ancient treatise using mathematical constants and mean-motion tables. Due to the lack of modern observational corrections, planetary positions and timings derived purely from Surya Siddhanta deviate from actual current sky positions.
- **Drik (Drigganita)**: Observational astronomy relying on modern ephemeris data (e.g., NASA JPL or Swiss Ephemeris). Highly precise.
- **Relevance**: Most modern libraries default to Drik. If Ganesh Apa uses a regional Siddhanta, a standard Drik engine means we must empirically test for discrepancies in exact Tithi/Nakshatra ending times.

## 3. Swiss Ephemeris
- **Capabilities**: A high-precision astronomical engine widely used for planetary positions, eclipses, and astronomical phenomena.
- **Relevant Calculations**: Can calculate Sun/Moon/Jupiter positions, Sunrise/Sunset, Tithi, Nakshatra, Yoga, and Karana.
- **Licensing & Risks**: Dual-licensed. 
  - **AGPL-3.0**: The free open-source copyleft license. If this library is used to provide functionality over a network (e.g., a backend API or SaaS), the AGPL requires that the entire backend source code be disclosed and licensed under AGPL.
  - **Commercial License**: Costs approximately CHF 750 (one-time fee). Purchasing this removes the AGPL open-source requirement.

## 4. Calculated vs. Sourced Data
Based on the Golden Reference requirements:
- **Can be Calculated (by Engines)**: Tithi, Nakshatra, Yoga, Karana, Sunrise/Sunset, Moon Rashi transitions, Sun Nakshatra/Rashi, Jupiter Rashi, Ayana, Gola, Bhadra (derived from Vishti Karana).
- **Observances (Festivals/Parana)**: Initially source-referenced/curated until deterministic rules are validated. (These rely on complex, region-specific religious texts, e.g., Smarta vs. Vaishnava rules).

## 5. Candidate Comparison Table

| Candidate | Language | Calculation Basis | Open Source? | License | Commercial Suitability | Offline Capability | Relevant Features | Likely Ability to Match Ganesh Apa | Major Risks | Source/Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PyJHora** | Python | Swiss Ephemeris (Drik) | Yes | AGPL | Requires paid SwissEph license if closed-source backend | Backend only | 5 Limbs, Planets, Sunrise | High for Drik; unknown for Siddhanta | AGPL backend contamination | PyPI / JHora lineage |
| **jyotishganit** | Python | NASA Skyfield (Drik) | Yes | MIT | Excellent (No SwissEph) | Backend only | 5 Limbs, Planets | High for Drik | NASA JPL models differ slightly from SwissEph | PyPI / Skyfield |
| **@ishubhamx/panchangam-js** | TypeScript | astronomy-engine (Drik) | Yes | MIT | Excellent | Yes (Browser PWA) | 5 Limbs, Sunrise | High for Drik | Limited built-in Vrat resolution | GitHub / NPM |
| **@node-jhora/core** | JS/WASM | Swiss Ephemeris (Drik) | Yes | AGPL | Requires paid SwissEph license if closed-source | Yes (Browser PWA) | High precision Jyotish | High for Drik | AGPL applies even if bundled in client | NPM |
| **VedAstro API** | REST API | Cloud Engine | No (API) | Varies | Good (API calls) | No | 500+ calculations | Moderate (Uses standard Drik) | Dependency on 3rd party uptime | VedAstro Docs |
| **AstroSage API** | REST API | Proprietary | No | Paid | Good | No | Rahu Kaal, 5 Limbs | High for Rahu Kaal (current workflow) | Expensive, vendor lock-in | AstroSage Docs |

## 6. Reproducing the Golden Reference Dataset
- **Can candidate engines reproduce the 25 Sep–4 Oct 2026 dataset?** 
  - **Timings**: Engines will calculate times, but we must empirically test for discrepancies against the Golden Reference if Ganesh Apa uses a different Ayanamsa, sunrise definition, or Siddhantic corrections.
  - **Vrats/Parana**: Initially source-referenced/curated until deterministic rules are validated.

## 7. Recommended Validation Strategy
We must experimentally determine which calculation configuration best reproduces the Panchang the domain expert actually follows.
1. **The Delta Test**: Build a minimal test script using an MIT-licensed engine (e.g., `@ishubhamx/panchangam-js` or `jyotishganit`).
2. **Input**: Kashi coordinates (25.3176° N, 82.9739° E). Test various Ayanamsas (e.g., Lahiri as just one configuration) and sunrise definitions.
3. **Execution**: Generate Tithi, Nakshatra, Yoga, Karana, and Sunrise end-times for 25 Sep–4 Oct 2026.
4. **Comparison**: Map the engine's 24h output to the Golden Reference's Hindi time buckets. Compare the state, the transition, and the timestamp, rather than just minute deltas.
5. **Iteration**: Adjust calculation configurations (Ayanamsa, Siddhanta modes) until the exact transition states and timestamps closely match the Golden Reference.
