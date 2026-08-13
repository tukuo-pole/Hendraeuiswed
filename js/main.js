/* ==========================================================================
   CONFIG — edit everything here. Nothing else in the codebase needs to
   change when the wedding details change.
   ========================================================================== */
const CONFIG = {
  groom: {
    fullName: "Muhammad Hendrananta, S.Ars",
    shortName: "Hendra",
    fatherName: "Eko Hari Endrarto",
    motherName: "Tita Anantasari",
    photoUrl: "assets/groom.jpg" // leave "" for a placeholder circle instead
  },
  bride: {
    fullName: "Euis Herlina, S.M",
    shortName: "Euis",
    fatherName: "Caswan Ocim",
    motherName: "Rasminah",
    photoUrl: "assets/bride.jpg"
  },

  // Optional: a couple photo used as the cover section's background.
  // Leave "" to keep the plain dark cover background instead.
  coverPhotoUrl: "assets/couple.jpg",

  // Wedding date, and two events (Akad Nikah & Resepsi). Hours/minutes are
  // in WIB (UTC+7). Both events default to the same day/venue — change
  // venue per event below if they're held in different places.
  wedding: {
    year: 2026,
    month: 11,     // 1–12
    day: 28,
    timezone: "Asia/Jakarta"
  },
  events: {
    akad: {
      label: "Akad Nikah",
      startHour: 8,
      startMinute: 0,
      endHour: 10,
      endMinute: 0
    },
    resepsi: {
      label: "Resepsi",
      startHour: 11,
      startMinute: 0,
      endHour: 14,
      endMinute: 0
    }
  },

  venue: {
    name: "Arunika Eatery",
    address: "Cigugur, Palutungan, Kuningan, Jawa Barat",
    // If you have exact coordinates, fill these in for a pinpoint-accurate
    // map + directions link. Leave as null to search by name/address instead.
    lat: null,
    lng: null,
    // Shown as a small badge under the map. Leave "" to hide it.
    travelNote: "± 4 jam perjalanan dari Jakarta"
  },

  gift: {
    bankName: "Bank BCA",
    accountNumber: "123456789",
    accountHolder: "a.n. Herlinanta",
    deliveryAddress: "Jl. Cisanggiri II No.3"
  },

  // Shown in the "Quote" section right after the cover. Leave text as ""
  // to hide the section entirely.
  quote: {
    text:
      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu " +
      "pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa " +
      "tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.",
    source: "Q.S. Ar-Rum: 21"
  },

  // Photos for the "Our Moments" gallery. Add as many paths as you like —
  // just drop the files into assets/ first. Leave empty to hide the section.
  gallery: [
    "assets/moment1.jpg",
    "assets/moment2.jpg",
    "assets/moment3.jpg",
    "assets/moment4.jpg",
    "assets/moment5.jpg"
  ],

  // Paste the Web App URL you get after deploying apps-script/Code.gs
  // (see SETUP-GUIDE.md). Leave empty to keep RSVP/Wishes disabled.
  appsScriptUrl: "",

  // How often to refresh the wishes list, in milliseconds.
  wishesPollMs: 15000
};

/* ==========================================================================
   HELPERS
   ========================================================================== */
function pad2(n) { return String(n).padStart(2, "0"); }

// An event's start/end as real UTC instants, computed from the WIB fields
// above. eventKey is "akad" or "resepsi".
function getEventUtcRange(eventKey) {
  const { year, month, day } = CONFIG.wedding;
  const ev = CONFIG.events[eventKey];
  // WIB is UTC+7 year-round (no DST), so subtract 7 hours to get UTC.
  const startUtc = new Date(Date.UTC(year, month - 1, day, ev.startHour - 7, ev.startMinute, 0));
  const endUtc = new Date(Date.UTC(year, month - 1, day, ev.endHour - 7, ev.endMinute, 0));
  return { startUtc, endUtc };
}

