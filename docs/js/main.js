document.addEventListener("DOMContentLoaded", () => {
  setupPagination(); // ページ番号にも data-en を付けるので、言語切り替えより先に作る
  setupLanguage();
  setupMenu();
});

const isEnglish = () => document.documentElement.lang === "en";

// JA / EN 切り替え
// 英語にしたい要素には data-en="英語の文" を付ける（日本語はHTMLにそのまま書く）
function setupLanguage() {
  const buttons = document.querySelectorAll(".lang-switch button");
  const targets = document.querySelectorAll("[data-en]");
  targets.forEach((el) => {
    el.dataset.ja = el.innerHTML;
  });

  const apply = (lang) => {
    targets.forEach((el) => {
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.ja;
    });
    document.documentElement.lang = lang;
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    });
  };

  // 選んだ言語はページを移動しても引き継ぐ（保存できない環境では毎回日本語）
  let saved = "ja";
  try {
    saved = localStorage.getItem("lang") === "en" ? "en" : "ja";
  } catch (e) {
    // 何もしない
  }
  if (saved === "en") apply("en");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      apply(lang);
      try {
        localStorage.setItem("lang", lang);
      } catch (e) {
        // 何もしない
      }
    });
  });
}

// スマホ用ハンバーガーメニューの開閉
function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".global-nav");
  if (!button || !nav) return;

  const setOpen = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    const label = isEnglish()
      ? (isOpen ? "Close menu" : "Open menu")
      : (isOpen ? "メニューを閉じる" : "メニューを開く");
    button.setAttribute("aria-label", label);
  };

  button.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  // メニュー内のリンクを押したら閉じる
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

// ニュース一覧のページ送り
// <ul class="news-list" data-per-page="10"> のように件数を書くと、その件数ごとにページを分ける
// 表示中のページは URL の ?page=2 で表す（JavaScript が動かない環境では全件表示）
function setupPagination() {
  const list = document.querySelector(".news-list[data-per-page]");
  if (!list) return;

  const perPage = Number(list.dataset.perPage) || 10;
  const items = Array.from(list.children);
  const total = Math.ceil(items.length / perPage);
  if (total <= 1) return;

  const requested = Number(new URLSearchParams(location.search).get("page")) || 1;
  const current = Math.min(Math.max(requested, 1), total);

  items.forEach((item, i) => {
    item.hidden = Math.floor(i / perPage) + 1 !== current;
  });

  // 表示するページ番号：最初・最後・現在のページの前後2つ。間は「…」で省略する
  const pages = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 2) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const pageUrl = (p) => (p === 1 ? location.pathname : `?page=${p}`);

  const nav = document.createElement("nav");
  nav.className = "pagination";
  nav.setAttribute("aria-label", "ニュースのページ / News pages");
  const ul = document.createElement("ul");

  const addLink = (text, en, p, className) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = pageUrl(p);
    a.className = className;
    a.textContent = text;
    a.dataset.en = en;
    li.appendChild(a);
    ul.appendChild(li);
  };

  if (current > 1) addLink("前へ", "Previous", current - 1, "pagination__prev");

  pages.forEach((p) => {
    const li = document.createElement("li");
    if (p === "…") {
      li.className = "pagination__gap";
      li.textContent = "…";
    } else if (p === current) {
      const span = document.createElement("span");
      span.className = "pagination__num";
      span.setAttribute("aria-current", "page");
      span.textContent = p;
      li.appendChild(span);
    } else {
      const a = document.createElement("a");
      a.href = pageUrl(p);
      a.className = "pagination__num";
      a.textContent = p;
      li.appendChild(a);
    }
    ul.appendChild(li);
  });

  if (current < total) addLink("次へ", "Next", current + 1, "pagination__next");

  nav.appendChild(ul);
  list.after(nav);
}
