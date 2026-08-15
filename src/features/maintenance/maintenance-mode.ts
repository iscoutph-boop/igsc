const TRUE_VALUES = new Set(["1", "true", "yes", "on", "enabled", "maintenance"]);

function normalize(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isMaintenanceModeEnabled(...values: unknown[]) {
  if (values.some((value) => normalize(value) === "test")) return false;

  return values.some((value) => {
    if (value === true) return true;
    return TRUE_VALUES.has(normalize(value));
  });
}

export function getMaintenanceAwareTitle(normalTitle: string, ...maintenanceSignals: unknown[]) {
  return isMaintenanceModeEnabled(...maintenanceSignals)
    ? "Website Update | IG Sabroso Construction"
    : normalTitle;
}
