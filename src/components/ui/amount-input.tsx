"use client";

import { useState, useEffect } from "react";

export function AmountInput({
  value,
  defaultValue,
  name = "amount",
  placeholder = "0",
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
  const initialVal = value !== undefined ? value : (defaultValue !== undefined ? defaultValue : "0");
  const parsedInitial = initialVal !== "" && initialVal !== null ? initialVal.toString() : "0";
  
  const [displayAmount, setDisplayAmount] = useState(
    Number(parsedInitial).toLocaleString("id-ID")
  );
  const [rawAmount, setRawAmount] = useState(parsedInitial);

  useEffect(() => {
    const val = value !== undefined ? value : defaultValue;
    if (val !== undefined && val !== null && val !== "") {
      setRawAmount(val.toString());
      setDisplayAmount(Number(val).toLocaleString("id-ID"));
    } else {
      setRawAmount("0");
      setDisplayAmount("0");
    }
  }, [value, defaultValue]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const finalValue = numericValue || "0";
    setRawAmount(finalValue);
    setDisplayAmount(parseInt(finalValue, 10).toLocaleString("id-ID"));
    
    if (onChangeValue) {
      onChangeValue(finalValue === "0" ? "" : finalValue);
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
