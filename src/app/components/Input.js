'use client';
import { useState,useEffect } from "react";
export default function Input({ type, name, placeholder, value, onChange,err,pattern }) {
  const [error, setError] = useState("");
  
  useEffect(() => {
   setError(err);
  }, [err]);

  return (
    <div className="form-group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        pattern={pattern}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
