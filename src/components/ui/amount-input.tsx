"use client";

import { useState, useEffect } from "react";

export function AmountInput({
  value,
  defaultValue,
  name = "amount",
  placeholder = "50.000",
  required = true,
  autoFocus = false,
  onChangeValue,
  className = "w-full rounded-xl pl-11 pr-4 py-3.5 text-sm input-base font-medium",
}: {
  value?: string | number;
  defaultValue?: string | number;
  name?: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  onChangeValue?: (val: string) => void;
  className?: string;
}) {
  const [displayAmount, setDisplayAmount] = useState("");
  const [rawAmount, setRawAmount] = useState("");

  useEffect(() => {
    const val = value !== undefined ? value : defaultValue;
    if (val !== undefined && val !== null && val !== "") {
      setRawAmount(val.toString());
      setDisplayAmount(Number(val).toLocaleString("id-ID"));
    } else if (value === "" || value === 0) {
      setRawAmount("");
      setDisplayAmount("");
    }
  }, [value, defaultValue]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setRawAmount(numericValue);
    if (numericValue) {
      setDisplayAmount(parseInt(numericValue, 10).toLocaleString("id-ID"));
    } else {
      setDisplayAmount("");
    }
    if (onChangeValue) {
      onChangeValue(numericValue);
    }
  };

  return (
    <>
      <input type="hidden" name={name} value={rawAmount} />
      <input
        type="text"
        inputMode="numeric"
        required={required}
        autoFocus={autoFocus}
        value={displayAmount}
        onChange={handleAmountChange}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
    </>
  );
}
