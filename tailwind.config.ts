/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

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
  plugins: [],
};

export default withMT(config);
