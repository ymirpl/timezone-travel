# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who coordinate across time zones and need to compare the same moment in several cities quickly, primarily from the keyboard inside Raycast on macOS or Windows.

## Product Purpose

Timezone Travel turns a world clock into a time-travel tool. A user sets one moment in an anchor city, then immediately sees the corresponding local time, date boundary, and working-hours status everywhere else. Success means finding a workable cross-city moment without mental offset arithmetic.

## Positioning

The product moves one shared instant through every saved city together. Time search and movement are the primary interaction; city configuration is secondary.

## Operating Context

The extension runs inside Raycast's native list interface. Users type times such as `14:30`, `tomorrow 9am`, or `+3h`, move in one-hour steps with Option/Alt plus the arrow keys, and copy individual or complete comparisons.

## Capabilities and Constraints

- The anchor city stays first; other cities are ordered by increasing UTC offset at the selected moment.
- Day changes, daylight-saving offsets, local working hours, and 12/24-hour display must remain legible at a glance.
- City search supports place, country, abbreviation, and timezone names.
- The Store icon must be a 512 × 512 PNG and remain recognizable at small Raycast list sizes.
- The extension makes no network requests and stores city choices locally.

## Brand Commitments

- Product name: Timezone Travel.
- The identity should feel native to Raycast: polished, compact, confident, and professional.
- Personality may be loud, but must remain tasteful rather than flattened into generic utility minimalism.
- Avoid generic clock or globe clip-art and avoid heavy skeuomorphism.
- A GMT watch may supply the conceptual logic—24-hour travel, a second timezone, a movable shared moment—but should be abstracted into a strong graphic mark rather than rendered as a miniature physical watch.

## Evidence on Hand

- Current icon: `assets/icon.png`.
- Product screenshot: `media/timezone-travel.png`.
- Store screenshot: `metadata/timezone-travel-1.png`.
- No established external logo system, testimonials, or marketing claims are available and none should be fabricated.

## Product Principles

- Make temporal relationships visible instead of asking users to calculate them.
- Keep movement and search faster than configuration.
- Preserve personality through precise hierarchy, color, and rhythm.
- Prefer one memorable mechanism over decorative detail.
- Feel at home inside Raycast on both light and dark themes.
