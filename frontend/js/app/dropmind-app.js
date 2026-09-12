      /* =================================
         APP INITIALIZATION
      ================================= */

import { createApiClient } from "../../dany-framework/frontend/data/api-client.js";
import { ICONS } from "../ui/icons.js";
import { SelectionManager } from "../../dany-framework/frontend/core/selection-manager.js";
import { bindLongPress } from "../../dany-framework/frontend/interaction/long-press.js";

const API_BASE_URL = "/api";

const appConfig = {
  apiToken: window.DM_CONFIG?.API_TOKEN || ""
};

const api = createApiClient({
  baseUrl: API_BASE_URL,
  token: appConfig.apiToken
});

/* =================================
   THEME
================================= */

const THEME_STORAGE_KEY = "dm_theme";
const THEME_OPTIONS = ["dark", "light", "auto"];
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

let themePreference = "dark";

/* =================================
   THEME PREFERENCE / RESOLUTION
================================= */

function normalizeThemePreference(preference) {

  return THEME_OPTIONS.includes(preference) ? preference : "dark";
}

function getSavedThemePreference() {

  return normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
}

function getEffectiveTheme(preference) {

  if (preference === "auto") {
    return systemThemeQuery.matches ? "dark" : "light";
  }

  return preference;
}

function saveThemePreference(preference) {

  localStorage.setItem(THEME_STORAGE_KEY, preference);
}

function handleSystemThemeChange() {

  if (themePreference === "auto") {
    applyThemePreference(themePreference);
  }
}

/* =================================
   THEME VISUAL APPLICATION
================================= */

function applyVisualTheme(effectiveTheme) {

  const themeColor = document.querySelector('meta[name="theme-color"]');

  document.documentElement.dataset.theme = effectiveTheme;

  if (themeColor) {
    themeColor.content = effectiveTheme === "light" ? "#f8fafc" : "#020617";
  }
}

/* =================================
   DROPMIND THEME UI
================================= */

function getThemeToggleDetails(preference) {

  const details = {
    dark: {
      icon: "☾",
      label: "Tema scuro"
    },
    light: {
      icon: ICONS.sun,
      label: "Tema chiaro"
    },
    auto: {
      icon: ICONS.monitor,
      label: "Tema automatico"
    }
  };

  return details[preference];
}

function updateDropMindThemeControls(preference) {

  const toggleDetails = getThemeToggleDetails(preference);
  const themeToggle = document.getElementById("themeToggle");
  const mobileThemeSelect = document.getElementById("mobileThemeSelect");

  if (themeToggle) {
    const nextTheme = THEME_OPTIONS[
      (THEME_OPTIONS.indexOf(preference) + 1) % THEME_OPTIONS.length
    ];
    const nextThemeLabel = getThemeToggleDetails(nextTheme).label.toLowerCase();

    themeToggle.innerHTML = toggleDetails.icon;
    themeToggle.setAttribute(
      "aria-label",
      `${toggleDetails.label} attivo. Passa a ${nextThemeLabel}`
    );
    themeToggle.title = `${toggleDetails.label} attivo. Passa a ${nextThemeLabel}`;
  }

  if (mobileThemeSelect) {
    mobileThemeSelect.value = preference;
  }
}

function applyThemePreference(preference) {

  themePreference = normalizeThemePreference(preference);

  applyVisualTheme(getEffectiveTheme(themePreference));
  updateDropMindThemeControls(themePreference);
}

function setThemePreference(preference) {

  const normalizedPreference = normalizeThemePreference(preference);

  saveThemePreference(normalizedPreference);
  applyThemePreference(normalizedPreference);
}

function initializeMobileThemeControl() {

  const orderMobile = document.getElementById("order-mobile");
  if (!orderMobile) return;

  const themeControl = document.createElement("div");
  themeControl.id = "mobileThemeControl";
  themeControl.innerHTML = `
    <label for="mobileThemeSelect">Theme</label>
    <select id="mobileThemeSelect">
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      <option value="auto">Auto</option>
    </select>
  `;

  orderMobile.insertAdjacentElement("afterend", themeControl);

  document.getElementById("mobileThemeSelect").addEventListener("change", (event) => {
    setThemePreference(event.target.value);
  });
}

function initializeThemeToggle() {

  const headerRight = document.querySelector(".header-right");
  let themeToggle = null;

  if (headerRight) {
    themeToggle = document.createElement("button");
    themeToggle.id = "themeToggle";
    themeToggle.type = "button";

    headerRight.prepend(themeToggle);
  }

  initializeMobileThemeControl();

  applyThemePreference(getSavedThemePreference());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = THEME_OPTIONS[
        (THEME_OPTIONS.indexOf(themePreference) + 1) % THEME_OPTIONS.length
      ];

      setThemePreference(nextTheme);
    });
  }

  systemThemeQuery.addEventListener("change", handleSystemThemeChange);
}

initializeThemeToggle();