function formatGCalDate(d) {
  return (
    d.getUTCFullYear() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}

function buildCalendarUrl(eventKey) {
  const { startUtc, endUtc } = getEventUtcRange(eventKey);
  const ev = CONFIG.events[eventKey];
  const title = `${ev.label} ${CONFIG.groom.shortName} & ${CONFIG.bride.shortName}`;
  const details = `${ev.label} ${CONFIG.groom.fullName} & ${CONFIG.bride.fullName} di ${CONFIG.venue.name}.`;
  const location = `${CONFIG.venue.name}, ${CONFIG.venue.address}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGCalDate(startUtc)}/${formatGCalDate(endUtc)}`,
    details,
    location,
    sf: "true",
    output: "xml"
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function buildMapsSearchUrl() {
  if (CONFIG.venue.lat != null && CONFIG.venue.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${CONFIG.venue.lat},${CONFIG.venue.lng}`;
  }
  const q = encodeURIComponent(`${CONFIG.venue.name}, ${CONFIG.venue.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function buildMapsEmbedUrl() {
  if (CONFIG.venue.lat != null && CONFIG.venue.lng != null) {
    return `https://www.google.com/maps?q=${CONFIG.venue.lat},${CONFIG.venue.lng}&output=embed`;
  }
  const q = encodeURIComponent(`${CONFIG.venue.name}, ${CONFIG.venue.address}`);
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

/* ==========================================================================
   POPULATE CONTENT FROM CONFIG
   ========================================================================== */
function populateContent() {
  // Cover
  document.getElementById("coverDate").textContent = formatDisplayDate();

  if (CONFIG.coverPhotoUrl) {
    const cover = document.getElementById("cover");
    cover.style.backgroundImage =
      "linear-gradient(180deg, rgba(15,22,17,0.78) 0%, rgba(15,22,17,0.62) 35%, rgba(15,22,17,0.72) 65%, rgba(15,22,17,0.92) 100%), " +
      "radial-gradient(ellipse at top, rgba(168,129,60,0.15), transparent 60%), " +
      `url('${CONFIG.coverPhotoUrl}')`;
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = "center 20%";
    cover.classList.add("cover--photo");
  }

  // Guest name from ?to=Nama in the invitation link
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  if (guest) {
    document.getElementById("guestName").textContent = decodeURIComponent(guest);
  }

  // Couple
  document.getElementById("groomName").textContent = CONFIG.groom.fullName;
  document.getElementById("brideName").textContent = CONFIG.bride.fullName;
  document.getElementById("groomParents").textContent =
    CONFIG.groom.fatherName || CONFIG.groom.motherName
      ? `Bapak ${CONFIG.groom.fatherName || "....................."} & Ibu ${CONFIG.groom.motherName || "....................."}`
      : ".....................";
  document.getElementById("brideParents").textContent =
    CONFIG.bride.fatherName || CONFIG.bride.motherName
      ? `Bapak ${CONFIG.bride.fatherName || "....................."} & Ibu ${CONFIG.bride.motherName || "....................."}`
      : "Bapak ..................... & Ibu .....................";

  if (CONFIG.groom.photoUrl) {
    document.getElementById("groomPhoto").style.backgroundImage = `url('${CONFIG.groom.photoUrl}')`;
  }
  if (CONFIG.bride.photoUrl) {
    document.getElementById("bridePhoto").style.backgroundImage = `url('${CONFIG.bride.photoUrl}')`;
  }

  // Event details — Akad Nikah & Resepsi
  const eventDateStr = formatDisplayDate(true);
  const akad = CONFIG.events.akad;
  const resepsi = CONFIG.events.resepsi;

  document.getElementById("akadDateFull").textContent = eventDateStr;
  document.getElementById("akadTimeFull").textContent =
    `${pad2(akad.startHour)}:${pad2(akad.startMinute)} – ${pad2(akad.endHour)}:${pad2(akad.endMinute)} WIB`;
  document.getElementById("akadVenueName").textContent = CONFIG.venue.name;
  document.getElementById("akadVenueAddress").textContent = CONFIG.venue.address;

  document.getElementById("resepsiDateFull").textContent = eventDateStr;
  document.getElementById("resepsiTimeFull").textContent =
    `${pad2(resepsi.startHour)}:${pad2(resepsi.startMinute)} – ${pad2(resepsi.endHour)}:${pad2(resepsi.endMinute)} WIB`;
  document.getElementById("resepsiVenueName").textContent = CONFIG.venue.name;
  document.getElementById("resepsiVenueAddress").textContent = CONFIG.venue.address;

  document.querySelectorAll(".event-card__calendarBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.open(buildCalendarUrl(btn.dataset.event), "_blank", "noopener");
    });
  });

  // Map
  document.getElementById("mapEmbed").src = buildMapsEmbedUrl();
  document.getElementById("mapDirectionsBtn").href = buildMapsSearchUrl();

  // Travel note badge
  const travelNoteEl = document.getElementById("travelNote");
  if (CONFIG.venue.travelNote) {
    document.getElementById("travelNoteText").textContent = CONFIG.venue.travelNote;
  } else {
    travelNoteEl.hidden = true;
  }

  // Gift
  document.getElementById("giftBankName").textContent = CONFIG.gift.bankName;
  document.getElementById("giftAccountNumber").textContent = CONFIG.gift.accountNumber;
  document.getElementById("giftAccountName").textContent = CONFIG.gift.accountHolder;
  document.getElementById("giftAddress").textContent = CONFIG.gift.deliveryAddress;

  // Quote
  const quoteSection = document.getElementById("quote");
  if (CONFIG.quote && CONFIG.quote.text) {
    document.getElementById("quoteText").textContent = `"${CONFIG.quote.text}"`;
    document.getElementById("quoteSource").textContent = CONFIG.quote.source
      ? `— ${CONFIG.quote.source}`
      : "";
  } else {
    quoteSection.hidden = true;
  }

  // Our Moments carousel
  const momentsSection = document.getElementById("moments");
  const momentsTrack = document.getElementById("momentsTrack");
  const gallery = CONFIG.gallery || [];
  if (gallery.length === 0) {
    momentsSection.hidden = true;
  } else {
    momentsTrack.innerHTML = gallery
      .map(
        (src) => `
        <div class="moments-carousel__item">
          <img src="${src}" alt="Momen Hendra & Euis" loading="lazy">
        </div>`
      )
      .join("");
  }
}

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function formatDisplayDate(withDayName) {
  const { year, month, day } = CONFIG.wedding;
  const d = new Date(year, month - 1, day);
  const datePart = `${day} ${MONTH_NAMES[month - 1]} ${year}`;
  return withDayName ? `${DAY_NAMES[d.getDay()]}, ${datePart}` : datePart;
}

/* ==========================================================================
   COUNTDOWN
   ========================================================================== */
function startCountdown() {
  const { startUtc } = getEventUtcRange("akad");
  const target = startUtc.getTime();

  function tick() {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    document.getElementById("cd-days").textContent = pad2(days);
    document.getElementById("cd-hours").textContent = pad2(hours);
    document.getElementById("cd-minutes").textContent = pad2(minutes);
    document.getElementById("cd-seconds").textContent = pad2(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   SCROLL REVEAL + VINE DIVIDER
   ========================================================================== */
function initReveal() {
  const targets = document.querySelectorAll(".reveal, .vine-divider");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  targets.forEach((t) => observer.observe(t));
}

/* ==========================================================================
   COVER / OPEN INVITATION + MUSIC
   ========================================================================== */
function initCoverOpen() {
  const openBtn = document.getElementById("openInvitation");
  const cover = document.getElementById("cover");
  const main = document.getElementById("mainContent");
  const music = document.getElementById("bgMusic");

  openBtn.addEventListener("click", () => {
    main.hidden = false;
    document.body.style.overflow = "auto";
    document.body.classList.add("invitation-open");
    cover.style.opacity = "0";
    cover.style.transition = "opacity 0.6s ease";
    setTimeout(() => {
      cover.style.display = "none";
      main.scrollIntoView({ behavior: "instant" });
    }, 600);

    // Browsers require a user gesture before audio can autoplay — the tap
    // on "Buka Undangan" is that gesture.
    music.play().then(() => setMusicState(true)).catch(() => {});
  });

  document.body.style.overflow = "hidden";
}

function setMusicState(playing) {
  document.getElementById("musicToggle").setAttribute("aria-pressed", String(playing));
  document.querySelector(".music-icon--play").hidden = playing;
  document.querySelector(".music-icon--pause").hidden = !playing;
}

function initMusicToggle() {
  const btn = document.getElementById("musicToggle");
  const music = document.getElementById("bgMusic");
  btn.addEventListener("click", () => {
    if (music.paused) {
      music.play().then(() => setMusicState(true)).catch(() => {});
    } else {
      music.pause();
      setMusicState(false);
    }
  });

  // Browsers allow audio to keep playing in the background by default
  // (switching apps, locking the screen, minimizing). Stop it explicitly
  // whenever the page is hidden or closed, rather than letting it run on.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && !music.paused) {
      music.pause();
      setMusicState(false);
    }
  });
  window.addEventListener("pagehide", () => {
    music.pause();
  });
}

/* ==========================================================================
   MOMENTS CAROUSEL
   ========================================================================== */
function initMomentsCarousel() {
  const track = document.getElementById("momentsTrack");
  const dotsWrap = document.getElementById("momentsDots");
  const prevBtn = document.querySelector(".moments-carousel__arrow--prev");
  const nextBtn = document.querySelector(".moments-carousel__arrow--next");
  const items = track.querySelectorAll(".moments-carousel__item");

  if (items.length === 0) return;

  dotsWrap.innerHTML = Array.from(items)
    .map((_, i) => `<button type="button" class="moments-carousel__dot${i === 0 ? " is-active" : ""}" aria-label="Foto ${i + 1}"></button>`)
    .join("");
  const dots = dotsWrap.querySelectorAll(".moments-carousel__dot");

  function scrollToIndex(i) {
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    items[clamped].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function currentIndex() {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.clientWidth / 2;
      const dist = Math.abs(itemCenter - trackCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function setActiveDot(i) {
    dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
  }

  prevBtn.addEventListener("click", () => scrollToIndex(currentIndex() - 1));
  nextBtn.addEventListener("click", () => scrollToIndex(currentIndex() + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => scrollToIndex(i)));

  let scrollTimeout;
  track.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => setActiveDot(currentIndex()), 100);
  });
}

/* ==========================================================================
   RSVP + WISHES (Google Sheets via Apps Script)
   ========================================================================== */
function initRsvpAndWishes() {
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");
  const submitBtn = form.querySelector(".rsvp-form__submit");
  const btnText = submitBtn.querySelector(".btn__text");
  const btnSpinner = submitBtn.querySelector(".btn__spinner");

  if (!CONFIG.appsScriptUrl) {
    status.textContent =
      "RSVP belum aktif — tempelkan Apps Script Web App URL di js/main.js (lihat SETUP-GUIDE.md).";
    status.classList.add("rsvp-form__status--error");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!CONFIG.appsScriptUrl) return;

    const data = {
      name: document.getElementById("rsvpName").value.trim(),
      phone: document.getElementById("rsvpPhone").value.trim(),
      attendance: form.querySelector('input[name="attendance"]:checked')?.value || "",
      guestCount: document.getElementById("rsvpGuestCount").value,
      message: document.getElementById("rsvpMessage").value.trim()
    };

    btnText.textContent = "Mengirim...";
    btnSpinner.hidden = false;
    submitBtn.disabled = true;
    status.textContent = "";
    status.className = "rsvp-form__status";

    try {
      // text/plain avoids a CORS preflight against the Apps Script endpoint.
      const res = await fetch(CONFIG.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "rsvp", ...data })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Gagal mengirim RSVP");

      status.textContent = "Terima kasih! RSVP Anda telah terkirim.";
      status.classList.add("rsvp-form__status--ok");
      form.reset();
      loadWishes();
    } catch (err) {
      status.textContent = "Maaf, terjadi kesalahan. Silakan coba lagi.";
      status.classList.add("rsvp-form__status--error");
      console.error(err);
    } finally {
      btnText.textContent = "Kirim RSVP";
      btnSpinner.hidden = true;
      submitBtn.disabled = false;
    }
  });

  if (CONFIG.appsScriptUrl) {
    loadWishes();
    setInterval(loadWishes, CONFIG.wishesPollMs);
  }
}

