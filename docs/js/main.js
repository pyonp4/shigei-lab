document.addEventListener("DOMContentLoaded", () => {
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
