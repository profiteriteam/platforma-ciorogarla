import {RouteDataFuncArgs, useRouteData} from "@solidjs/router";
import Markdown from "solid-markdown";
import {createEffect, createResource, For, Show} from "solid-js";
import Header from "../../components/Header";
import {sanityClient, urlFor} from "../../lib/sanity";
import {Article} from "../../types/SanitySchema";
import {Chip, Container, Link, Typography, useTheme} from "@suid/material";

import ErrorIcon from "@suid/icons-material/Error";

export default function ArticlePage() {
	const data = useRouteData<typeof ArticleGetData>();
	const theme = useTheme();
	const windowWidth = window.innerWidth;

	return (
		<>
			<Header
				title={data()?.title ?? "Articol"}
				//@ts-ignore: Metadata is there but not specified
				themeColor={data()?.cover?.asset?.metadata?.palette?.dominant.background}
				//@ts-ignore: Metadata is there but not specified
				color={data()?.cover?.asset?.metadata?.palette?.dominant.title}
				back
				noHeading
			/>
			<Show when={data()?.cover}>
				<img
					src={urlFor(data()?.cover).width(windowWidth * 2).height(256).url()}
					width={windowWidth}
					height="128px"
					style={{
						"border-bottom-left-radius": theme.shape.borderRadius + "px",
						"border-bottom-right-radius": theme.shape.borderRadius + "px",
					}}
				/>
			</Show>
			<Container>
				<Typography variant="h1" sx={{ mt: data()?.cover ? 0 : 8, mb: 1 }}>
					{data()?.title}
				</Typography>
				<Show when={data()?.urgent}>
					<Chip icon={<ErrorIcon />} label="STIRE URGENTA" color="error" sx={{ mb: 1 }}/>
					<br/>
				</Show>
				<For each={data()?.tags}>
					{(tag) => (
						<Chip label={`#${tag}`} size="small" variant="outlined" sx={{ mr: .5, mb: 1 }} />
					)}
				</For>
				<Show when={data()?.content}>
					<Markdown 
						children={data()?.content}
						components={{
							a: (props) => <Link {...props} target="_blank" />,
							h1: (props) => <Typography component="h1" variant="h1" {...props} />,
							h2: (props) => <Typography component="h2" variant="h2" {...props} />,
							h3: (props) => <Typography component="h3" variant="h3" {...props} />,
							h4: (props) => <Typography component="h4" variant="h4" {...props} />,
							h5: (props) => <Typography component="h5" variant="h5" {...props} />,
							h6: (props) => <Typography component="h6" variant="h6" {...props} />,
							p: (props) => <Typography component="p" variant="body1" {...props} />,
							blockquote: (props) => <Typography component="blockquote" sx={{ py: 1 }} variant="body1" color="textSecondary" {...props} />,
						}}
					/>
				</Show>
			</Container>
		</>
	)
}

const fetcher = async (id: string) => {
	const data = await sanityClient.fetch<Article>(`*[_type == "article" && slug.current == $slug][0] {
			...,
			cover {
				...,
				asset-> {..., metadata}
			}
		}`, { slug: id })
		.catch(() => null);

	return data;
}

export function ArticleGetData({ params, navigate }: RouteDataFuncArgs) {
	const [data] = createResource(() => params.id, fetcher);

	createEffect(() => {
		if (data() === null) {
			navigate("/businesses", { replace: true })
		}
	})

	return data;
}
