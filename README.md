# ELEXE Downloads — GitHub Pages

A static dark-themed website that automatically retrieves the latest **stable** GitHub Release and links to its `.jar` asset. No server, API token, or 24/7 bot required.

## Setup

1. Create a **public** GitHub repository, e.g. `elexe` (or use an existing public repository).
2. Edit `config.js`: replace `YOUR_GITHUB_USERNAME` with your GitHub username and change `githubRepo` if your repository has a different name.
3. Upload `index.html`, `style.css`, `config.js`, and `app.js` to the repository root, then commit them.
4. In GitHub, open **Settings → Pages → Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, and save.
5. The site will be available at `https://YOUR_GITHUB_USERNAME.github.io/elexe/` (if the repository is named `elexe`). It may take a few minutes to publish.
6. Open the repository's **Releases** page, click **Draft a new release**, choose a tag like `v1.0.0`, attach your compiled `.jar` as a binary asset, and **Publish release**. The site will fetch it automatically on each visit.

## Important notes

- The site uses `https://api.github.com/repos/OWNER/REPO/releases/latest`, which selects the latest published **non-prerelease** release. Drafts and prereleases aren't included.
- If there are multiple `.jar` assets, `preferredAssetText` in `config.js` picks the first matching name; otherwise the first `.jar` is used. Use descriptive asset names.
- GitHub API has unauthenticated rate limits; on a rate-limit error the site shows an error instead of a stale link.
- GitHub Pages and public Releases are public. Do not commit Discord bot tokens, secrets, private data, or untrusted builds.
- If you want a Discord link button, point it at the GitHub Pages site. Discord link buttons don't require a continuously running bot to work after being posted.
