import type { CollectionConfig } from "payload";

export const Videos: CollectionConfig = {
  slug: "videos",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "youtubeId",
      type: "text",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "lessonNumber",
      type: "number",
      required: true,
    },
    {
      name: "book",
      type: "relationship",
      relationTo: "books",
      required: true,
    },
    {
      name: "chapter",
      type: "text",
    },
    {
      name: "publishedAt",
      type: "date",
    },
    {
      name: "durationMinutes",
      type: "number",
    },
  ],
};
