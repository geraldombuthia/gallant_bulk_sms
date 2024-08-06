document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navbarHeight = document.querySelector("header").offsetHeight;
  const url = window.location;

  console.log("URL: ", url.origin, url.pathname);

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  //   // Close menu when a link is clicked
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", (e) => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");

      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const hash = link.getAttribute('href');
        console.log("Hash: ", hash);
        window.location.href = `/${hash}`;
      }
    });
  });
});
