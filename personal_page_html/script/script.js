document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello World!");
  init();
});

function init() {
  // scrollLock();
  stickNav();
  changeCurrent();
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
  const header = document.querySelector("header");
  const navToggle = document.querySelector("#nav-toggle");
  var lastScroll = 0;

  window.addEventListener("scroll", () => {
    var currentScroll = window.scrollY;
    if (currentScroll <= 10) {
      header.classList.remove("scroll-up");
      header.classList.remove("scroll-down");
    } else if (
      currentScroll > lastScroll &&
      !header.classList.contains("scroll-down") &&
      !navToggle.checked
    ) {
      header.classList.remove("scroll-up");
      header.classList.add("scroll-down");
    } else if (
      currentScroll < lastScroll &&
      !header.classList.contains("scroll-up")
    ) {
      header.classList.remove("scroll-down");
      header.classList.add("scroll-up");
    }

    lastScroll = currentScroll;
  });
}

function changeCurrent() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log(entry.target.id + ": " + entry.isIntersecting);
        if (entry.isIntersecting) {
          const navItem = document.querySelector(
            "#nav-" + entry.target.id
          );
          navItems.forEach((otherNavItem) => {
            otherNavItem.classList.remove("current");
          });
          navItem.classList.add("current");
        }
      });
    },
    { rootMargin: "-35% 0px -65% 0px" }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}
