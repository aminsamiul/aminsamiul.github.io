// Smooth scroll button
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

// Simple form alert (can be linked to EmailJS later)
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thank you for reaching out! I’ll get back to you soon.");
  this.reset();
});
