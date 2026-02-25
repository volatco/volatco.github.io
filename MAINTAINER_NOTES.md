# Maintainer Notes

## Adding New Databooks

Use this workflow when adding a new page under `docs/pages/`:

1. Copy `docs/_templates/databook-page-template.md` to a new file such as `docs/pages/DB003.md`.
2. Update the front matter title and page content.
3. Keep the nested Table of Contents structure so subsections are indented and easy to scan.
4. Commit and push. The sidebar will list the page automatically, and the URL will be clean (`/pages/db003/`) from the global permalink defaults.
