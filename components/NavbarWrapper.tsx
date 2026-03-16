import { getPayload } from "payload";
import config from "@payload-config";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const payload = await getPayload({ config });
  const { docs: books } = await payload.find({
    collection: "books",
    sort: "order",
    limit: 100,
  });

  const serializedBooks = books.map((book) => ({
    id: String(book.id),
    slug: book.slug,
    name: book.name,
  }));

  return <Navbar books={serializedBooks} />;
}
