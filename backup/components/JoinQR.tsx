"use client";

import { QRCodeSVG } from "qrcode.react";

type JoinQRProps = {
  url: string;
  size?: number;
  present?: boolean;
};

const JoinQR = ({ url, size = 220, present = false }: JoinQRProps) => {
  const qrSize = present ? 140 : size;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <div className="rounded-xl bg-white p-3 shadow-glow">
        <QRCodeSVG value={url} size={qrSize} level="M" />
      </div>
      <p className={`font-medium text-white/80 ${present ? "text-sm" : "text-sm"}`}>
        Scan to join
      </p>
      {!present ? (
        <p className="max-w-[220px] break-all text-center text-xs text-white/35">
          {url}
        </p>
      ) : null}
    </div>
  );
};

export default JoinQR;
