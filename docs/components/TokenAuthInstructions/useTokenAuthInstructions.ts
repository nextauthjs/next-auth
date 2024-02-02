import { useState } from "react";

export enum Option {
  Email = "email",
  OTP = "otp",
}

export function useTokenAuthInstructions() {
  const [selected] = useState<Option>(Option.Email);

  return {
    selected,
  };
}
