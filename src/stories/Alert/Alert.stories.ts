import type { Meta, StoryObj } from "@storybook/svelte";
import Alert from "$lib/components/Alert.svelte";
import AlertView from "./AlertView.svelte";

const meta: Meta = {
	component: Alert,
	title: "Alert",
}

export default meta;

export const Regular: StoryObj = {
	render: ({ ...args }) => ({
		Component: AlertView,
		props: args,
	}),
	args: {
		icon: "info"
	}
}

export const Outline: StoryObj = {
	render: ({ ...args }) => ({
		Component: AlertView,
		props: args,
	}),
	args: {
		icon: "warning",
		outline: true,
	}
}
