import React from "react";
import {
    contentUIDecorators,
    ContentLeafsProvider,
    LeafsRenderMapping,
    ContentLeafsNodeMapping,
    ContentRenderComponents, ContentLeafMatchParams,
} from "@content-ui/react/ContentLeaf";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { renderMapping } from "@content-ui/md-mui/LeafsMarkdown";
import { customTheme } from "./theme";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CustomCodeMirror } from "./components/CustomCodeMirror";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const themes = customTheme();

const contentUIMapping: LeafsRenderMapping<
  ContentLeafsNodeMapping,
  ContentRenderComponents,
  ContentLeafMatchParams
> = {
  ...renderMapping,
  leafs: {
    ...renderMapping.leafs,
  },
  components: {
    ...renderMapping.components,
    CodeMirror: CustomCodeMirror,
  },
};

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes.dark}>
        <CssBaseline />
        <BrowserRouter>
          <ContentLeafsProvider
            deco={contentUIDecorators}
            renderMap={contentUIMapping}
          >
            <App />
          </ContentLeafsProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
