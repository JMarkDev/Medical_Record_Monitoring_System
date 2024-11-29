/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      // colors: {
      //   main: "#3B7A57",
      //   main_hover: "#255e35",
      //   yellow: "#de8f2f",
      //   yellow_hover: "#c77b1e",
      // },
      colors: {
        primary: "#27C690",
        primary_hover: "#11ba81",
        secondary: "#9CB2AA",
        tertiary: "#B2D8CB",
        bgprimary: "#FAFCFF",
        bgsecondary: "#E3FAFB",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("flowbite/plugin")],
};
