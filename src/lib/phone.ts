import { isValidPhoneNumber } from "react-phone-number-input";
import * as yup from "yup";

export function isValidPhoneValue(value: string | null | undefined): boolean {
  if (!value?.trim()) return false;
  return isValidPhoneNumber(value);
}

/** Optional phone — empty is allowed; non-empty must be valid E.164. */
export function yupPhoneOptional() {
  return yup
    .string()
    .default("")
    .test("valid-phone", "Enter a valid phone number", (value) => {
      if (!value?.trim()) return true;
      return isValidPhoneNumber(value);
    });
}

/** Required phone with E.164 validation. */
export function yupPhoneRequired(message = "Phone number is required") {
  return yup
    .string()
    .required(message)
    .test("valid-phone", "Enter a valid phone number", (value) =>
      Boolean(value && isValidPhoneNumber(value)),
    );
}