async function loadWishes() {
  if (!CONFIG.appsScriptUrl) return;
  const list = document.getElementById("wishesList");

  try {
    const res = await fetch(`${CONFIG.appsScriptUrl}?action=list`);
    const json = await res.json();
    const items = (json.items || []).slice().reverse(); // newest first

    if (items.length === 0) {
      list.innerHTML = '<p class="wishes-empty">Belum ada ucapan. Jadilah yang pertama!</p>';
      return;
    }

    list.innerHTML = items
      .filter((it) => it.message)
      .map(
        (it) => `
        <div class="wish-card">
          <p class="wish-card__name">${escapeHtml(it.name)}<span class="wish-card__attendance">${escapeHtml(it.attendance || "")}</span></p>
          <p class="wish-card__message">"${escapeHtml(it.message)}"</p>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error("Failed to load wishes:", err);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   COPY ACCOUNT NUMBER
   ========================================================================== */
function initCopyAccount() {
  const btn = document.getElementById("copyAccount");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.gift.accountNumber);
      btn.textContent = "Tersalin!";
      setTimeout(() => (btn.textContent = "Salin"), 1800);
    } catch {
      /* clipboard API unavailable — fail silently */
    }
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  populateContent();
  startCountdown();
  initReveal();
  initCoverOpen();
  initMusicToggle();
  initMomentsCarousel();
  initRsvpAndWishes();
  initCopyAccount();
});
