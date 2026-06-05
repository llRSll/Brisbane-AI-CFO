"use client";

import { QRCodeSVG } from "qrcode.react";

type JoinQRProps = {
  url: string;
  size?: number;
};

const JoinQR = ({ url, size = 220 }: JoinQRProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl border border-stage-border bg-white p-4 shadow-sm">
        <QRCodeSVG value={url} size={size} level="M" />
      </div>
      <p className="text-sm font-medium text-ink-muted">Scan to join</p>
      <p className="break-all text-center text-xs text-ink-faint">{url}</p>
    </div>
  );
};

export default JoinQR;
