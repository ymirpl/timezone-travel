/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Cities - Comma-separated Label|IANA timezone pairs */
  "cities": string,
  /** Clock Format - Choose how local times are displayed */
  "clockFormat": "12" | "24",
  /** Movement Step - Amount moved by the primary forward and backward actions */
  "stepMinutes": "15" | "30" | "60"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `time-travel` command */
  export type TimeTravel = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `time-travel` command */
  export type TimeTravel = {}
}

