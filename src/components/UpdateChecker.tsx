import { useEffect } from "react";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

type VersionPayload = {
  version?: string;
};

async function fetchDeployedVersion() {
  const response = await fetch("/version.json", {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as VersionPayload;
  return typeof payload.version === "string" ? payload.version : null;
}

export function UpdateChecker() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      return;
    }

    let cancelled = false;
    const versionKey = "focalipse:last-version-check";

    const checkForUpdates = async () => {
      try {
        const deployedVersion = await fetchDeployedVersion();
        if (cancelled || !deployedVersion) {
          return;
        }

        if (deployedVersion !== __APP_VERSION__) {
          const lastReloadVersion = sessionStorage.getItem(versionKey);
          if (lastReloadVersion !== deployedVersion) {
            sessionStorage.setItem(versionKey, deployedVersion);
            window.location.reload();
          }
        }
      } catch {
        // Silencioso: se a verificação falhar, o app continua a funcionar normalmente.
      }
    };

    void checkForUpdates();
    const intervalId = window.setInterval(checkForUpdates, CHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return null;
}
