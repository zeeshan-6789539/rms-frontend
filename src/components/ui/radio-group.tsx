import { cn } from "@/utils/cn";
import type { IRadioGroupProps } from "@/types/ui";

export const RadioGroup = ({
  id,
  name,
  options,
  value,
  onChange,
  disabled,
  className,
}: IRadioGroupProps) => (
  <div id={id} role="radiogroup" className={cn("flex h-11 flex-wrap items-center gap-5", className)}>
    {options.map((option) => (
      <label
        key={option.value}
        className={cn(
          "inline-flex cursor-pointer items-center gap-2 text-sm text-foreground",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          disabled={disabled}
          className="size-4 cursor-pointer accent-primary disabled:cursor-not-allowed"
        />
        {option.label}
      </label>
    ))}
  </div>
);
