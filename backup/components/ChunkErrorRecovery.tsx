"use client";

import { useEffect } from "react";

const CHUNK_ERROR_PATTERN =
  /Cannot read properties of undefined \(reading 'call'\)|Loading chunk|ChunkLoadError|Failed to fetch dynamically imported module/i;

const ChunkErrorRecovery = () => {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const message = event.message ?? "";
      if (!CHUNK_ERROR_PATTERN.test(message)) return;
      window.location.reload();
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason instanceof Error
            ? reason.message
            : "";
      if (!CHUNK_ERROR_PATTERN.test(message)) return;
      window.location.reload();
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
};

export default ChunkErrorRecovery;
