import React from "react";
import { TextField } from "@mui/material";

const InputField = (props) => {
  const { 
    required, 
    id, 
    type, 
    name, 
    label, 
    fullWidth, 
    value, 
    onChange, 
    inputProps, 
    disabled 
  } = props;
  
  return (
    <div>
      <TextField
        required={required !== false}
        autoComplete="on"
        id={id}
        type={type || "text"}
        name={name}
        label={label}
        fullWidth={fullWidth}
        variant="outlined"
        value={value || ""}
        onChange={onChange}
        InputProps={inputProps}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
