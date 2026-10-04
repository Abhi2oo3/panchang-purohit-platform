# Sunrise Experiment Summary

## Experiment Details
- **Engine**: `@ishubhamx/panchangam-js` (via `astronomy-engine`)
- **Variables Tested**: Observer Elevation (the only relevant parameter exposed by the library).
- **Unsupported Variables**: Solar center vs upper-limb definition, atmospheric refraction, solar semidiameter, and specific horizon corrections are **not exposed** by the library (they are hardcoded in `astronomy-engine`).

## Configurations Tested
1. **baseline**: 80m elevation (Kashi approximate)
2. **sea_level**: 0m elevation
3. **high_elevation**: 500m elevation
4. **mountain_elevation**: 2000m elevation

## Results

| Configuration | Elevation | Mean Abs Delta | Max Abs Delta | Min Abs Delta |
| ------------- | --------- | -------------- | ------------- | ------------- |
| baseline | 80m | 155.5s | 156s | 155s |
| sea_level | 0m | 156.5s | 157s | 156s |
| high_elevation | 500m | 149.5s | 150s | 149s |
| mountain_elevation | 2000m | 129.6s | 130s | 129s |

## Conclusions & Limitations
- The library does not expose the necessary astronomical levers (refraction, center vs limb) to deeply tune the sunrise.
- Elevation changes produce very small shifts in Sunrise (usually only a few seconds per 100m). It cannot account for a ~2.5 minute discrepancy alone unless we assume extreme, unrealistic elevations.
- **Next Experiment**: Since the open-source Drik library used does not expose these Sunrise levers, we may need to either evaluate a different library (e.g. `jyotishganit` in Python) that exposes refraction and center/limb options, or accept that Sunrise must be treated differently from the rest of the Panchanga calculations.

*Note: The Golden Reference dataset used in this run was extrapolated as exactly +156 seconds from the baseline output to proxy the 156-second drift previously identified.*
