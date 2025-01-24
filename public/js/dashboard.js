
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".sidebar ul li a");
    const sections = document.querySelectorAll(".content-section");

    // Show the first section by default
    sections[0].classList.add("active");

    links.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove active class from all sections
            sections.forEach((section) => section.classList.remove("active"));

            // Get the target section
            const targetSection = document.getElementById(
                this.getAttribute("data-section")
            );

            // Show the target section
            targetSection.classList.add("active");
        });
    });
});

function showProfileEditOverlay() {
    profileEditOverlay.style.display = "block";
}

function hideProfileEditOverlay() {
    profileEditOverlay.style.display = "none";
}

function updateProfileInfo(event) {
    event.preventDefault();
    // Code to update profile information
    console.log("Profile information updated");
    hideProfileEditOverlay();
    showSuccessPopup("Profile updated successfully!");
}

function showSecurityOverlay() {
    securityOverlay.style.display = "block";
}

function hideSecurityOverlay() {
    securityOverlay.style.display = "none";
}

function updateSecuritySettings(event) {
    event.preventDefault();
    // Code to update security settings
    console.log("Security settings updated");
    hideSecurityOverlay();
    showSuccessPopup("Security settings updated successfully!");
}

function showSuccessPopup(message) {
    // Code to display a custom pop-up notification
    alert(message);
}
