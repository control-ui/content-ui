import { Route, Routes } from "react-router";
import { PageHome } from "./pages/PageHome";
import { MuiNavLink } from "@content-ui/md-mui/MuiComponents/MuiNavLink";
import { PageInput } from "./pages/PageInput";
import IcGitHub from "@mui/icons-material/GitHub";
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export default function App() {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        maxHeight: "100%",
      }}
    >
      <Box px={2} py={1} style={{ display: "flex", alignItems: "center", textAlign: "left" }}>
        <MuiNavLink href={"/"} exact>
          home
        </MuiNavLink>
        <Divider orientation={'vertical'} sx={{ mx: 0.5, height: "1.25rem" }} />
        <MuiNavLink href={"/input"}>input</MuiNavLink>
        <MuiNavLink
          href={"https://github.com/control-ui/content-ui"}
          target={"_blank"}
          rel="noreferrer noopener"
          sx={{ display: "flex", ml: "auto" }}
        >
          <IcGitHub fontSize={"small"}/>
        </MuiNavLink>
      </Box>
      <Box
        style={{ display: "flex", flexDirection: "column", overflow: "auto" }}
      >
        <Routes>
          <Route path={""} element={<PageHome />} />
          <Route path={"input"} element={<PageInput />} />
        </Routes>
      </Box>
    </Box>
  );
}
