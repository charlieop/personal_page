document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello World!");
  init();
});

function init() {
  // scrollLock();
  stickNav();
  changeCurrent();
  setTimeout(nextMainIntro, 5000);
  fadeIn();
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
  const navButtons = document.querySelectorAll(".nav-item");
  var navCLicked = false;
  var timeout = null;
  var lastScroll = 0;
  const margin = 5;

  navButtons.forEach((navButton) => {
    navButton.addEventListener("click", (e) => {
      clearTimeout(timeout);
      navCLicked = true;
      timeout = setTimeout(() => {
        if (e.target.getAttribute("href") == "#") {
          console.log("hi");
          header.classList.remove("scrolling-up");
        }
        navCLicked = false;
      }, 1000);
    });
  });

  window.addEventListener("scroll", () => {
    var currentScroll = window.scrollY;
    if (currentScroll <= 10) {
      header.classList.remove("scrolling-down");
      header.classList.remove("scrolling-up");
    } else if (navToggle.checked || navCLicked) {
      header.classList.add("scrolling-up");
      header.classList.remove("scrolling-down");
    } else if (
      currentScroll - lastScroll > margin &&
      !header.classList.contains("scrolling-down")
    ) {
      header.classList.remove("scrolling-up");
      header.classList.add("scrolling-down");
    } else if (
      currentScroll - lastScroll < -1 * margin &&
      !header.classList.contains("scrolling-up")
    ) {
      header.classList.remove("scrolling-down");
      header.classList.add("scrolling-up");
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
        if (entry.isIntersecting) {
          const navItem = document.querySelector("#nav-" + entry.target.id);
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

function nextMainIntro() {
  const sections = document.querySelectorAll(".home-intro-section");
  var currentSession = 0;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].dataset.display == "true") {
      currentSession = i;
      break;
    }
  }
  sections[currentSession].dataset.display = "false";
  sections[(currentSession + 1) % sections.length].dataset.display = "true";
  setTimeout(nextMainIntro, 5000);
}

function fadeIn() {
  const fadeInItem = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationName = "fade-in";
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "10% 0px -10% 0px" });

  fadeInItem.forEach((item) => {
    observer.observe(item);
  });
}
