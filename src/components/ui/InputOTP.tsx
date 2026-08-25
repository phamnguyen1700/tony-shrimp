import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import {
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { cn } from "@/lib/config/utils";

const InputOTP = forwardRef<
  ElementRef<typeof OTPInput>,
  ComponentPropsWithoutRef<typeof OTPInput>
>(function InputOTP({ className, containerClassName, ...props }, ref) {
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
});

const InputOTPGroup = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function InputOTPGroup({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex items-center", className)} {...props} />;
  },
);

const InputOTPSlot = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & { index: number }
>(function InputOTPSlot({ index, className, ...props }, ref) {
  const inputOTPContext = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-12 w-11 items-center justify-center border-y border-r border-border bg-card font-mono-label text-sm text-foreground transition-all first:rounded-l-[var(--radius)] first:border-l last:rounded-r-[var(--radius)]",
        isActive && "z-10 border-ring ring-1 ring-ring",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});

const InputOTPSeparator = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  function InputOTPSeparator(props, ref) {
    return (
      <div ref={ref} role="separator" {...props}>
        <Dot className="h-4 w-4 text-muted-foreground" />
      </div>
    );
  },
);

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

