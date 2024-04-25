import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";
import { createEmptyContact, getContacts } from "./data";
// existing imports

import appStylesHref from "./app.css?url";
import axios from "axios";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {contacts.map((contact) => (
          <h1>{contact.title}</h1>
        ))}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const getBlogs = async () => {
  const blogsResponse = await axios.get(
    `https://remixcms.ptemagic.com/wp-json/wp/v2/posts?_embed`,
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJhZG1pbl9yZW1peF9oYWkiLCJpYXQiOjE3MTQwMjg0ODgsImV4cCI6MTg3MTcwODQ4OH0.8Vjc9UsaZEfhphfpwzA2bneZXDxOtqd5vCBs4I4o6tc`,
      },
    }
  );

  const blogs = blogsResponse.data.map((item: any) => {
    const embedded = item._embedded;
    return {
      id: item.id,
      featureImage:
        "wp:featuredmedia" in embedded
          ? embedded["wp:featuredmedia"][0].link
          : null,
      categories: item._embedded["wp:term"][0].map(
        (category: any) => category.name
      ),
      title: item.title.rendered,
      excerpt: item.excerpt.rendered,
      content: item.content.rendered,
      author: {
        avatar: item._embedded.author[0].avatar_urls["48"],
        name: item._embedded.author[0].name,
      },
      date: item.date,
      readTime: "5 min",
    };
  });

  return blogs;
};

export const loader = async () => {
  const contacts = await getBlogs();
  return json({ contacts });
};
