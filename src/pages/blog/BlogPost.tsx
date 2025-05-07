// BlogPost.tsx (with Auto-Generated Table of Contents)

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import blogPosts from "./blogData";
import { Link } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  const [tableOfContents, setTableOfContents] = useState<string[][]>([]);

  useEffect(() => {
    if (!post) return;
    const headings = Array.from(post.content.matchAll(/^##+\s(.*)$/gm));
    const toc = headings.map(([full, title], index) => {
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return [title, `#${id}`];
    });
    setTableOfContents(toc);
  }, [post]);

  function convertMarkdownToHTML(markdown: string) {
    let html = markdown
      .replace(/^### (.*$)/gim, "<h3 id='$1' class='text-xl font-medium mt-6 mb-3'>$1</h3>")
      .replace(/^## (.*$)/gim, (_m, p1) => {
        const id = p1.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return `<h2 id='${id}' class='text-2xl font-semibold mt-8 mb-4'>${p1}</h2><hr class='my-6 border-t border-gray-300' />`;
      })
      .replace(/^# (.*$)/gim, "<h1 class='text-3xl md:text-4xl font-bold mb-6'>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' class='rounded-xl my-6' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-indigo-600 hover:underline'>$1</a>")
      .replace(/^> (.*$)/gim, "<blockquote class='border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50 rounded'>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\.\s(.*$)/gim, "<li>$1</li>")
      .replace(/\n$/gim, "<br />");

    if (html.includes("<li>")) {
      html = html.replace(/(<li>.*<\/li>)/gims, "<ul class='list-disc pl-6 space-y-1 my-4'>$1</ul>");
    }

    return html.trim();
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600 mb-6">Oops! Blog post not found.</p>
          <Link to="/blog" className="text-indigo-600 hover:underline">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>{post.title} | AIVideoSummary</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://aivideosummary.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            image: `https://aivideosummary.com${post.image}`,
            author: {
              "@type": "Person",
              name: "AIVideoSummary Team",
            },
            publisher: {
              "@type": "Organization",
              name: "AIVideoSummary",
              logo: {
                "@type": "ImageObject",
                url: "https://aivideosummary.com/logo.png",
              },
            },
            datePublished: post.date,
            dateModified: post.date,
            description: post.description,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://aivideosummary.com/blog/${post.slug}`,
            },
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg shadow-md mb-8"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 text-sm mb-10">{post.date}</p>

          {/* Table of Contents */}
          {tableOfContents.length > 0 && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-10">
              <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
              <ul className="list-none pl-2 space-y-2 text-indigo-700">
                {tableOfContents.map(([title, id], index) => (
                  <li key={index}>
                    <a href={id} className="hover:underline">
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:leading-relaxed prose-p:mb-5 prose-ul:pl-5 prose-ol:pl-5 prose-li:marker:text-indigo-600"
            dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(post.content) }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/blog" className="text-indigo-600 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
