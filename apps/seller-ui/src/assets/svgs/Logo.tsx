import * as React from "react";
const Logo = (props:any) => (
  <svg
    width="70px"
    height="70px"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className="text-white"
  >
    <path
      d="M8 18C19.9545 18 20.9173 7.82917 20.9935 2.99666C21.0023 2.44444 20.54 1.99901 19.9878 2.00915C3 2.32115 3 10.5568 3 18V22"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 18C3 18 3 12 11 11"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Logo;
