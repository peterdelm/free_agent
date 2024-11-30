export default {
  expo: {
    name: "Free Agent",
    slug: "free_agent",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/fa-icon.png",
    userInterfaceStyle: "light",
    scheme: "free_agent",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "freeAgentiosBundle",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/fa-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: "AIzaSyDof22OsH_HsjBC9sS9NnsAC3o9IfVfqmA",
        },
      },
      package: "com.cabbageconundrum.free_agent",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "0fea66a4-f931-4b41-a5d3-8be4d1bcd6e7",
      },
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      "expo-secure-store",
      "expo-router",
    ],
    sdkVersion: "50.0.0",
  },
};
