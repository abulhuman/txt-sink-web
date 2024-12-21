/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import { mtConfig } from "@material-tailwind/react";

const config: Config =
{
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['__Inter_e66fe9', '__Inter_Fallback_e66fe9', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [mtConfig],
};

export default config;
