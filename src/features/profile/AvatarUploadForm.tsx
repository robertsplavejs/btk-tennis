"use client";

import { Camera } from "lucide-react";
import { useActionState, useRef } from "react";

import {
  updateProfileAvatar,
  type UpdateAvatarState,
} from "@/app/profile/actions";

const initialState: UpdateAvatarState = { status: "idle", message: "" };

export function AvatarUploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(updateProfileAvatar, initialState);

  return (
    <form ref={formRef} action={formAction} style={{ position: "absolute", top: 94, left: "calc(50% + 24px)", zIndex: 3 }}>
      <label
        aria-label={pending ? "Saglabā profila bildi" : "Mainīt profila bildi"}
        title={pending ? "Saglabā..." : "Mainīt bildi"}
        style={{ display: "grid", width: 27, height: 27, cursor: pending ? "wait" : "pointer", placeItems: "center", border: "1.5px solid #fff", borderRadius: "50%", color: "#374151", background: pending ? "#e5e7eb" : "rgba(255,255,255,.94)", boxShadow: "0 3px 9px rgba(0,0,0,.2)" }}
      >
        <Camera size={12} strokeWidth={1.9} aria-hidden="true" />
        <input
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending}
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}
          onChange={(event) => {
            if (event.currentTarget.files?.length) formRef.current?.requestSubmit();
          }}
        />
      </label>
      {state.message ? (
        <p aria-live="polite" style={{ position: "absolute", top: 42, left: "50%", width: 190, margin: 0, padding: "5px 8px", transform: "translateX(-50%)", borderRadius: 8, color: state.status === "error" ? "#fecaca" : "rgba(255,255,255,.8)", background: "rgba(5,13,20,.88)", fontSize: 9, textAlign: "center" }}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
