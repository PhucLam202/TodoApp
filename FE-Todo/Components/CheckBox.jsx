import React from "react";
import ICON from "./SVG/ICON";

const CheckBox = ({ toggleCompleted, todo }) => {
  return (
    <label className="container">
      <input 
        checked={todo.completed || false}
        type="checkbox" 
        onChange={() => toggleCompleted(todo.id)}
      />
      <ICON />
    </label>
  );
};

export default CheckBox;
