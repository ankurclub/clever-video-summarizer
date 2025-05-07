
import React from "react";
import { Helmet } from "react-helmet";
import blogPosts from "./blog/blogData";
import { Link } from "react-router-dom";

const Blog = () => {
  // Limit to first 6 blog posts only
  const limitedPosts = blogPosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>Blog | AIVideoSummary</title>
        <meta
          name="description"
          content="Explore the latest articles on AI-powered video summarization, transcription, and more on AIVideoSummary blog."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center">Our Blog</h1>

          <div className="grid md:grid-cols-2 gap-12">
            {limitedPosts.map((post) => (
              <div
                key={post.slug}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <Link to={`/blog/${post.slug}`}>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </Link>

                <div className="p-6">
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-500 text-sm mb-4">{post.date}</p>
                  <p className="text-gray-600">{post.description}</p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-indigo-600 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
