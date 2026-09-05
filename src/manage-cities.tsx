import { Action, ActionPanel, Color, Icon, List, Toast, showToast } from "@raycast/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CITIES,
  addCity,
  formatTimeZoneIdentifier,
  getCityCatalog,
  makeAnchor,
  removeCity,
} from "./cities";
import { loadCities, saveCities } from "./city-storage";
import type { City } from "./cities";

interface ManageCitiesProps {
  onChange?: (cities: City[]) => void;
}

export function ManageCities({ onChange }: ManageCitiesProps) {
  const [cities, setCities] = useState<City[]>(DEFAULT_CITIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isPersisting = useRef(false);
  const catalog = getCityCatalog();
  const selectedTimeZones = useMemo(() => new Set(cities.map((city) => city.timeZone)), [cities]);
  const availableCities = useMemo(
    () => catalog.filter((option) => !selectedTimeZones.has(option.timeZone)),
    [catalog, selectedTimeZones],
  );

  useEffect(() => {
    let isActive = true;
    loadCities()
      .then((storedCities) => {
        if (isActive) setCities(storedCities);
      })
      .catch(() => showToast(Toast.Style.Failure, "Could not load your cities"))
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const persist = useCallback(
    async (nextCities: City[], successTitle: string) => {
      if (isPersisting.current) return;

      isPersisting.current = true;
      setIsSaving(true);
      const previousCities = cities;
      setCities(nextCities);
      onChange?.(nextCities);

      try {
        await saveCities(nextCities);
        await showToast(Toast.Style.Success, successTitle);
      } catch {
        setCities(previousCities);
        onChange?.(previousCities);
        await showToast(Toast.Style.Failure, "Could not save that change");
      } finally {
        isPersisting.current = false;
        setIsSaving(false);
      }
    },
    [cities, onChange],
  );

  const remove = useCallback(
    async (city: City) => {
      const nextCities = removeCity(cities, city.timeZone);
      if (nextCities === cities) {
        await showToast(Toast.Style.Failure, "Keep at least one city");
        return;
      }
      await persist(nextCities, `Removed ${city.label}`);
    },
    [cities, persist],
  );

  if (isLoading) {
    return <List isLoading navigationTitle="Manage Cities" searchBarPlaceholder="Loading cities…" />;
  }

  return (
    <List isLoading={isSaving} navigationTitle="Manage Cities" searchBarPlaceholder="Search cities…">
      <List.Section title="Your Cities" subtitle="The first city is the time-search anchor">
        {cities.map((city, index) => (
          <List.Item
            key={city.timeZone}
            icon={index === 0 ? Icon.StarCircle : Icon.CheckCircle}
            title={city.label}
            subtitle={formatTimeZoneIdentifier(city.timeZone)}
            accessories={index === 0 ? [{ tag: { value: "Anchor", color: Color.Blue } }] : []}
            actions={
              <ActionPanel>
                <Action
                  title="Remove City"
                  icon={Icon.XMarkCircle}
                  style={Action.Style.Destructive}
                  onAction={() => remove(city)}
                />
                {index > 0 ? (
                  <Action
                    title="Make Time-Search Anchor"
                    icon={Icon.StarCircle}
                    shortcut={{
                      macOS: { modifiers: ["cmd", "shift"], key: "enter" },
                      Windows: { modifiers: ["ctrl", "shift"], key: "enter" },
                    }}
                    onAction={() =>
                      persist(makeAnchor(cities, city.timeZone), `${city.label} is now the anchor`)
                    }
                  />
                ) : null}
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      <List.Section title="Add a City" subtitle={`${availableCities.length} time zones`}>
        {availableCities.map((city) => (
          <List.Item
            key={city.timeZone}
            icon={Icon.PlusCircle}
            title={city.label}
            subtitle={formatTimeZoneIdentifier(city.timeZone)}
            keywords={city.keywords}
            actions={
              <ActionPanel>
                <Action
                  title="Add City"
                  icon={Icon.PlusCircle}
                  onAction={() => persist(addCity(cities, city), `Added ${city.label}`)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

export default function Command() {
  return <ManageCities />;
}
