import { defineLive } from "next-sanity/live";
import { client } from "./sanity.client";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    // Live content is available for those who have it enabled
    useCdn: false,
  }),
  serverToken: false,
  browserToken: false,
});
