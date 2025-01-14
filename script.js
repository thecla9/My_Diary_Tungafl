// Function to set a cookie with a specific name, value, and expiration days
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

// Get cookie value by name
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let cookie of cookieArr) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Get JWT token from the cookie
function getJWT() {
    return getCookie('jwt');
}

// Block access to the page if no JWT token is found, excluding the index page
function blockAccessWithoutToken() {
    const jwt = getJWT();
    const isIndexPage = window.location.pathname.includes("index.html");
    if (!jwt && !isIndexPage) {
        alert("You are not logged in!");
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 100);
    }
}

// Store entries
let entries = [];

// Display entries in the table
function displayEntries() {
    const tbody = document.getElementById("entriesBody");
    tbody.innerHTML = "";

    if (entries.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No entries available.</td></tr>";
        return;
    }

    entries.forEach((entry, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.title}</td>
            <td>${entry.content}</td>
            <td>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Attach event listeners for edit and delete buttons
    tbody.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            const modal = document.getElementById("modal");
            const title = document.getElementById("title");
            const content = document.getElementById("content");
            const entry = entries[index];
            if (title && content) {
                title.value = entry.title;
                content.value = entry.content;
                document.getElementById("entryId").value = entry.id;

                if (modal) {
                    modal.style.display = "block";
                    modal.style.position = "absolute";
                }
                editEntry(index);
            } else {
                console.error("Modal or form elements not found.");
            }
        });
    });

    tbody.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            deleteEntry(index);
        });
    });
}

// Load entries from the API
async function loadEntries() {
    try {
        const response = await axios.get(
            "https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/entries",
            { headers: { Authorization: `Bearer ${getJWT()}` } }
        );
        entries = response.data.data || [];
        displayEntries();
        updatePageForEntries(); // Update page layout after loading entries
    } catch (error) {
        console.error("Error loading entries:", error);
        alert("Failed to load diary entries. Please try again.");
    }
}

// Delete an entry
async function deleteEntry(index) {
    try {
        const entryId = entries[index].id;
        await axios.delete(
            `https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/delete/${entryId}`,
            { headers: { Authorization: `Bearer ${getJWT()}` } }
        );

        entries.splice(index, 1); // Remove the deleted entry from the array
        displayEntries();
        alert("Diary entry deleted successfully!");
    } catch (error) {
        console.error("Error deleting entry:", error);
        alert("Failed to delete the diary entry.");
    }
}

// Edit an entry
function editEntry(index) {
    const entry = entries[index];
    const title1 = document.getElementById("title1");
    const content1 = document.getElementById("content1");

    if (title1 && content1) {
        title1.value = entry.title;
        content1.value = entry.content;
        document.getElementById("formAction").value = "edit";
        document.getElementById("entryId").value = entry.id;
        document.getElementById("modalForm").scrollIntoView();
    } else {
        console.error("Form elements not found.");
    }
}

// Handle login functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        axios.post("https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/auth/login", { email, password })
            .then(response => {
                const { token } = response.data;
                if (token) {
                    setCookie("jwt", token, 14); // Set JWT cookie for 14 days
                    alert("Login successful! Welcome to Your Diary!");
                    window.location.href = "/home.html"; // Redirect to home page
                }
            })
            .catch(error => {
                console.error(error);
                alert(error.response?.data?.message || "Login failed. Please try again.");
            });
    });
}

// Initialize application and load entries
document.addEventListener("DOMContentLoaded", () => {
    blockAccessWithoutToken(); // Block access if no valid token is found

    const jwt = getJWT();
    const isIndexPage = window.location.pathname.includes("index.html");

    // Only load entries if JWT is found and not on the index page
    if (jwt && !isIndexPage) {
        loadEntries();
    } else if (isIndexPage) {
        document.body.style.display = "block"; // Ensure index page is visible
    }
});

// Update the page layout when entries are available
function updatePageForEntries() {
    const emptyState = document.getElementById("emptyState");
    const entriesSection = document.getElementById("entriesSection");
    const createBtn = document.querySelector('.create-btn');

    if (emptyState && entriesSection) {
        if (entries.length > 0) {
            emptyState.style.display = 'none';  // Hide the empty state message
            entriesSection.style.display = 'block';  // Show the entries section
            if (createBtn) {
                createBtn.style.display = 'none';  // Hide the "Create Diary" button
            }
        } else {
            emptyState.style.display = 'block';  // Show the empty state message
            entriesSection.style.display = 'none';  // Hide the entries section
            if (createBtn) {
                createBtn.style.display = 'block';  // Show the "Create Diary" button
            }
        }
    }
}

// Create or update an entry
document.addEventListener("DOMContentLoaded", () => {
    const createForm = document.getElementById("createForm");

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById("title1").value.trim();
            const content = document.getElementById("content1").value.trim();
            const formAction = document.getElementById("formAction").value;
            const entryId = document.getElementById("entryId").value;

            if (!title || !content) {
                alert("Title and content are required!");
                return;
            }

            const url = formAction === "edit"
                ? `https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/update/${entryId}`
                : "https://tunga-c3-diaryapi.onrender.com/api/cohort3-fullstack/diary/create";

            try {
                const response = await axios({
                    method: formAction === "edit" ? "put" : "post",
                    url,
                    headers: { Authorization: `Bearer ${getJWT()}` },
                    data: { title, content },
                });

                if (formAction === "edit") {
                    const updatedEntry = response.data.data;
                    const index = entries.findIndex(entry => entry.id === entryId);
                    if (index !== -1) {
                        entries[index] = updatedEntry;
                    }
                } else {
                    entries.push(response.data.data);
                }

                displayEntries();
                document.getElementById("createForm").reset();
                alert("Diary entry saved successfully!");
            } catch (error) {
                console.error("Error saving entry:", error);
                alert("Failed to save the diary entry.");
            }
        });
    } else {
        console.error("Create form not found!");
    }
});

// Logout button functionality
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            setCookie("jwt", "", -1); // Clear JWT cookie
            alert("Logged out successfully!");
            window.location.href = "/index.html"; // Redirect to login page
        });
    } else {
        console.warn("Logout button not found on this page.");
    }
});
