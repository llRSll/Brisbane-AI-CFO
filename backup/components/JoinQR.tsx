"use client";

import { QRCodeSVG } from "qrcode.react";

type JoinQRProps = {
  url: string;
  size?: number;
};

const JoinQR = ({ url, size = 220 }: JoinQRProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <QRCodeSVG value={url} size={size} level="M" />
      </div>
      <p className="text-sm text-white/60">Scan to join</p>
      <p className="break-all text-center text-xs text-white/40">{url}</p>
    </div>
  );
};

export default JoinQR;
