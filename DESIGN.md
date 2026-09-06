---
name: Timezone Travel
description: A shared instant crossing day and night inside a continuous 24-hour system.
colors:
  coral-dawn: "#FF6363"
  midnight-cobalt: "#10265C"
  graphite: "#151515"
  warm-ivory: "#FFF1D5"
---

# Design System: Timezone Travel

## Overview

**Creative North Star: "Horizon GMT"**

Timezone Travel turns GMT-watch logic into an astronomical horizon: one shared instant travels through a continuous day-and-night field. The identity is compact, confident, and vivid enough to remain memorable inside Raycast without becoming novelty illustration.

The world combines matte graphite, midnight cobalt, warm ivory, and coral dawn with restrained low-relief depth. Precision comes from the 24-hour bezel and its measured marker rhythm; emotion comes from the curved horizon, sun, moon, and sparse stars.

**Key Characteristics:**

- A single continuous 24-hour system, never a collection of independent clocks.
- One dominant curved day/night horizon inside a contained circular dial.
- Compact astronomical cues supported by disciplined GMT-watch geometry.
- Polished low relief, without literal watch hardware or heavy skeuomorphism.

## Colors

The palette moves from deep night to warm daylight, with coral reserved for the shared instant and the day field.

### Primary

- **Coral Dawn** (`colors.coral-dawn`): Drives the daylight field and the warm focal transition. Use it decisively, not as scattered decoration.

### Secondary

- **Midnight Cobalt** (`colors.midnight-cobalt`): Anchors the night field and the cool side of the 24-hour bezel.

### Neutral

- **Graphite** (`colors.graphite`): Forms the outer squircle and gives the astronomical field a quiet, native-to-Raycast frame.
- **Warm Ivory** (`colors.warm-ivory`): Carries the daylight end of the bezel, celestial highlights, and high-contrast markers.

### Named Rules

**The One Instant Rule.** Coral and the horizon transition must describe one shared temporal state; never distribute accents as unrelated decoration.

**The Continuous Day Rule.** Cobalt, coral, and ivory should read as one uninterrupted day-to-night cycle rather than separate color panels.

## Layout

Identity compositions are centered, compact, and dominated by one oversized circular dial within the graphite squircle. The curved horizon owns the interior; the 24-hour bezel frames it without competing for attention. Preserve generous dark breathing room at the outer corners and keep all meaningful geometry away from the crop edge.

The Store icon ships as a 512 × 512 PNG and must be inspected at 32, 64, and 512 pixels. At the smallest size, the read order is squircle, dial, curved day/night split, then celestial detail; decorative stars may recede, but the horizon and bezel rhythm must remain distinct.

## Elevation & Depth

Depth is restrained and structural: a soft lift separates the dial from the graphite ground, while subtle inner shading gives the bezel and horizon enough volume to remain legible. Highlights may clarify the dawn edge and celestial bodies, but the icon must never read as a miniature physical watch.

### Named Rules

**The Low-Relief Rule.** Use depth only to separate major layers; avoid glossy metal, thick bevels, or dramatic cast shadows.

## Shapes

The outer silhouette is a soft graphite squircle. Inside it, a single near-full circular dial contains both the bezel and the day/night field. The midnight horizon is a broad, smooth arc rather than a straight split. Celestial bodies are simple discs, stars are sparse points, and bezel markers alternate dots and rounded dashes in a measured 24-hour rhythm.

**The Contained Bezel Rule.** Every dot, dash, and cardinal marker stays entirely inside the bezel. Nothing protrudes beyond the ring, and no crown, pusher, knob, or external marker is permitted.

## Components

### Horizon GMT Store Icon

- **Frame:** Matte graphite squircle with quiet corner breathing room.
- **Bezel:** A continuous cobalt-to-ivory 24-hour ring using contained dot-and-dash markers.
- **Field:** Coral day above a sweeping midnight-cobalt horizon, with the dawn edge acting as the primary focal line.
- **Celestial cues:** One sun at the horizon, one moon in the night field, and sparse stars; all are subordinate to the day/night mechanism.
- **Finish:** Restrained low relief with no text, logo lettering, watermark, or protruding hardware.

## Do's and Don'ts

### Do:

- **Do** preserve the curved horizon as the first interior read at every shipping size.
- **Do** keep the 24-hour marker rhythm crisp and entirely contained within the bezel.
- **Do** treat the sun, moon, and stars as supporting evidence of the day/night cycle.
- **Do** verify recognition at 32, 64, and 512 pixels against both light and dark Raycast surroundings.

### Don't:

- **Don't** reduce the identity to a generic clock face, globe badge, or travel clip-art symbol.
- **Don't** add hands, numbers, text, crowns, pushers, knobs, or any element that protrudes from the bezel.
- **Don't** split the dial into independent timezone widgets; the identity represents one instant moving through every city together.
- **Don't** over-render the materials with metallic gloss, deep bevels, or luxury-watch skeuomorphism.
