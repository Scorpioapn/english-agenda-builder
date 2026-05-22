window.AgendaBuilder = window.AgendaBuilder || {};
    const outputFieldGroups = [
      ["Main Labels", ["agendaTitle", "themeLabel", "wordOfDayLabel", "dateLabel", "timeLabel", "meetingNoLabel"]],
      ["Card Titles", ["aboutTitle", "timingTitle", "followTitle", "officerTitle", "flowTitle", "guestParticipationTitle", "liveVotingCardTitle", "meetingRulesTitle"]],
      ["QR Labels", ["officialQrLabel", "membershipQrLabel"]],
      ["Footer Text", ["timingNote", "guestParticipationFooter", "liveVotingFooter", "footerSlogan", "footerBrand"]]
    ];

    const qrFieldLabels = {
      officialQrSrc: "Official Account",
      membershipQrSrc: "Membership",
      votingQrSrc: "Voting"
    };

    function fieldControlHtml([key, label, type], options = {}) {
        const value = escapeHtml(state[key] || "");
        const fieldClass = `field${type === "textarea" || type === "image" || options.readable?.has(key) ? " field-readable" : ""}`;
        if (type === "image") {
          return `
            <div class="${fieldClass} qr-upload-field">
              <label for="field-${key}">${label}</label>
              <div class="qr-upload-row">
                <button class="qr-thumb-button" id="field-${key}" type="button" data-qr-upload="${key}" aria-label="Upload ${label}">
                  <img class="qr-thumb" src="${value}" alt="${label} preview" />
                </button>
              </div>
              <input class="hidden-input" type="file" accept="image/*" data-qr-file="${key}" />
            </div>
          `;
        }
        if (type === "textarea") {
          return `
            <div class="${fieldClass}">
              <label for="field-${key}">${label}</label>
              <textarea class="textarea" id="field-${key}" data-meeting-field="${key}">${value}</textarea>
            </div>
          `;
        }
        return `
          <div class="${fieldClass}">
            <label for="field-${key}">${label}</label>
            <input class="input" id="field-${key}" data-meeting-field="${key}" type="${type}" value="${value}" />
          </div>
        `;
    }

    function qrTileHtml([key, label]) {
      const value = escapeHtml(state[key] || "");
      const displayLabel = qrFieldLabels[key] || label;
      return `
        <div class="qr-tile-field">
          <button class="qr-tile" type="button" data-qr-upload="${key}" aria-label="Replace ${escapeHtml(displayLabel)} QR image">
            <span class="qr-tile-label">${escapeHtml(displayLabel)}</span>
            <span class="qr-tile-preview">
              <img class="qr-thumb" src="${value}" alt="${escapeHtml(displayLabel)} preview" />
            </span>
            <span class="qr-replace">Replace</span>
          </button>
          <input class="hidden-input" type="file" accept="image/*" data-qr-file="${key}" />
        </div>
      `;
    }

    function outputGroupsHtml() {
      const defsByKey = new Map(previewTextFieldDefs.map((definition) => [definition[0], definition]));
      return outputFieldGroups.map(([title, keys]) => {
        const fields = keys
          .map((key) => defsByKey.get(key))
          .filter(Boolean)
          .map((definition) => fieldControlHtml(definition))
          .join("");
        return `
          <div class="inspector-card output-group">
            <div class="card-heading"><h3>${escapeHtml(title)}</h3></div>
            <div class="field-grid">${fields}</div>
          </div>
        `;
      }).join("");
    }

    function listFieldHtml(field, labels, separator = "line") {
      const values = listFieldValues(state[field], labels.length, separator);
      return labels.map((label, index) => `
        <div class="field">
          <label for="${field}-${index}">${label}</label>
          <input class="input" id="${field}-${index}" data-list-field="${field}" data-list-separator="${separator}" value="${escapeHtml(values[index])}" />
        </div>
      `).join("");
    }

    function renderInputs() {
      const basicFieldDefs = meetingFieldDefs.filter((definition) => definition[2] !== "image");
      const qrFieldDefs = meetingFieldDefs.filter((definition) => definition[2] === "image");

      els.meetingFields.innerHTML = basicFieldDefs
        .map((definition) => fieldControlHtml(definition, { readable: readableMeetingFields }))
        .join("");

      if (els.qrFields) {
        els.qrFields.innerHTML = qrFieldDefs.map(qrTileHtml).join("");
      }

      els.previewTextFields.innerHTML = outputGroupsHtml();

      els.meetingRuleFields.innerHTML = listFieldHtml("meetingRules", ["Rule 1", "Rule 2", "Rule 3"]);
      els.guestParticipationFields.innerHTML = listFieldHtml("guestParticipation", ["Guest Intro", "Table Topics", "Reflection", "Sharing"], "pipe");
      els.autoTimeStart.value = state.agendaStartTime || "";

      for (const field of [els.aboutClub, els.officers, els.timingRules]) {
        field.value = state[field.dataset.field] || "";
      }
    }

    function autoSizeTextarea(textarea) {
      if (!textarea || textarea.tagName !== "TEXTAREA") return;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }

    function autoSizeTextareas(scope = document) {
      scope.querySelectorAll("textarea.textarea").forEach(autoSizeTextarea);
    }

    function renderAgendaList(options = {}) {
      const previousScrollTop = els.editorStack?.scrollTop || 0;
      const itemCount = state.items.filter((item) => item.kind !== "section").length;
      els.agendaCount.textContent = `${itemCount} agenda lines`;
      els.agendaList.innerHTML = state.items.map((item, index) => {
        const isActive = item.id === editingId;
        const safeId = escapeHtml(item.id);
        const meta = item.kind === "section"
          ? "Section heading"
          : [item.duration ? `${item.duration} min` : "", item.person].filter(Boolean).join(" | ");
        const durationWarning = item.kind !== "section" && !isValidDuration(item.duration)
          ? `<div class="agenda-warning">Duration should be a number or range, such as 3, 1.5, or 5-7.</div>`
          : "";
        if (item.kind === "section") {
          return `
            <article class="agenda-card agenda-section-row section-card ${isActive ? "active editing-card" : ""}" data-id="${safeId}" draggable="true" aria-label="Drag to reorder ${escapeHtml(item.title || "section heading")}">
              <span class="drag-handle" aria-hidden="true"></span>
              <div class="agenda-section-title agenda-title">${escapeHtml(item.title || "Untitled section")}</div>
              <div class="agenda-section-meta agenda-meta">${escapeHtml(meta)}</div>
              <button class="btn small" type="button" data-action="edit" data-id="${safeId}">Edit</button>
            </article>
          `;
        }
        return `
          <article class="agenda-card agenda-row ${isActive ? "active editing-card" : ""}" data-id="${safeId}" draggable="true" aria-label="Drag to reorder ${escapeHtml(item.title || "agenda item")}">
            <span class="drag-handle" aria-hidden="true"></span>
            <div class="agenda-time">${escapeHtml(item.time || "--:--")}</div>
            <div class="agenda-row-main">
              <div class="agenda-title">${escapeHtml(item.title || "Untitled")}</div>
              ${item.detail ? `<div class="agenda-detail">${escapeHtml(item.detail)}</div>` : ""}
              ${durationWarning}
            </div>
            <div class="agenda-row-duration">${escapeHtml(item.duration ? `${item.duration} min` : "")}</div>
            <div class="agenda-row-owner">${escapeHtml(item.person || "")}</div>
            <button class="btn small" type="button" data-action="edit" data-id="${safeId}">Edit</button>
          </article>
        `;
      }).join("");
      placeAgendaForm();
      if (els.editorStack) els.editorStack.scrollTop = previousScrollTop;
      if (options.revealForm) revealAgendaForm();
    }

    function placeAgendaForm() {
      els.agendaFormAnchor.appendChild(els.agendaForm);
      syncFormVisibility();
      autoSizeTextarea(els.itemDetail);
    }

    function revealAgendaForm() {
      if (!els.editorStack || !els.agendaForm) return;
      const panelRect = els.editorStack.getBoundingClientRect();
      const formRect = els.agendaForm.getBoundingClientRect();
      const padding = 10;
      if (formRect.top < panelRect.top + padding) {
        els.editorStack.scrollTop += formRect.top - panelRect.top - padding;
      } else if (formRect.bottom > panelRect.bottom - padding) {
        const shiftToTop = formRect.top - panelRect.top - padding;
        const shiftToBottom = formRect.bottom - panelRect.bottom + padding;
        els.editorStack.scrollTop += Math.min(Math.max(shiftToBottom, 0), Math.max(shiftToTop, 0));
      }
    }

    function updateActiveAgendaCard() {
      const item = state.items.find((entry) => entry.id === editingId);
      if (!item) return;
      const card = [...els.agendaList.querySelectorAll(".agenda-card")].find((node) => node.dataset.id === item.id);
      if (!card) return;

      const meta = item.kind === "section"
        ? "Section heading"
        : [item.duration ? `${item.duration} min` : "", item.person].filter(Boolean).join(" | ");
      const timeEl = card.querySelector(".agenda-time");
      const titleEl = card.querySelector(".agenda-title");
      const metaEl = card.querySelector(".agenda-meta");
      const durationEl = card.querySelector(".agenda-row-duration");
      const ownerEl = card.querySelector(".agenda-row-owner");
      const rowMainEl = card.querySelector(".agenda-row-main");
      let detailEl = card.querySelector(".agenda-detail");

      card.classList.toggle("section-card", item.kind === "section");
      if (timeEl) timeEl.textContent = item.kind === "section" ? "" : item.time || "--:--";
      if (titleEl) titleEl.textContent = item.title || "Untitled";
      if (metaEl) metaEl.textContent = meta;
      if (durationEl) durationEl.textContent = item.duration ? `${item.duration} min` : "";
      if (ownerEl) ownerEl.textContent = item.person || "";
      if (item.detail) {
        if (!detailEl) {
          detailEl = document.createElement("div");
          detailEl.className = "agenda-detail";
          (metaEl || titleEl)?.after(detailEl);
        }
        detailEl.textContent = item.detail;
      } else {
        detailEl?.remove();
      }
      let warningEl = card.querySelector(".agenda-warning");
      const hasInvalidDuration = item.kind !== "section" && !isValidDuration(item.duration);
      if (hasInvalidDuration) {
        if (!warningEl) {
          warningEl = document.createElement("div");
          warningEl.className = "agenda-warning";
          (detailEl || metaEl || titleEl || rowMainEl)?.after(warningEl);
        }
        warningEl.textContent = "Duration should be a number or range, such as 3, 1.5, or 5-7.";
      } else {
        warningEl?.remove();
      }
    }

    function updateDurationWarning() {
      if (!els.itemDurationWarning) return;
      const shouldWarn = els.itemKind.value !== "section" && !isValidDuration(els.itemDuration.value);
      els.itemDurationWarning.hidden = !shouldWarn;
    }

    function syncEditingCalculatedTime() {
      if (!editingId || !els.itemTime) return;
      const item = state.items.find((entry) => entry.id === editingId);
      els.itemTime.value = item && item.kind !== "section" ? item.time || "" : "";
    }

    function updateAgendaCardTimes() {
      if (!els.agendaList) return;
      for (const card of els.agendaList.querySelectorAll(".agenda-card")) {
        const item = state.items.find((entry) => entry.id === card.dataset.id);
        const timeEl = card.querySelector(".agenda-time");
        if (item && timeEl) {
          timeEl.textContent = item.kind === "section" ? "" : item.time || "--:--";
        }
      }
    }
window.AgendaBuilder.editor = { renderInputs, renderAgendaList, placeAgendaForm, updateActiveAgendaCard, updateAgendaCardTimes, updateDurationWarning, autoSizeTextareas };
