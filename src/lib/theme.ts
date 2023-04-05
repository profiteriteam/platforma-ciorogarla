import { ThemeInput } from "@suid/material/styles/createTheme";

export const commonTheme: Partial<ThemeInput> = {
	shape: {
		borderRadius: 12
	},
	typography: {
		h1: {
			fontSize: "4rem",
		}
	},
	components: {
		MuiButton: {
			defaultProps: {
				variant: "contained",
				color: "primary",
			}
		},
		MuiPaper: {
			defaultProps: {
				elevation: 0
			}
		},
		MuiContainer: {
			defaultProps: {
				maxWidth: "md"
			}
		},
		MuiStack: {
			defaultProps: {
				spacing: 2
			}
		}
	}
}

export const lightTheme: Partial<ThemeInput> = {
	palette: {
		mode: "light",
		primary: {
			main: "#006d3f"
		},
		secondary: {
			main: "#4f6354"
		},
		background: {
			default: "#fbfdf8",
			paper: "#d1e8d5"
		},
	}
}

export const darkTheme: Partial<ThemeInput> = {
	palette: {
		mode: "dark",
		primary: {
			main: "#79da9e",
		},
		secondary: {
			main: "#b5ccba",
		},
		background: {
			default: "#191c1a",
			paper: "#213528"
		},
	}
};
