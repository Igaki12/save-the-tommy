import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const theme = extendTheme({
  config,
  components: {
    Button: {
      baseStyle: {
        _active: {
          bg: "#0b0f1c",
          color: "whiteAlpha.900"
        },
        _focusVisible: {
          boxShadow: "0 0 0 2px rgba(38, 246, 255, 0.6)"
        }
      }
    }
  },
  styles: {
    global: {
      ":root": {
        "--neon-pink": "#ff2bd1",
        "--neon-cyan": "#26f6ff",
        "--ink": "#12131a",
        "--paper": "#f7f1e8",
        "--seal": "#c91f2f"
      },
      "html, body": {
        height: "100%",
        background: "#0c0f1f",
        color: "#f7f7ff",
        fontFamily: "\"A-OTF Jun Pro\", \"Hiragino Kaku Gothic ProN\", \"Yu Gothic\", sans-serif"
      },
      "*": {
        boxSizing: "border-box"
      }
    }
  },
  fonts: {
    heading: "\"A-OTF Jun Pro\", \"Hiragino Kaku Gothic ProN\", \"Yu Gothic\", sans-serif",
    body: "\"A-OTF Jun Pro\", \"Hiragino Kaku Gothic ProN\", \"Yu Gothic\", sans-serif"
  }
});

export default theme;
