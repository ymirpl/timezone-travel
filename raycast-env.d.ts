/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Clock Format - Choose how local times are displayed */
  clockFormat: "12" | "24";
};

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences;

declare namespace Preferences {
  /** Preferences accessible in the `time-travel` command */
  export type TimeTravel = ExtensionPreferences & {};
  /** Preferences accessible in the `manage-cities` command */
  export type ManageCities = ExtensionPreferences & {};
}

declare namespace Arguments {
  /** Arguments passed to the `time-travel` command */
  export type TimeTravel = {};
  /** Arguments passed to the `manage-cities` command */
  export type ManageCities = {};
}
