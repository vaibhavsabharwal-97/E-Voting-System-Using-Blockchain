import React from "react";

const DatePicker = (props) => {
  const { title, name, max, value, onChange } = props;
  
  const handleChange = (e) => {
    if (onChange) {
      onChange({
        target: {
          name: name,
          value: e.target.value
        }
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <label>{title}</label>&nbsp;
      <input 
        type="date" 
        name={name} 
        max={max}
        value={value || ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default DatePicker;
