window.AgendaBuilder = window.AgendaBuilder || {};
    const els = {};
    let state = loadData();
    let editingId = null;
    let isFormOpen = false;
    let draggedId = null;
    let toastTimer = null;
    let activeEditorTab = "agenda";
    const scheduleSaveAndPreview = debounce(() => {
      saveData();
      renderPreview();
    }, 120);

    function debounce(fn, wait = 120) {
      let timer = null;
      const debounced = (...args) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), wait);
      };
      debounced.cancel = () => window.clearTimeout(timer);
      debounced.flush = (...args) => {
        window.clearTimeout(timer);
        fn(...args);
      };
      return debounced;
    }

    function saveAndRenderNow() {
      scheduleSaveAndPreview.cancel();
      saveData();
      renderPreview();
    }

    function formatDisplayDate() {
      if (!state.date) return "";
      const parts = state.date.split("-");
      if (parts.length !== 3) return state.date;
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }

    function setupElements() {
      Object.assign(els, {
        meetingFields: $("#meetingFields"),
        qrFields: $("#qrFields"),
        editorStack: $(".editor-stack"),
        editorTabs: [...document.querySelectorAll("[data-editor-tab]")],
        editorPanels: [...document.querySelectorAll("[data-editor-panel]")],
        agendaList: $("#agendaList"),
        agendaFormAnchor: $("#agendaFormAnchor"),
        selectedEditorCard: $("#selectedEditorCard"),
        agendaCount: $("#agendaCount"),
        agendaForm: $("#agendaForm"),
        itemKind: $("#itemKind"),
        itemTime: $("#itemTime"),
        itemTitle: $("#itemTitle"),
        itemDuration: $("#itemDuration"),
        itemDurationWarning: $("#itemDurationWarning"),
        itemPerson: $("#itemPerson"),
        itemDetail: $("#itemDetail"),
        addItemBtn: $("#addItemBtn"),
        addSectionBtn: $("#addSectionBtn"),
        saveItemBtn: $("#saveItemBtn"),
        duplicateItemBtn: $("#duplicateItemBtn"),
        deleteItemBtn: $("#deleteItemBtn"),
        autoTimeStart: $("#autoTimeStart"),
        clearFormBtn: $("#clearFormBtn"),
        printBtn: $("#printBtn"),
        copyBtn: $("#copyBtn"),
        exportBtn: $("#exportBtn"),
        importBtn: $("#importBtn"),
        resetBtn: $("#resetBtn"),
        importFile: $("#importFile"),
        aboutClub: $("#aboutClub"),
        officers: $("#officers"),
        timingRuleCards: $("#timingRuleCards"),
        previewTextFields: $("#previewTextFields"),
        meetingRuleFields: $("#meetingRuleFields"),
        guestParticipationFields: $("#guestParticipationFields"),
        timingRules: $("#timingRules"),
        previewPanel: $(".preview-panel"),
        previewStage: $("#previewStage"),
        previewSheet: $("#previewSheet"),
        printPage: $("#printPage"),
        overflowWarning: $("#overflowWarning"),
        previewMeta: $("#previewMeta"),
        saveStatus: $("#saveStatus"),
        toast: $("#toast")
      });
    }

    function setEditorTab(tab) {
      if (!["basics", "agenda", "club", "output"].includes(tab)) return;
      activeEditorTab = tab;
      syncEditorTabs();
    }

    function syncEditorTabs() {
      for (const button of els.editorTabs || []) {
        const isActive = button.dataset.editorTab === activeEditorTab;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      }
      for (const panel of els.editorPanels || []) {
        panel.hidden = panel.dataset.editorPanel !== activeEditorTab;
      }
    }

    function renderAll() {
      renderInputs();
      renderAgendaList();
      renderPreview();
      syncEditorTabs();
      syncFormVisibility();
      autoSizeTextareas();
    }

    function syncFromInputs(event) {
      const target = event.target;
      if (els.agendaForm?.contains(target)) return;
      if (target.dataset.timingRuleField) {
        syncTimingRuleDraft(target);
        return;
      }
      autoSizeTextarea(target);
      if (target.dataset.meetingField) {
        state[target.dataset.meetingField] = target.value;
      }
      if (target.dataset.field) {
        state[target.dataset.field] = target.value;
        if (target === els.timingRules) {
          renderTimingRuleCards();
        }
      }
      if (target.dataset.listField) {
        const field = target.dataset.listField;
        const separator = target.dataset.listSeparator === "pipe" ? " | " : "\n";
        state[field] = [...document.querySelectorAll(`[data-list-field="${CSS.escape(field)}"]`)]
          .map((input) => input.value.trim())
          .join(separator);
      }
      if (target === els.autoTimeStart) {
        autoRescheduleAgenda({ save: false, renderPreviewPage: false });
      }
      scheduleSaveAndPreview();
    }

    function syncTimingRuleDraft(target) {
      const index = Number.parseInt(target.dataset.timingRuleIndex, 10);
      const field = target.dataset.timingRuleField;
      const rules = parseTimingRules(state.timingRules);
      if (!rules[index] || !field) return;
      rules[index][field] = target.value;
      state.timingRules = serializeTimingRules(rules);
      if (els.timingRules) {
        els.timingRules.value = state.timingRules;
        autoSizeTextarea(els.timingRules);
      }
      const card = target.closest(".timing-rule-card");
      if (card) {
        const heading = card.querySelector(".timing-rule-card-head strong");
        if (heading && field === "title") {
          heading.textContent = target.value || "Untitled timing rule";
        }
        updateTimingRuleValidation(card);
      }
      scheduleSaveAndPreview();
    }

    function openForm(id) {
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;
      editingId = item.id;
      isFormOpen = true;
      els.itemKind.value = item.kind;
      els.itemTime.value = item.time || "";
      els.itemTitle.value = item.title || "";
      els.itemDuration.value = item.duration || "";
      els.itemPerson.value = item.person || "";
      els.itemDetail.value = item.detail || "";
      setEditorTab("agenda");
      syncFormVisibility();
      autoSizeTextarea(els.itemDetail);
      updateDurationWarning();
      renderAgendaList({ revealForm: true });
    }

    function clearForm(kind = "item", options = {}) {
      editingId = null;
      isFormOpen = Boolean(options.open);
      els.itemKind.value = kind;
      els.itemTime.value = "";
      els.itemTitle.value = "";
      els.itemDuration.value = "";
      els.itemPerson.value = "";
      els.itemDetail.value = "";
      if (isFormOpen) setEditorTab("agenda");
      syncFormVisibility();
      autoSizeTextarea(els.itemDetail);
      updateDurationWarning();
      renderAgendaList({ revealForm: isFormOpen });
    }

    function readForm() {
      return normalizeItem({
        id: editingId || newId(),
        kind: els.itemKind.value,
        time: els.itemTime.value,
        title: els.itemTitle.value.trim(),
        duration: els.itemDuration.value.trim(),
        person: els.itemPerson.value.trim(),
        detail: els.itemDetail.value.trim()
      });
    }

    function saveForm(event) {
      event.preventDefault();
      const item = readForm();
      if (!item.title) {
        showToast("Program title is required");
        return;
      }
      const index = state.items.findIndex((entry) => entry.id === item.id);
      if (index >= 0) {
        state.items[index] = item;
      } else {
        state.items.push(item);
      }
      autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
      saveAndRenderNow();
      clearForm();
      showToast("Agenda item saved");
    }

    function syncAgendaDraftFromForm(eventOrOptions = {}) {
      if (!editingId) return;
      const index = state.items.findIndex((entry) => entry.id === editingId);
      if (index < 0) return;
      state.items[index] = readForm();
      const target = eventOrOptions.target;
      const shouldReschedule = Boolean(eventOrOptions.forceReschedule)
        || target === els.itemDuration
        || target === els.itemKind;
      updateDurationWarning();
      if (shouldReschedule) {
        autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
      }
      updateActiveAgendaCard();
      if (shouldReschedule) updateAgendaCardTimes();
      scheduleSaveAndPreview();
    }

    function deleteCurrentItem() {
      if (!editingId) {
        showToast("No item selected");
        return;
      }
      const item = state.items.find((entry) => entry.id === editingId);
      if (!item) return;
      const confirmed = window.confirm(`Delete "${item.title || "Untitled"}"?`);
      if (!confirmed) return;
      state.items = state.items.filter((entry) => entry.id !== editingId);
      clearForm();
      autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
      saveData();
      renderAll();
      showToast("Item deleted");
    }

    function duplicateCurrentItem() {
      if (!editingId) {
        showToast("No item selected");
        return;
      }
      const source = state.items.find((entry) => entry.id === editingId);
      if (!source) return;
      const cloneItem = { ...clone(source), id: newId(), title: `${source.title} Copy` };
      const index = state.items.findIndex((entry) => entry.id === editingId);
      state.items.splice(index + 1, 0, cloneItem);
      autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
      saveData();
      openForm(cloneItem.id);
      renderPreview();
      showToast("Item duplicated");
    }

    function clearDropMarkers() {
      els.agendaList.querySelectorAll(".drop-before, .drop-after").forEach((card) => {
        card.classList.remove("drop-before", "drop-after");
      });
    }

    function reorderDraggedItem(targetId, insertAfter) {
      if (!draggedId || draggedId === targetId) return false;
      const fromIndex = state.items.findIndex((item) => item.id === draggedId);
      if (fromIndex < 0) return false;
      const [draggedItem] = state.items.splice(fromIndex, 1);
      let targetIndex = state.items.findIndex((item) => item.id === targetId);
      if (targetIndex < 0) {
        state.items.splice(fromIndex, 0, draggedItem);
        return false;
      }
      if (insertAfter) targetIndex += 1;
      state.items.splice(targetIndex, 0, draggedItem);
      autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
      saveData();
      renderAgendaList();
      renderPreview();
      return true;
    }

    function getDropPosition(event, card) {
      const rect = card.getBoundingClientRect();
      return event.clientY > rect.top + rect.height / 2;
    }

    function handleAgendaDragStart(event) {
      const card = event.target.closest(".agenda-card");
      if (!card || event.target.closest("button, input, textarea, select, .agenda-form")) {
        event.preventDefault();
        return;
      }
      draggedId = card.dataset.id;
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedId);
    }

    function handleAgendaDragOver(event) {
      const card = event.target.closest(".agenda-card");
      if (!draggedId || !card || card.dataset.id === draggedId) return;
      event.preventDefault();
      const insertAfter = getDropPosition(event, card);
      clearDropMarkers();
      card.classList.add(insertAfter ? "drop-after" : "drop-before");
      event.dataTransfer.dropEffect = "move";
    }

    function handleAgendaDrop(event) {
      const card = event.target.closest(".agenda-card");
      if (!draggedId || !card) return;
      event.preventDefault();
      const moved = reorderDraggedItem(card.dataset.id, getDropPosition(event, card));
      clearDropMarkers();
      draggedId = null;
      if (moved) showToast("Agenda order updated");
    }

    function handleAgendaDragEnd() {
      els.agendaList.querySelectorAll(".dragging").forEach((card) => card.classList.remove("dragging"));
      clearDropMarkers();
      draggedId = null;
    }

    function syncFormVisibility() {
      const formVisible = isFormOpen || Boolean(editingId);
      els.agendaForm.hidden = !formVisible;
      els.agendaFormAnchor.classList.toggle("is-hidden", !formVisible);
      if (els.selectedEditorCard) {
        els.selectedEditorCard.hidden = !formVisible;
      }
      const isSection = els.itemKind.value === "section";
      els.itemTime.closest(".field").style.display = isSection ? "none" : "";
      els.itemDuration.closest(".field").style.display = isSection ? "none" : "";
      els.itemPerson.closest(".field").style.display = isSection ? "none" : "";
      els.itemDetail.closest(".field").style.display = isSection ? "none" : "";
      updateDurationWarning();
    }

    function copyText() {
      const lines = [
        state.clubName,
        state.meetingTitle,
        `${state.weekday}, ${formatDisplayDate()} | ${state.meetingTime}`,
        `Theme: ${state.theme}`,
        `Word of the Day: ${state.wordOfDay}`,
        `Location: ${state.location}`,
        "",
        "Agenda"
      ];
      for (const item of state.items) {
        if (item.kind === "section") {
          lines.push("", item.title);
        } else {
          const meta = [item.time, item.title, item.duration ? `${item.duration} min` : "", item.person].filter(Boolean).join(" | ");
          lines.push(meta);
          if (item.detail) lines.push(`  ${item.detail}`);
        }
      }
      navigator.clipboard.writeText(lines.join("\n")).then(() => {
        showToast("Text copied");
      }).catch(() => {
        showToast("Copy failed");
      });
    }

    function exportJson() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cbd-agenda-${state.meetingNumber || "draft"}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("JSON exported");
    }

    async function importJson(file) {
      if (!file) return;
      try {
        const text = await file.text();
        state = normalizeData(migrateData(JSON.parse(text)));
        editingId = null;
        isFormOpen = false;
        autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
        saveData();
        renderAll();
        showToast("JSON imported");
      } catch (error) {
        showToast("Import failed");
      } finally {
        els.importFile.value = "";
      }
    }

    function handleQrUploadClick(event) {
      const button = event.target.closest("[data-qr-upload]");
      if (!button) return;
      const fileInput = document.querySelector(`[data-qr-file="${CSS.escape(button.dataset.qrUpload)}"]`);
      fileInput?.click();
    }

    async function handleQrUploadChange(event) {
      const input = event.target.closest("[data-qr-file]");
      if (!input) return;
      const key = input.dataset.qrFile;
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > MAX_QR_IMAGE_BYTES) {
        showToast("Image too large. Please use a smaller QR image.");
        input.value = "";
        return;
      }
      try {
        state[key] = await readFileAsDataUrl(file);
        saveData();
        renderAll();
        showToast("QR image uploaded");
      } catch (error) {
        showToast("QR upload failed");
      } finally {
        input.value = "";
      }
    }

    function readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", () => reject(reader.error));
        reader.readAsDataURL(file);
      });
    }

    function resetDefaults() {
      const confirmed = window.confirm("Reset the local draft to the CBD #441 defaults?");
      if (!confirmed) return;
      state = clone(DEFAULT_DATA);
      editingId = null;
      isFormOpen = false;
      autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
      saveData();
      renderAll();
      showToast("Defaults restored");
    }

    function showToast(message) {
      els.toast.textContent = message;
      els.toast.classList.add("show");
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 1700);
    }

    function bindEvents() {
      document.addEventListener("input", syncFromInputs);
      els.agendaForm.addEventListener("submit", saveForm);
      els.agendaForm.addEventListener("input", syncAgendaDraftFromForm);
      els.itemKind.addEventListener("change", () => {
        syncFormVisibility();
        syncAgendaDraftFromForm({ forceReschedule: true });
      });
      els.addItemBtn.addEventListener("click", () => clearForm("item", { open: true }));
      els.addSectionBtn.addEventListener("click", () => clearForm("section", { open: true }));
      els.clearFormBtn.addEventListener("click", () => clearForm());
      els.deleteItemBtn.addEventListener("click", deleteCurrentItem);
      els.duplicateItemBtn.addEventListener("click", duplicateCurrentItem);
      els.printBtn.addEventListener("click", () => window.print());
      els.copyBtn.addEventListener("click", copyText);
      els.exportBtn.addEventListener("click", exportJson);
      els.importBtn.addEventListener("click", () => els.importFile.click());
      els.importFile.addEventListener("change", (event) => importJson(event.target.files[0]));
      els.resetBtn.addEventListener("click", resetDefaults);
      for (const tab of els.editorTabs) {
        tab.addEventListener("click", () => setEditorTab(tab.dataset.editorTab));
      }
      document.addEventListener("click", handleQrUploadClick);
      document.addEventListener("change", handleQrUploadChange);
      els.agendaList.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const { action, id } = button.dataset;
        if (action === "edit") openForm(id);
      });
      els.agendaList.addEventListener("dragstart", handleAgendaDragStart);
      els.agendaList.addEventListener("dragover", handleAgendaDragOver);
      els.agendaList.addEventListener("dragleave", (event) => {
        if (!els.agendaList.contains(event.relatedTarget)) clearDropMarkers();
      });
      els.agendaList.addEventListener("drop", handleAgendaDrop);
      els.agendaList.addEventListener("dragend", handleAgendaDragEnd);
      window.addEventListener("resize", syncPreviewScale);
    }

    setupElements();
    autoRescheduleAgenda({ save: false, updateCards: false, renderPreviewPage: false });
    renderAll();
    bindEvents();
