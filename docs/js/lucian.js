// Lucian UX/UI Prompt の部品を、このサイト用に移植した動き
//   https://lucianlabs.dev/uxui-prompt/
// 各関数の先頭に、元の部品の番号と MIT ライセンスの表記を残している（消さないこと）
// defer で読み込むので、HTML を読み終えた直後（main.js の言語切り替えより前）に動く
// そのため、ここで作る要素に data-en を付けておけば、言語切り替えの対象になる

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isEnglish = () => document.documentElement.lang === "en";

  setupHideOnScrollHeader();
  setupHeroEntrance();
  setupGridBeams();
  setupMarquee();
  setupScrollIn();
  setupBento();
  setupGlowCta();
  setupBackToTop();
  setupTimeline();
  setupPanels();

  // Lucian UX/UI Prompt #212 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#212
  // 下にスクロールするとヘッダーが上へ隠れ、少し戻すとすりガラスのヘッダーで戻る。下の線は読んだ量
  // スマホのメニューを開いている間と、ヘッダー内にフォーカスがある間は隠さない
  function setupHideOnScrollHeader() {
    const root = document.querySelector(".site-header");
    if (!root) return;
    root.classList.add("u212");
    const pg = document.createElement("span");
    pg.className = "u212-pg";
    pg.setAttribute("aria-hidden", "true");
    root.appendChild(pg);
    const nav = root.querySelector(".global-nav");

    let last = window.scrollY;
    let acc = 0;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const d = y - last;
      last = y;
      acc = (d > 0) === (acc > 0) ? acc + d : d;
      root.classList.toggle("is-solid", y > 20);
      if (y < 60 || (nav && nav.classList.contains("is-open"))) root.classList.remove("is-hide");
      else if (acc > 8) root.classList.add("is-hide");
      else if (acc < -6) root.classList.remove("is-hide");
      const max = document.documentElement.scrollHeight - window.innerHeight;
      pg.style.width = ((y / Math.max(1, max)) * 100).toFixed(1) + "%";
    };
    window.addEventListener("scroll", () => {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  // Lucian UX/UI Prompt #216 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#216
  // トップのヒーロー：ラベル → 見出しの語 → 説明 → ボタンが、少しずつ間をあけて浮かび上がる
  // 遅らせる時間は HTML の style="--d:ミリ秒" で指定する
  function setupHeroEntrance() {
    const root = document.querySelector(".u216");
    if (!root) return;
    const play = () => requestAnimationFrame(() => root.classList.add("is-in"));
    if (reduceMotion || !("IntersectionObserver" in window)) {
      root.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        play();
      }
    }, { threshold: 0.35 });
    io.observe(root);
  }

  // Lucian UX/UI Prompt #226 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#226
  // ヒーローの方眼の線に沿って光が流れる。カーソルの周りだけ方眼が明るくなる
  // 動きを減らす設定のときは、光を流さず方眼だけを表示する
  function setupGridBeams() {
    const root = document.querySelector(".u226");
    if (!root) return;
    const cv = root.querySelector(".u226-cv");
    const cx = cv.getContext("2d");
    const C = 34;
    const COL = ["199,214,242", "125,180,255", "45,212,191"];
    let W = 0;
    let H = 0;
    let B = [];
    let acc = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = root.clientWidth;
      H = root.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const spawn = () => {
      const v = Math.random() < 0.5;
      const line = (1 + Math.floor(Math.random() * ((v ? W : H) / C - 1))) * C - 1;
      const dir = Math.random() < 0.5 ? 1 : -1;
      B.push({
        v, l: line, p: dir > 0 ? -60 : (v ? H : W) + 60, d: dir,
        sp: 110 + Math.random() * 90, len: 50 + Math.random() * 40, c: COL[Math.floor(Math.random() * 3)],
      });
    };

    function draw() {
      cx.clearRect(0, 0, W, H);
      B.forEach((b) => {
        const x0 = b.v ? b.l : b.p - b.d * b.len;
        const y0 = b.v ? b.p - b.d * b.len : b.l;
        const x1 = b.v ? b.l : b.p;
        const y1 = b.v ? b.p : b.l;
        const g = cx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(" + b.c + ",0)");
        g.addColorStop(1, "rgba(" + b.c + ",.95)");
        cx.strokeStyle = g;
        cx.lineWidth = 1.6;
        cx.beginPath();
        cx.moveTo(x0 + 0.5, y0 + 0.5);
        cx.lineTo(x1 + 0.5, y1 + 0.5);
        cx.stroke();
        cx.fillStyle = "rgba(" + b.c + ",1)";
        cx.shadowColor = "rgba(" + b.c + ",1)";
        cx.shadowBlur = 8;
        cx.beginPath();
        cx.arc(x1 + 0.5, y1 + 0.5, 1.8, 0, 6.2832);
        cx.fill();
        cx.shadowBlur = 0;
      });
    }

    let raf = 0;
    let last = 0;
    let vis = true;
    const frame = (now) => {
      raf = 0;
      if (!vis) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      acc += dt;
      if (acc > 0.42 && B.length < 9) {
        acc = 0;
        spawn();
      }
      B.forEach((b) => {
        b.p += b.d * b.sp * dt;
      });
      B = B.filter((b) => {
        const lim = (b.v ? H : W) + 70;
        return b.d > 0 ? b.p < lim : b.p > -70;
      });
      draw();
      raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (!raf && vis && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        vis = entries[0].isIntersecting;
        run();
      }).observe(root);
    }
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(root);
    else window.addEventListener("resize", resize);

    root.addEventListener("pointermove", (e) => {
      const r = root.getBoundingClientRect();
      root.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
      root.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
    });
    root.addEventListener("pointerleave", () => {
      root.style.setProperty("--mx", "-200px");
      root.style.setProperty("--my", "-200px");
    });

    resize();
    if (reduceMotion) return;
    for (let i = 0; i < 4; i++) {
      spawn();
      B[i].p = (B[i].v ? H : W) * (0.2 + i * 0.18);
    }
    draw();
    run();
  }

  // Lucian UX/UI Prompt #394 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#394
  // 3段の大きな文字がゆっくり逆向きに流れ、スクロールの速さに合わせて加速して少し傾く
  // 上にスクロールすると向きが逆になり、止まるとゆっくりした流れに戻る
  // 流す文字は HTML の data-rows に「|」区切りで書く（飾りなので読み上げ対象から外している）
  function setupMarquee() {
    const root = document.querySelector(".u394");
    if (!root) return;
    const ROWS = (root.dataset.rows || "").split("|");
    const rows = ROWS.map((t, i) => {
      const r = document.createElement("div");
      r.className = "u394-row";
      for (let k = 0; k < 4; k++) {
        const s = document.createElement("span");
        s.textContent = t;
        r.appendChild(s);
      }
      root.appendChild(r);
      return { el: r, x: -Math.random() * 200, dir: i % 2 ? 1 : -1, w: 0 };
    });

    let lastY = window.scrollY;
    let boost = 0;
    let sign = 1;
    let last = 0;
    let vis = true;
    let skew = 0;
    window.addEventListener("scroll", () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      boost = Math.min(40, boost + Math.abs(dy) * 0.25);
      if (dy) sign = dy > 0 ? 1 : -1;
    }, { passive: true });
    window.addEventListener("resize", () => rows.forEach((r) => { r.w = 0; }));

    const frame = (now) => {
      const dt = Math.max(0, Math.min(50, now - (last || now))) / 16.7;
      last = now;
      boost *= Math.pow(0.92, dt);
      skew += ((boost > 1 ? sign * Math.min(8, boost * 0.35) : 0) - skew) * 0.15 * dt;
      rows.forEach((r) => {
        if (!r.w) r.w = r.el.firstChild.offsetWidth;
        r.x += r.dir * sign * (0.5 + boost) * dt;
        if (r.x < -r.w) r.x += r.w;
        if (r.x > 0) r.x -= r.w;
        r.el.style.transform = "translateX(" + r.x.toFixed(1) + "px) skewX(" + (-skew * r.dir).toFixed(2) + "deg)";
      });
      if (vis && !reduceMotion) requestAnimationFrame(frame);
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        const was = vis;
        vis = entries[0].isIntersecting;
        if (vis && !was) {
          last = 0;
          requestAnimationFrame(frame);
        }
      }).observe(root);
    }
    requestAnimationFrame(frame);
  }

  // Lucian UX/UI Prompt #251 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#251
  // 画面に入ったカードが、左の列から順に少しずつ間をあけて下から浮かび上がる
  // セクション見出しの上のラインは左から引かれる。上に戻ってから下ると、また最初から登場する
  function setupScrollIn() {
    const cards = [];
    document.querySelectorAll(".card-grid").forEach((grid) => {
      Array.from(grid.children).forEach((card, i) => {
        if (!card.classList.contains("card")) return;
        card.classList.add("u251-cd");
        cards.push({ card, grid, i });
      });
    });
    const heads = Array.from(document.querySelectorAll(".section-title"));
    heads.forEach((h) => h.classList.add("u251-hd"));

    // 何列で並んでいるかは画面幅で変わるので、登場させる直前に数える
    const setDelay = ({ card, grid, i }) => {
      const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length || 1;
      card.style.setProperty("--d", (i % cols) * 0.09 + "s");
    };

    const R = cards.map((c) => c.card).concat(heads);
    if (reduceMotion || !("IntersectionObserver" in window)) {
      R.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const c = cards.find((x) => x.card === e.target);
          if (c) setDelay(c);
          e.target.classList.add("is-in");
        } else if (e.boundingClientRect.top > e.rootBounds.bottom - 1) {
          e.target.classList.remove("is-in");
        }
      });
    }, { threshold: 0.18 });
    R.forEach((el) => io.observe(el));
  }

  // Lucian UX/UI Prompt #214 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#214
  // ベントーグリッドのタイルにカーソルを合わせる（またはフォーカスする）と、タイルごとの動きが再生される
  // 打ち込まれる文字は HTML の data-type（日本語）と data-type-en（英語）に書く
  function setupBento() {
    const root = document.querySelector(".u214");
    if (!root) return;
    const br = root.querySelector(".u214-br");
    if (br) {
      [0.45, 0.7, 0.55, 0.9, 0.75, 1].forEach((h, i) => {
        const b = document.createElement("i");
        b.style.setProperty("--h", h);
        b.style.setProperty("--i", i);
        br.appendChild(b);
      });
    }

    const timers = new Map();
    const type = (el) => {
      clearTimeout(timers.get(el));
      const text = isEnglish() ? el.dataset.typeEn : el.dataset.type;
      if (!text) return;
      if (reduceMotion) {
        el.textContent = text;
        return;
      }
      const s = Array.from(text);
      let k = 0;
      const t = () => {
        el.textContent = s.slice(0, ++k).join("");
        if (k < s.length) timers.set(el, setTimeout(t, 45));
      };
      t();
    };

    root.querySelectorAll(".u214-t").forEach((t) => {
      const on = () => {
        t.classList.add("is-on");
        t.querySelectorAll("[data-type]").forEach(type);
      };
      const off = () => t.classList.remove("is-on");
      t.addEventListener("pointerenter", on);
      t.addEventListener("pointerleave", off);
      t.addEventListener("focus", on);
      t.addEventListener("blur", off);
    });
  }

  // Lucian UX/UI Prompt #211 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#211
  // お問い合わせ欄：ボタンの後ろで光の帯が回り、ボタンの縁を色の光が一周する
  // 全ページ共通の HTML はそのままにして、ここで飾りの要素を足す（JavaScript が動かなくても元の見た目で使える）
  function setupGlowCta() {
    const root = document.querySelector(".contact-cta");
    if (!root) return;
    const button = root.querySelector(".btn--ghost");
    const title = root.querySelector(".contact-cta__title");
    root.classList.add("ux", "u211");

    const bm = document.createElement("span");
    bm.className = "u211-bm";
    bm.setAttribute("aria-hidden", "true");
    root.prepend(bm);

    if (title) title.classList.add("u211-gr");

    if (button) {
      button.classList.remove("btn", "btn--ghost");
      button.classList.add("u211-bt");
      const inner = document.createElement("span");
      inner.className = "u211-in";
      inner.append(...button.childNodes);
      inner.insertAdjacentHTML("beforeend",
        '<svg class="u211-ar" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      button.appendChild(inner);
    }
  }

  // Lucian UX/UI Prompt #343 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#343
  // ある程度下へスクロールすると右下に丸いボタンが浮かび、周りの輪が読んだ量だけ埋まる
  // 押すと矢印がロケットに変わって飛び、ページがなめらかに先頭へ戻る
  // 戻ったあとはフォーカスをヘッダーのロゴへ移す（キーボード操作の人が見失わないように）
  function setupBackToTop() {
    const root = document.createElement("div");
    root.className = "ux u343";
    root.innerHTML =
      '<button class="u343-up" type="button">' +
      '<span class="visually-hidden" data-en="Back to top">ページの先頭へ戻る</span>' +
      '<svg viewBox="0 0 52 52" aria-hidden="true"><circle class="u343-ring" cx="26" cy="26" r="24"/><path class="u343-ar" d="M26 34V18M19 25l7-7 7 7"/><g class="u343-rk"><path class="f" d="M23 33h6l-3 7z"/><path class="b" d="M26 13c4 3 5 9 4 16h-8c-1-7 0-13 4-16z"/><circle class="w" cx="26" cy="22" r="2.2"/><path class="b" d="M22 26l-3 6h4zM30 26l3 6h-4z"/></g></svg>' +
      "</button>";
    const footer = document.querySelector(".site-footer");
    if (footer) footer.after(root);
    else document.body.appendChild(root);

    const up = root.querySelector(".u343-up");
    const ring = root.querySelector(".u343-ring");
    const rk = root.querySelector(".u343-rk");
    const C = 2 * Math.PI * 24;
    let raf = 0;
    let flying = false;
    ring.style.strokeDasharray = C;

    const draw = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      ring.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
      if (!flying) root.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", () => {
      if (!raf) raf = requestAnimationFrame(draw);
    }, { passive: true });

    up.addEventListener("click", () => {
      if (flying) return;
      flying = true;
      root.classList.add("fly");
      const from = window.scrollY;
      const t0 = performance.now();
      const D = reduceMotion ? 1 : 900;
      // html の scroll-behavior: smooth を一時的に止め、1コマずつ位置を決める
      const html = document.documentElement;
      html.style.scrollBehavior = "auto";
      if (!reduceMotion && rk.animate) {
        rk.animate(
          [{ transform: "none" }, { transform: "translateY(4px)", offset: 0.15 }, { transform: "translateY(-260px)" }],
          { duration: 900, easing: "cubic-bezier(.6,0,.8,.4)" }
        );
      }
      const f = (now) => {
        const k = Math.min(1, Math.max(0, (now - t0) / D));
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        window.scrollTo(0, from * (1 - e));
        if (k < 1) {
          requestAnimationFrame(f);
          return;
        }
        html.style.scrollBehavior = "";
        const logo = document.querySelector(".site-logo");
        if (logo) logo.focus({ preventScroll: true });
        setTimeout(() => {
          flying = false;
          root.classList.remove("fly");
          draw();
        }, 200);
      };
      requestAnimationFrame(f);
    });
    draw();
  }

  // Lucian UX/UI Prompt #370 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#370
  // 行事紹介の「1年の流れ」：画面の上から6割の位置まで、中央の線が光で満ちていく
  // 線の先が届いた月の点が点灯し、その月のカードが左右交互に滑り込む。上へ戻すと逆の順に消える
  // HTML の <ol class="timeline"> はそのままにして、ここで線・点・カードの枠を足す
  function setupTimeline() {
    const tl = document.querySelector(".timeline");
    if (!tl) return;
    tl.classList.add("ux", "u370");
    const ln = document.createElement("span");
    ln.className = "u370-ln";
    ln.setAttribute("aria-hidden", "true");
    ln.appendChild(document.createElement("i"));
    tl.prepend(ln);

    const evs = Array.from(tl.querySelectorAll(":scope > li"));
    evs.forEach((li) => {
      li.classList.add("u370-ev");
      const cd = document.createElement("div");
      cd.className = "u370-cd";
      cd.append(...li.childNodes);
      const dot = document.createElement("span");
      dot.className = "u370-dot";
      dot.setAttribute("aria-hidden", "true");
      li.append(dot, cd);
    });

    // 動きを減らす設定のときは、最初からすべて点灯した状態で表示する
    if (reduceMotion) {
      ln.style.setProperty("--p", "1");
      evs.forEach((li) => li.classList.add("on"));
      return;
    }

    let raf = 0;
    const draw = () => {
      raf = 0;
      const top = ln.getBoundingClientRect().top;
      const tip = window.innerHeight * 0.6 - top;
      const p = Math.max(0, Math.min(1, tip / ln.offsetHeight));
      ln.style.setProperty("--p", p.toFixed(4));
      evs.forEach((li) => {
        li.classList.toggle("on", li.getBoundingClientRect().top - top + 18 <= tip);
      });
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    requestAnimationFrame(draw);
  }

  // Lucian UX/UI Prompt #389 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#389
  // トップの研究紹介：細いパネルにカーソルを合わせる・フォーカスすると、そのパネルが大きく開く
  // ←/→（スマホの縦並びでは ↑/↓ も）キーで隣のパネルへ移動する
  // パネルはリンクなので、タップでは1回目で開くだけにして、開いているパネルをもう一度押すとページへ移動する
  function setupPanels() {
    const root = document.querySelector(".u389");
    if (!root) return;
    const ps = Array.from(root.querySelectorAll(".u389-p"));
    let cur = 0;
    let pointerType = "mouse";

    // 説明欄の幅は「開いたときのパネルの幅」に固定する（閉じて細いときに折り返して高さが変わらないように）
    // そのうえで、開いたときの名前を説明とボタンのすぐ上に置く
    const place = () => {
      const row = getComputedStyle(root).flexDirection === "row";
      if (row) {
        const cs = getComputedStyle(root);
        const inner = root.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const gaps = parseFloat(cs.columnGap || cs.gap) * (ps.length - 1);
        const openW = ((inner - gaps) * 5) / (ps.length + 4);
        root.style.setProperty("--ds-w", Math.floor(openW - 48) + "px");
      } else {
        root.style.removeProperty("--ds-w");
      }
      ps.forEach((p) => {
        const ds = p.querySelector(".u389-ds");
        p.style.setProperty("--lb-b", ds.offsetHeight + 24 + 12 + "px");
      });
    };

    const open = (i) => {
      cur = i;
      ps.forEach((p, k) => p.classList.toggle("on", k === i));
    };

    ps.forEach((p, i) => {
      p.addEventListener("pointerdown", (e) => {
        pointerType = e.pointerType;
      });
      p.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") open(i);
      });
      p.addEventListener("focus", () => open(i));
      p.addEventListener("click", (e) => {
        if (pointerType !== "mouse" && !p.classList.contains("on")) {
          e.preventDefault();
          open(i);
        }
        pointerType = "mouse";
      });
      p.addEventListener("keydown", (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key] || 0;
        if (!d) return;
        e.preventDefault();
        const n = Math.max(0, Math.min(ps.length - 1, cur + d));
        open(n);
        ps[n].focus();
      });
    });

    window.addEventListener("resize", place);
    // 言語を切り替えると説明の長さが変わるので、置き直す
    document.querySelectorAll(".lang-switch button").forEach((b) => b.addEventListener("click", () => setTimeout(place)));
    if (document.fonts) document.fonts.ready.then(place);
    place();
    open(0);
  }
})();
