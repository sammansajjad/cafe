
document.addEventListener("DOMContentLoaded", function () {
    const themeButton = document.getElementById("theme-toggle");
    const menuContainer = document.getElementById("menu-items");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const discountSelect = document.getElementById("discount-type");
    const orderSummary = document.getElementById("selected-items");

    let menuItems = [];
    let activeFilter = "all";
    const selectedItems = new Map();

    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const darkMode = document.body.classList.contains("dark-mode");

        themeButton.textContent = darkMode ? "☀" : "☾";
        themeButton.setAttribute(
            "aria-label",
            darkMode ? "Switch to light mode" : "Switch to dark mode"
        );
    });

    function getDisplayCategory(category) {
        const categories = {
            drink: "drinks",
            dessert: "pastries",
            food: "food"
        };

        return categories[category] || category;
    }

    function createMenuCard(item) {
        const card = document.createElement("article");
        card.className = "menu-card";

        const top = document.createElement("div");
        top.className = "menu-card-top";

        const details = document.createElement("div");

        const category = document.createElement("span");
        category.className = "menu-category";
        category.textContent = getDisplayCategory(item.category);

        const name = document.createElement("h3");
        name.textContent = item.name;

        details.appendChild(category);
        details.appendChild(name);

        const price = document.createElement("span");
        price.className = "menu-price";
        price.textContent = "Rs. " + Number(item.price).toFixed(2);

        top.appendChild(details);
        top.appendChild(price);

        const bottom = document.createElement("div");
        bottom.className = "menu-card-bottom";

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "order-item";
        checkbox.dataset.id = item.id;
        checkbox.checked = selectedItems.has(item.id);
        checkbox.disabled = !item.available;

        checkbox.setAttribute(
            "aria-label",
            "Add " + item.name + " to your order"
        );

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" Add to order"));

        bottom.appendChild(label);

        if (!item.available) {
            const soldOut = document.createElement("span");
            soldOut.className = "sold-out";
            soldOut.textContent = "Sold out";
            bottom.appendChild(soldOut);
        }

        card.appendChild(top);
        card.appendChild(bottom);

        return card;
    }

    function renderMenu() {
        menuContainer.replaceChildren();

        const filteredItems = menuItems.filter(function (item) {
            return activeFilter === "all" ||
                getDisplayCategory(item.category) === activeFilter;
        });

        if (filteredItems.length === 0) {
            const message = document.createElement("p");
            message.className = "menu-message";
            message.textContent =
                "No menu items found in this category just yet.";

            menuContainer.appendChild(message);
            return;
        }

        filteredItems.forEach(function (item) {
            menuContainer.appendChild(createMenuCard(item));
        });
    }

    async function loadMenu() {
        try {
            const response = await fetch("/api/menu");

            if (!response.ok) {
                throw new Error("Failed to load menu.");
            }

            menuItems = await response.json();

            for (const id of selectedItems.keys()) {
                const item = menuItems.find(function (menuItem) {
                    return menuItem.id === id && menuItem.available;
                });

                if (!item) {
                    selectedItems.delete(id);
                }
            }

            renderMenu();
            updateTotal();

        } catch (error) {
            console.error("Menu loading error:", error);

            menuContainer.replaceChildren();

            const message = document.createElement("p");
            message.className = "menu-message";
            message.textContent =
                "We couldn't load the menu. Please refresh and try again.";

            menuContainer.appendChild(message);
        }
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeFilter = button.dataset.filter;

            filterButtons.forEach(function (filterButton) {
                filterButton.classList.toggle(
                    "active",
                    filterButton === button
                );
            });

            renderMenu();
        });
    });

    menuContainer.addEventListener("change", function (event) {
        if (!event.target.classList.contains("order-item")) {
            return;
        }

        const itemId = Number(event.target.dataset.id);

        if (event.target.checked) {
            selectedItems.set(itemId, 1);
        } else {
            selectedItems.delete(itemId);
        }

        updateTotal();
    });

    orderSummary.addEventListener("click", function (event) {
        const button = event.target.closest("button");

        if (!button) {
            return;
        }

        const itemId = Number(button.dataset.id);
        const quantity = selectedItems.get(itemId);

        if (!quantity) {
            return;
        }

        if (button.classList.contains("increase-item")) {
            selectedItems.set(itemId, quantity + 1);
        }

        if (button.classList.contains("decrease-item")) {
            if (quantity > 1) {
                selectedItems.set(itemId, quantity - 1);
            } else {
                selectedItems.delete(itemId);
            }
        }

        if (button.classList.contains("remove-item")) {
            selectedItems.delete(itemId);
        }

        updateTotal();
    });

    function updateTotal() {
        let subtotal = 0;
        orderSummary.replaceChildren();

        if (selectedItems.size === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.className = "empty-order";
            emptyMessage.textContent =
                "Nothing here yet. Pick a treat!";

            orderSummary.appendChild(emptyMessage);
        }

        selectedItems.forEach(function (quantity, itemId) {
            const item = menuItems.find(function (menuItem) {
                return menuItem.id === itemId;
            });

            if (!item) {
                return;
            }

            const itemTotal = Number(item.price) * quantity;
            subtotal += itemTotal;

            const listItem = document.createElement("li");
            listItem.className = "order-summary-item";

            const details = document.createElement("div");
            details.className = "order-item-details";

            const itemName = document.createElement("span");
            itemName.textContent = item.name;

            const itemPrice = document.createElement("strong");
            itemPrice.textContent =
                "Rs. " + itemTotal.toFixed(2);

            details.appendChild(itemName);
            details.appendChild(itemPrice);

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.className = "decrease-item";
            decreaseButton.dataset.id = itemId;
            decreaseButton.textContent = "−";
            decreaseButton.setAttribute(
                "aria-label",
                "Decrease " + item.name + " quantity"
            );

            const quantityText = document.createElement("span");
            quantityText.textContent = quantity;

            const increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.className = "increase-item";
            increaseButton.dataset.id = itemId;
            increaseButton.textContent = "+";
            increaseButton.setAttribute(
                "aria-label",
                "Increase " + item.name + " quantity"
            );

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-item";
            removeButton.dataset.id = itemId;
            removeButton.textContent = "Remove";

            controls.appendChild(decreaseButton);
            controls.appendChild(quantityText);
            controls.appendChild(increaseButton);
            controls.appendChild(removeButton);

            listItem.appendChild(details);
            listItem.appendChild(controls);

            orderSummary.appendChild(listItem);
        });

        const discountRate =
            Number(discountSelect.value) / 100;

        const discount = subtotal * discountRate;
        const total = subtotal - discount;

        document.getElementById("subtotal").textContent =
            subtotal.toFixed(2);

        document.getElementById("discount-amount").textContent =
            discount.toFixed(2);

        document.getElementById("total").textContent =
            total.toFixed(2);

        const discountMessage =
            document.getElementById("discount-message");

        if (discountRate === 0) {
            discountMessage.textContent = "No discount selected.";
        } else {
            discountMessage.textContent =
                (discountRate * 100) +
                "% discount applied to your order.";
        }

        menuContainer.querySelectorAll(".order-item").forEach(function (checkbox) {
            checkbox.checked = selectedItems.has(Number(checkbox.dataset.id));
        });
    }

    discountSelect.addEventListener("change", updateTotal);

    const readButton = document.getElementById("read-more");
    const extraStory = document.getElementById("story-extra");

    readButton.addEventListener("click", function () {
        extraStory.hidden = !extraStory.hidden;

        readButton.innerHTML = extraStory.hidden
            ? 'Read our story <span>＋</span>'
            : 'Read less <span>−</span>';
    });

    const notes = document.getElementById("special-notes");
    const characterCount = document.getElementById("character-count");

    notes.addEventListener("input", function () {
        characterCount.textContent =
            notes.maxLength - notes.value.length;
    });

    const status = document.getElementById("opening-status");
    const hour = new Date().getHours();

    if (hour >= 8 && hour < 22) {
        status.textContent = "We're open right now!";
        status.classList.add("open");
    } else {
        status.textContent =
            "We're closed right now — see you from 8 AM!";

        status.classList.add("closed");
    }

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

        if (!valid) {
            response.textContent =
                "Please fix the errors above.";

            response.classList.add("error");
            return;
        }

        response.textContent =
            "Thank you, " + name +
            "! We received your request and will contact you at " +
            email + ".";

        response.classList.add("success");

        form.reset();
        characterCount.textContent = notes.maxLength;
    });

    loadMenu();
});
