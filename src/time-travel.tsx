import {
  Action,
  ActionPanel,
  Color,
  getPreferenceValues,
  Icon,
  Keyboard,
  List,
  openExtensionPreferences,
} from "@raycast/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  describeDayOffset,
  formatDateInZone,
  formatTimeInZone,
  formatTimeZoneName,
  getCitySnapshot,
  parseCities,
  parseTimeQuery,
  shiftInstant,
} from "./time";

type QueryState = "idle" | "valid" | "invalid";

function formatStep(minutes: number): string {
  if (minutes === 60) return "1 Hour";
  return `${minutes} Minutes`;
}

function TimeTravelActions(props: {
  stepMinutes: number;
  clipboardSummary: string;
  onMove: (minutes: number) => void;
  onPick: (date: Date) => void;
  onNow: () => void;
}) {
  const { stepMinutes, clipboardSummary, onMove, onPick, onNow } = props;

  return (
    <ActionPanel>
      <ActionPanel.Section title="Move Through Time">
        <Action
          title={`Move Forward ${formatStep(stepMinutes)}`}
          icon={Icon.ArrowRight}
          shortcut={{
            macOS: { modifiers: ["cmd"], key: "arrowRight" },
            Windows: { modifiers: ["ctrl"], key: "arrowRight" },
          }}
          onAction={() => onMove(stepMinutes)}
        />
        <Action
          title={`Move Back ${formatStep(stepMinutes)}`}
          icon={Icon.ArrowLeft}
          shortcut={{
            macOS: { modifiers: ["cmd"], key: "arrowLeft" },
            Windows: { modifiers: ["ctrl"], key: "arrowLeft" },
          }}
          onAction={() => onMove(-stepMinutes)}
        />
        <Action
          title="Move Forward 1 Hour"
          icon={Icon.ArrowRightCircle}
          shortcut={{
            macOS: { modifiers: ["opt"], key: "arrowRight" },
            Windows: { modifiers: ["alt"], key: "arrowRight" },
          }}
          onAction={() => onMove(60)}
        />
        <Action
          title="Move Back 1 Hour"
          icon={Icon.ArrowLeftCircle}
          shortcut={{
            macOS: { modifiers: ["opt"], key: "arrowLeft" },
            Windows: { modifiers: ["alt"], key: "arrowLeft" },
          }}
          onAction={() => onMove(-60)}
        />
        <Action
          title="Move Forward 1 Day"
          icon={Icon.Calendar}
          shortcut={{
            macOS: { modifiers: ["cmd", "shift"], key: "arrowRight" },
            Windows: { modifiers: ["ctrl", "shift"], key: "arrowRight" },
          }}
          onAction={() => onMove(1_440)}
        />
        <Action
          title="Move Back 1 Day"
          icon={Icon.Calendar}
          shortcut={{
            macOS: { modifiers: ["cmd", "shift"], key: "arrowLeft" },
            Windows: { modifiers: ["ctrl", "shift"], key: "arrowLeft" },
          }}
          onAction={() => onMove(-1_440)}
        />
      </ActionPanel.Section>
      <ActionPanel.Section title="Jump">
        <Action
          title="Return to Now"
          icon={Icon.RotateClockwise}
          shortcut={Keyboard.Shortcut.Common.Refresh}
          onAction={onNow}
        />
        <Action.PickDate
          title="Pick Exact Moment"
          type={Action.PickDate.Type.DateTime}
          onChange={(date) => date && onPick(date)}
        />
      </ActionPanel.Section>
      <ActionPanel.Section>
        <Action.CopyToClipboard
          title="Copy All Local Times"
          content={clipboardSummary}
          shortcut={Keyboard.Shortcut.Common.Copy}
        />
        <Action title="Manage Cities" icon={Icon.Gear} onAction={openExtensionPreferences} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences.TimeTravel>();
  const cities = useMemo(() => parseCities(preferences.cities), [preferences.cities]);
  const stepMinutes = Number(preferences.stepMinutes) || 15;
  const use24Hour = preferences.clockFormat === "24";
  const anchorCity = cities[0];

  const [moment, setMoment] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [queryState, setQueryState] = useState<QueryState>("idle");
  const [isLive, setIsLive] = useState(true);
  const queryBase = useRef<Date | null>(null);
  const readings = useMemo(
    () =>
      cities.map((city) => ({
        city,
        ...getCitySnapshot(moment, city.timeZone),
        date: formatDateInZone(moment, city.timeZone),
        time: formatTimeInZone(moment, city.timeZone, use24Hour),
        timeZoneName: formatTimeZoneName(moment, city.timeZone),
      })),
    [cities, moment, use24Hour],
  );
  const clipboardSummary = useMemo(
    () => readings.map((reading) => `${reading.city.label}: ${reading.time}, ${reading.date}`).join("\n"),
    [readings],
  );

  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => setMoment(new Date()), 15_000);
    return () => clearInterval(timer);
  }, [isLive]);

  const move = useCallback((minutes: number) => {
    queryBase.current = null;
    setMoment((current) => shiftInstant(current, minutes));
    setQuery("");
    setQueryState("idle");
    setIsLive(false);
  }, []);

  const returnToNow = useCallback(() => {
    queryBase.current = null;
    setMoment(new Date());
    setQuery("");
    setQueryState("idle");
    setIsLive(true);
  }, []);

  const pickMoment = useCallback((date: Date) => {
    queryBase.current = null;
    setMoment(date);
    setQuery("");
    setQueryState("idle");
    setIsLive(false);
  }, []);

  const changeQuery = useCallback(
    (text: string) => {
      setQuery(text);
      if (!text.trim()) {
        queryBase.current = null;
        setQueryState("idle");
        return;
      }
      if (!anchorCity) {
        setQueryState("invalid");
        return;
      }

      const base = queryBase.current ?? moment;
      queryBase.current = base;
      const parsed = parseTimeQuery(text, base, anchorCity.timeZone);
      if (!parsed) {
        setQueryState("invalid");
        return;
      }

      setMoment(parsed);
      setQueryState("valid");
      setIsLive(text.trim().toLowerCase() === "now");
    },
    [anchorCity, moment],
  );

  if (!anchorCity) {
    return (
      <List searchBarPlaceholder="Configure at least one city to begin">
        <List.EmptyView
          title="No Valid Cities"
          description="Add Label|IANA timezone pairs in extension preferences."
          icon={Icon.Globe}
          actions={
            <ActionPanel>
              <Action title="Manage Cities" icon={Icon.Gear} onAction={openExtensionPreferences} />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  const anchorReading = `${formatDateInZone(moment, anchorCity.timeZone)} at ${formatTimeInZone(
    moment,
    anchorCity.timeZone,
    use24Hour,
  )}`;
  const sectionSubtitle =
    queryState === "invalid"
      ? "Keep typing: 14:30, tomorrow 9am, +3h, or -30m"
      : `${anchorReading} in ${anchorCity.label}`;

  return (
    <List
      filtering={false}
      navigationTitle="Time Travel"
      searchText={query}
      onSearchTextChange={changeQuery}
      searchBarPlaceholder={`Set time in ${anchorCity.label}: 14:30, tomorrow 9am, +3h`}
    >
      <List.Section title={isLive ? "NOW" : "TIME TRAVEL"} subtitle={sectionSubtitle}>
        {readings.map((reading, index) => {
          const { city } = reading;
          const dayDifference = describeDayOffset(reading.daySerial - readings[0].daySerial);

          return (
            <List.Item
              key={city.timeZone}
              icon={{
                source: reading.hour >= 7 && reading.hour < 19 ? Icon.Sun : Icon.Moon,
                tintColor: reading.isWorkingHour ? Color.Green : Color.SecondaryText,
              }}
              title={{ value: city.label, tooltip: reading.timeZoneName }}
              subtitle={`00  ${reading.timeline}  24`}
              keywords={[city.timeZone, reading.timeZoneName]}
              accessories={[
                ...(index === 0 ? [{ tag: { value: "Anchor", color: Color.Blue } }] : []),
                ...(dayDifference === "Same day" ? [] : [{ tag: dayDifference }]),
                {
                  tag: {
                    value: reading.isWorkingHour ? "Working hours" : "Outside work",
                    color: reading.isWorkingHour ? Color.Green : Color.SecondaryText,
                  },
                },
                {
                  text: reading.time,
                  tooltip: reading.date,
                },
              ]}
              actions={
                <TimeTravelActions
                  stepMinutes={stepMinutes}
                  clipboardSummary={clipboardSummary}
                  onMove={move}
                  onPick={pickMoment}
                  onNow={returnToNow}
                />
              }
            />
          );
        })}
      </List.Section>
    </List>
  );
}
