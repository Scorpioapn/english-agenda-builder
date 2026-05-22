window.AgendaBuilder = window.AgendaBuilder || {};
    const STORAGE_KEY = "cbd_english_agenda_builder_v2";
    const STORAGE_VERSION = 2;
    const MAX_QR_IMAGE_BYTES = 1024 * 1024;
    const LEGACY_BELL_TEXT = "30\" later, timer will ring the bell";
    const CURRENT_BELL_TEXT = "30s after time is up";

    const DEFAULT_DATA = {
      clubName: "CBD Toastmasters Club",
      meetingTitle: "EOE & CBD #441 English Meeting",
      meetingNumber: "441",
      date: "2026-05-08",
      weekday: "Friday",
      meetingTime: "19:30-21:30",
      agendaStartTime: "19:00",
      location: "Hall M3, 7B2, 7F, AB Building, Tianji Building, Tian'an Cyber Park, Futian District, Shenzhen",
      localAddress: "Room M3, 7F, 7B2, AB Block, Tianji Building, Tian'an Cyber Park.",
      theme: "The Art of Slowing Down",
      wordOfDay: "Serenity",
      meetingManager: "Jackson & Tracy",
      toastmaster: "Momo Lee",
      joinUs: "Guests are welcome. Join the meeting, vote for best speakers, and connect with CBD members after the session.",
      meetingVision: "Meeting Vision: We are happy to build a joyful learning journey with everyone. Thank you.",
      nextTheme: "Summer Outfits",
      nextMeetingTime: "Next Friday, 19:30-21:30",
      nextVenue: "Hall M3, 7B2, Tianji Building, Tian'an Cyber Park",
      guestParticipation: "Guest Intro | Table Topics | Reflection | Sharing",
      liveVotingTitle: "Scan at 21:00",
      liveVotingNote: "Best Speaker | Best Evaluator | Best Table Topic",
      officialQrSrc: "assets/excel/sheet1_image_4_950x1295.png",
      membershipQrSrc: "assets/excel/sheet1_image_5_950x1295.png",
      votingQrSrc: "assets/excel/sheet1_image_8_300x300.png",
      agendaTitle: "Meeting Agenda",
      themeLabel: "Theme",
      wordOfDayLabel: "Word of the Day",
      dateLabel: "Date",
      timeLabel: "Time",
      meetingNoLabel: "Meeting No.",
      aboutTitle: "About Us",
      timingTitle: "Timing Signals",
      followTitle: "Follow Us",
      officerTitle: "Club Officer",
      flowTitle: "Meeting Flow",
      guestParticipationTitle: "Guest Participation",
      liveVotingCardTitle: "Live Voting",
      meetingRulesTitle: "Meeting Rules",
      officialQrLabel: "Official Account",
      membershipQrLabel: "Membership Inquiry",
      timingNote: "Applause is a sign of respect. Please watch the timing signals and wrap up quickly.",
      guestParticipationFooter: "No experience required.\nFirst-timers are welcome.",
      liveVotingFooter: "Please vote after all sessions are completed.",
      footerSlogan: "Where Leaders Are Made",
      footerBrand: "Toastmasters International",
      aboutClub: [
        "CBD Toastmasters Club is based in Futian and belongs to District 118, Division I, Area I1.",
        "Founded on June 1, 2017, with 40+ active members in Shenzhen."
      ].join("\n"),
      officers: [
        "Term | The 18th Officer Team (2026.1-2026.6)",
        "President | Momo Lee",
        "VPE | Tracy Chen",
        "VPM | Elvis Liu",
        "VPPR | Tiffany Tan",
        "Secretary | Min Chen",
        "Treasurer | Nancy Xia",
        "SAA | Lisa Yang"
      ].join("\n"),
      timingRules: [
        `Less/equal 2min | Speech length: Table topic speakers, facilitators' introductions | Green Card: 1 minute left | Yellow Card: 30 seconds left | Red Card: TIME IS UP | Bell: ${CURRENT_BELL_TEXT}`,
        `Less/equal 3 min | Speech length: Individual Evaluation, Facilitators' Report | Green Card: 2 minutes left | Yellow Card: 30 seconds left | Red Card: TIME IS UP | Bell: ${CURRENT_BELL_TEXT}`,
        `Less/equal 7 min, and other sessions more than 7mins | Speech length: Prepared Speech, Table Topic Evaluation, General Evaluation, Workshops | Green Card: 2 minutes left | Yellow Card: 1 minutes left | Red Card: TIME IS UP | Bell: ${CURRENT_BELL_TEXT}`
      ].join("\n"),
      meetingRules: [
        "Please turn off your phone or switch it to silent mode during the meeting.",
        "Please avoid political, religious, or sexual topics during club meetings.",
        "Please take away your belongings and trash when you leave the room."
      ].join("\n"),
      roleAssignments: [
        "TME | Momo Lee",
        "SAA | Jackson / Rebecca / Wilson / Lisa",
        "Photo | Bandari (EOE & CBD)",
        "Timer | Ruby Lai",
        "Grammar | Gary Jiang",
        "Hark | Nana (EOE)",
        "TTE | Dylan (EOE)",
        "LGT | Wilson Li",
        "Award | Meeting Team"
      ].join("\n"),
      items: [
        { id: "s-opening", kind: "section", title: "Opening Session" },
        { id: "i-registration", kind: "item", time: "19:00", title: "Member and Guest Registration", duration: "30", person: "All", detail: "" },
        { id: "i-rules", kind: "item", time: "19:30", title: "Brief Introduction of Meeting Rules (SAA)", duration: "2", person: "Jackson / Rebecca / Wilson / Lisa", detail: "" },
        { id: "i-president", kind: "item", time: "19:32", title: "President Opening Remarks", duration: "2", person: "Momo Lee", detail: "" },
        { id: "i-tme", kind: "item", time: "19:34", title: "Introduction of Facilitators by Toastmaster of the Evening", duration: "2", person: "Momo Lee", detail: "" },
        { id: "i-timer", kind: "item", time: "19:36", title: "Timer's Introduction", duration: "2", person: "Ruby Lai", detail: "" },
        { id: "i-grammarian", kind: "item", time: "19:38", title: "Grammarian's Introduction", duration: "2", person: "Gary Jiang", detail: "" },
        { id: "i-hark", kind: "item", time: "19:40", title: "Hark Master's Introduction", duration: "2", person: "Nana (EOE)", detail: "" },
        { id: "i-photographer", kind: "item", time: "19:42", title: "Photographer's Introduction", duration: "2", person: "Bandari (EOE)", detail: "" },
        { id: "i-guests", kind: "item", time: "19:44", title: "Guest Intro", duration: "5", person: "Wilson Li", detail: "Each guest has 30 seconds." },
        { id: "s-prepared", kind: "section", title: "Prepared Speech Session" },
        { id: "i-prepared-open", kind: "item", time: "19:49", title: "Prepared Speech Session Opening", duration: "1", person: "Momo Lee", detail: "" },
        { id: "i-speech-1", kind: "item", time: "19:50", title: "My Third Odyssey", duration: "5-7", person: "Magnolia Yang", detail: "Prepared Speech 1 | PM L1-3-1 | Practice using vocal variety or body language to enhance speech delivery." },
        { id: "i-speech-2", kind: "item", time: "19:57", title: "We Are Good Enough", duration: "5-7", person: "Dylan (EOE)", detail: "Prepared Speech 2 | DL L1-4-2 | Deliver two speeches, receive feedback, apply it, and practice constructive feedback." },
        { id: "s-table-topics", kind: "section", title: "Table Topics Session" },
        { id: "i-table-topics", kind: "item", time: "20:04", title: "Table Topic Session", duration: "25", person: "Elvis Liu", detail: "" },
        { id: "i-break", kind: "item", time: "20:29", title: "Group Photo and Tea Break", duration: "15", person: "All", detail: "" },
        { id: "s-evaluation", kind: "section", title: "Evaluation Session" },
        { id: "i-evaluation-open", kind: "item", time: "20:44", title: "Evaluation Session Opening", duration: "1", person: "Momo Lee", detail: "" },
        { id: "i-eval-1", kind: "item", time: "20:45", title: "Prepared Speech Evaluation 1", duration: "3", person: "Jenny", detail: "Evaluator for Magnolia Yang." },
        { id: "i-eval-2", kind: "item", time: "20:48", title: "Prepared Speech Evaluation 2", duration: "3", person: "Nana (EOE)", detail: "Evaluator for Dylan (EOE)." },
        { id: "i-tte", kind: "item", time: "20:51", title: "Table Topic Evaluation", duration: "6", person: "Dylan (EOE)", detail: "" },
        { id: "i-facilitator-report", kind: "item", time: "20:57", title: "Facilitator's Report", duration: "1", person: "Momo Lee", detail: "" },
        { id: "i-timer-report", kind: "item", time: "20:58", title: "Timer's Report", duration: "3", person: "Ruby Lai", detail: "" },
        { id: "i-grammarian-report", kind: "item", time: "21:01", title: "Grammarian and Ah-Counter's Report", duration: "3", person: "Gary Jiang", detail: "" },
        { id: "i-hark-report", kind: "item", time: "21:04", title: "Hark Master's Report", duration: "3", person: "Nana (EOE)", detail: "" },
        { id: "i-photo-report", kind: "item", time: "21:07", title: "Photographer's Report", duration: "2", person: "Bandari (EOE)", detail: "" },
        { id: "i-general-eval", kind: "item", time: "21:09", title: "General Evaluation", duration: "8", person: "Robin Luo", detail: "" },
        { id: "s-closing", kind: "section", title: "Awards and Closing" },
        { id: "i-vote", kind: "item", time: "21:17", title: "Vote for Best", duration: "1", person: "All", detail: "" },
        { id: "i-moment", kind: "item", time: "21:18", title: "Moment of Truth", duration: "5", person: "Rebecca Guan", detail: "" },
        { id: "i-awards", kind: "item", time: "21:23", title: "Awards for Best and Closing Remarks", duration: "3", person: "Momo Lee", detail: "" }
      ]
    };

    const meetingFieldDefs = [
      ["clubName", "Club Name", "text"],
      ["meetingTitle", "Meeting Title", "text"],
      ["meetingNumber", "Meeting Number", "text"],
      ["date", "Date", "date"],
      ["weekday", "Weekday", "text"],
      ["meetingTime", "Meeting Time", "text"],
      ["theme", "Theme", "text"],
      ["wordOfDay", "Word of the Day", "text"],
      ["location", "Location", "textarea"],
      ["meetingVision", "Meeting Vision", "textarea"],
      ["liveVotingTitle", "Live Voting Title", "text"],
      ["liveVotingNote", "Live Voting Note", "textarea"],
      ["officialQrSrc", "Official QR Image", "image"],
      ["membershipQrSrc", "Membership QR Image", "image"],
      ["votingQrSrc", "Voting QR Image", "image"]
    ];

    const previewTextFieldDefs = [
      ["agendaTitle", "A4 Title", "text"],
      ["themeLabel", "Theme Label", "text"],
      ["wordOfDayLabel", "Word Label", "text"],
      ["dateLabel", "Date Label", "text"],
      ["timeLabel", "Time Label", "text"],
      ["meetingNoLabel", "Meeting No. Label", "text"],
      ["aboutTitle", "About Card Title", "text"],
      ["timingTitle", "Timing Card Title", "text"],
      ["followTitle", "Follow Card Title", "text"],
      ["officerTitle", "Officer Card Title", "text"],
      ["flowTitle", "Flow Card Title", "text"],
      ["guestParticipationTitle", "Guest Card Title", "text"],
      ["liveVotingCardTitle", "Voting Card Title", "text"],
      ["meetingRulesTitle", "Rules Card Title", "text"],
      ["officialQrLabel", "Official QR Label", "text"],
      ["membershipQrLabel", "Membership QR Label", "text"],
      ["timingNote", "Timing Note", "textarea"],
      ["guestParticipationFooter", "Guest Participation Footer", "textarea"],
      ["liveVotingFooter", "Live Voting Footer", "text"],
      ["footerSlogan", "Footer Slogan", "text"],
      ["footerBrand", "Footer Brand", "text"]
    ];

    const readableMeetingFields = new Set([
      "clubName",
      "meetingTitle",
      "theme",
      "liveVotingTitle",
      "liveVotingNote"
    ]);
window.AgendaBuilder.data = { STORAGE_KEY, STORAGE_VERSION, MAX_QR_IMAGE_BYTES, DEFAULT_DATA, meetingFieldDefs, previewTextFieldDefs, readableMeetingFields, LEGACY_BELL_TEXT, CURRENT_BELL_TEXT };
