class ReleaseSelector {
  constructor() {
    this.releases = [];
    this.assets = [];
    this.init();

    this.osNames = {
      windows: "Windows",
      linux: "Linux",
      macos: "macOS",
      android: "Android",
      ios: "iOS",
      "web-no": "Web (No Threads)",
      "web-yes": "Web (With Threads)",
    };

    this.engines = {
      v8: "V8",
      "qjs-ng": "QuickJS NG",
      browser: "Browser",
    };

    this.targets = {
      editor: "Editor",
      template_release: "Release Template",
      template_debug: "Debug Template",
    };

    this.versions = ["4.4", "4.5"];
  }

  async init() {
    await this.fetchReleases();
    this.renderSelectors();
    this.bindEvents();
  }

  async fetchReleases() {
    try {
      const response = await fetch(
        "https://api.github.com/repos/godotjs/GodotJS/releases",
      );
      this.releases = await response.json();
      this.parseAssets();
    } catch (error) {
      console.error("Failed to fetch releases:", error);
    }
  }

  parseAssets() {
    this.assets = [];

    this.releases.forEach((release) => {
      release.assets.forEach((asset) => {
        const os = Object.keys(this.osNames).find((key) =>
          asset.name.includes(key),
        );
        const jsEngine = Object.keys(this.engines).find((key) =>
          asset.name.includes(key),
        );
        const target = Object.keys(this.targets).find((key) =>
          asset.name.includes(key),
        );
        const godotVersion = this.versions.find((key) =>
          asset.name.includes(key),
        );

        this.assets.push({
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          os,
          target,
          jsEngine,
          godotVersion,
          releaseTag: release.tag_name,
          releaseDate: release.published_at,
          isPrerelease: release.prerelease,
        });
      });
    });
  }

  getUniqueValues(key, filters = {}) {
    const filteredAssets = this.getFilteredAssets(filters);
    return [...new Set(filteredAssets.map((asset) => asset[key]))].sort();
  }

  getFilteredAssets(filters) {
    return this.assets.filter((asset) => {
      return Object.entries(filters).every(
        ([key, value]) => !value || asset[key] === value,
      );
    });
  }

  renderSelectors() {
    const container = document.getElementById("release-selector");
    if (!container) return;

    const osOptions = this.getUniqueValues("os");
    const targetOptions = this.getUniqueValues("target");
    const jsEngineOptions = this.getUniqueValues("jsEngine");
    const versionOptions = this.getUniqueValues("godotVersion");

    container.innerHTML = `
      <div class="release-selector-container">
        <h3>Download GodotJS</h3>
        <div class="selector-row">
          <div class="selector-group">
            <label for="os-select">Operating System:</label>
            <select id="os-select">
              <option value="">All OS</option>
              ${osOptions
                .filter((os) => os)
                .map(
                  (os) =>
                    `<option value="${os}">${this.formatOSName(os)}</option>`,
                )
                .join("")}
            </select>
          </div>
          
          <div class="selector-group">
            <label for="target-select">Target:</label>
            <select id="target-select">
              <option value="">All Targets</option>
              ${targetOptions
                .filter((target) => target)
                .map(
                  (target) =>
                    `<option value="${target}">${this.formatTargetName(target)}</option>`,
                )
                .join("")}
            </select>
          </div>
          
          <div class="selector-group">
            <label for="engine-select">JS Engine:</label>
            <select id="engine-select">
              <option value="">All Engines</option>
              ${jsEngineOptions
                .filter((engine) => engine)
                .map(
                  (engine) =>
                    `<option value="${engine}">${this.formatEngineName(engine)}</option>`,
                )
                .join("")}
            </select>
          </div>
          
          <div class="selector-group">
            <label for="version-select">Godot Version:</label>
            <select id="version-select">
              <option value="">All Versions</option>
              ${versionOptions
                .filter((version) => version)
                .map(
                  (version) => `<option value="${version}">${version}</option>`,
                )
                .join("")}
            </select>
          </div>
        </div>
        
        <div class="selector-row">
          <div class="selector-group">
            <label>
              <input type="checkbox" id="include-prerelease"> Include pre-releases
            </label>
          </div>
        </div>
        
        <div id="download-results"></div>
      </div>
    `;
  }

  formatOSName(os) {
    return this.osNames[os] || os;
  }

  formatEngineName(engine) {
    return this.engines[engine] || engine;
  }

  formatTargetName(target) {
    return (
      this.targets[target] || this.targets[target.replace("-", "_")] || target
    );
  }

  bindEvents() {
    const osSelect = document.getElementById("os-select");
    const targetSelect = document.getElementById("target-select");
    const engineSelect = document.getElementById("engine-select");
    const versionSelect = document.getElementById("version-select");
    const prereleaseCheckbox = document.getElementById("include-prerelease");

    if (osSelect) {
      osSelect.addEventListener("change", () => {
        this.updateTargetOptions();
        this.updateEngineOptions();
        this.updateVersionOptions();
        this.updateResults();
      });
    }

    if (targetSelect) {
      targetSelect.addEventListener("change", () => {
        this.updateEngineOptions();
        this.updateVersionOptions();
        this.updateResults();
      });
    }

    if (engineSelect) {
      engineSelect.addEventListener("change", () => {
        this.updateVersionOptions();
        this.updateResults();
      });
    }

    [versionSelect, prereleaseCheckbox].forEach((element) => {
      if (element) {
        element.addEventListener("change", () => this.updateResults());
      }
    });

    // Set default values
    if (osSelect) osSelect.value = this.detectOS();
    this.updateTargetOptions();
    this.updateEngineOptions();
    this.updateVersionOptions();
    if (targetSelect) targetSelect.value = "editor";
    if (engineSelect) engineSelect.value = "v8";

    this.updateResults();
  }

  detectOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("win")) return "windows";
    if (userAgent.includes("mac")) return "macos";
    if (userAgent.includes("linux")) return "linux";
    return "windows"; // default
  }

  updateTargetOptions() {
    const osSelect = document.getElementById("os-select");
    const targetSelect = document.getElementById("target-select");

    if (!osSelect || !targetSelect) return;

    const selectedOS = osSelect.value;
    const currentTarget = targetSelect.value;

    const availableTargets = this.getUniqueValues("target", { os: selectedOS });

    targetSelect.innerHTML = `
      <option value="">All Targets</option>
      ${availableTargets
        .filter((target) => target)
        .map(
          (target) =>
            `<option value="${target}">${this.formatTargetName(target)}</option>`,
        )
        .join("")}
    `;

    // Restore selection if still available
    if (availableTargets.includes(currentTarget)) {
      targetSelect.value = currentTarget;
    }
  }

  updateEngineOptions() {
    const osSelect = document.getElementById("os-select");
    const targetSelect = document.getElementById("target-select");
    const engineSelect = document.getElementById("engine-select");

    if (!engineSelect) return;

    const filters = {
      os: osSelect?.value || "",
      target: targetSelect?.value || "",
    };
    const currentEngine = engineSelect.value;

    const availableEngines = this.getUniqueValues("jsEngine", filters);

    engineSelect.innerHTML = `
      <option value="">All Engines</option>
      ${availableEngines
        .filter((engine) => engine)
        .map(
          (engine) =>
            `<option value="${engine}">${this.formatEngineName(engine)}</option>`,
        )
        .join("")}
    `;

    // Restore selection if still available
    if (availableEngines.includes(currentEngine)) {
      engineSelect.value = currentEngine;
    }
  }

  updateVersionOptions() {
    const osSelect = document.getElementById("os-select");
    const targetSelect = document.getElementById("target-select");
    const engineSelect = document.getElementById("engine-select");
    const versionSelect = document.getElementById("version-select");

    if (!versionSelect) return;

    const filters = {
      os: osSelect?.value || "",
      target: targetSelect?.value || "",
      jsEngine: engineSelect?.value || "",
    };
    const currentVersion = versionSelect.value;

    const availableVersions = this.getUniqueValues("godotVersion", filters);

    versionSelect.innerHTML = `
      <option value="">All Versions</option>
      ${availableVersions
        .filter((version) => version)
        .map((version) => `<option value="${version}">${version}</option>`)
        .join("")}
    `;

    // Restore selection if still available
    if (availableVersions.includes(currentVersion)) {
      versionSelect.value = currentVersion;
    }
  }

  updateResults() {
    const filters = {
      os: document.getElementById("os-select")?.value || "",
      target: document.getElementById("target-select")?.value || "",
      jsEngine: document.getElementById("engine-select")?.value || "",
      godotVersion: document.getElementById("version-select")?.value || "",
    };

    const includePrerelease =
      document.getElementById("include-prerelease")?.checked || false;

    let filteredAssets = this.getFilteredAssets(filters);

    if (!includePrerelease) {
      filteredAssets = filteredAssets.filter((asset) => !asset.isPrerelease);
    }

    // Group by release and sort by date (newest first)
    const groupedAssets = {};
    filteredAssets.forEach((asset) => {
      if (!groupedAssets[asset.releaseTag]) {
        groupedAssets[asset.releaseTag] = [];
      }
      groupedAssets[asset.releaseTag].push(asset);
    });

    const sortedReleases = Object.keys(groupedAssets).sort((a, b) => {
      const releaseA = this.releases.find((r) => r.tag_name === a);
      const releaseB = this.releases.find((r) => r.tag_name === b);
      return new Date(releaseB.published_at) - new Date(releaseA.published_at);
    });

    this.renderResults(groupedAssets, sortedReleases);
  }

  renderResults(groupedAssets, sortedReleases) {
    const resultsContainer = document.getElementById("download-results");
    if (!resultsContainer) return;

    if (sortedReleases.length === 0) {
      resultsContainer.innerHTML =
        '<p class="no-results">No releases found matching your criteria.</p>';
      return;
    }

    const html = sortedReleases
      .map((releaseTag, index) => {
        const assets = groupedAssets[releaseTag];
        const release = this.releases.find((r) => r.tag_name === releaseTag);

        return `
        <details class="release-group" ${index === 0 ? "open" : ""}>
          <summary>
            ${releaseTag} 
            ${release.prerelease ? '<span class="prerelease-badge">Pre-release</span>' : ""}
            <span class="release-date">${new Date(release.published_at).toLocaleDateString()}</span>
          </summary>
          <div class="download-links">
            ${assets
              .map(
                (asset) => `
              <a href="${asset.downloadUrl}" class="download-link" download>
                <span class="download-icon">⬇️</span>
                <span class="download-details">${this.formatOSName(asset.os)} • ${this.formatTargetName(asset.target)} • ${this.formatEngineName(asset.jsEngine)} • ${asset.godotVersion ?? "Unknown"}</span>
              </a>
            `,
              )
              .join("")}
          </div>
        </details>
      `;
      })
      .join("");

    resultsContainer.innerHTML = html;
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ReleaseSelector();
});