document.getElementById("createClipboardBtn").innerHTML = `
<svg viewBox="0 0 24 24" width="18" height="18"
 stroke="currentColor" fill="none"
 stroke-width="2" stroke-linecap="round">
 <path d="M12 5v14M5 12h14"/>
</svg>`;

      document.getElementById("renameClipboard").innerHTML = ICONS.edit;
      document.getElementById("deleteClipboard").innerHTML = ICONS.delete;

      document.getElementById("favoriteClipboardBtn").innerHTML = `
<svg viewBox="0 0 24 24" width="18" height="18"
 stroke="currentColor" fill="none"
 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"/>
</svg>`;

      document.querySelector(".check-pin").innerHTML = ICONS.pin;
      document.querySelector(".check-file").innerHTML = ICONS.file;
      document.querySelector(".check-text").innerHTML = ICONS.edit;

      // === MOBILE MENU ICONS ===

      document.getElementById("mobileCreateClipboard").innerHTML =
        ICONS.plus + " New clipboard";

      document.getElementById("mobileRenameClipboard").innerHTML =
        ICONS.edit + " Rename";

      document.getElementById("mobileDeleteClipboard").innerHTML =
        ICONS.delete + " Delete";

      document.getElementById("mobileFavoriteClipboard").innerHTML =
        ICONS.star + " Starred";

      document.querySelector(".filter-pin").innerHTML = ICONS.pin;
      document.querySelector(".filter-file").innerHTML = ICONS.file;
      document.querySelector(".filter-text").innerHTML = ICONS.edit;

      function formatFileSize(bytes) {
        if (!bytes && bytes !== 0) return "";

        const kb = bytes / 1024;
        const mb = kb / 1024;

        if (mb >= 1) {
          return mb.toFixed(2) + " MB";
        } else {
          return kb.toFixed(1) + " KB";
        }
      }

      let CLIPBOARDS = [];


      /* =========================
         MULTI SELECT STATE
      ========================= */

      const selection = new SelectionManager();
      let touchHandled = false;
      let lastTouchTime = 0;

      function updateSelectionUI() {

        const normalInput = document.getElementById("normalInput");
        const actions = document.getElementById("selectionActions");
        const count = document.getElementById("selectionCount");

        count.textContent = selection.count + " selected";

        if (selection.isActive) {

          normalInput.style.display = "none";
          actions.style.display = "flex";

          document.querySelectorAll(".message").forEach(el => {
            el.classList.remove("show-actions");
          });

        } else {

          normalInput.style.display = "flex";
          actions.style.display = "none";

        }

      }

      function clearCardSelection() {

        document.querySelectorAll(".message.selected").forEach(el => {
          el.classList.remove("selected");
        });

      }

      /* =========================
         CLIPBOARD VIEW
      ========================= */
      function renderClipboards(forceSelectId, favoriteId) {

        const select = document.getElementById("clipboardSelect");
        const menu = document.getElementById("clipboardMenu");

        select.innerHTML = "";
        menu.innerHTML = "";

        CLIPBOARDS.forEach(c => {

          // select invisibile
          const opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.name;
          select.appendChild(opt);

          // dropdown UI
          const item = document.createElement("div");

          const count = c.count || "";

          item.dataset.value = c.id;

          item.innerHTML = `
            <span class="clipboard-name">
              ${c.id == favoriteId ? "☆ " : ""}
              ${c.name}
            </span>

            <span class="clipboard-count">
              ${count ? `(${count})` : ""}
            </span>
          `;

          item.onclick = () => {

            select.value = c.id;

            document.getElementById("clipboardBtn").textContent =
              c.name + " ▾";

            document.querySelectorAll("#clipboardMenu div")
              .forEach(el => el.style.background = "");

            item.style.background = "rgba(59,130,246,0.15)";

            menu.style.display = "none";

            load();
          };

          menu.appendChild(item);

        });

        // Keep previous selection if possible
        const currentValue = select.value;

        if (forceSelectId) {
          select.value = forceSelectId;
        } else if (currentValue && CLIPBOARDS.some(c => c.id == currentValue)) {
          select.value = currentValue;
        } else if (CLIPBOARDS.length > 0) {
          select.value = CLIPBOARDS[0].id;
        }
        const selectedClipboard = CLIPBOARDS.find(c => c.id == select.value);

        document.querySelectorAll("#clipboardMenu div").forEach(el => {
          if (el.dataset.value == select.value) {
            el.style.background = "rgba(59,130,246,0.15)";
          }
        });

        if (selectedClipboard) {
          document.getElementById("clipboardBtn").textContent =
            selectedClipboard.name + " ▾";
        }

        const desktopFavoriteBtn = document.getElementById("favoriteClipboardBtn");

        if (desktopFavoriteBtn) {
          desktopFavoriteBtn.classList.toggle(
            "favorite-active",
            select.value == favoriteId
          );
        }

      }

      /* =========================
         LOAD CLIPBOARDS
      ========================= */
      async function loadClipboards(forceSelectId = null) {
        const res = await api.fetch("/clipboards");
        if (!res.ok) return;

        CLIPBOARDS = await res.json();

        const favoriteId = localStorage.getItem("dm_favorite_clipboard");

        CLIPBOARDS.sort((a, b) => {

          // 1️⃣ Starred first
          if (a.id == favoriteId) return -1;
          if (b.id == favoriteId) return 1;

          // 2️⃣ Or alphabetic order
          return a.name.localeCompare(b.name, "it", { sensitivity: "base" });

        });

        renderClipboards(forceSelectId, favoriteId);
      }

      async function createClipboard() {
        const name = prompt("New clipboard name:");
        if (!name) return;

        const res = await api.fetch("/clipboards", {
          method: "POST",
          body: new URLSearchParams({ name })
        });

        if (!res.ok) return;

        const newClipboard = await res.json();

        await loadClipboards();

        const created = CLIPBOARDS.find(c => c.name === newClipboard.name);

        if (created) {
          const select = document.getElementById("clipboardSelect");
          select.value = created.id;
        }

        await load();
      }

      async function handleRenameClipboard() {

        const select = document.getElementById("clipboardSelect");
        const id = select.value;

        const current = CLIPBOARDS.find(c => c.id == id);
        if (!current) return;

        const newName = prompt("New name:", current.name);
        if (!newName || newName.trim() === "") return;

        await api.fetch(`/clipboards/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            name: newName.trim()
          })
        });

        await loadClipboards(id);
        await load();
      }

      document.getElementById("renameClipboard").onclick = handleRenameClipboard;

      async function handleDeleteClipboard() {

        const select = document.getElementById("clipboardSelect");
        const id = select.value;

        const current = CLIPBOARDS.find(c => c.id == id);
        if (!current) return;

        if (Number(id) === 1) {
          alert("You cannot delete the main clipboard");
          return;
        }

        if (!confirm("Delete \"" + current.name + "\"?")) return;

        await api.fetch(`/clipboards/${id}`, {
          method: "DELETE"
        });

        await loadClipboards();

        // Torna a main
        const mainClipboard = CLIPBOARDS.find(c => c.name === "main");
        if (mainClipboard) {
          select.value = mainClipboard.id;
        }

        load();
      }

      document.getElementById("deleteClipboard").onclick = handleDeleteClipboard;
      document.getElementById("createClipboardBtn").onclick = createClipboard;

      /* ===========================
         MOBILE MENU CLIPBOARD ACTIONS
      =========================== */

      const mobileCreate = document.getElementById("mobileCreateClipboard");
      const mobileRename = document.getElementById("mobileRenameClipboard");
      const mobileDelete = document.getElementById("mobileDeleteClipboard");
      const mobileFavorite = document.getElementById("mobileFavoriteClipboard");

      const desktopFavorite = document.getElementById("favoriteClipboardBtn");

      if (desktopFavorite) {
        desktopFavorite.onclick = () => {

          const id = document.getElementById("clipboardSelect").value;

          localStorage.setItem("dm_favorite_clipboard", id);

          loadClipboards();
          load();
        };
      }

      if (mobileFavorite) {
        mobileFavorite.onclick = () => {

          const id = document.getElementById("clipboardSelect").value;

          localStorage.setItem("dm_favorite_clipboard", id);

          document.getElementById("mobileMenu").classList.remove("open");

          loadClipboards();
          load();
        };
      }

      if (mobileCreate) {
        mobileCreate.onclick = () => {
          document.getElementById("mobileMenu").classList.remove("open");
          createClipboard();
        };
      }

      if (mobileRename) {
        mobileRename.onclick = async () => {
          await handleRenameClipboard();
          document.getElementById("mobileMenu").classList.remove("open");
        };
      }

      if (mobileDelete) {
        mobileDelete.onclick = () => {
          document.getElementById("mobileMenu").classList.remove("open");
          handleDeleteClipboard();
        };
      }

      /* =========================
         DROPMIND INFO AND CLIPBOARD ID
      ========================= */

      document.getElementById("appTitle").onclick = () => {

        const select = document.getElementById("clipboardSelect");
        const id = select?.value;

        const current = CLIPBOARDS?.find(c => c.id == id);

        const version = "2.0";

        alert(`DropMind v${version}\n\nClipboard: ${current?.name || "Unknown"}\nID: ${id}`);
      };

      /* =========================
         LOAD MESSAGES
      ========================= */
      function highlight(text, search) {

        if (!search) return text;

        // escape HTML per evitare che <mark> rompa il rendering
        const escapedHtml = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]]/g, '\\$&');

        const regex = new RegExp("(" + escapedSearch + ")", "gi");

        return escapedHtml.replace(regex, "<mark>$1</mark>");
      }

      function isMapUrl(url) {
        return url.includes("maps.apple.com") ||
          url.includes("maps.app.goo.gl") ||
          url.includes("google.com/maps");
      }

      function parseAppleMaps(url) {
        try {
          const u = new URL(url);
          const name = u.searchParams.get("name");
          const ll = u.searchParams.get("ll");

          return {
            name: name ? decodeURIComponent(name) : "Posizione",
            coords: ll || null
          };
        } catch {
          return null;
        }
      }

      /* =================================
         CORE FUNCTIONS
      ================================= */

      async function refreshAll() {

        const select = document.getElementById("clipboardSelect");
        const currentValue = select ? select.value : null;

        await loadClipboards(currentValue);
        await load();

      }

      /* =========================
         MESSAGE DATA
      ========================= */

      function getMessageRequest() {

        return {
          clipboardId: document.getElementById("clipboardSelect").value,
          order: document.getElementById("order").value,
          isGlobal: document.getElementById("searchGlobal").checked
        };
      }

      async function fetchMessages({ clipboardId, order, isGlobal }) {

        let url = `/messages?order=${order}`;

        if (!isGlobal) {
          url += `&clipboard_id=${clipboardId}`;
        }

        const res = await api.fetch(url);
        if (!res.ok) return null;

        return res.json();
      }

      /* =========================
         MESSAGE FILTERING
      ========================= */

      function getMessageFilterState() {

        return {
          showPinned: document.getElementById("filterPinned").checked,
          showFiles: document.getElementById("filterFiles").checked,
          showText: document.getElementById("filterText").checked,
          searchValue: document.getElementById("search").value.trim().toLowerCase()
        };
      }

      function filterMessages(messages, filterState) {

        let filtered = messages;

        // pinned filter
        if (filterState.showPinned) {
          filtered = filtered.filter(m => m.pinned === 1);
        }

        // file filter
        if (filterState.showFiles) {
          filtered = filtered.filter(m => m.filename);
        }

        // text filter
        if (filterState.showText) {
          filtered = filtered.filter(m => !m.filename);
        }

        // search
        if (filterState.searchValue) {
          filtered = filtered.filter(m =>
            (m.text && m.text.toLowerCase().includes(filterState.searchValue)) ||
            (m.title && !m.filename && m.title.toLowerCase().includes(filterState.searchValue)) ||
            (m.filename && m.filename.toLowerCase().includes(filterState.searchValue))
          );
        }

        return filtered;
      }

      /* =========================
         MESSAGE VIEW
      ========================= */

      function renderActiveFilters(filterState) {

        const activeFiltersBar = document.getElementById("activeFiltersBar");
        let activeLabels = [];

        if (filterState.showPinned) {
          activeLabels.push("Pinned only");
        }

        if (filterState.showFiles) {
          activeLabels.push("Files only");
        }

        if (filterState.showText) {
          activeLabels.push("Text only");
        }

        if (activeLabels.length > 0) {
          activeFiltersBar.style.display = "flex";
          activeFiltersBar.innerHTML =
            "<strong>Active filters:</strong> " +
            activeLabels.map(f => `<span>${f}</span>`).join("");
        } else {
          activeFiltersBar.style.display = "none";
        }
      }

      function createMessageCard(message, searchValue) {

        const m = message;

        /*========================================
          MESSAGE CARD
        ========================================*/

        const div = document.createElement("div");
        div.className = "message";
        div.setAttribute("data-id", m.id);
        if (m.pinned) div.classList.add("pinned");

        if (m.filename && m.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
          div.classList.add("image");
          div.classList.add("actions-vertical");
        }

        const content = document.createElement("div");

        if (m.filename) {
          if (m.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
            const displayName = m.original_filename ?? m.filename ?? "";

            content.innerHTML = `
              <div class="image-wrapper">
                <img loading="lazy" src="${API_BASE_URL}/thumbs/${m.filename}?token=${appConfig.apiToken}&t=${Date.now()}">
                ${m.text ? `<div class="file-text">${m.text}</div>` : ""}
              </div>
            `;

            setTimeout(() => {
              const img = content.querySelector("img");
              if (!img) return;

              img.addEventListener("click", () => {

                if (selection.isActive) return;

                const overlay = document.getElementById("imgOverlay");
                const overlayImg = document.getElementById("imgOverlayContent");

                // show immediatelly actual thumbnail
                overlayImg.src = img.src;
                overlay.style.display = "flex";

                // preload original
                const fullImg = new Image();

                fullImg.onload = () => {
                  overlayImg.src = fullImg.src;
                };

                fullImg.src =
                  `${API_BASE_URL}/previews/${m.filename}?token=${appConfig.apiToken}&t=${Date.now()}`;
              });
            }, 0);
          } else {
            const displayName = m.original_filename || m.filename;

            const fileNameDisplay = searchValue
              ? highlight(displayName, searchValue)
              : displayName;

            const sizeText = formatFileSize(m.file_size);

            content.innerHTML = `
              <div class="file-card">
                <span class="file-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18"
                    stroke="currentColor" fill="none"
                    stroke-width="2" stroke-linecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                </span>

                <span class="file-name">
                  ${fileNameDisplay}
                  ${sizeText
                ? `<span style="opacity:.6; font-size:12px; margin-left:6px;">(${sizeText})</span>`
                : ""
              }
                </span>
              </div>

              ${m.text ? `<div class="file-text">${m.text}</div>` : ""}
            `;
          }

        } else {

          const text = m.text || "";
          const urlRegex = /^https?:\/\/[^\s]+$/i;

          const parts = text.split(/\n?---\n?/);
          let urlPart = parts[0].trim();

          // Extract URL from mixed text
          const urls = text.match(/https?:\/\/[^\s]+/g);

          // 👉 case 1: only link
          if (urls && urls.length === 1 && text.trim() === urls[0]) {
            urlPart = urls[0];
          }

          // 👉 case 2: title + link (bookmarklet)
          else if (
            urls &&
            urls.length === 1 &&
            parts.length > 1 &&
            parts[0].includes(urls[0])
          ) {
            urlPart = urls[0];
          }

          // 👉 case 3: title + link WITHOUT separation line (bookmarklet)
          else if (
            urls &&
            urls.length === 1 &&
            text.includes("\n")
          ) {
            urlPart = urls[0];
          }

          // 👉 case 4: mixed text
          else {
            urlPart = null;
          }
          const descriptionPart = parts[1] ? parts[1].trim() : "";

          if (urlPart && isMapUrl(urlPart)) {
            div.classList.add("location");

            let locationName = "Posizione salvata";
            let coords = "";

            if (urlPart.includes("maps.apple.com")) {
              try {
                const u = new URL(urlPart);
                locationName = u.searchParams.get("name")
                  ? decodeURIComponent(u.searchParams.get("name"))
                  : locationName;

                coords = u.searchParams.get("ll") ||
                  u.searchParams.get("coordinate") ||
                  "";
              } catch { }
            }

            content.innerHTML = `
              <div class="link-card">
                <div class="link-icon">${ICONS.map}</div>
                <div class="link-info">
                  <div class="link-domain">${locationName}</div>
                  ${coords ? `<div class="link-url">${coords}</div>` : ""}
                  ${descriptionPart ? `<div class="file-text">${descriptionPart}</div>` : ""}
                </div>
              </div>
            `;

          } else if (urlPart && urlRegex.test(urlPart)) {

            div.classList.add("link");

            content.innerHTML = `
              <div class="link-card">
                <div class="link-icon">${ICONS.link}</div>
                <div class="link-info">
                  <div class="link-domain">${new URL(urlPart).hostname}</div>
                  <div class="link-url">${urlPart}</div>
                  ${descriptionPart ? `<div class="file-text">${descriptionPart}</div>` : ""}
                </div>
              </div>
            `;

          } else {

            if (m.title && !m.filename && !div.classList.contains("link") && !div.classList.contains("location")) {
              const titleElem = document.createElement("div");
              titleElem.classList.add("message-title");

              if (searchValue) {
                titleElem.innerHTML = highlight(m.title, searchValue);
              } else {
                titleElem.textContent = m.title;
              }

              content.appendChild(titleElem);
            }

            const textElem = document.createElement("div");
            textElem.classList.add("message-text");

            if (searchValue) {
              textElem.innerHTML = highlight(text, searchValue);
            } else {
              textElem.textContent = text;
            }

            content.appendChild(textElem);

            setTimeout(() => {

              if (textElem.scrollHeight > textElem.clientHeight) {

                const expandBtn = document.createElement("button");
                expandBtn.classList.add("expand-btn");
                expandBtn.textContent = "Expand";

                expandBtn.addEventListener("click", (e) => {
                  e.stopPropagation();
                  textElem.classList.toggle("expanded");

                  expandBtn.textContent =
                    textElem.classList.contains("expanded")
                      ? "Collapse"
                      : "Expand";
                });

                content.appendChild(expandBtn);

              }

            }, 0);
          }
        }

        div.appendChild(content);

        /*========================================
          CARD INTERACTIONS
        ========================================*/

        // Desktop double click on card
        let clickTimer = null;

        /* LONG PRESS FOR MULTI SELECT */

        // BLOCCA click fantasma dopo touch

        let touchMoved = false;

        bindLongPress(div, {
          delay: 500,
          onTouchStart: () => {
            lastTouchTime = Date.now();
            touchHandled = false;
            touchMoved = false;
          },
          shouldStart: () => !selection.isActive,
          onLongPress: e => {
            e.preventDefault();

            selection.enter();

            document.body.classList.add("selection-mode");

            selection.select(m.id);

            div.classList.add("selected");

            updateSelectionUI();

            touchHandled = true;

            console.log("Selection mode ON", selection.getSelected());
          },
          onTouchMove: () => {
            touchMoved = true;
          }
        });

        let lastTap = 0;

        div.addEventListener("touchend", (e) => {

          if (touchHandled) {
            touchHandled = false;
            return;
          }

          if (selection.isActive && !touchMoved) {

            if (selection.has(m.id)) {
              selection.deselect(m.id);
              div.classList.remove("selected");
            } else {
              selection.select(m.id);
              div.classList.add("selected");
            }

            if (selection.count === 0) {
              selection.exit();
              document.body.classList.remove("selection-mode");

              document.querySelectorAll(".message")
                .forEach(el => el.classList.remove("show-actions"));
            }

            updateSelectionUI();
            return;
          }

          const now = Date.now();
          const delta = now - lastTap;

          if (delta < 300 && delta > 0) {
            // 👉 DOUBLE TAP MOBILE
            if (!div.classList.contains("image") && !selection.isActive) {
              enterEditMode(m, content);
            }
          }

          lastTap = now;
        });

        div.addEventListener("click", (e) => {

          if (Date.now() - lastTouchTime < 300) {
            return;
          }

          // MULTISELECT MODE
          if (selection.isActive) {

            if (selection.has(m.id)) {
              selection.deselect(m.id);
              div.classList.remove("selected");
            } else {
              selection.select(m.id);
              div.classList.add("selected");
            }

            if (selection.count === 0) {
              selection.exit();
              document.body.classList.remove("selection-mode");
            }

            updateSelectionUI();
            return;
          }

          if (touchHandled && !selection.isActive) {
            touchHandled = false;
          } else if (touchHandled) {
            touchHandled = false;
            return;
          }

          // DESKTOP MULTI SELECT (CTRL/CMD + CLICK)

          if (e.ctrlKey || e.metaKey) {

            if (!selection.isActive) {
              selection.enter();
            }

            if (selection.has(m.id)) {
              selection.deselect(m.id);
              div.classList.remove("selected");
            } else {
              selection.select(m.id);
              div.classList.add("selected");
            }

            if (selection.count === 0) {
              selection.exit();
              document.body.classList.remove("selection-mode");
            }

            updateSelectionUI();
            return;
          }

          if (div.querySelector("textarea")) return;
          if (div.classList.contains("move-active")) return;

          // MULTI SELECT MODE
          if (selection.isActive) {

            if (selection.has(m.id)) {
              selection.deselect(m.id);
              div.classList.remove("selected");
            } else {
              selection.select(m.id);
              div.classList.add("selected");
            }

            // AUTO EXIT if nothing selected
            if (selection.count === 0) {
              selection.exit();
            }

            console.log("Selected:", selection.getSelected());
            updateSelectionUI();
            return;
          }

          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;

            if (!div.classList.contains("image")) {
              enterEditMode(m, content);
            }

          } else {
            clickTimer = setTimeout(() => {
              clickTimer = null;

              // Open link only on desktop (mouse)
              if (
                (div.classList.contains("link") || div.classList.contains("location")) &&
                window.matchMedia("(hover: hover) and (pointer: fine)").matches
              ) {
                const url = m.text.match(/https?:\/\/[^\s]+/)?.[0];
                if (url) window.open(url, "_blank");
              }
            }, 300); // double click timer
          }

        });

        /* Buttons */
        const actions = document.createElement("div");
        actions.className = "message-actions";

        /* 🔗 LINKand LOCATION */
        if (div.classList.contains("link") || div.classList.contains("location")) {
          const openBtn = document.createElement("button");
          openBtn.innerHTML = ICONS.link;
          openBtn.title = "Open link";

          openBtn.onclick = (e) => {
            e.stopPropagation();
            const url = m.text.match(/https?:\/\/[^\s]+/)?.[0];
            if (url) window.open(url, "_blank");
          };

          actions.appendChild(openBtn);
        }

        const pinBtn = document.createElement("button");
        pinBtn.innerHTML = ICONS.pin;
        pinBtn.title = m.pinned ? "Unpin" : "Pin";

        if (m.pinned) {
          pinBtn.classList.add("pin-active");
        }

        pinBtn.onclick = (e) => {
          e.stopPropagation();
          pinMessage(m.id, !m.pinned);
        };

        /* COPY */
        const copy = document.createElement("button");
        copy.innerHTML = ICONS.copy;
        copy.title = "Copy text";
        copy.onclick = async (e) => {
          e.stopPropagation();

          try {
            await navigator.clipboard.writeText(m.text || "");

            copy.style.background = "rgba(59,130,246,0.35)";
            copy.style.borderColor = "rgba(59,130,246,0.6)";

            setTimeout(() => {
              copy.style.background = "";
              copy.style.borderColor = "";
            }, 400);

          } catch (err) {
            console.error(err);
          }
        };
        // actions.appendChild(copy);

        const moveBtn = document.createElement("button");
        moveBtn.innerHTML = ICONS.move;
        moveBtn.title = "Move to another clipboard";

        moveBtn.onclick = (e) => {
          e.stopPropagation();
          moveMessage(m.id);
        };

        if (m.filename) {

          const downloadBtn = document.createElement("button");
          downloadBtn.innerHTML = ICONS.download;
          downloadBtn.title = "Download file";

          downloadBtn.onclick = (e) => {

            e.stopPropagation();

            const fileUrl =
              `${API_BASE_URL}/files/${m.filename}?token=${appConfig.apiToken}`;

            // PDF -> open
            if (m.filename.match(/\.pdf$/i)) {

              window.open(fileUrl, "_blank");
              return;

            }

            // everything else -> download
            const a = document.createElement("a");

            a.href = fileUrl;
            a.download = m.original_filename || m.filename;

            document.body.appendChild(a);

            a.click();

            document.body.removeChild(a);

          };

          actions.appendChild(downloadBtn);

        }

        const delBtn = document.createElement("button");
        delBtn.innerHTML = ICONS.delete;
        delBtn.title = "Delete message";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          deleteMessage(m.id);
        };

        actions.append(pinBtn, copy, moveBtn, delBtn);
        div.appendChild(actions);

        return div;
      }

      function renderMessages(filtered, searchValue) {

        const container = document.getElementById("messages");
        container.innerHTML = "";

        filtered.forEach(message => {
          container.appendChild(createMessageCard(message, searchValue));
        });
      }

      async function load() {

        const messageRequest = getMessageRequest();
        const favoriteId = localStorage.getItem("dm_favorite_clipboard");
        const desktopFavoriteBtn = document.getElementById("favoriteClipboardBtn");

        if (!navigator.onLine) {
          console.log("Offline: skip load");
          return;
        }

        if (desktopFavoriteBtn) {
          desktopFavoriteBtn.classList.toggle(
            "favorite-active",
            messageRequest.clipboardId == favoriteId
          );
        }

        const messages = await fetchMessages(messageRequest);
        if (!messages) return;

        const filterState = getMessageFilterState();
        const filtered = filterMessages(messages, filterState);

        renderActiveFilters(filterState);
        renderMessages(filtered, filterState.searchValue);
      }

      /* =========================
         NEW MESSAGE CHECK
      ========================= */

      const NEW_MESSAGE_CHECK_INTERVAL = 60_000;
      let newMessageCheckTimer = null;
      let newMessageCheckInFlight = false;

      function isSameMessageRequest(firstRequest, secondRequest) {

        return firstRequest.clipboardId === secondRequest.clipboardId &&
          firstRequest.order === secondRequest.order &&
          firstRequest.isGlobal === secondRequest.isGlobal;
      }

      function isSameMessageFilterState(firstState, secondState) {

        return firstState.showPinned === secondState.showPinned &&
          firstState.showFiles === secondState.showFiles &&
          firstState.showText === secondState.showText &&
          firstState.searchValue === secondState.searchValue;
      }

      function isNewMessageCheckSafe() {

        if (document.visibilityState !== "visible" || !navigator.onLine) {
          return false;
        }

        if (selection.isActive) {
          return false;
        }

        if (document.querySelector(".message.editing, .move-select, .message.show-actions")) {
          return false;
        }

        if (document.getElementById("imgOverlay").style.display === "flex") {
          return false;
        }

        if (document.getElementById("mobileMenu").classList.contains("open")) {
          return false;
        }

        if (Array.from(document.querySelectorAll(".dm-dropdown-menu"))
          .some(menu => menu.style.display === "block")) {
          return false;
        }

        const moveMenu = document.getElementById("moveMenu");
        if (moveMenu.classList.contains("open") || moveMenu.style.display === "flex") {
          return false;
        }

        return true;
      }

      function captureMessageScrollAnchor(container) {

        if (container.scrollTop <= 0) {
          return null;
        }

        const containerTop = container.getBoundingClientRect().top;
        const anchorCard = Array.from(container.querySelectorAll(".message"))
          .find(card => card.getBoundingClientRect().bottom > containerTop);

        if (!anchorCard) {
          return null;
        }

        return {
          card: anchorCard,
          offset: anchorCard.getBoundingClientRect().top - containerTop
        };
      }

      function restoreMessageScrollAnchor(container, anchor) {

        if (!anchor || !anchor.card.isConnected) {
          return;
        }

        const currentOffset =
          anchor.card.getBoundingClientRect().top - container.getBoundingClientRect().top;
        const offsetChange = currentOffset - anchor.offset;

        if (offsetChange === 0) {
          return;
        }

        const previousScrollBehavior = container.style.scrollBehavior;
        container.style.scrollBehavior = "auto";
        container.scrollTop += offsetChange;
        container.style.scrollBehavior = previousScrollBehavior;
      }

      function insertNewMessageCards(messages, searchValue) {

        const container = document.getElementById("messages");
        const cardsById = new Map(
          Array.from(container.querySelectorAll(".message[data-id]"))
            .map(card => [card.dataset.id, card])
        );
        const hasNewMessages = messages.some(message =>
          !cardsById.has(String(message.id))
        );

        if (!hasNewMessages) {
          return false;
        }

        const scrollAnchor = captureMessageScrollAnchor(container);
        let nextCard = null;

        for (let index = messages.length - 1; index >= 0; index -= 1) {
          const message = messages[index];
          const messageId = String(message.id);
          const existingCard = cardsById.get(messageId);

          if (existingCard) {
            nextCard = existingCard;
            continue;
          }

          const newCard = createMessageCard(message, searchValue);
          container.insertBefore(newCard, nextCard);
          cardsById.set(messageId, newCard);
          nextCard = newCard;
        }

        restoreMessageScrollAnchor(container, scrollAnchor);
        return true;
      }

      async function checkForNewMessages() {

        if (newMessageCheckInFlight || !isNewMessageCheckSafe()) {
          return;
        }

        const messageRequest = getMessageRequest();
        const filterState = getMessageFilterState();

        newMessageCheckInFlight = true;

        try {
          const messages = await fetchMessages(messageRequest);
          if (!messages || !isNewMessageCheckSafe()) {
            return;
          }

          if (!isSameMessageRequest(messageRequest, getMessageRequest()) ||
            !isSameMessageFilterState(filterState, getMessageFilterState())) {
            return;
          }

          const filteredMessages = filterMessages(messages, filterState);
          insertNewMessageCards(filteredMessages, filterState.searchValue);

        } catch (error) {
          console.error("New message check failed:", error);
        } finally {
          newMessageCheckInFlight = false;
        }
      }

      function stopNewMessageCheck() {

        clearTimeout(newMessageCheckTimer);
        newMessageCheckTimer = null;
      }

      function scheduleNewMessageCheck(delay = NEW_MESSAGE_CHECK_INTERVAL) {

        stopNewMessageCheck();

        if (document.visibilityState !== "visible" || !navigator.onLine) {
          return;
        }

        newMessageCheckTimer = setTimeout(async () => {
          newMessageCheckTimer = null;
          await checkForNewMessages();
          scheduleNewMessageCheck();
        }, delay);
      }

      function initializeNewMessageCheck() {

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") {
            scheduleNewMessageCheck();
          } else {
            stopNewMessageCheck();
          }
        });

        window.addEventListener("online", () => scheduleNewMessageCheck());
        window.addEventListener("offline", stopNewMessageCheck);

        scheduleNewMessageCheck();
      }

      /* =========================
         SEND MESSAGE
      ========================= */
      async function send() {

        const textInput = document.getElementById("text");
        const fileInput = document.getElementById("file");
        const clipboardId = document.getElementById("clipboardSelect").value;

        const text = textInput.value.trim();
        const file = fileInput.files[0];

        if (!navigator.onLine) return;

        if (!file && !text) return;

        let response;

        try {

          if (file) {

            const form = new FormData();
            form.append("file", file);
            form.append("clipboard_id", clipboardId);
            form.append("text", text || "");

            response = await api.fetch("/messages/file", {
              method: "POST",
              body: form
            });

          } else {

            response = await api.fetch("/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                text: text,
                clipboard_id: parseInt(clipboardId)
              })
            });
          }

          if (!response.ok) {
            console.error("Errore invio messaggio");
            return;
          }

          // Reset input solo se OK
          textInput.value = "";
          textInput.style.height = "44px";
          fileInput.value = "";
          document.getElementById("filePreview").style.display = "none";

          await refreshAll();

          const container = document.getElementById("messages");
          const order = document.getElementById("order").value;

          if (order === "recent") {
            container.scrollTo({ top: 0, behavior: "smooth" });
          }

          if (order === "oldest") {
            container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
          }

        } catch (err) {
          console.error("Errore di rete:", err);
        }
      }

      document.getElementById("sendBtn").addEventListener("click", send);

      // ===============================
      // FILE PREVIEW
      // ===============================
      document.getElementById("file").addEventListener("change", (e) => {
        const preview = document.getElementById("filePreview");
        const file = e.target.files[0];

        if (file) {
          preview.innerHTML = ICONS.copy + " " + file.name;
          preview.style.display = "block";
        } else {
          preview.style.display = "none";
        }
      });

      /* =========================
         PIN
      ========================= */
      async function pinMessage(id, pinned) {
        await api.fetch(`/messages/${id}/pin?pinned=${pinned}`, {
          method: "POST"
        });
        refreshAll();
      }

      /* =========================
         MOVE
      ========================= */
      async function moveMessage(id) {

        // find message
        const messageCard = document.querySelector(`[data-id="${id}"]`);
        if (!messageCard) return;

        const imageWrapper = messageCard.querySelector(".image-wrapper");
        const img = imageWrapper?.querySelector("img");
        if (img) {
          img.style.willChange = "transform";
          img.style.transform = "translateZ(0)";
          img.offsetHeight; // forza reflow
          img.style.transform = "";
          img.style.willChange = "";
        }

        messageCard.classList.add("move-active");

        messageCard.classList.remove("show-actions");

        // avoid duoble menu
        if (messageCard.querySelector(".move-select")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "move-select";

        const select = document.createElement("select");
        select.style.padding = "6px";
        select.style.borderRadius = "6px";

        CLIPBOARDS.forEach(c => {
          const opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.name;
          select.appendChild(opt);
        });

        const btn = document.createElement("button");
        btn.textContent = "Move";
        btn.classList.add("confirm-move");

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";

        cancelBtn.addEventListener("click", (e) => {

          e.stopPropagation();

          wrapper.remove();

          messageCard.classList.remove("move-active");

          const imageWrapper = messageCard.querySelector(".image-wrapper");
          if (imageWrapper) {
            imageWrapper.style.display = "";
            const img = imageWrapper.querySelector("img");
            if (img) img.style.display = "";
          }
        });

        wrapper.appendChild(select);
        wrapper.appendChild(btn);
        wrapper.appendChild(cancelBtn);

        if (imageWrapper) {
          const img = imageWrapper.querySelector("img");
          if (img) img.style.display = "none";
          imageWrapper.style.display = "none";
        }

        messageCard.style.transform = "translateZ(0)";
        messageCard.offsetHeight; // forza reflow
        messageCard.style.transform = "";

        messageCard.appendChild(wrapper);

        btn.onclick = async () => {

          const targetId = select.value;

          await api.fetch(`/messages/${id}/move?clipboard_id=${targetId}`, {
            method: "POST"
          });

          messageCard.classList.remove("move-active");

          await loadClipboards(targetId);
          await load();

        };
      }

      /* ============================
             MOVE MULTISELECT
      =========================== */

      async function moveSelectedMessages(targetClipboard) {
        const ids = selection.getSelected();

        await Promise.all(
          ids.map(id =>
            api.fetch(`/messages/${id}/move?clipboard_id=${targetClipboard}`, {
              method: "POST"
            })
          )
        );

        await refreshAll();
      }

      /* ============================
             Edit Mode
      =========================== */

      async function enterEditMode(m, contentDiv) {

        const card = contentDiv.closest(".message");

        if (card && card.classList.contains("image")) return;

        if (card) {
          card.classList.remove("show-actions");
          card.classList.add("editing");
        }

        let originalText = m.text || "";

        let urlPart = originalText;
        let descriptionPart = originalText;

        // if is card link, divide URL and description
        if (card && (card.classList.contains("link") || card.classList.contains("location"))) {

          const urlMatch = originalText.match(/https?:\/\/[^\s]+/);
          urlPart = urlMatch ? urlMatch[0] : "";

          if (originalText.includes("---")) {
            const parts = originalText.split(/\n?---\n?/);
            descriptionPart = parts[1] ? parts[1].trim() : "";
          } else {
            descriptionPart = "";
          }
        }

        let titleInput = null;

        const isTextCard =
          !card.classList.contains("link") &&
          !card.classList.contains("location") &&
          !m.filename;

        if (isTextCard) {

          titleInput = document.createElement("input");

          titleInput.type = "text";
          titleInput.placeholder = "Title (optional)";
          titleInput.value = m.title || "";

          titleInput.style.width = "100%";
          titleInput.style.height = "44px";
          titleInput.style.marginBottom = "10px";

          titleInput.style.background = "#0f172a";
          titleInput.style.color = "#e5e7eb";
          titleInput.style.border = "1px solid #334155";
          titleInput.style.borderRadius = "14px";
          titleInput.style.padding = "0 18px";
          titleInput.style.fontFamily = "inherit";
          titleInput.style.fontSize = "14px";
          titleInput.style.boxSizing = "border-box";
        }

        const textarea = document.createElement("textarea");
        textarea.value = descriptionPart;

        textarea.style.width = "100%";
        textarea.style.height = "44px";
        textarea.style.minHeight = "44px";
        textarea.style.maxHeight = "160px";

        textarea.style.background = "#0f172a";
        textarea.style.color = "#e5e7eb";
        textarea.style.border = "1px solid #334155";
        textarea.style.borderRadius = "14px";
        textarea.style.padding = "10px 18px";

        textarea.style.fontFamily = "inherit";
        textarea.style.fontSize = "14px";
        textarea.style.lineHeight = "1.4";

        textarea.style.resize = "none";
        textarea.style.overflowY = "auto";
        textarea.style.boxSizing = "border-box";

        const autoResize = () => {

          if (!textarea.value.trim()) {
            textarea.style.height = "44px";
            return;
          }

          textarea.style.height = "auto";

          const newHeight = Math.min(textarea.scrollHeight, 160);

          textarea.style.height = newHeight + "px";
        };

        textarea.addEventListener("input", autoResize);

        setTimeout(autoResize, 0);

        const actions = document.createElement("div");
        actions.style.marginTop = "8px";
        actions.style.display = "flex";
        actions.style.gap = "8px";

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";

        saveBtn.style.background = "#2563eb";
        saveBtn.style.color = "white";
        saveBtn.style.border = "none";
        saveBtn.style.padding = "6px 12px";
        saveBtn.style.borderRadius = "6px";

        cancelBtn.style.background = "#334155";
        cancelBtn.style.color = "white";
        cancelBtn.style.border = "none";
        cancelBtn.style.padding = "6px 12px";
        cancelBtn.style.borderRadius = "6px";

        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);

        contentDiv.innerHTML = "";
        contentDiv.style.display = "block";

        if (titleInput) {
          contentDiv.appendChild(titleInput);
        }

        contentDiv.appendChild(textarea);
        contentDiv.appendChild(actions);

        textarea.focus();

        cancelBtn.onclick = () => refreshAll();

        saveBtn.onclick = async () => {

          const form = new FormData();

          const title = titleInput
            ? titleInput.value.trim()
            : "";

          form.append("title", title);

          // If is link card
          const card = contentDiv.closest(".message");

          if (card && (card.classList.contains("link") || card.classList.contains("location"))) {

            const parts = m.text.split(/\n?---\n?/);
            const urlPart = parts[0].trim();

            const newDescription = textarea.value.trim();

            const currentDescription = parts[1] ? parts[1].trim() : "";

            if (newDescription) {
              form.append("text", urlPart + "\n---\n" + newDescription);
            } else {
              form.append("text", urlPart);
            }

          } else {
            form.append("text", textarea.value.trim());
          }

          await api.fetch(`/messages/${m.id}`, {
            method: "PUT",
            body: form
          });

          refreshAll();
        };
      }


      /* =========================
         DELETE
      ========================= */
      async function deleteMessage(id) {
        await api.fetch(`/messages/${id}`, {
          method: "DELETE"
        });
        refreshAll();
      }

      // ==============================
      // ANDROID SHARE HANDLER
      // ==============================

      function handleSharedContent() {

        if (window.__dropmindShareHandled) return;
        window.__dropmindShareHandled = true;

        const params = new URLSearchParams(window.location.search);

        const shared =
          params.get("share") ||
          params.get("text") ||
          params.get("url");

        const sharedFile =
          params.get("shared_file") ||
          params.get("file");

        const input = document.getElementById("text");

        // text or link shared
        if (shared && input) {
          input.value = decodeURIComponent(shared);
          send();
        }

        // file shared (immage or document)
        if (sharedFile) {
          load();
        }

        // clean URL
        history.replaceState({}, document.title, window.location.pathname);
      }

      // ==============================
      // TEXTAREA AUTO EXPAND
      // ==============================

      const textInput = document.getElementById("text");

      if (textInput) {

        const autoGrow = () => {

          if (!textInput.value.trim()) {
            textInput.style.height = "44px";
            return;
          }

          textInput.style.height = "auto";

          const newHeight = Math.min(textInput.scrollHeight, 160);

          textInput.style.height = newHeight + "px";
        };

        textInput.addEventListener("input", autoGrow);

      }

      /* =========================
         INIT
      ========================= */
      (async () => {
        await loadClipboards();
        handleSharedContent();
        load();

        // autofocus input on start
        const textInput = document.getElementById("text");
        if (textInput) {
          setTimeout(() => textInput.focus(), 100);
        }

      })();

      /* ===============================
         QUICK PASTE (CTRL+V)
      ================================ */

      let lastPaste = 0;
      let pasteFromOutside = false;

      document.addEventListener("keydown", (e) => {

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {

          const textInput = document.getElementById("text");

          pasteFromOutside = document.activeElement !== textInput;
          lastPaste = Date.now();

        }

      });

      // if input change after CTRL+V → send
      document.getElementById("text").addEventListener("input", () => {

        const textInput = document.getElementById("text");

        if (pasteFromOutside && Date.now() - lastPaste < 400) {

          if (textInput.value.trim() !== "") {

            send();
            textInput.value = "";

          }

        }

      });

      /* ===============================
         DROPDOWN UI
      ================================ */

      // clipboard dropdown
      document.getElementById("clipboardBtn").onclick = (e) => {

        e.stopPropagation();

        const menu = document.getElementById("clipboardMenu");
        const isOpen = menu.style.display === "block";

        document.querySelectorAll(".dm-dropdown-menu")
          .forEach(m => m.style.display = "none");

        if (!isOpen) {
          menu.style.display = "block";
        }

      };

      // order dropdown
      document.getElementById("orderBtn").onclick = (e) => {

        e.stopPropagation();

        const menu = document.getElementById("orderMenu");
        const isOpen = menu.style.display === "block";

        document.querySelectorAll(".dm-dropdown-menu")
          .forEach(m => m.style.display = "none");

        if (!isOpen) {
          menu.style.display = "block";
        }

      };

      // order items
      document.querySelectorAll("#orderMenu div").forEach(el => {

        el.onclick = () => {

          const value = el.dataset.value;

          document.getElementById("order").value = value;

          document.getElementById("orderBtn").textContent =
            el.textContent + " ▾";

          document.getElementById("orderMenu").style.display = "none";

          load();
        };

      });

      // close dropdown on click outside
      document.addEventListener("click", (e) => {

        if (!e.target.closest(".dm-dropdown")) {
          document.querySelectorAll(".dm-dropdown-menu")
            .forEach(m => m.style.display = "none");
        }

      });

      /* =================================
         KEYBOARD SHORTCUTS
      ================================= */

      // ESC removes focus from textarea
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const textInput = document.getElementById("text");
          if (textInput) {
            textInput.blur();
          }
        }
      });

      // CTRL+K focuses the input
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();

          const textInput = document.getElementById("text");
          if (textInput) {
            textInput.focus();
          }
        }
      });

      // CTRL+ENTER sends message
      document.addEventListener("keydown", (e) => {

        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {

          const textInput = document.getElementById("text");

          if (textInput && document.activeElement === textInput) {

            e.preventDefault();

            send();

          }

        }

      });

      // N focuses the input (new note)
      document.addEventListener("keydown", (e) => {

        if (
          e.key.toLowerCase() === "n" &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {

          const active = document.activeElement;

          if (
            active.tagName !== "INPUT" &&
            active.tagName !== "TEXTAREA"
          ) {

            e.preventDefault();

            const textInput = document.getElementById("text");
            if (textInput) {
              textInput.focus();
            }

          }

        }

      });

      // / focuses the search
      document.addEventListener("keydown", (e) => {

        if (
          (e.key === "/" || e.code === "Slash") &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {

          const active = document.activeElement;

          if (
            active.tagName !== "INPUT" &&
            active.tagName !== "TEXTAREA"
          ) {

            e.preventDefault();

            const searchInput = document.getElementById("search");
            if (searchInput) {
              searchInput.focus();
            }

          }

        }

      });

      // CTRL/CMD + V forces focus on input (Windows Chromium workaround)
      window.addEventListener("keydown", (e) => {

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {

          const input = document.getElementById("text");

          if (input && document.activeElement !== input) {
            input.focus();
          }

        }

      });

      /* =================================
         CARD INTERACTIONS
      ================================= */

      // close image overlay
      document.getElementById("imgOverlay").addEventListener("click", () => {
        document.getElementById("imgOverlay").style.display = "none";
      });

      document.getElementById("order").addEventListener("change", load);
      document.getElementById("clipboardSelect").addEventListener("change", load);

      let searchTimer;

      document.getElementById("search").addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(load, 250);
      });

      document.getElementById("searchGlobal").addEventListener("change", load);

      document.getElementById("filterPinned").addEventListener("change", load);
      document.getElementById("filterFiles").addEventListener("change", load);
      document.getElementById("filterText").addEventListener("change", load);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          document.activeElement.blur();
        }
      });

      // inibit contextual menu on images (iOS long press)
      document.addEventListener("contextmenu", function (e) {
        if (e.target.closest(".message.image")) {
          e.preventDefault();
        }
      });

      /* ==============================
         TOUCH CARD ACTIONS
      ============================== */

      document.addEventListener("click", (e) => {

        const card = e.target.closest(".message");

        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        // === DESKTOP ===
        if (isDesktop) {

          if (!card) {
            document.querySelectorAll(".message.show-actions")
              .forEach(el => el.classList.remove("show-actions"));
            return;
          }

          if (e.target.closest(".message-actions")) return;

          // Close all others card
          document.querySelectorAll(".message.show-actions")
            .forEach(el => {
              if (el !== card) {
                el.classList.remove("show-actions");
              }
            });

          // Activate this card
          card.classList.toggle("show-actions");
          return;
        }

        // Click out → close everything
        if (!card) {
          document.querySelectorAll(".message.show-actions")
            .forEach(el => el.classList.remove("show-actions"));
          return;
        }

        // Click on buttons → do nothing
        if (e.target.closest(".message-actions")) return;

        // Close all others
        document.querySelectorAll(".message.show-actions")
          .forEach(el => {
            if (el !== card) {
              el.classList.remove("show-actions");
            }
          });

        setTimeout(() => {
          card.classList.toggle("show-actions");
        }, 320);

      });

      document.getElementById("mobileMenuBtn")
        .addEventListener("click", (e) => {

          const menu = document.getElementById("mobileMenu");
          menu.classList.toggle("open");

          e.currentTarget.blur();
        });

      document.getElementById("refreshBtn")
        .addEventListener("click", async (e) => {

          const btn = e.currentTarget;

          btn.classList.add("spinning");

          await refreshAll();

          setTimeout(() => {
            btn.classList.remove("spinning");
          }, 600);
          btn.blur();
        });

      // ==============================
      // SYNC MOBILE CONTROLS
      // ==============================

      document.getElementById("order-mobile").addEventListener("change", (e) => {
        document.getElementById("order").value = e.target.value;
        load();
      });

      document.getElementById("filterPinnedMobile").addEventListener("change", (e) => {
        document.getElementById("filterPinned").checked = e.target.checked;
        load();
      });

      document.getElementById("filterFilesMobile").addEventListener("change", (e) => {
        document.getElementById("filterFiles").checked = e.target.checked;
        load();
      });

      document.getElementById("filterTextMobile").addEventListener("change", (e) => {
        document.getElementById("filterText").checked = e.target.checked;
        load();
      });

      document.getElementById("closeMobileMenuBtn")
        .addEventListener("click", () => {
          document.getElementById("mobileMenu").classList.remove("open");
        });

      document.getElementById("selectionCancel").onclick = () => {

        selection.exit();

        selection.clear();

        document.body.classList.remove("selection-mode");

        document.querySelectorAll(".message.selected")
          .forEach(el => el.classList.remove("selected"));

        document.querySelectorAll(".message")
          .forEach(el => el.classList.remove("show-actions"));

        updateSelectionUI();

      };

      /* =========================
        MULTI DELETE
      ========================= */

      document.getElementById("selectionDelete").onclick = async () => {
        if (selection.count === 0) return;

        const ids = selection.getSelected();

        await Promise.all(
          ids.map(id =>
            api.fetch(`/messages/${id}`, {
              method: "DELETE"
            })
          )
        );

        selection.clear();
        selection.exit();
        clearCardSelection();
        updateSelectionUI();

        await refreshAll();
      };

      /* =========================
         MULTI MOVE
      ========================= */

      const moveBtn = document.getElementById("selectionMove");
      const moveMenu = document.getElementById("moveMenu");

      moveBtn.onclick = () => {

        if (selection.count === 0) return;

        if (moveMenu.style.display === "flex") {
          moveMenu.style.display = "none";
          return;
        }

        moveMenu.innerHTML = "";

        moveMenu.style.top = "";
        moveMenu.style.transform = "";

        const current = document.getElementById("clipboardSelect").value;

        CLIPBOARDS.forEach(c => {

          if (String(c.id) === String(current)) return;

          const btn = document.createElement("button");
          btn.textContent = c.name;

          btn.onclick = async () => {

            await moveSelectedMessages(c.id);

            selection.clear();
            selection.exit();
            clearCardSelection();
            updateSelectionUI();

            const select = document.getElementById("clipboardSelect");
            select.value = c.id;

            document.getElementById("clipboardBtn").textContent =
              c.name + " ▾";

            document.querySelectorAll("#clipboardMenu div")
              .forEach(el => el.style.background = "");

            document.querySelectorAll("#clipboardMenu div")
              .forEach(el => {
                if (el.dataset.value == c.id) {
                  el.style.background = "rgba(59,130,246,0.15)";
                }
              });

            await load();

            moveMenu.style.display = "none";

          };

          moveMenu.appendChild(btn);

        });

        const rect = moveBtn.getBoundingClientRect();

        moveMenu.style.display = "flex";
        moveMenu.style.position = "fixed";

        requestAnimationFrame(() => {
          const menuHeight = moveMenu.offsetHeight;
          const menuWidth = moveMenu.offsetWidth;

          moveMenu.style.top = (rect.top - menuHeight - 12) + "px";
          moveMenu.style.left =
            rect.left + rect.width / 2 - menuWidth / 2 + "px";

          moveMenu.classList.add("open");
        });

      };

      /* =========================
        CLOSE MOVE MENU
      ========================= */

      document.addEventListener("click", e => {

        const menu = document.getElementById("moveMenu");
        const btn = document.getElementById("selectionMove");

        if (!menu.contains(e.target) && e.target !== btn) {
          moveMenu.classList.remove("open");

          setTimeout(() => {
            moveMenu.style.display = "none";
          }, 150);
        }

      });

      // ==============================
      // CLOSE ACTIONS ON SCROLL
      // ==============================

      const messagesContainer = document.getElementById("messages");

      if (messagesContainer) {

        let scrollTimer;

        messagesContainer.addEventListener("scroll", () => {

          messagesContainer.classList.add("scrolling");

          document.querySelectorAll(".message.show-actions")
            .forEach(el => el.classList.remove("show-actions"));

          clearTimeout(scrollTimer);

          scrollTimer = setTimeout(() => {
            messagesContainer.classList.remove("scrolling");
          }, 120);

        });

      }

      function updateOnlineStatus() {

        const banner = document.getElementById("offline-banner");

        if (!banner) return;

        banner.style.display = navigator.onLine
          ? "none"
          : "block";
      }

      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);

      updateOnlineStatus();
      initializeNewMessageCheck();

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then(() => console.log("Service Worker registrato"))
          .catch(err => console.error("SW error:", err));
      }

      document.addEventListener("click", e => {

        const menu = document.getElementById("moveMenu");
        const btn = document.getElementById("selectionMove");

        if (!menu) return;

        if (!menu.contains(e.target) && e.target !== btn) {
          menu.style.display = "none";
        }

      });
