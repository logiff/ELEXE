(() => {
  "use strict";
  const cfg = window.ELEXE_CONFIG || {};
  const $ = id => document.getElementById(id);
  const setStatus = (message, isError = false) => { $("status").textContent = message; $("status").classList.toggle("error", isError); };
  $("year").textContent = new Date().getFullYear();
  const owner = String(cfg.githubOwner || "").trim();
  const repo = String(cfg.githubRepo || "").trim();
  if (!/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(owner) || !/^[a-z\d._-]+$/i.test(repo) || owner === "YOUR_GITHUB_USERNAME") {
    $("version").textContent = "Not configured";
    $("notes").textContent = "Edit config.js and set githubOwner and githubRepo to your GitHub Releases repository.";
    setStatus("Setup needed: update config.js with your GitHub details.", true);
    return;
  }
  const repoUrl = `https://github.com/${owner}/${repo}`;
  $("github-link").href = repoUrl;
  $("releases-link").href = `${repoUrl}/releases`;
  const api = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  async function load() {
    try {
      const response = await fetch(api, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 404 ? "No published stable release found. Publish a non-draft, non-prerelease GitHub Release with a .jar attached." : `GitHub API returned HTTP ${response.status}.`);
      const release = await response.json();
      const jars = (Array.isArray(release.assets) ? release.assets : []).filter(asset => typeof asset.name === "string" && asset.name.toLowerCase().endsWith(".jar") && typeof asset.browser_download_url === "string" && asset.browser_download_url.startsWith("https://github.com/"));
      const preferred = String(cfg.preferredAssetText || "").trim().toLowerCase();
      const asset = (preferred && jars.find(a => a.name.toLowerCase().includes(preferred))) || jars[0];
      $("version").textContent = release.tag_name || release.name || "Latest release";
      $("date").textContent = release.published_at ? new Date(release.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "Unknown";
      $("release-type").textContent = "LATEST STABLE";
      $("notes").textContent = release.body?.trim() || "No release notes provided.";
      if (!asset) throw new Error("Release found, but no .jar download asset was attached.");
      const button = $("download");
      button.href = asset.browser_download_url;
      button.removeAttribute("aria-disabled");
      button.removeAttribute("tabindex");
      button.classList.remove("disabled");
      $("download-label").textContent = "Download Latest";
      button.setAttribute("aria-label", `Download ${asset.name}`);
      setStatus(`Ready · ${asset.name}`);
    } catch (error) {
      $("download-label").textContent = "Download unavailable";
      setStatus(error instanceof Error ? error.message : "Unable to fetch releases.", true);
    }
  }
  load();
})();
