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
      "web-nothreads": "Web (No Threads)",
      web: "Web",
    };

    this.engines = {
      v8: "V8",
      "qjs-ng": "QuickJS NG",
    };

    this.targets = {
      editor: "Editor",
      "template-release": "Release Template",
      "template-debug": "Debug Template",
    };
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

        this.assets.push({
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          os: os,
          target: target,
          jsEngine: jsEngine,
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

    container.innerHTML = `
      <div class="release-selector-container">
        <h3>Download GodotJS</h3>
        <div class="selector-row">
          <div class="selector-group">
            <label for="os-select">Operating System:</label>
            <select id="os-select">
              <option value="">Select OS</option>
              ${osOptions.map((os) => `<option value="${os}">${this.formatOSName(os)}</option>`).join("")}
            </select>
          </div>
          
          <div class="selector-group">
            <label for="target-select">Target:</label>
            <select id="target-select">
              <option value="">Select Target</option>
              ${targetOptions.map((target) => `<option value="${target}">${this.formatTargetName(target)}</option>`).join("")}
            </select>
          </div>
          
          <div class="selector-group">
            <label for="engine-select">JS Engine:</label>
            <select id="engine-select">
              <option value="">Select Engine</option>
              ${jsEngineOptions.map((engine) => `<option value="${engine}">${this.formatEngineName(engine)}</option>`).join("")}
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
      this.targets[target] ||
      target.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }

  bindEvents() {
    const osSelect = document.getElementById("os-select");
    const targetSelect = document.getElementById("target-select");
    const engineSelect = document.getElementById("engine-select");
    const prereleaseCheckbox = document.getElementById("include-prerelease");

    if (osSelect) {
      osSelect.addEventListener("change", () => {
        this.updateTargetOptions();
        this.updateResults();
      });
    }

    [targetSelect, engineSelect, prereleaseCheckbox].forEach(
      (element) => {
        if (element) {
          element.addEventListener("change", () => this.updateResults());
        }
      },
    );

    // Set default values
    if (osSelect) osSelect.value = this.detectOS();
    this.updateTargetOptions();
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
      <option value="">Select Target</option>
      ${availableTargets.map((target) => `<option value="${target}">${this.formatTargetName(target)}</option>`).join("")}
    `;
    
    // Restore selection if still available
    if (availableTargets.includes(currentTarget)) {
      targetSelect.value = currentTarget;
    }
  }

  updateResults() {
    const filters = {
      os: document.getElementById("os-select")?.value || "",
      target: document.getElementById("target-select")?.value || "",
      jsEngine: document.getElementById("engine-select")?.value || "",
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
      .map((releaseTag) => {
        const assets = groupedAssets[releaseTag];
        const release = this.releases.find((r) => r.tag_name === releaseTag);

        return `
        <div class="release-group">
          <h4>
            ${releaseTag} 
            ${release.prerelease ? '<span class="prerelease-badge">Pre-release</span>' : ""}
            <span class="release-date">${new Date(release.published_at).toLocaleDateString()}</span>
          </h4>
          <div class="download-links">
            ${assets
              .map(
                (asset) => `
              <a href="${asset.downloadUrl}" class="download-link" download>
                <span class="download-icon">⬇️</span>
                ${asset.name}
                <span class="download-details">${this.formatOSName(asset.os)} • ${this.formatTargetName(asset.target)} • ${asset.jsEngine.toUpperCase()}</span>
              </a>
            `,
              )
              .join("")}
          </div>
        </div>
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
