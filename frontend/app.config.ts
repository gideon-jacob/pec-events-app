import type { ExpoConfig, ConfigContext } from "@expo/config";
// Read version from package.json to avoid hardcoded defaults in production
// Using require to ensure compatibility in the config runtime
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require("./package.json");

export default ({ config }: ConfigContext): ExpoConfig => {
  const isDevelopmentEnv = process.env.APP_ENV === "development";

  const plugins = [...(config.plugins ?? [])];

  if (isDevelopmentEnv) {
    plugins.push([
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ]);
  }

  const envVersion =
    process.env.APP_VERSION || process.env.EXPO_PUBLIC_APP_VERSION;

  const resolvedConfig: ExpoConfig = {
    ...config,
    // Ensure required fields are present for typing
    name: config.name ?? "pec-event-app",
    slug: config.slug ?? "pec-event-app",
    // Prefer explicitly provided version, then env, then package.json version
    version: config.version ?? envVersion ?? packageJson.version,
    plugins,
  };

  return resolvedConfig;
};
