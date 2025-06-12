"use client";

import React from "react";

export const TextInput = ({ id, labelText, onChange, value }: any) => {
  return (
    <div>
      <label htmlFor={id}>{labelText}</label>
      <input type="text" id={id} onChange={onChange} value={value} />
    </div>
  );
};
