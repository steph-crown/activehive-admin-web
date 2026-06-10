import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { getCountryCallingCode } from "react-phone-number-input";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref" | "type"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const ReactPhoneNumberInput = RPNInput.default;

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof ReactPhoneNumberInput>,
  PhoneInputProps
>(({ className, onChange, value, disabled, readOnly, ...props }, ref) => {
  const isDisabled = disabled || readOnly;

  return (
    <ReactPhoneNumberInput
      ref={ref}
      className={cn("flex w-full", className)}
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={InputComponent}
      smartCaret={false}
      international
      countryCallingCodeEditable={false}
      defaultCountry="NG"
      value={(value as RPNInput.Value) || undefined}
      onChange={(next) => onChange?.(next ?? ("" as RPNInput.Value))}
      disabled={isDisabled}
      {...props}
    />
  );
});
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, readOnly, ...props }, ref) => (
  <Input
    className={cn(
      "rounded-s-none border-s-0 shadow-none focus-visible:z-10",
      readOnly && "bg-muted",
      className,
    )}
    readOnly={readOnly}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

function CountrySelect({
  disabled,
  value,
  options,
  onChange,
}: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        getCountryCallingCode(option.value).includes(query),
    );
  }, [options, search]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 shrink-0 gap-1 rounded-e-none rounded-s-md border-r-0 px-3 shadow-xs focus:z-10"
          disabled={disabled}
          aria-label="Select country code"
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0"
        align="start"
        portalled={false}
      >
        <div className="border-b p-2">
          <Input
            placeholder="Search country..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9"
          />
        </div>
        <div className="max-h-72 touch-pan-y overflow-y-auto overscroll-contain p-1">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground px-3 py-6 text-center text-sm">
              No country found.
            </p>
          ) : (
            filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm outline-hidden",
                  option.value === value && "bg-accent",
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <FlagComponent
                  country={option.value}
                  countryName={option.label}
                />
                <span className="flex-1 text-left">{option.label}</span>
                <span className="text-muted-foreground text-xs">
                  +{getCountryCallingCode(option.value)}
                </span>
                {option.value === value ? (
                  <Check className="size-4 shrink-0 opacity-70" />
                ) : (
                  <span className="size-4 shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function FlagComponent({ country, countryName }: RPNInput.FlagProps) {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 shrink-0 overflow-hidden rounded-sm [&_svg]:size-full!">
      {Flag ? <Flag title={countryName} /> : null}
    </span>
  );
}

export { PhoneInput };
