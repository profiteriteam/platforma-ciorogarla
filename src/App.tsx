import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from "@suid/material";
import { darkTheme, lightTheme, commonTheme } from "./lib/theme";
import {useIsRouting, useLocation, useRoutes} from "@solidjs/router";
import {routes} from "./pages/routes";
import {createEffect, createMemo, Suspense} from "solid-js";
import {createPalette, Palette} from "@suid/material/styles/createPalette";
import Header from "./components/Header";
import {useAuth, useFirebaseApp} from "solid-firebase";
import {getAnalytics, logEvent} from "firebase/analytics";
import {getPerformance} from "firebase/performance";
import {getAuth} from "firebase/auth";
import {useA2HS} from "./hooks/useA2HS";


export default function App() {
	const app = useFirebaseApp();
	const analytics = import.meta.env.MODE === "production" ? getAnalytics(app) : null;
	if (import.meta.env.MODE === "production") {
		getPerformance(app);
	}
	useAuth(getAuth(app));
	const location = useLocation();
	const isRouting = useIsRouting();
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const Routes = useRoutes(routes);
	const palette = createMemo(() => createPalette(prefersDarkMode() ? darkTheme.palette as Palette : lightTheme.palette as Palette));
	// We use this hook to make sure that the prompt event is being hooked into the app
	useA2HS();

	const theme = createTheme({...commonTheme, palette});

	createEffect(() => {
		if (!isRouting() && analytics) {
			console.log("Log event");
			logEvent(analytics, "screen_view", {
				firebase_screen: location.pathname,
				firebase_screen_class: location.pathname,
			})
		}
	})

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme/>
			<Suspense fallback={<Header noNav title="Se incarca..." />}>
				<Routes />
			</Suspense>
		</ThemeProvider>
	)
}
