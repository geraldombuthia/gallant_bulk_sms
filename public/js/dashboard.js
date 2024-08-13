document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".sidebar ul li a");
    const sections = document.querySelectorAll(".content-section");

    // Show the first section by default
    sections[0].classList.add("active");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            // Remove active class from all sections
            sections.forEach(section => section.classList.remove("active"));

            // Get the target section
            const targetSection = document.getElementById(this.getAttribute("data-section"));

            // Show the target section
            targetSection.classList.add("active");
        });
    });
});
