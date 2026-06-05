import "server-only";

import { cookies } from "next/headers";

const ATTENDEE_COOKIE = "attendee_id";
const MAX_AGE = 60 * 60 * 24 * 365;

export const getAttendeeId = async (): Promise<string | null> => {
  const store = await cookies();
  return store.get(ATTENDEE_COOKIE)?.value ?? null;
};

export const setAttendeeId = async (attendeeId: string): Promise<void> => {
  const store = await cookies();
  store.set(ATTENDEE_COOKIE, attendeeId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
};
