"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

const initialState: LoginState = { error: null };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-4">
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoFocus
        required
        className="border border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3 font-sans text-lg text-[#e8e3dc] outline-none placeholder:text-[#4a4a4a] focus:border-[#3a3a3a]"
      />
      <button
        type="submit"
        disabled={pending}
        className="border border-[#2a2a2a] px-4 py-3 font-sans text-sm uppercase tracking-[0.2em] text-[#e8e3dc] transition-colors hover:bg-[#151515] disabled:opacity-50"
      >
        {pending ? "Checking…" : "Enter"}
      </button>
      {state.error && <p className="font-sans text-[#c98a7a]">{state.error}</p>}
    </form>
  );
}
