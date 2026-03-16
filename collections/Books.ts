import type { CollectionConfig } from "payload";

export const Books: CollectionConfig = {
  slug: "books",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
    },
    {
      name: "coverVideoId",
      type: "relationship",
      relationTo: "videos",
    },
  ],
};
