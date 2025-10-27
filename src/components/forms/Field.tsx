"use client";

import React from "react";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Field: React.FC<FieldProps> = ({ label, error, ...props }) => {
  return (
    <div className="field">
      <label className="field-label" htmlFor={props.id ?? props.name}>
        {label}
      </label>
      <input className={`field-input ${error ? "has-error" : ""}`} {...props} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default Field;
