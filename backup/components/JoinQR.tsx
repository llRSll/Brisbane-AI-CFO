"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type JoinQRProps = {
  url: string;
  size?: number;
  present?: boolean;
};

const JoinQR = ({ url, size = 220, present = false }: JoinQRProps) => {
  const [expanded, setExpanded] = useState(false);
  const qrSize = present ? 185 : size;
  const expandedSize = present ? 420 : 360;

  const handleExpand = () => setExpanded(true);
  const handleCollapse = useCallback(() => setExpanded(false), []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") handleCollapse();
    },
    [handleCollapse],
  );

  useEffect(() => {
    if (!expanded) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expanded, handleKeyDown]);

  return (
    <>
      <div className="relative flex h-full flex-col items-center justify-center gap-2">
        <div className="relative">
          <div
            className={`rounded-xl bg-white shadow-glow ${present ? "p-2.5" : "p-3"}`}
          >
            <QRCodeSVG value={url} size={qrSize} level="M" />
          </div>
          <button
            type="button"
            onClick={handleExpand}
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-stage-border bg-stage-panel text-white/70 shadow-lg transition hover:border-brand/50 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label="Expand QR code"
            title="Expand QR code"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M3 3a1 1 0 0 0-1 1v2.586a1 1 0 1 0 2 0V5h1.586a1 1 0 1 0 0-2H3ZM14.414 3H13a1 1 0 1 0 0 2h1.586V6.5a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-1.586ZM3 13.414V14a1 1 0 0 0 1 1h1.586a1 1 0 1 0 0-2H5v-1.586a1 1 0 1 0-2 0ZM17 13.414V14a1 1 0 0 0-1-1h-1.586a1 1 0 1 0 0 2H16v1.586a1 1 0 1 0 2 0v-1.586a1 1 0 0 0-1-1h-1.586Z" />
            </svg>
          </button>
        </div>
        <p className="font-medium text-white/80 text-sm">Scan to join</p>
        {!present ? (
          <p className="max-w-[220px] break-all text-center text-xs text-white/35">
            {url}
          </p>
        ) : null}
      </div>

      {expanded ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded QR code"
          onClick={handleCollapse}
        >
          <div
            className="flex flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rounded-2xl bg-white p-6 shadow-glow">
              <QRCodeSVG value={url} size={expandedSize} level="M" />
            </div>
            <p className="text-lg font-semibold text-white">Scan to join</p>
            <button
              type="button"
              onClick={handleCollapse}
              className="rounded-xl border border-stage-border px-5 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default JoinQR;
