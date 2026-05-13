import {
  useState,
  useCallback,
} from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  EOpenMode,
  AppContainer,
} from "./components/AppContainer";
import {
  EThemeName,
  EThemeSize,
  ThemeProvider,
} from "./components/ThemeProvider";
import {ListPage} from "./pages/ListPage";
import {TimelinePage} from "./pages/TimelinePage";
import {WelcomePage} from "./pages/WelcomePage";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import HomeIcon from "@mui/icons-material/Home";
import LightModeIcon from "@mui/icons-material/LightMode";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TimelineIcon from "@mui/icons-material/Timeline";
import logo from "./assets/logo.png";

interface IAppShellProps {
  themeName: EThemeName;
  onToggleTheme: () => void;
}

const AppShell = ({themeName, onToggleTheme}: IAppShellProps) => {

  const isDark = themeName === EThemeName.MUI9_DARK;
  const navigate = useNavigate();
  const {pathname} = useLocation();
  return (
    <AppContainer
      logoSquareWhite={logo}
      logoSquareBlack={logo}
      logoLandscapeWhite={logo}
      logoLandscapeBlack={logo}
      appTitle={ROUTE_TITLES[pathname] ?? "Events App"}
      initialOpenMode={EOpenMode.EXPANDED}
      showMinimizedOption
      menuItems={[
        {title: "Welcome", icon: <HomeIcon/>, menuId: "/", onClick: () => navigate("/")},
        {title: "Events List", icon: <TableRowsIcon/>, menuId: "/list", onClick: () => navigate("/list")},
        {title: "Timeline", icon: <TimelineIcon/>, menuId: "/timeline", onClick: () => navigate("/timeline")},
      ]}
      selectedMenuId={pathname}
      notificationIcons={[
        {
          label: isDark ? "Switch to light mode" : "Switch to dark mode",
          icon: isDark ? <LightModeIcon/> : <DarkModeIcon/>,
          onClick: onToggleTheme,
        },
      ]}
    >
      <Routes>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="/list" element={<ListPage/>}/>
        <Route path="/timeline" element={<TimelinePage/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </AppContainer>
  );

};
const LS_THEME_KEY = "app-theme-mode";

const App = () => {

  const [themeName, setThemeName] = useState<EThemeName>(
    () => (localStorage.getItem(LS_THEME_KEY) as EThemeName) ?? EThemeName.MUI9_LIGHT
  );
  const toggleTheme = useCallback(() => {
    setThemeName(prev => {
      const next = prev === EThemeName.MUI9_DARK ? EThemeName.MUI9_LIGHT : EThemeName.MUI9_DARK;
      localStorage.setItem(LS_THEME_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeProvider themeName={themeName} themeSize={EThemeSize.SMALL}>
      <BrowserRouter>
        <AppShell
          themeName={themeName}
          onToggleTheme={toggleTheme}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

const ROUTE_TITLES: Record<string, string> = {
  "/": "Welcome",
  "/list": "Events List",
  "/timeline": "Timeline",
};
