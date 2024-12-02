
//Kood selles failis on tehisintellekti poolt genereeritud
//Kood kerib alla kui vajutad objekti peale millel on onclick="scrollToSection()", eksisteerib vahelehtedel
function scrollToSection() {
            const target = document.getElementById("scrollto");
            target.scrollIntoView({ behavior: "smooth" });
        }