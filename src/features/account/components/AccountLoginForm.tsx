import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import type { Translations } from "@/i18n";
import {
  loginCodeSchema,
  loginEmailSchema,
  type LoginCodeFormValues,
  type LoginEmailFormValues,
} from "@/schema/auth";
import Input from "@/components/ui/Input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/InputOTP";
import MotionButton from "@/components/common/motion/MotionButton";
import AccountHeader from "./AccountHeader";

export type LoginStep = "email" | "code";

interface AccountLoginFormProps {
  t: Translations;
  reduced: boolean | null;
  step: LoginStep;
  email: string;
  error?: string | null;
  isSubmitting?: boolean;
  onRequestOtp: (email: string) => void;
  onVerifyOtp: (code: string) => void;
  onChangeEmail: () => void;
}

export default function AccountLoginForm({
  t,
  reduced,
  step,
  email,
  error,
  isSubmitting = false,
  onRequestOtp,
  onVerifyOtp,
  onChangeEmail,
}: AccountLoginFormProps) {
  const emailForm = useForm<LoginEmailFormValues>({
    resolver: zodResolver(loginEmailSchema),
    defaultValues: { email },
  });
  const codeForm = useForm<LoginCodeFormValues>({
    resolver: zodResolver(loginCodeSchema),
    defaultValues: { code: "" },
  });

  return (
    <div className="app-page">
      <div className="mx-auto max-w-screen-lg px-4 py-8 md:px-8 md:py-12">
        <AccountHeader t={t} reduced={reduced} />

        <motion.div
          className="max-w-2xl"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
            {step === "email" ? "Sign in with email" : "Enter login code"}
          </p>
          <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
            {step === "email"
              ? "We will send a one-time login code to your email. No password needed."
              : `Use the 6 digit code sent to ${email}. In local development, the backend prints the OTP in the terminal.`}
          </p>

          {step === "email" ? (
            <form
              className="mt-7 max-w-xl space-y-4"
              onSubmit={emailForm.handleSubmit((form) => onRequestOtp(form.email))}
            >
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={emailForm.formState.errors.email?.message}
                {...emailForm.register("email")}
              />
              <MotionButton
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SENDING..." : "SEND LOGIN CODE"}
              </MotionButton>
            </form>
          ) : (
              <form
                className="mt-7 max-w-xl space-y-4"
                onSubmit={codeForm.handleSubmit((form) => onVerifyOtp(form.code))}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">
                    Login Code
                  </label>
                  <InputOTP
                    maxLength={6}
                    value={codeForm.watch("code")}
                    onChange={(value) =>
                      codeForm.setValue("code", value, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    containerClassName="w-full"
                  >
                    <InputOTPGroup className="w-full">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} className="flex-1" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {codeForm.formState.errors.code?.message && (
                    <p className="text-xs text-red-500">
                      {codeForm.formState.errors.code.message}
                    </p>
                  )}
                </div>
                <MotionButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "VERIFYING..." : "VERIFY CODE"}
                </MotionButton>
              <button
                type="button"
                onClick={onChangeEmail}
                className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Change email
              </button>
            </form>
          )}

          {error && (
            <p className="mt-5 font-body text-sm text-red-500">
              {error}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
