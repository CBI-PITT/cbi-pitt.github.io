module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  eleventyConfig.addCollection("news", (collection) =>
    collection.getFilteredByGlob("news/*.md").sort((a, b) => {
      const da = new Date(a.data.date || 0);
      const db = new Date(b.data.date || 0);
      return db - da;
    })
  );

  eleventyConfig.addFilter("asset", (p) => (p ? "/" + String(p).replace(/^\//, "") : p));

  eleventyConfig.addFilter("stripDash", (s) => (s || "").replace(/^- /, ""));
  eleventyConfig.addFilter("isDashItem", (s) => /^- /.test(s || ""));

  eleventyConfig.addFilter("excerpt", (html, len = 140) => {
    if (!html) return "";
    const text = String(html)
      .replace(/<[^>]+>/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= len) return text;
    return text.slice(0, len).replace(/\s+\S*$/, "").replace(/[.,;:!?]$/, "") + "…";
  });

  eleventyConfig.addFilter("displayDate", (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch (e) {
      return String(d);
    }
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
