
document.addEventListener("DOMContentLoaded", function () {

    // 1. Toggle Light and Dark Mode
    const themeButton = document.getElementById("theme-toggle");

    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeButton.textContent = "Light Mode";
        } else {
            themeButton.textContent = "Dark Mode";
        }
    });


    // 2. Highlight Menu Rows
    const rows = document.querySelectorAll(".menu-table tbody tr");

    rows.forEach(function (row) {
        row.addEventListener("mouseover", function () {
            row.classList.add("row-highlight");
        });

        row.addEventListener("mouseout", function () {
            row.classList.remove("row-highlight");
        });
    });


    // 3. Filter Menu by Category
    const filterButtons = document.querySelectorAll("[data-filter]");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const filter = button.dataset.filter;

            rows.forEach(function (row) {
                const category = row.dataset.category;

                if (filter === "all" || category === filter) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    });


    // 4. Read More / Read Less
    const readButton = document.getElementById("read-more");
    const extraStory = document.getElementById("story-extra");

    readButton.addEventListener("click", function () {
        if (extraStory.hidden) {
            extraStory.hidden = false;
            readButton.textContent = "Read Less";
        } else {
            extraStory.hidden = true;
            readButton.textContent = "Read More";
        }
    });


    // 5. Character Counter
    const notes = document.getElementById("special-notes");
    const characterCount = document.getElementById("character-count");

    notes.addEventListener("input", function () {
        characterCount.textContent = 100 - notes.value.length;
    });


    // 6. Opening Status: 8 AM to 10 PM
    const status = document.getElementById("opening-status");
    const hour = new Date().getHours();

    if (hour >= 8 && hour < 22) {
        status.textContent = "We are Open!";
        status.classList.add("open");
    } else {
        status.textContent = "Closed - Open at 8 AM";
        status.classList.add("closed");
    }


    // 7. Calculate Order Total
    const items = document.querySelectorAll(".order-item");
    const discountSelect = document.getElementById("discount-type");

    function updateTotal() {
        let subtotal = 0;
        const selectedNames = [];

        items.forEach(function (item) {
            if (item.checked) {
                subtotal += Number(item.value);
                selectedNames.push(item.dataset.name);
            }
        });

        const discountRate = Number(discountSelect.value) / 100;
        const discount = subtotal * discountRate;
        const total = subtotal - discount;

        document.getElementById("subtotal").textContent = subtotal;
        document.getElementById("discount-amount").textContent = discount.toFixed(2);
        document.getElementById("total").textContent = total.toFixed(2);

        const summary = document.getElementById("order-summary-items");
        summary.replaceChildren();

        if (selectedNames.length === 0) {
            const li = document.createElement("li");
            li.textContent = "No items selected.";
            summary.appendChild(li);
        } else {
            selectedNames.forEach(function (name) {
                const li = document.createElement("li");
                li.textContent = name;
                summary.appendChild(li);
            });
        }

        if (discountRate === 0) {
            document.getElementById("discount-message").textContent =
                "No discount selected.";
        } else {
            document.getElementById("discount-message").textContent =
                "Selected discount: " + (discountRate * 100) +
                "%. Please make sure you are eligible.";
        }
    }

    items.forEach(function (item) {
        item.addEventListener("change", updateTotal);
    });

    discountSelect.addEventListener("change", updateTotal);
    updateTotal();


    // 8. Birth Year Conversion and Age Verification
    const birthYearInput = document.getElementById("birth-year");
    const ageMessage = document.getElementById("age-message");

    function checkAge() {
        const text = birthYearInput.value.trim();
        const error = document.getElementById("birth-year-error");
        error.textContent = "";

        if (text === "") {
            ageMessage.textContent = "Enter your birth year to calculate your age.";
            return null;
        }

        const birthYear = parseInt(text, 10);
        const currentYear = new Date().getFullYear();

        if (!/^\d{4}$/.test(text) ||
            Number.isNaN(birthYear) ||
            birthYear < 1900 ||
            birthYear > currentYear) {

            error.textContent = "Enter a valid four-digit birth year.";
            ageMessage.textContent = "Age could not be checked.";
            return null;
        }

        const age = currentYear - birthYear;

if (age >= 60) {
    ageMessage.textContent =
        "Your age is about " + age +
        ". You meet the senior discount age requirement (60+).";
}
else if (age >= 0 && age <= 22) {
    ageMessage.textContent =
        "Your age is about " + age +
        ". You meet the student discount age requirement (up to 22).";
}
else {
    ageMessage.textContent =
        "Your age is about " + age +
        ". You do not meet the student discount or senior discount age requirements.";
}

return age;


        
    }

    birthYearInput.addEventListener("input", checkAge);


    // 9. Form Validation
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();

        const response = document.getElementById("form-response");
        const nameError = document.getElementById("name-error");
        const emailError = document.getElementById("email-error");

        nameError.textContent = "";
        emailError.textContent = "";
        response.textContent = "";
        response.className = "";

        let valid = true;

        if (name === "") {
            nameError.textContent = "Please enter your name.";
            valid = false;
        }

        if (email === "") {
            emailError.textContent = "Please enter your email.";
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = "Please enter a valid email.";
            valid = false;
        }

        const age = checkAge();

        if (birthYearInput.value.trim() !== "" && age === null) {
            valid = false;
        }

        if (!valid) {
            response.textContent = "Please fix the errors above.";
            response.classList.add("error");
            return;
        }

        response.textContent =
            "Thank you, " + name +
            "! We received your request and will contact you at " +
            email + ".";

        response.classList.add("success");
    });

});
