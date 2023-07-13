import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { openai } from "$lib/utils/openai";
import type { Business, Knowledge, VolunteeringProject } from "$lib/types/SanitySchema";
import { sanity } from "$lib/utils/sanity";

export const load = (async ({ url, locals }) => {
	const supabase = locals.supabase;
	const query = url.searchParams.get("query") as string;

	if (!query) {
		return;
	}

	const results = await openai
		.createModeration({
			model: "text-moderation-latest",
			input: query,
		})
		.then((res) => res.data.results)
		.catch((err) => {
			console.log(err);
			throw error(500, "Could not check query");
		});

	if (results[0]?.flagged) {
		throw error(400, "Bad Request");
	}

	const queryEmbedding = await openai
		.createEmbedding({
			model: "text-embedding-ada-002",
			input: query,
		})
		.then((res) => res.data.data);

	// Maximum of 25 matches
	// Can be lower if there are not enough matches
	const { data: matches, error: supabaseError } = await supabase.rpc("match_documents", {
		query_embedding: queryEmbedding[0].embedding,
		match_count: 25,
		match_threshold: 0.75,
	});

	if (supabaseError) {
		console.log(supabaseError);
		throw error(500, "Internal Server Error");
	}

	const allowedTypes = ["business", "volunteeringProject", "knowledge"];
	type PossibleResult = {
		_type: "business" | "volunteeringProject" | "knowledge";
		_id: string;
		title: string;
		image: Business["logo"] | VolunteeringProject["image"];
		description: Business["description"] | VolunteeringProject["description"];
		content: Knowledge["content"];
		url: string;
	};

	const documents = await sanity.fetch<Array<PossibleResult>>(
		`*[_id in $ids && _type in $allowedTypes] {
			...,
			"title": coalesce(title, name),
			"image": coalesce(logo, image),
			"description": coalesce(description, "Cunostinte"),
			"url": select(
				_type == "volunteeringProject" => "/projects/" + slug.current,
				_type == "business" => "/businesses/" + slug.current,
			)
		}`,
		{
			ids: matches.map((match: { id: string }) => match.id),
			allowedTypes,
		},
	);

	// Order documents by matches order
	// since sanity scrambles the order of the documents
	const matchesIds: string[] = matches.map((match: { id: string }) => match.id);
	documents.sort((a, b) => matchesIds.indexOf(a._id) - matchesIds.indexOf(b._id));

	return {
		query,
		documents,
	};
}) satisfies PageServerLoad;
