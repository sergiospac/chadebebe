import { useState } from "react";

export const useForm = <T extends Record<string, any>>(initial: T) => {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<keyof T, string | undefined>>({} as Record<keyof T, string | undefined>);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setValues(initial);
    setErrors({} as Record<keyof T, string | undefined>);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    reset,
  };
};
