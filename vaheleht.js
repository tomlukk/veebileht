const navLinks = document.querySelectorAll('.navlink');

// Get the current page's URL
const currentPage = window.location.pathname;

// Loop through the links and check if their href matches the current page
navLinks.forEach(link => {
    if (link.href.includes(currentPage)) {
        link.classList.add('active');  // Add "active" class to the current page link
    }
});

function scrollToSection() {
            const target = document.getElementById("scrollto");
            target.scrollIntoView({ behavior: "smooth" });
        }