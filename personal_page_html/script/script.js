document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello World!");
  init();
});

function init() {
  // scrollLock();
  stickNav();
}

// disable scrolling when nav opens
function scrollLock() {
  const navToggle = document.querySelector("#nav-toggle");
  navToggle.addEventListener("change", () => {
    if (navToggle.checked) {
      document.querySelector("body").style.overflow = "hidden";
      console.log("scroll disabled");
    } else {
      document.querySelector("body").style.overflowY = "auto";
    }
  });
}

// change the nav after scrolling
function stickNav() {
  const mainContent = document.querySelector(".home");
  const header = document.querySelector("header");

  awayObserver = new IntersectionObserver(
    (e) => {
      if (e[0].isIntersecting) {
        header.classList.add("away");
      } else {
        header.classList.remove("away");
      }
      console.log("Visiable?" + !e[0].isIntersecting);
      // header.classList.toggle("away", !e[0].isIntersecting);
    },
    { rootMargin: "0% 0px -100% 0px" }
  );

  const contentObserver = new IntersectionObserver(
    (e) => {
      console.log(e[0].isIntersecting);
      header.classList.toggle("sticking", !e[0].isIntersecting);
      header.classList.remove("away");
    },
    { rootMargin: "-20% 0px 0px 0px" }
  );

  awayObserver.observe(mainContent);
  contentObserver.observe(mainContent);
}

function changeCurrent() {}
