---
status: accepted
---

# 0001 Empirically Tuned Calculation Engine

We will use a permissively-licensed (e.g., MIT) Drik engine and empirically tune its configuration to match the Ganesh Apa Golden Reference, rather than assuming any single library is correct out-of-the-box.

### Context
Our domain research and initial Delta Test revealed measurable discrepancies—such as a ~2–2.5 minute drift in sunrise times—between standard Drik calculation engines and the Varanasi-based Ganesh Apa Panchang reference. This Delta Test result serves as empirical evidence highlighting that the calculation engine requires configuration, rather than proof of any final configuration. Notably, the sunrise discrepancy is independent of sidereal factors like Ayanamsa or Bija corrections. Furthermore, the industry-standard Swiss Ephemeris carries an AGPL-3.0 dual-license/copyleft implication, which could force backend code to be open-sourced if deployed as a service, creating unacceptable commercial risk.

### Decision
Instead of committing to a proprietary API or accepting the AGPL risk of Swiss Ephemeris (a high-precision astronomical engine), we will:
1. Select an open-source, permissively-licensed engine (e.g., `@ishubhamx/panchangam-js`).
2. Treat the engine's default output not as absolute truth, but as a baseline to be empirically tested for discrepancies.
3. Treat Sunrise/Sunset calculation as a completely separate configuration problem from sidereal Panchanga calculations (such as Tithi and Nakshatra).
4. Systematically experiment with the following Sunrise parameters to match our 10-day Golden Reference dataset:
   - solar center vs upper-limb definition
   - atmospheric refraction
   - solar semidiameter
   - observer elevation
   - horizon/topographic correction if supported
   - timezone/location handling
5. Rely on the established `PurohitReview` and `PurohitDecision` domain workflow to initially source-reference/curate complex regional observances (Vrat/Parana) until deterministic rules are validated.

### Consequences
This approach decouples our architecture from restrictive licensing and ensures we experimentally determine the configuration that best reproduces the Panchang our Purohit actually uses, treating compatibility with the project's established reference as the ultimate acceptance criterion.
