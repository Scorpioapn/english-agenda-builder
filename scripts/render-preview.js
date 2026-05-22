window.AgendaBuilder = window.AgendaBuilder || {};
    function refIcon(name, className = "ref-section-icon") {
      const icons = {
        target: '<circle cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="3"></circle>',
        star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path>',
        calendar: '<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16"></path>',
        clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
        hash: '<path d="M10 3 8 21M16 3l-2 18M4 9h17M3 15h17"></path>',
        pin: '<path d="M12 21s7-5.2 7-12a7 7 0 0 0-14 0c0 6.8 7 12 7 12z"></path><circle cx="12" cy="9" r="2.2"></circle>',
        info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 16v-5M12 8h.01"></path>',
        stopwatch: '<circle cx="12" cy="13" r="8"></circle><path d="M9 2h6M12 13l3-3"></path>',
        bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>',
        qr: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2M14 18h6M18 16v4"></path>',
        users: '<path d="M16 20v-2a4 4 0 0 0-8 0v2"></path><circle cx="12" cy="8" r="4"></circle><path d="M22 20v-2a4 4 0 0 0-3-3.9M2 20v-2a4 4 0 0 1 3-3.9"></path>',
        calendarDays: '<rect x="4" y="5" width="16" height="15" rx="2"></rect><path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01"></path>',
        list: '<path d="M8 6h12M8 12h12M8 18h12"></path><path d="M4 6h.01M4 12h.01M4 18h.01"></path>',
        heart: '<path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21l8.8-8.2a5.1 5.1 0 0 0 0-7.2z"></path>',
        shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-5"></path>',
        phone: '<rect x="7" y="2" width="10" height="20" rx="2"></rect><path d="M11 18h2"></path>',
        trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"></path>',
        eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle>',
        user: '<circle cx="12" cy="8" r="4"></circle><path d="M5 21a7 7 0 0 1 14 0"></path>',
        circleStar: '<circle cx="12" cy="12" r="9"></circle><path d="m12 7 1.4 2.9 3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.8 1.5.5-3.2-2.3-2.2 3.2-.5z"></path>',
        pencil: '<path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"></path><path d="m14 6 4 4"></path>',
        mic: '<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"></path>',
        megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h2l4 4v-5l8 2V8l-8 2V5l-4 4H5a2 2 0 0 0-2 2z"></path>',
        speech: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>',
        handshake: '<path d="M8 12 4 16l4 4 4-4M16 12l4 4-4 4-4-4"></path><path d="M8 12l3-3h2l3 3M12 16l2-2"></path>',
        group: '<path d="M7 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M4 14a3 3 0 0 0-2 3v1M20 14a3 3 0 0 1 2 3v1"></path>',
        trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"></path><path d="M7 6H4a3 3 0 0 0 3 3M17 6h3a3 3 0 0 1-3 3"></path>',
        bars: '<path d="M5 20V10M12 20V4M19 20v-7"></path>',
      };
      return `<span class="${escapeHtml(`${className} ref-svg-icon`)}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.info}</svg></span>`;
    }
    function renderPreview() {
      els.printPage.className = "print-page ref-page";
      els.previewMeta.textContent = `${state.meetingTitle} | ${formatDisplayDate()} ${state.meetingTime}`;
      const groups = buildAgendaGroups();
      const agendaRows = groups.map((group, groupIndex) => {
        const meta = stageMeta(group.title, groupIndex);
        return group.items.map((item, itemIndex) => `
          <tr class="${highlightClass(item.title)}">
            ${itemIndex === 0 ? `
              <td class="ref-stage-cell" rowspan="${group.items.length}">
                <div class="ref-stage-content">
                  <span class="ref-stage-number">${groupIndex + 1}</span>
                  <span class="ref-stage-label">
                    <span class="ref-stage-name">${escapeHtml(meta.label)}</span>
                    ${refIcon(meta.icon, "ref-stage-icon")}
                  </span>
                </div>
              </td>
            ` : ""}
            <td class="ref-time-col">${escapeHtml(item.time || "")}</td>
            <td>
              <div class="ref-program-title">${escapeHtml(item.title)}</div>
              ${item.detail ? `<div class="ref-program-detail">${escapeHtml(item.detail)}</div>` : ""}
            </td>
            <td class="ref-duration-col">${escapeHtml(item.duration)}</td>
            <td class="ref-owner-col">${escapeHtml(item.person)}</td>
          </tr>
        `).join("");
      }).join("");
      const officialQr = state.officialQrSrc || DEFAULT_DATA.officialQrSrc;
      const membershipQr = state.membershipQrSrc || DEFAULT_DATA.membershipQrSrc;
      const votingQr = state.votingQrSrc || DEFAULT_DATA.votingQrSrc;

      els.printPage.innerHTML = `
        <header class="ref-header">
          <div class="ref-logo">
            <img src="assets/toastmasters-logo-color-png.png" alt="Toastmasters International logo" />
          </div>
          <div class="ref-title">
            <p class="ref-title-kicker">${escapeHtml(state.clubName)}</p>
            <h2>${escapeHtml(state.agendaTitle)}</h2>
            <div class="ref-theme-strip">
              <span class="ref-tag ref-tag-red">${escapeHtml(state.themeLabel)}</span>
              <span class="ref-topic">${escapeHtml(state.theme)}</span>
              <span class="ref-tag ref-tag-blue">${escapeHtml(state.wordOfDayLabel)}</span>
              <span class="ref-word">${escapeHtml(state.wordOfDay)}</span>
            </div>
          </div>
          <div class="ref-meta-stack">
            <div class="ref-meta-pill">${refIcon("calendar", "ref-meta-icon")}<span class="ref-meta-copy"><span class="ref-meta-label">${escapeHtml(state.dateLabel)}</span><span class="ref-meta-value">${escapeHtml(formatLongDate())}</span></span></div>
            <div class="ref-meta-pill">${refIcon("clock", "ref-meta-icon")}<span class="ref-meta-copy"><span class="ref-meta-label">${escapeHtml(state.timeLabel)}</span><span class="ref-meta-value">${escapeHtml(state.meetingTime)}</span></span></div>
            <div class="ref-meta-pill">${refIcon("users", "ref-meta-icon")}<span class="ref-meta-copy"><span class="ref-meta-label">${escapeHtml(state.meetingNoLabel)}</span><span class="ref-meta-value">${escapeHtml(state.meetingNumber)}</span></span></div>
          </div>
        </header>

        <section class="ref-body">
          <aside class="ref-sidebar">
            <section class="ref-card">
              <h3 class="ref-card-title">${refIcon("info")}${escapeHtml(state.aboutTitle)}</h3>
              <div class="ref-card-body">
                ${aboutUsHtml()}
              </div>
            </section>

            <section class="ref-card">
              <h3 class="ref-card-title">${refIcon("stopwatch")}${escapeHtml(state.timingTitle)}</h3>
              <div class="ref-card-body ref-timing-stack">
                ${timingSignalCardsHtml(state.timingRules)}
                <div class="ref-note">${refIcon("star", "ref-line-icon")}<span>${escapeHtml(state.timingNote)}</span></div>
              </div>
            </section>

            <section class="ref-card">
              <h3 class="ref-card-title">${refIcon("qr")}${escapeHtml(state.followTitle)}</h3>
              <div class="ref-card-body">
                <div class="ref-qr-grid">
                  ${qrCardHtml(officialQr, state.officialQrLabel)}
                  ${qrCardHtml(membershipQr, state.membershipQrLabel)}
                </div>
              </div>
            </section>

            <section class="ref-card ref-officers-card">
              <h3 class="ref-card-title">${refIcon("users")}${escapeHtml(state.officerTitle)}</h3>
              <div class="ref-card-body ref-officers-body">${officersPreviewHtml(state.officers)}</div>
            </section>

          </aside>

          <section class="ref-flow-card">
            <h3 class="ref-flow-title">${refIcon("list")}${escapeHtml(state.flowTitle)}</h3>
            <div class="ref-table-wrap">
              <table class="ref-agenda-table">
                <colgroup>
                  <col class="ref-col-stage" />
                  <col class="ref-col-time" />
                  <col class="ref-col-program" />
                  <col class="ref-col-duration" />
                  <col class="ref-col-owner" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Time</th>
                    <th>Program</th>
                    <th>Duration<br>(min)</th>
                    <th>Owner</th>
                  </tr>
                </thead>
                <tbody>${agendaRows}</tbody>
              </table>
            </div>
            <div class="ref-vision-bar">${refIcon("heart")}${escapeHtml(state.meetingVision)}</div>
          </section>
        </section>

        <footer class="ref-bottom-grid">
          <section class="ref-bottom-card">
            <h3 class="ref-bottom-title">${refIcon("users")}${escapeHtml(state.guestParticipationTitle)}</h3>
            ${participationHtml(state.guestParticipation)}
          </section>
          <section class="ref-bottom-card">
            <h3 class="ref-bottom-title">${refIcon("bars")}${escapeHtml(state.liveVotingCardTitle)}</h3>
            <div class="ref-live-vote">
              <strong class="ref-scan-time">${escapeHtml(state.liveVotingTitle)}</strong>
              <div class="ref-vote-awards">${escapeHtml(state.liveVotingNote).split("|").map((part) => `<span>${part.trim()}</span>`).join("<span>|</span>")}</div>
              <img src="${escapeHtml(votingQr)}" alt="Live voting QR" />
              <span class="ref-vote-note">${escapeHtml(state.liveVotingFooter)}</span>
            </div>
          </section>
          <section class="ref-bottom-card">
            <h3 class="ref-bottom-title">${refIcon("shield")}${escapeHtml(state.meetingRulesTitle)}</h3>
            ${meetingRulesListHtml(state.meetingRules)}
          </section>
        </footer>
        <footer class="ref-footer">
          <span class="ref-footer-line"></span>
          <span>${escapeHtml(state.footerSlogan)}</span>
          <span class="ref-footer-heart">${refIcon("heart", "ref-mini-icon")}</span>
          <span>${escapeHtml(state.footerBrand)}</span>
          <span class="ref-footer-line"></span>
        </footer>
      `;
      syncPreviewScale();
    }

    function syncPreviewScale() {
      if (!els.previewSheet || !els.printPage) return;
      const pageWidth = els.printPage.offsetWidth || 794;
      const pageHeight = els.printPage.offsetHeight || 1123;
      const availableWidth = Math.max(280, (els.previewStage?.clientWidth || pageWidth) - 24);
      const fitScale = availableWidth / pageWidth;
      const minScale = Number.parseFloat(getComputedStyle(els.previewSheet).getPropertyValue("--preview-min-scale")) || 0;
      const scale = Math.min(1, Math.max(minScale, fitScale));
      els.previewSheet.style.setProperty("--preview-scale", scale.toFixed(4));
      els.previewSheet.style.width = `${Math.ceil(pageWidth * scale)}px`;
      els.previewSheet.style.height = `${Math.ceil(pageHeight * scale)}px`;
      els.previewSheet.dataset.overflowing = scale > fitScale + 0.001 ? "true" : "false";
      const contentOverflowing = els.printPage.scrollHeight > els.printPage.clientHeight + 1;
      els.previewMeta.dataset.fit = contentOverflowing ? "overflow" : "ok";
      els.previewPanel?.classList.toggle("is-overflowing", contentOverflowing);
      if (els.overflowWarning) {
        els.overflowWarning.hidden = !contentOverflowing;
      }
    }

    function buildAgendaGroups() {
      const groups = [];
      let current = { title: "Arrival", items: [] };
      for (const item of state.items) {
        if (item.kind === "section") {
          if (current.items.length) groups.push(current);
          current = { title: item.title || "Session", items: [] };
        } else {
          current.items.push(item);
        }
      }
      if (current.items.length) groups.push(current);
      return groups;
    }

    function stageMeta(title, index) {
      const normalized = String(title || "").toLowerCase();
      if (normalized.includes("prepared")) return { label: "Prepared Speeches", icon: "mic" };
      if (normalized.includes("table")) return { label: "Table Topics", icon: "speech" };
      if (normalized.includes("evaluation")) return { label: "Guests & Feedback", icon: "users" };
      if (normalized.includes("award") || normalized.includes("closing")) return { label: "Sharing", icon: "trophy" };
      if (normalized.includes("opening")) return { label: index === 0 ? "Arrival & Opening" : "Opening", icon: "handshake" };
      return { label: title || "Session", icon: "pin" };
    }

    function highlightClass(title) {
      const text = String(title || "").toLowerCase();
      if (text.includes("guest intro") || text.includes("vote")) return "ref-highlight-green";
      if (text.includes("photo") || text.includes("tea break")) return "ref-highlight-blue";
      return "";
    }

    function formatLongDate() {
      if (!state.date) return `${state.weekday || ""}`.trim();
      const date = new Date(`${state.date}T00:00:00`);
      if (Number.isNaN(date.getTime())) return `${state.date}, ${state.weekday || ""}`.trim();
      const month = date.toLocaleString("en-US", { month: "long" });
      return `${month} ${date.getDate()}, ${date.getFullYear()}, ${state.weekday || ""}`.trim().replace(/,\s*$/, "");
    }

    function aboutUsHtml() {
      const lines = splitLines(state.aboutClub);
      const intro = lines.join(" ");
      const venue = state.location;
      return `
        <p class="ref-about-line">${escapeHtml(intro)}</p>
        <div class="ref-icon-line">${refIcon("eye", "ref-line-icon")}<span><strong>Vision:</strong> ${escapeHtml(state.meetingVision.replace(/^Meeting Vision:\s*/i, ""))}</span></div>
        <div class="ref-icon-line">${refIcon("clock", "ref-line-icon")}<span><strong>Meeting Time:</strong> ${escapeHtml(state.weekday)}, ${escapeHtml(state.meetingTime)}</span></div>
        <div class="ref-icon-line">${refIcon("pin", "ref-line-icon")}<span><strong>Venue:</strong> ${escapeHtml(venue)}</span></div>
      `;
    }

    function timingSignalCardsHtml(value) {
      return splitLines(value).map((line) => {
        const parts = line.split("|").map((part) => part.trim());
        const title = parts.shift() || "";
        const text = (...names) => {
          const part = parts.find((entry) => names.some((name) => entry.toLowerCase().startsWith(name)));
          return part && part.includes(":") ? part.split(":").slice(1).join(":").trim() : "";
        };
        const speechLength = text("speech length", "speech");
        const bellText = text("bell");
        return `
          <div class="ref-timing-card">
            <h4>${escapeHtml(shortTimingTitle(title))}</h4>
            ${speechLength ? `<p class="ref-timing-scope">${escapeHtml(speechLength)}</p>` : ""}
            <div class="ref-signal-grid">
              <div class="ref-signal-row"><span class="ref-signal-mark"><i class="ref-signal-dot green"></i>Green Card</span><span>${escapeHtml(shortSignalText(text("green")))}</span></div>
              <div class="ref-signal-row"><span class="ref-signal-mark"><i class="ref-signal-dot yellow"></i>Yellow Card</span><span>${escapeHtml(shortSignalText(text("yellow")))}</span></div>
              <div class="ref-signal-row ref-signal-red"><span class="ref-signal-mark"><i class="ref-signal-dot red"></i>Red Card</span><span>${escapeHtml(shortSignalText(text("red") || "TIME IS UP"))}</span></div>
              ${bellText ? `<div class="ref-signal-row ref-signal-bell"><span class="ref-signal-mark">${refIcon("bell", "ref-bell-icon")}Bell</span><span>${escapeHtml(shortSignalText(bellText))}</span></div>` : ""}
            </div>
          </div>
        `;
      }).join("");
    }

    function shortTimingTitle(title) {
      return String(title || "")
        .replace(/minutes?/gi, "min")
        .replace(/\s+/g, " ")
        .trim();
    }

    function shortSignalText(value) {
      const text = normalizeTimingRules(value)
        .replace(/\s+/g, " ")
        .trim();
      return /^time is up$/i.test(text) ? "TIME IS UP" : text;
    }

    function qrCardHtml(src, label) {
      return `
        <div class="ref-qr-box">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(label)} QR" />
          <span>${escapeHtml(label)}</span>
        </div>
      `;
    }

    function officersPreviewHtml(value) {
      const rows = splitLines(value).map((line) => {
        const [key = "", ...valueParts] = line.split("|").map((part) => part.trim());
        return { key, value: valueParts.join(" | ") };
      }).filter((row) => row.key || row.value);
      const term = rows.find((row) => row.key.toLowerCase() === "term");
      const officers = rows.filter((row) => row.key.toLowerCase() !== "term");
      return `
        ${term ? `
          <div class="ref-officer-term">
            <span class="ref-officer-term-key">${escapeHtml(term.key)}:</span>
            <span class="ref-officer-term-value">${escapeHtml(term.value)}</span>
          </div>
        ` : ""}
        <div class="ref-officer-grid">
          ${officers.map((row) => `
            <div class="ref-officer-row">
              <span class="ref-officer-role">${escapeHtml(row.key)}</span>
              <span class="ref-officer-name">${escapeHtml(row.value)}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    function participationHtml(value) {
      const items = listFieldValues(value, 4, "pipe");
      const icons = ["user", "circleStar", "speech", "pencil"];
      return `
        <div class="ref-participation-grid">
          ${items.map((item, index) => `
            <div class="ref-participation-item">
              ${refIcon(icons[index] || "user", "ref-circle-icon")}
              <span>${escapeHtml(item)}</span>
            </div>
          `).join("")}
        </div>
        <p class="ref-bottom-copy">${escapeHtml(state.guestParticipationFooter).replace(/\n/g, "<br>")}</p>
      `;
    }

    function meetingRulesListHtml(value) {
      const icons = ["phone", "users", "trash"];
      const rules = listFieldValues(value, 3).map((line, index) => `
        <li class="ref-rule-item">
          ${refIcon(icons[index] || "shield", "ref-rule-icon")}
          <span>${escapeHtml(line.replace(/^\d+\)\s*/, ""))}</span>
        </li>
      `).join("");
      return `<ul class="ref-meeting-rules">${rules}</ul>`;
    }

window.AgendaBuilder.preview = { renderPreview, syncPreviewScale };
