import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useId, useRef, useState } from "react";
import { EASE_EXPO } from "@/lib/hooks";

type Status = "idle" | "sending" | "done" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface SignupFormProps {
  /** `hero` sits on a light map ground; `night` sits in the closing band. */
  tone?: "hero" | "night";
  idPrefix?: string;
  className?: string;
}

/**
 * Prototype signup. It validates, waits 700 ms and shows the success state.
 * Nothing is sent anywhere.
 */
export function SignupForm({ tone = "hero", idPrefix, className = "" }: SignupFormProps) {
  const autoId = useId();
  const base = idPrefix ?? autoId;
  const emailId = `${base}-email`;
  const errorId = `${base}-error`;
  const betaId = `${base}-beta`;
  const [email, setEmail] = useState("");
  const [beta, setBeta] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setStatus("error");
      inputRef.current?.focus();
      return;
    }
    setStatus("sending");
    window.setTimeout(() => setStatus("done"), 700);
  };

  const reset = () => {
    setStatus("idle");
    setEmail("");
    setBeta(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const onNight = tone === "night";
  const fieldBg = onNight ? "bg-night-2" : "bg-surface";

  return (
    <div className={className}>
      <AnimatePresence initial={false} mode="wait">
        {status === "done" ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-xl flex-col items-start gap-3 rounded-2xl border border-rule bg-card px-5 py-5"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0.4, y: 8 }}
            key="done"
            transition={{ duration: 0.45, ease: EASE_EXPO }}
          >
            <p className="flex items-start gap-3 font-display text-xl leading-snug font-medium text-fg">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-data text-ground">
                <Check aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              </span>
              You&rsquo;re on the list. We&rsquo;ll email you once, at launch.
            </p>
            <button className="min-h-11 text-sm font-semibold underline underline-offset-4" onClick={reset} type="button">
              Use a different email
            </button>
          </motion.div>
        ) : (
          <motion.form
            animate={{ opacity: 1 }}
            className="max-w-xl"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            key="form"
            noValidate
            onSubmit={submit}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-bold tracking-wide text-fg" htmlFor={emailId}>
              Email for the launch
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                aria-describedby={status === "error" ? errorId : undefined}
                aria-invalid={status === "error"}
                autoComplete="email"
                className={`min-h-12 w-full flex-1 rounded-xl border px-4 text-base text-fg placeholder:text-fg-muted/70 ${fieldBg} ${
                  status === "error" ? "border-amber" : "border-rule"
                }`}
                id={emailId}
                inputMode="email"
                name="email"
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@example.com"
                ref={inputRef}
                type="email"
                value={email}
              />
              <motion.button
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-data px-5 text-base font-bold text-ground"
                disabled={status === "sending"}
                type="submit"
                whileHover={{ y: -1 }}
                whileTap={{ y: 1 }}
              >
                {status === "sending" ? (
                  <>
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Sending
                  </>
                ) : (
                  "Get the launch email"
                )}
              </motion.button>
            </div>
            {status === "error" ? (
              <p className="mt-2 text-sm font-semibold text-fg" id={errorId} role="alert">
                Enter an email like name@example.com
              </p>
            ) : null}
            <label className="mt-3 flex min-h-11 items-center gap-3 text-sm text-fg" htmlFor={betaId}>
              <input
                checked={beta}
                className="h-5 w-5 shrink-0 accent-[var(--data)]"
                id={betaId}
                name="beta"
                onChange={(event) => setBeta(event.target.checked)}
                type="checkbox"
              />
              Also invite me to the beta
            </label>
            <p className="mt-2 text-sm text-fg-muted">
              One email at launch. The beta invite only if you ask. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
