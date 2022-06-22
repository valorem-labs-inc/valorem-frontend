import { get } from "lodash";

export default function getConfigValue(key: string, defaultValue = ""): string {
  const context = process.env[process.env.NODE_ENV];
  if (!context) return defaultValue;
  const value = get(context, key);
  return value || defaultValue;
}
