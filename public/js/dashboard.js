const editProfileBtn = document.getElementById("edit-profile-btn");
const profileEditOverlay = document.getElementById("profile-edit-overlay");
const profileEditCloseButton = document.querySelector("#profile-edit-overlay .close-button");
const profileEditForm = document.getElementById("profile-edit-form");

// Security Settings
const updateSecurityBtn = document.getElementById("update-security-btn");
const securityOverlay = document.getElementById("security-overlay");
const securityCloseButton = document.querySelector(
    "#security-overlay .close-button"
);
const securityForm = document.getElementById("security-form");

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".sidebar ul li a");
    const sections = document.querySelectorAll(".content-section");

    // Profile Edit
    editProfileBtn.addEventListener("click", showProfileEditOverlay);
    profileEditCloseButton.addEventListener("click", hideProfileEditOverlay);
    profileEditForm.addEventListener("submit", updateProfileInfo);

    // Security Edit
    updateSecurityBtn.addEventListener("click", showSecurityOverlay);
    securityCloseButton.addEventListener("click", hideSecurityOverlay);
    securityForm.addEventListener("submit", updateSecuritySettings);

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

    // // Open the profile edit overlay when the "Edit Profile" button is clicked
    // editProfileBtn.addEventListener("click", function () {
    //   profileEditOverlay.style.display = "block";
    //   console.log("Clicked Edit");
    // });

    // // Close the profile edit overlay when the close button is clicked
    // closeButton.addEventListener("click", function () {
    //   profileEditOverlay.style.display = "none";
    // });

    // // Handle the profile edit form submission
    // profileEditForm.addEventListener("submit", function (event) {
    //   event.preventDefault();
    //   // Code to update the user's profile information
    //   console.log("Profile information updated");
    //   profileEditOverlay.style.display = "none";
    //   // Show a custom pop-up notification
    //   showSuccessPopup("Profile updated successfully!");
    // });
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
