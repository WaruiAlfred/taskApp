import { extendTheme } from "native-base";

const secondary = {
  50: "#f2ebf8",
  100: "#e4d7f1",
  200: "#d7c3e9",
  300: "#caafe2",
  400: "#bd9cdb",
  500: "#af88d4",
  600: "#7a38b7",
  700: "#9560c5",
  800: "#874cbe",
  900: "#7a38b7",
};

const primary = {
  50: "#e6f4ea",
  100: "#cce8d5",
  200: "#b3ddc1",
  300: "#99d2ac",
  400: "#80c797",
  500: "#67bb82",
  600: "#018e2f",
  700: "#34a559",
  800: "#1a9944",
  900: "#018e2f",
};

const theme = extendTheme({
  colors: {
    // Add new color
    primary,
    secondary,

    amber: {
      400: "#d97706",
    },
  },
  components: {
    Buttton: {
      solid: {
        bg: "red",
      },
    },
  },
  // fonts: {
  //   heading: "raleway-regular",
  //   body: "mont-regular",
  //   mono: "mont-regular",
  //   montbold: "mont-bold",
  //   ralewaybold: "raleway-bold",
  // },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "light",
  },
});

export default theme;
