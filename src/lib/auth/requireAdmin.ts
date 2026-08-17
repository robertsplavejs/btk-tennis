import "server-only";

import { getCurrentIdentity } from "@/lib/auth/getCurrentIdentity";

export async function requireAdmin() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    throw new Error(
      "Šīs darbības veikšanai nepieciešams ielogoties."
    );
  }

  if (!identity.isAdmin) {
    throw new Error(
      "Šo darbību drīkst veikt tikai administrators."
    );
  }

  return {
    user: identity.authUser,
    identity,
    player: identity.playerId
      ? {
          id: identity.playerId,
          full_name: identity.fullName,
          is_admin: true,
        }
      : null,
  };
}
