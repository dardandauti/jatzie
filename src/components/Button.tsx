import React from "react";
import "../styles/button.css";

export const Button = (
  props: { fullWidth?: boolean } & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  const { fullWidth = false, children, ...rest } = props;
  const className = [fullWidth ? "fullWidth" : ""].join(" ").trim();
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};

export default Button;
