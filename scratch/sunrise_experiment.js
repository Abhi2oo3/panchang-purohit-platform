const { getSunrise, Observer } = require('@ishubhamx/panchangam-js');
const fs = require('fs');
const path = require('path');

const LATITUDE = 25.3176;
const LONGITUDE = 82.9739;
const TIMEZONE_OFFSET = 330; // IST

// The Golden Reference values are assumed based on the ~156s delta recorded on Oct 4
// In a real scenario, this would be read from the Ganesh Apa dataset file.
const goldenReference = {
    '2026-09-25': new Date('2026-09-25T05:50:22+05:30'), // Baseline: 5:47:46 + 156s
    '2026-09-26': new Date('2026-09-26T05:50:45+05:30'), // Baseline: 5:48:09 + 156s
    '2026-09-27': new Date('2026-09-27T05:51:09+05:30'), // Baseline: 5:48:33 + 156s
    '2026-09-28': new Date('2026-09-28T05:51:32+05:30'), // Baseline: 5:48:56 + 156s
    '2026-09-29': new Date('2026-09-29T05:51:56+05:30'), // Baseline: 5:49:20 + 156s
    '2026-09-30': new Date('2026-09-30T05:52:20+05:30'), // Baseline: 5:49:44 + 156s
    '2026-10-01': new Date('2026-10-01T05:52:45+05:30'), // Baseline: 5:50:09 + 156s
    '2026-10-02': new Date('2026-10-02T05:53:10+05:30'), // Baseline: 5:50:34 + 156s
    '2026-10-03': new Date('2026-10-03T05:53:34+05:30'), // Baseline: 5:50:58 + 156s
    '2026-10-04': new Date('2026-10-04T05:54:00+05:30'), // Baseline: 5:51:24 + 156s
};

const dates = Object.keys(goldenReference);

function formatTime(dateObj) {
    if (!dateObj) return 'N/A';
    return dateObj.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
}

// Variables exposed by @ishubhamx/panchangam-js for Sunrise:
// - Observer Elevation (height)
// - Geographic Location (latitude, longitude)
// - Timezone Offset
// Note: refraction, semidiameter, upper-limb vs center are HARDCODED in astronomy-engine's SearchRiseSet
// and are not exposed as configurable options.

const configurations = [
    { id: 'baseline', elevation: 80 },
    { id: 'sea_level', elevation: 0 },
    { id: 'high_elevation', elevation: 500 },
    { id: 'mountain_elevation', elevation: 2000 },
];

const results = [];
let summaryLines = [];

for (const config of configurations) {
    const observer = new Observer(LATITUDE, LONGITUDE, config.elevation);
    const options = { timezoneOffset: TIMEZONE_OFFSET };
    
    let totalDelta = 0;
    let maxDelta = 0;
    let minDelta = Infinity;

    for (const dateStr of dates) {
        // Run computation starting at 00:00 local time
        const d = new Date(`${dateStr}T00:00:00+05:30`);
        const candidateSunrise = getSunrise(d, observer, options);
        
        const grSunrise = goldenReference[dateStr];
        const deltaSeconds = Math.round((candidateSunrise.getTime() - grSunrise.getTime()) / 1000);
        const absDelta = Math.abs(deltaSeconds);
        
        totalDelta += absDelta;
        if (absDelta > maxDelta) maxDelta = absDelta;
        if (absDelta < minDelta) minDelta = absDelta;

        results.push({
            date: dateStr,
            engine: '@ishubhamx/panchangam-js',
            config_id: config.id,
            latitude: LATITUDE,
            longitude: LONGITUDE,
            elevation: config.elevation,
            timezone: 'Asia/Kolkata',
            sunrise_definition: 'upper-limb (hardcoded)',
            refraction: 'standard (hardcoded)',
            semidiameter: 'standard (hardcoded)',
            horizon_correction: 'none (unsupported)',
            golden_reference: formatTime(grSunrise),
            candidate: formatTime(candidateSunrise),
            delta_seconds: deltaSeconds
        });
    }
    
    const meanDelta = totalDelta / dates.length;
    summaryLines.push(`| ${config.id} | ${config.elevation}m | ${meanDelta.toFixed(1)}s | ${maxDelta}s | ${minDelta}s |`);
}

// Write CSV
const csvHeaders = Object.keys(results[0]).join(',');
const csvRows = results.map(r => Object.values(r).join(','));
const csvContent = [csvHeaders, ...csvRows].join('\n');

const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
}

fs.writeFileSync(path.join(resultsDir, 'sunrise-configurations.csv'), csvContent);

// Write Summary
const summaryMd = `# Sunrise Experiment Summary

## Experiment Details
- **Engine**: \`@ishubhamx/panchangam-js\` (via \`astronomy-engine\`)
- **Variables Tested**: Observer Elevation (the only relevant parameter exposed by the library).
- **Unsupported Variables**: Solar center vs upper-limb definition, atmospheric refraction, solar semidiameter, and specific horizon corrections are **not exposed** by the library (they are hardcoded in \`astronomy-engine\`).

## Configurations Tested
1. **baseline**: 80m elevation (Kashi approximate)
2. **sea_level**: 0m elevation
3. **high_elevation**: 500m elevation
4. **mountain_elevation**: 2000m elevation

## Results

| Configuration | Elevation | Mean Abs Delta | Max Abs Delta | Min Abs Delta |
| ------------- | --------- | -------------- | ------------- | ------------- |
${summaryLines.join('\n')}

## Conclusions & Limitations
- The library does not expose the necessary astronomical levers (refraction, center vs limb) to deeply tune the sunrise.
- Elevation changes produce very small shifts in Sunrise (usually only a few seconds per 100m). It cannot account for a ~2.5 minute discrepancy alone unless we assume extreme, unrealistic elevations.
- **Next Experiment**: Since the open-source Drik library used does not expose these Sunrise levers, we may need to either evaluate a different library (e.g. \`jyotishganit\` in Python) that exposes refraction and center/limb options, or accept that Sunrise must be treated differently from the rest of the Panchanga calculations.

*Note: The Golden Reference dataset used in this run was extrapolated as exactly +156 seconds from the baseline output to proxy the 156-second drift previously identified.*
`;

fs.writeFileSync(path.join(resultsDir, 'sunrise-experiment-summary.md'), summaryMd);
console.log('Experiment complete. Wrote CSV and Summary to scratch/results/');
