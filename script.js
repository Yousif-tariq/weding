/**
 * =========================================================================
 * ROYAL VELVET CRIMSON & ROSE GOLD — MOBILE-FIRST WEDDING INVITATION SCRIPT
 * Mustafa & Eithar • Remas Hall, Riyadh • 3 Dec 2027
 * Scroll-Driven Journey Timeline • Silent Mode (Audio Removed per Request)
 * =========================================================================
 */

(async () => {
  // 1. CONFIGURATION
  let config = {
    groom: "مصطفى",
    bride: "إيثار",
    monogram: "م & إ",
    date: "2027-12-03",
    displayDate: "يوم الخميس الموافق ٣ ديسمبر ٢٠٢٧",
    shortDate: "٣ ديسمبر ٢٠٢٧",
    time: "٨:٠٠ مساءً",
    location: "قاعة ريماس",
    city: "الرياض — حي الشفاء",
    address: "الرياض، حي الشفاء — قاعة ريماس للاحتفالات",
    mapsUrl: "https://maps.app.goo.gl/PpPdYDgY5c9Vi3b18?g_st=iw",
    whatsappPhone: "+966530124082",
    whatsappDisplay: "+966 53 012 4082",
    language: "ar",
    direction: "rtl",
    countdown: true,
    animations: true
  };

  try {
    const response = await fetch("./wedding.config.json");
    if (response.ok) {
      const remote = await response.json();
      config = { ...config, ...remote };
    }
  } catch (_) {}

  document.documentElement.lang = config.language || "ar";
  document.documentElement.dir = config.direction || "rtl";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const arabicDigits = (val) => String(val).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

  // Toast helper
  const toastPill = document.querySelector("#toastPill");
  let toastTimer = null;
  const showToast = (msg) => {
    if (!toastPill) return;
    toastPill.textContent = msg;
    toastPill.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastPill.classList.remove("show"), 2600);
  };

  // Personalized VIP Guest Name from URL (?to=اسم الضيف or ?guest=اسم الضيف)
  try {
    const params = new URLSearchParams(window.location.search);
    const vipName = (params.get("to") || params.get("guest") || "").trim();
    if (vipName) {
      const vipBadge = document.querySelector("#vipGuestIntro");
      document.querySelectorAll("[data-vip-name]").forEach((el) => (el.textContent = vipName));
      vipBadge?.classList.remove("hidden");
    }
  } catch (_) {}

  // Bind dynamic links
  const mapsLink = document.querySelector("#mapsLink");
  if (mapsLink) mapsLink.href = config.mapsUrl;

  const whatsappInquiryBtn = document.querySelector("#whatsappInquiryBtn");
  if (whatsappInquiryBtn) {
    const cleanPhone = (config.whatsappPhone || "+966530124082").replace(/[^0-9]/g, "");
    const prefill = `السلام عليكم، لدي استفسار بخصوص حفل زفاف ${config.groom} و ${config.bride} في ${config.location} (${config.city}).`;
    whatsappInquiryBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefill)}`;
  }

  // Hijri date helper (keeps user's exact Gregorian text untouched)
  const weddingDate = new Date(`${config.date}T20:00:00`);
  try {
    const hijriStr = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(weddingDate);
    const hijriEl = document.querySelector("#hijriDateDisplay");
    if (hijriEl) hijriEl.textContent = `الموافق ${hijriStr} هـ — بمشيئة الله تعالى`;
  } catch (_) {}

  // 1.5. SUBTLE 3D HOLOGRAPHIC TILT ON OPENING PORTAL CARD (ZERO WEBGL OVERHEAD FOR 120FPS SCROLL)
  const introPortalCard = document.querySelector("#introGlassCard");
  if (introPortalCard && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      if (document.body.classList.contains("invitation-opened") || intro?.classList.contains("opening-sequence")) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 10;
      const dy = (e.clientY / window.innerHeight - 0.5) * -8;
      introPortalCard.style.setProperty("--tilt-x", `${dy.toFixed(1)}deg`);
      introPortalCard.style.setProperty("--tilt-y", `${dx.toFixed(1)}deg`);
    }, { passive: true });
  }

  // 1.6. SUBTLE CINEMATIC PARALLAX ON OPENING HERO PHOTO (249.jpg)
  const introHeroPhoto = document.querySelector("#introHeroPhoto");
  if (introHeroPhoto && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      if (document.body.classList.contains("invitation-opened")) return;
      const bx = (e.clientX / window.innerWidth - 0.5) * -12;
      const by = (e.clientY / window.innerHeight - 0.5) * -8;
      introHeroPhoto.style.setProperty("--bg-x", `${bx.toFixed(1)}px`);
      introHeroPhoto.style.setProperty("--bg-y", `${by.toFixed(1)}px`);
    }, { passive: true });
  }

  // 2. INTRO OPENING CEREMONY & GOLDEN BURST
  const intro = document.querySelector("#intro");
  const site = document.querySelector("#site");
  const officialCard = document.querySelector("#officialCard");
  const enterButton = document.querySelector("#enterButton");
  const waxSealBtn = document.querySelector("#waxSealBtn");
  const burstCanvas = document.querySelector("#introBurstCanvas");

  document.body.style.overflow = "hidden";

  // Intro floating golden stardust
  const magicCanvas = document.querySelector("#introMagicCanvas");
  if (magicCanvas && config.animations && !reducedMotion) {
    const mCtx = magicCanvas.getContext("2d");
    let magicParticles = [];

    const resizeMagic = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      magicCanvas.width = window.innerWidth * dpr;
      magicCanvas.height = window.innerHeight * dpr;
      mCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = window.innerWidth < 600 ? 22 : 36;
      magicParticles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.9 + 0.6,
        vy: -(Math.random() * 0.3 + 0.08),
        vx: (Math.random() - 0.5) * 0.2,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.025 + 0.015
      }));
    };

    const drawStar4 = (ctx, cx, cy, outerR, innerR, color) => {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i * Math.PI) / 4;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawMagic = () => {
      if (intro?.classList.contains("opened")) return;
      mCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      magicParticles.forEach((p, idx) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.pulse) * 0.18;
        p.pulse += p.speed;
        if (p.y < -12) {
          p.y = window.innerHeight + 12;
          p.x = Math.random() * window.innerWidth;
        }
        const alpha = 0.34 + Math.abs(Math.sin(p.pulse)) * 0.58;
        const col = idx % 3 === 0
          ? `rgba(201, 162, 75, ${alpha.toFixed(2)})`
          : `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        mCtx.save();
        mCtx.shadowColor = idx % 2 === 0 ? "rgba(140, 180, 245, 0.9)" : "rgba(201, 162, 75, 0.75)";
        mCtx.shadowBlur = 10;
        if (idx % 3 === 0) {
          const s = p.r * (1.7 + Math.abs(Math.sin(p.pulse)) * 0.9);
          drawStar4(mCtx, p.x, p.y, s, s * 0.28, col);
        } else {
          mCtx.beginPath();
          mCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          mCtx.fillStyle = col;
          mCtx.fill();
        }
        mCtx.restore();
      });

      requestAnimationFrame(drawMagic);
    };

    window.addEventListener("resize", resizeMagic);
    resizeMagic();
    drawMagic();
  }

  const triggerSealBurst = (originX, originY) => {
    if (!burstCanvas || reducedMotion) return;
    const ctx = burstCanvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    burstCanvas.width = window.innerWidth * dpr;
    burstCanvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#ffffff", "#8cb4f5", "#5378cf", "#c9a24b", "#d8c2f8", "#e4eef9"];
    const particles = [];

    // 1. Futuristic Quantum Warp Light Streaks shooting outward
    for (let i = 0; i < 42; i++) {
      const angle = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.12;
      const speed = Math.random() * 14 + 9;
      particles.push({
        type: "streak",
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: Math.random() * 34 + 18,
        angle,
        color: colors[i % colors.length],
        alpha: 1,
        decay: Math.random() * 0.024 + 0.018
      });
    }

    // 2. Crystal 4-point Stars & Iridescent Energy Orbs
    for (let i = 0; i < 64; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9.5 + 2.5;
      particles.push({
        type: i % 3 === 0 ? "star" : "orb",
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        r: Math.random() * 3.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.016 + 0.011,
        gravity: 0.09
      });
    }

    const renderBurst = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = false;

      particles.forEach((p) => {
        p.alpha -= p.decay;
        if (p.alpha <= 0) return;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === "streak") {
          p.vx *= 1.03;
          p.vy *= 1.03;
          const tailX = p.x - Math.cos(p.angle) * p.len;
          const tailY = p.y - Math.sin(p.angle) * p.len;
          const grad = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, p.color);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.lineCap = "round";
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        } else if (p.type === "star") {
          p.vy += p.gravity;
          p.vx *= 0.96;
          const s = p.r * 2.2;
          ctx.fillStyle = p.color;
          ctx.shadowColor = "#d4e0eb";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          for (let j = 0; j < 8; j++) {
            const rad = j % 2 === 0 ? s : s * 0.28;
            const a = (j * Math.PI) / 4;
            const px = p.x + Math.cos(a) * rad;
            const py = p.y + Math.sin(a) * rad;
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          p.vy += p.gravity;
          p.vx *= 0.96;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
        }

        ctx.restore();
      });

      if (alive) requestAnimationFrame(renderBurst);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    renderBurst();
  };

  // 2.5. FUTURISTIC LUMINOUS PEN WRITING + LIQUID WATER FLOW ENGINE
  const playLiquidCalligraphy = () => {
    const lineWraps = [...document.querySelectorAll("#liquidStanza .liquid-line-wrap")];
    const turbEl = document.querySelector("#liquidTurbulence");
    const dispEl = document.querySelector("#liquidDisplacement");
    if (!lineWraps.length) return;

    if (reducedMotion) {
      lineWraps.forEach((w) => w.classList.add("is-settled"));
      return;
    }

    // Animate SVG liquid ripple pulse smoothly when a line finishes writing
    const triggerWaterRipple = (durationMs = 780) => {
      if (!turbEl || !dispEl) return;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / durationMs);
        // Smooth bell-curve wave (0 -> peak 7.5 -> 0) like water flowing over silk
        const wave = Math.sin(t * Math.PI);
        const scale = wave * 7.5;
        const freqY = 0.05 + t * 0.06;
        dispEl.setAttribute("scale", scale.toFixed(2));
        turbEl.setAttribute("baseFrequency", `0.022 ${freqY.toFixed(3)}`);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          dispEl.setAttribute("scale", "0");
        }
      };
      requestAnimationFrame(step);
    };

    const runLine = (index) => {
      if (index >= lineWraps.length) return;
      const wrap = lineWraps[index];

      // Step A: Luminous pen writes the line smoothly Right -> Left
      wrap.classList.add("is-writing");

      // Step B: Once written, ink turns liquid, ripples like water & trickles into next line
      setTimeout(() => {
        wrap.classList.remove("is-writing");
        wrap.classList.add("is-flowing");
        triggerWaterRipple(760);

        // Start writing the next line just as the liquid drop reaches it
        setTimeout(() => {
          if (index + 1 < lineWraps.length) {
            runLine(index + 1);
          } else {
            officialCard?.classList.add("stanza-done");
          }
        }, 420);

        // Settle finished line into calm luminous ink
        setTimeout(() => {
          wrap.classList.remove("is-flowing");
          wrap.classList.add("is-settled");
        }, 900);
      }, 1220);
    };

    runLine(0);
  };

  let hasOpened = false;
  const openInvitation = () => {
    if (hasOpened) return;
    hasOpened = true;

    let ox = window.innerWidth / 2;
    let oy = window.innerHeight / 2;
    if (waxSealBtn) {
      const rect = waxSealBtn.getBoundingClientRect();
      ox = rect.left + rect.width / 2;
      oy = rect.top + rect.height / 2;
    }

    intro?.classList.add("opening-sequence");
    triggerSealBurst(ox, oy);

    const delay = reducedMotion ? 80 : 900;
    setTimeout(() => {
      document.body.classList.add("invitation-opened");
      intro?.classList.add("opened");
      site?.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "";
      window.scrollTo({ top: 0, behavior: "instant" });

      // Trigger futuristic luminous pen writing + liquid water flow stanza
      requestAnimationFrame(() => {
        officialCard?.classList.add("poetic-revealed");
        setTimeout(playLiquidCalligraphy, 240);
        updateJourneyTimeline();
      });

      setTimeout(() => {
        if (intro) intro.style.display = "none";
      }, 1200);
    }, delay);
  };

  enterButton?.addEventListener("click", openInvitation);
  waxSealBtn?.addEventListener("click", openInvitation);

  // 3. LIVE COUNTDOWN TIMER
  if (config.countdown) {
    const daysEl = document.querySelector("[data-days]");
    const hoursEl = document.querySelector("[data-hours]");
    const minsEl = document.querySelector("[data-minutes]");
    const secsEl = document.querySelector("[data-seconds]");

    const updateCountdown = () => {
      const distance = weddingDate.getTime() - Date.now();
      if (distance <= 0) {
        if (daysEl) daysEl.textContent = arabicDigits("000");
        if (hoursEl) hoursEl.textContent = arabicDigits("00");
        if (minsEl) minsEl.textContent = arabicDigits("00");
        if (secsEl) secsEl.textContent = arabicDigits("00");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = arabicDigits(String(days).padStart(3, "0"));
      if (hoursEl) hoursEl.textContent = arabicDigits(String(hours).padStart(2, "0"));
      if (minsEl) minsEl.textContent = arabicDigits(String(minutes).padStart(2, "0"));
      if (secsEl) secsEl.textContent = arabicDigits(String(seconds).padStart(2, "0"));
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 4. ADD TO CALENDAR (.ICS)
  const addToCalendarBtn = document.querySelector("#addToCalendarBtn");
  addToCalendarBtn?.addEventListener("click", () => {
    const dateCompact = config.date.replace(/-/g, "");
    const startDate = `${dateCompact}T170000Z`;
    const endDate = `${dateCompact}T230000Z`;
    const title = `حفل زفاف ${config.groom} & ${config.bride}`;
    const details = `يتشرف آل عبد الله يوسف زكريا وآل مبارك محمد عبد الله بدعوتكم لحضور زفاف ${config.groom} و ${config.bride} في ${config.location} (${config.city}).`;

    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mustafa & Eithar//Wedding Invitation//AR",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${config.address}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Wedding-${config.groom}-${config.bride}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تجهيز ملف التقويم بنجاح ✦");
  });

  // 5. SCROLL-DRIVEN JOURNEY TIMELINE (محطات الفرح لحظة بلحظة)
  const journeyWrap = document.querySelector("#journeyTrackWrap");
  const journeyRailFill = document.querySelector("#journeyRailFill");
  const journeyTraveler = document.querySelector("#journeyTraveler");
  const journeyStations = [...document.querySelectorAll(".journey-station")];

  const updateJourneyTimeline = () => {
    if (!journeyWrap || !journeyRailFill || !journeyTraveler) return;

    const wrapRect = journeyWrap.getBoundingClientRect();
    const triggerY = window.innerHeight * 0.58;
    const totalHeight = Math.max(1, wrapRect.height - 44);
    const progressed = Math.min(totalHeight, Math.max(0, triggerY - (wrapRect.top + 22)));
    const pct = (progressed / totalHeight) * 100;

    journeyRailFill.style.height = `${pct.toFixed(1)}%`;
    journeyTraveler.style.top = `${pct.toFixed(1)}%`;

    journeyStations.forEach((station) => {
      const sRect = station.getBoundingClientRect();
      if (sRect.top <= window.innerHeight * 0.72) {
        station.classList.add("is-reached");
      }
    });
  };

  // 6. LIGHTBOX FOR ALL IMAGES
  const photoModal = document.querySelector("#photoModal");
  const modalImg = document.querySelector("#modalImg");
  const modalCaption = document.querySelector("#modalCaption");
  const modalCloseBtn = document.querySelector("#modalCloseBtn");
  const modalBackdrop = document.querySelector("#modalBackdrop");

  const openLightbox = (src, caption) => {
    if (!photoModal || !modalImg) return;
    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = caption || "";
    photoModal.classList.add("active");
    photoModal.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    if (!photoModal) return;
    photoModal.classList.remove("active");
    photoModal.setAttribute("aria-hidden", "true");
  };

  document.querySelectorAll("[data-lightbox]").forEach((el) => {
    el.addEventListener("click", () => {
      openLightbox(el.getAttribute("data-lightbox"), el.getAttribute("data-caption"));
    });
  });

  modalCloseBtn?.addEventListener("click", closeLightbox);
  modalBackdrop?.addEventListener("click", closeLightbox);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // 7. SHARE LOCATION, COPY LINK & WHATSAPP SHARE
  const shareLocationBtn = document.querySelector("#shareLocationBtn");
  shareLocationBtn?.addEventListener("click", async () => {
    const text = `موقع حفل زفاف ${config.groom} & ${config.bride} في ${config.location} (${config.city}):\n${config.mapsUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `موقع ${config.location}`, text, url: config.mapsUrl });
      } catch (_) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showToast("تم نسخ موقع قاعة ريماس ✦");
    }
  });

  const copyLinkBtn = document.querySelector("#copyLinkBtn");
  const copyLinkText = document.querySelector("#copyLinkText");
  copyLinkBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (copyLinkText) copyLinkText.textContent = "تم النسخ ✓";
      showToast("تم نسخ رابط الدعوة بنجاح ✦");
      setTimeout(() => {
        if (copyLinkText) copyLinkText.textContent = "نسخ الرابط";
      }, 2400);
    } catch (_) {}
  });

  const shareWhatsAppBtn = document.querySelector("#shareWhatsAppBtn");
  shareWhatsAppBtn?.addEventListener("click", () => {
    const shareMsg = `ليلة الفرح الأبيض طلّا ✨\nيتشرف آل عبد الله يوسف زكريا وآل مبارك محمد عبد الله بدعوتكم لحضور زفاف مصطفى وإيثار في قاعة ريماس بالرياض:\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, "_blank", "noopener,noreferrer");
  });

  // 8. SCROLL REVEAL, ACTIVE NAV & SCROLL PROGRESS
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const navPills = [...document.querySelectorAll(".nav-pill")];
  const sections = navPills
    .map((pill) => document.querySelector(pill.getAttribute("href")))
    .filter(Boolean);

  const scrollProgress = document.querySelector("#scrollProgress");
  const canopyImg = document.querySelector(".hero-canopy-img");
  const unlockScrollBtn = document.querySelector("#unlockScrollBtn");

  const unlockScrollSections = (autoScrollToCard = false) => {
    if (!document.body.classList.contains("invitation-opened")) return;
    const alreadyUnlocked = document.body.classList.contains("scroll-unlocked");
    if (!alreadyUnlocked) {
      document.body.classList.add("scroll-unlocked");
      // Ensure the first official card is immediately visible upon unlocking
      document.querySelectorAll("#invitation .reveal").forEach((el) => el.classList.add("visible"));
      requestAnimationFrame(() => {
        updateJourneyTimeline();
        if (autoScrollToCard) {
          document.querySelector("#invitation")?.scrollIntoView({ behavior: "smooth" });
        }
      });
    } else if (autoScrollToCard) {
      document.querySelector("#invitation")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Unlock on button tap, mouse wheel down, touch swipe up, or ArrowDown/PageDown/Space
  unlockScrollBtn?.addEventListener("click", () => unlockScrollSections(true));

  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 8) unlockScrollSections(false);
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0]?.clientY || 0;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const currentY = e.touches[0]?.clientY || 0;
    if (touchStartY - currentY > 22) {
      unlockScrollSections(false);
    }
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (["ArrowDown", "PageDown", "Space", " "].includes(e.key)) {
      unlockScrollSections(false);
    }
  });

  let scrollTicking = false;
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      scrollTicking = false;
      const y = window.scrollY;
      if (y > 16 && document.body.classList.contains("invitation-opened")) {
        unlockScrollSections(false);
      }

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (scrollProgress) {
        scrollProgress.style.width = `${Math.min(100, (y / maxScroll) * 100).toFixed(1)}%`;
      }

      updateJourneyTimeline();

      let activeId = sections[0]?.id;
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 150) activeId = sec.id;
      });
      navPills.forEach((pill) => {
        pill.classList.toggle("active", pill.getAttribute("href") === `#${activeId}`);
      });
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 9. ULTRA-LIGHTWEIGHT FLOATING STARDUST PARTICLES (ZERO SHADOWBLUR LAG)
  const canvas = document.querySelector("#sparkles");
  if (canvas && config.animations && !reducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animId = null;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = window.innerWidth < 600 ? 10 : 16;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.6,
        vy: -(Math.random() * 0.16 + 0.05),
        vx: (Math.random() - 0.5) * 0.06,
        pulse: Math.random() * Math.PI * 2
      }));
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.pulse += 0.022;
        if (p.y < -10) {
          p.y = window.innerHeight + 10;
          p.x = Math.random() * window.innerWidth;
        }
        const alpha = 0.22 + Math.abs(Math.sin(p.pulse)) * 0.38;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 75, ${alpha.toFixed(2)})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    drawParticles();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      } else if (!document.hidden && !animId) {
        drawParticles();
      }
    });
  }
})();
