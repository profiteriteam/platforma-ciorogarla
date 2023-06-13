import * as dotenv from "dotenv";
import crypto from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SanityDocument, createClient as createSanityClient } from "@sanity/client";
import { Configuration, OpenAIApi } from "openai";
import { businessContentGenerator, projectContentGenerator } from "./contentGenerator";
import { Business, VolunteeringProject } from "../app/src/lib/types/SanitySchema";

dotenv.config();

const sanityClient = createSanityClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID as string,
	dataset: process.env.PUBLIC_SANITY_DATASET as string,
	apiVersion: "2021-03-25",
	useCdn: false,
});

const supabaseClient = createSupabaseClient(
	process.env.PUBLIC_SUPABASE_URL as string,
	process.env.SUPABASE_SERVICE_KEY as string,
	{
		auth: {
			persistSession: false,
		},
	},
);

const openaiConfiguration = new Configuration({
	apiKey: process.env.OPENAI_KEY as string,
});

const openaiClient = new OpenAIApi(openaiConfiguration);

function createPromises(documents: SanityDocument[], contentGenerator: (doc) => string) {
	return documents.map(async (document) => {
		const id = document._id;
		const content = contentGenerator(document);
		const checksum = crypto.createHash("md5").update(content).digest("hex");
		const created_at = document._createdAt;

		const { data } = await supabaseClient.from("documents").select("*").eq("id", id).single();

		if (!data) {
			const embeddings = await openaiClient
				.createEmbedding({
					input: content,
					model: "text-embedding-ada-002",
				})
				.then((res) => res.data.data);

			const { error } = await supabaseClient.from("documents").insert([
				{
					id,
					checksum,
					created_at,
					embedding: embeddings[0].embedding,
				},
			]);

			if (error) {
				console.error(error);
				return;
			}
		} else {
			if (data.checksum !== checksum) {
				const embeddings = await openaiClient
					.createEmbedding({
						input: content,
						model: "text-embedding-ada-002",
					})
					.then((res) => res.data);

				const { error } = await supabaseClient
					.from("documents")
					.update({
						checksum,
						created_at,
						embedding: embeddings.data[0].embedding,
					})
					.eq("id", id);

				if (error) {
					console.error(error);
					return;
				}
			} else {
				console.log("No changes");
			}
		}
	});
}

const businesses = await sanityClient.fetch<Business[]>(`*[_type == "business"]`);
const projects = await sanityClient.fetch<VolunteeringProject[]>(
	`*[_type == "volunteeringProject"]`,
);

console.log(businesses.length, projects.length);

const businessPromises = createPromises(businesses, businessContentGenerator);
const projectPromises = createPromises(projects, projectContentGenerator);

await Promise.all([...projectPromises, ...businessPromises]);
console.log("Done");
