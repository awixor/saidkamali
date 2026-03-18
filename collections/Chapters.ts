import type { CollectionConfig } from "payload";

export const Chapters: CollectionConfig = {
  slug: "chapters",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      // e.g. "بَاب وُقُوتِ الصَّلاَة"
    },
    {
      name: "book",
      type: "relationship",
      relationTo: "books",
      required: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
    },
    {
      name: "page",
      type: "number",
      admin: {
        description: "Page number in the Muwatta book",
      },
    },
  ],
};
