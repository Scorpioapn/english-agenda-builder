window.AgendaBuilder = window.AgendaBuilder || {};
    function minutesFromDuration(value) {
      const text = String(value || "").trim();
      if (!text) return 0;
      const range = text.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
      if (range) return Number(range[2]);
      const single = text.match(/(\d+(?:\.\d+)?)/);
      return single ? Number(single[1]) : 0;
    }

    function isValidDuration(value) {
      const text = String(value || "").trim();
      if (!text) return false;
      return /^(?:\d+(?:\.\d+)?|\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?)$/.test(text);
    }

    function timeToMinutes(value) {
      const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
      if (!match) return 0;
      return Number(match[1]) * 60 + Number(match[2]);
    }

    function minutesToTime(total) {
      const normalized = ((Math.round(total) % 1440) + 1440) % 1440;
      const h = String(Math.floor(normalized / 60)).padStart(2, "0");
      const m = String(normalized % 60).padStart(2, "0");
      return `${h}:${m}`;
    }
    function autoRescheduleAgenda(options = {}) {
      const {
        save = true,
        updateCards = true,
        renderPreviewPage = true
      } = options;
      let cursor = timeToMinutes(state.agendaStartTime || "19:00");
      let changed = false;
      state.items = state.items.map((item) => {
        if (item.kind === "section") return item;
        const time = minutesToTime(cursor);
        cursor += minutesFromDuration(item.duration);
        if (item.time === time) return item;
        changed = true;
        return { ...item, time };
      });
      syncEditingCalculatedTime();
      if (save && changed) saveData();
      if (updateCards) updateAgendaCardTimes();
      if (renderPreviewPage) renderPreview();
      return changed;
    }
window.AgendaBuilder.time = { minutesFromDuration, isValidDuration, timeToMinutes, minutesToTime, autoRescheduleAgenda };
