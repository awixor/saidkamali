import path from "path";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Books } from "./collections/Books";
import { Chapters } from "./collections/Chapters";
import { Videos } from "./collections/Videos";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Books, Chapters, Videos],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./data/payload.db",
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
  }),
  sharp,
});
