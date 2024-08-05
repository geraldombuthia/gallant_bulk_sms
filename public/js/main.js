document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navbarHeight = document.querySelector('header').offsetHeight;

  console.log(navbarHeight);

  // Smooth scroll to anchor links
  document.querySelectorAll('.nav-menu a').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      if (this.getAttribute("href").substring(0, 1) != "#") {
          return;
      }
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      console.log(targetElement);
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
  navToggle.addEventListener("click", () => {
      console.log("Clicked navToggle");
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when a link is clicked
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      console.log("clicked");
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

});
