document.addEventListener("DOMContentLoaded", () => {
  setupPagination(); // ページ番号にも data-en を付けるので、言語切り替えより先に作る
  setupLanguage();
  setupFontSize();
  setupMenu();
  setupDialogs();
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

// ニュース一覧のページ送りとカテゴリーの絞り込み
// <ul class="news-list" data-per-page="10"> のように件数を書くと、その件数ごとにページを分ける
// 各ニュースの data-category と、カテゴリー選択欄（#news-filter-select）の値で絞り込む
// 表示中の状態は URL の ?category=paper&page=2 で表す（JavaScript が動かない環境では全件表示）
// ページ番号を押したときは読み込み直さずに中身だけ入れ替え、一覧の先頭までスクロールする
function setupPagination() {
  const list = document.querySelector(".news-list[data-per-page]");
  if (!list) return;

  const perPage = Number(list.dataset.perPage) || 10;
  const items = Array.from(list.children);
  const filter = document.querySelector(".news-filter");
  const select = document.querySelector("#news-filter-select");
  const categories = select ? Array.from(select.options, (option) => option.value) : [""];

  const stateFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    return {
      category: categories.includes(category) ? category : "",
      page: Number(params.get("page")) || 1,
    };
  };

  const stateUrl = (category, page) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", page);
    const query = params.toString();
    return query ? `?${query}` : location.pathname;
  };

  const makeLink = (text, className) => {
    const a = document.createElement("a");
    a.className = className;
    a.textContent = text;
    return a;
  };

  // 「前へ」「次へ」は一度だけ作って使い回す（言語切り替えの対象に含めるため）
  const prevItem = document.createElement("li");
  const prev = makeLink("前へ", "pagination__prev");
  prev.dataset.en = "Previous";
  prevItem.appendChild(prev);

  const nextItem = document.createElement("li");
  const next = makeLink("次へ", "pagination__next");
  next.dataset.en = "Next";
  nextItem.appendChild(next);

  const nav = document.createElement("nav");
  nav.className = "pagination";
  nav.setAttribute("aria-label", "ニュースのページ / News pages");
  const ul = document.createElement("ul");
  nav.appendChild(ul);
  list.after(nav);

  let category = "";

  const render = (state) => {
    category = state.category;
    if (select) select.value = category;

    const matched = items.filter((item) => !category || item.dataset.category === category);
    const total = Math.max(Math.ceil(matched.length / perPage), 1);
    const current = Math.min(Math.max(state.page, 1), total);

    items.forEach((item) => {
      item.hidden = true;
    });
    matched.slice((current - 1) * perPage, current * perPage).forEach((item) => {
      item.hidden = false;
    });

    ul.replaceChildren();
    nav.hidden = total <= 1;
    if (total <= 1) return;

    // 表示するページ番号：最初・最後・現在のページの前後2つ。間は「…」で省略する
    const pages = [];
    for (let p = 1; p <= total; p++) {
      if (p === 1 || p === total || Math.abs(p - current) <= 2) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }

    if (current > 1) {
      prev.href = stateUrl(category, current - 1);
      prev.dataset.page = current - 1;
      ul.appendChild(prevItem);
    }

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
        const a = makeLink(p, "pagination__num");
        a.href = stateUrl(category, p);
        a.dataset.page = p;
        li.appendChild(a);
      }
      ul.appendChild(li);
    });

    if (current < total) {
      next.href = stateUrl(category, current + 1);
      next.dataset.page = current + 1;
      ul.appendChild(nextItem);
    }
  };

  // ページを切り替えたら一覧の先頭へ移動し、読み上げソフトにも一覧の先頭から伝わるようにする
  list.tabIndex = -1;
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-page]");
    // Ctrl＋クリックなどで新しいタブに開くときは、ふつうのリンクとして動かす
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const page = Number(link.dataset.page);
    history.pushState(null, "", stateUrl(category, page));
    render({ category, page });
    list.scrollIntoView({ block: "start" });
    list.focus({ preventScroll: true });
  });

  // カテゴリーを選んだら、そのカテゴリーの1ページ目を表示する
  if (filter && select) {
    filter.hidden = false;
    select.addEventListener("change", () => {
      history.pushState(null, "", stateUrl(select.value, 1));
      render({ category: select.value, page: 1 });
    });
  }

  // ブラウザの「戻る」「進む」でも切り替える
  window.addEventListener("popstate", () => render(stateFromUrl()));

  render(stateFromUrl());
}

// プロフィールなどのダイアログ
// aria-controls="ダイアログのid" を付けたボタンで開き、data-dialog-close のボタン・外側のクリック・Esc で閉じる
function setupDialogs() {
  document.querySelectorAll('[aria-haspopup="dialog"][aria-controls]').forEach((button) => {
    const dialog = document.getElementById(button.getAttribute("aria-controls"));
    if (!dialog || typeof dialog.showModal !== "function") return;

    button.addEventListener("click", () => dialog.showModal());

    dialog.querySelectorAll("[data-dialog-close]").forEach((close) => {
      close.addEventListener("click", () => dialog.close());
    });

    // 暗くなった外側を押したら閉じる
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    // 閉じたら、開いたボタンにフォーカスを戻す
    dialog.addEventListener("close", () => button.focus());
  });
}

// 文字サイズの切り替え（大・中・小）
// <html data-font-size="small|large"> を付けると CSS で文字の大きさが変わる（中は何も付けない）
// 「文字サイズ」にカーソルを合わせると CSS で一覧が開く。押したとき・キーボードでも開閉できるようにする
// 選んだ大きさはページを移動しても引き継ぐ（<head> の小さなスクリプトで表示前にも反映している）
function setupFontSize() {
  const menu = document.querySelector(".font-menu");
  if (!menu) return;
  const toggle = menu.querySelector(".font-menu__toggle");
  const options = menu.querySelectorAll("[data-font-size]");

  const setOpen = (isOpen) => {
    menu.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  const apply = (size) => {
    if (size === "medium") {
      delete document.documentElement.dataset.fontSize;
    } else {
      document.documentElement.dataset.fontSize = size;
    }
    options.forEach((option) => {
      option.setAttribute("aria-pressed", String(option.dataset.fontSize === size));
    });
  };

  apply(document.documentElement.dataset.fontSize || "medium");

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const size = option.dataset.fontSize;
      apply(size);
      setOpen(false);
      toggle.focus();
      try {
        localStorage.setItem("fontSize", size);
      } catch (e) {
        // 保存できない環境では、このページだけ切り替える
      }
    });
  });

  // 外側を押す・Esc・フォーカスが外れたら閉じる
  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) setOpen(false);
  });
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  menu.addEventListener("focusout", (event) => {
    if (!menu.contains(event.relatedTarget)) setOpen(false);
  });
}
