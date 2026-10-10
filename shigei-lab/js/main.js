// スマホ用ハンバーガーメニューの開閉
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".global-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  // メニュー内のリンクを押したら閉じる
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
});
