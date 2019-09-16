const { escapeHtml, html } = require("./utils");
const prettyBytes = require("pretty-bytes");
const renderBreadcrumbs = require("./breadcrumbs");

const icons = {
  file: "📄",
  dir: "📁",
  symlink: "📑"
};

/** @type {import('showdown').Converter} */
let _converter = null;
function renderMarkdown(source) {
  if (!_converter) {
    const { Converter } = require("showdown");
    _converter = new Converter({ tables: true });
  }
  return _converter.makeHtml(source);
}

// adapted from serve’s directory listing implementation:
// https://github.com/zeit/serve-handler/blob/6ece2015/src/directory.jst
module.exports = function renderListing(
  pathname,
  entry,
  path,
  contents,
  readme
) {
  const url = `https://deno.land${pathname}`;
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Index of ${escapeHtml(url)}</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.14.2/build/styles/default.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.14.2/build/styles/github-gist.min.css"
        />
        <link
          rel="stylesheet"
          media="(prefers-color-scheme: dark)"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.14.2/build/styles/monokai-sublime.min.css"
        />
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.14.2/build/highlight.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.14.2/build/languages/typescript.min.js"></script>
        <link rel="stylesheet" href="https://deno.land/style.css" />
        <link rel="stylesheet" href="/~/breadcrumbs/style.css" />
        <link rel="stylesheet" href="/~/dir_listing/style.css" />
      </head>
      <body>
        ${renderBreadcrumbs(pathname, entry)}
        <main>
          <section class="files">
            <ul>
              ${path !== ""
                ? html`
                    <li>
                      <a href=".."><span class="parent-dir-button">..</span></a>
                    </li>
                  `
                : ""}
              ${contents
                .map(
                  item =>
                    html`
                      <li>
                        <a
                          href="${escapeHtml(item.name)}${item.type === "dir"
                            ? "/"
                            : ""}"
                          data-icon="${icons[item.type]}"
                          ><span
                            class="name ${item.name.startsWith(".")
                              ? "hidden-file"
                              : ""}"
                            >${escapeHtml(item.name)}</span
                          ></a
                        >${item.size
                          ? html`
                              <span class="size"
                                >${prettyBytes(item.size)}</span
                              >
                            `.trim()
                          : ""}
                      </li>
                    `
                )
                .join("")}
            </ul>
          </section>
          ${readme
            ? html`
                <article>
                  ${renderMarkdown(readme)}
                  <script>
                    hljs.configure({ languages: [] });
                    hljs.initHighlighting();
                  </script>
                </article>
              `
            : ""}
        </main>
      </body>
    </html>
  `;
};
