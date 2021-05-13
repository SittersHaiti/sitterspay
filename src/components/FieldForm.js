import React from 'react';

const FieldForm = ({label, id, placeholder, autoComplete, onChange, value, type, required}) => (
  <div className="FormRow">
  <label htmlFor={id} className="FormRowLabel">
    {label}
  </label>
  <input
    className="FormRowInput"
    id={id}
    type={type}
    placeholder={placeholder}
    required={required}
    autoComplete={autoComplete}
    value={value}
    onChange={onChange}
  />
</div>);

export default FieldForm;


