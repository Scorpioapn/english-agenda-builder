window.AgendaBuilder = window.AgendaBuilder || {};
    function $(selector) {
      return document.querySelector(selector);
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }

    function loadData() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return normalizeData(clone(DEFAULT_DATA));
        const parsed = JSON.parse(saved);
        return normalizeData(migrateData(parsed));
      } catch (error) {
        return normalizeData(clone(DEFAULT_DATA));
      }
    }

    function migrateData(data) {
      const migrated = data && typeof data === "object" ? { ...data } : {};
      const version = Number(migrated.version) || 0;
      if (version < 2) {
        migrated.timingRules = normalizeTimingRules(migrated.timingRules || DEFAULT_DATA.timingRules);
        if (isLegacyTimingRules(migrated.timingRules)) {
          migrated.timingRules = DEFAULT_DATA.timingRules;
        }
      }
      migrated.version = STORAGE_VERSION;
      return migrated;
    }

    function normalizeData(data) {
      const normalized = { ...clone(DEFAULT_DATA), ...data, version: STORAGE_VERSION };
      for (const key of [
        "localAddress",
        "joinUs",
        "meetingVision",
        "nextTheme",
        "nextMeetingTime",
        "nextVenue",
        "guestParticipation",
        "liveVotingTitle",
        "liveVotingNote",
        "officialQrSrc",
        "membershipQrSrc",
        "votingQrSrc",
        "roleAssignments"
      ]) {
        if (normalized[key] == null) {
          normalized[key] = DEFAULT_DATA[key];
        }
      }
      normalized.meetingRules = listFieldValues(normalized.meetingRules, 3).join("\n");
      if (!String(normalized.timingRules || "").trim()) {
        normalized.timingRules = DEFAULT_DATA.timingRules;
      }
      normalized.timingRules = normalizeTimingRules(normalized.timingRules);
      normalized.items = Array.isArray(data.items) ? data.items.map(normalizeItem) : clone(DEFAULT_DATA.items);
      return normalized;
    }

    function normalizeTimingRules(value) {
      return String(value || "")
        .replaceAll(LEGACY_BELL_TEXT, CURRENT_BELL_TEXT)
        .replace(/30"\s*later,?\s*timer\s+will\s+ring\s+the\s+bell/gi, CURRENT_BELL_TEXT)
        .replace(/30\s*seconds?\s+later,?\s*timer\s+will\s+ring\s+the\s+bell/gi, CURRENT_BELL_TEXT);
    }

    function isLegacyTimingRules(value) {
      const text = String(value || "");
      return !text.trim()
        || (text.includes("Less than or equal to 2 minutes") && text.includes("Bell:"))
        || (text.includes("Less than or equal to 3 minutes") && text.includes("Bell:"))
        || (text.includes("Less/equal 2 min") && !text.includes(CURRENT_BELL_TEXT))
        || (text.includes("Less/equal 2min") && !text.includes(CURRENT_BELL_TEXT));
    }

    function normalizeItem(item) {
      return {
        id: item.id || newId(),
        kind: item.kind === "section" ? "section" : "item",
        time: item.time || "",
        title: item.title || "",
        duration: item.duration || "",
        person: item.person || "",
        detail: item.detail || ""
      };
    }

    function saveData() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: STORAGE_VERSION }));
        els.saveStatus.textContent = "Saved locally";
        window.clearTimeout(saveData.timer);
        saveData.timer = window.setTimeout(() => {
          els.saveStatus.textContent = "Local draft ready";
        }, 1400);
        return true;
      } catch (error) {
        els.saveStatus.textContent = "Save failed";
        showToast("Local save failed. Export JSON as backup.");
        return false;
      }
    }

    function newId() {
      return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    }

    function escapeHtml(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }
    function splitLines(value) {
      return String(value || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    }
    function listFieldValues(value, count, separator = "line") {
      const parts = separator === "pipe"
        ? String(value || "").split("|")
        : String(value || "").split(/\r?\n/);
      return Array.from({ length: count }, (_, index) => (parts[index] || "").trim());
    }
window.AgendaBuilder.storage = { loadData, migrateData, normalizeData, normalizeTimingRules, normalizeItem, saveData };
