// ------------ Set User Data --------------
const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

export const setLoggedUser = (name, email, key, user_id) => {
    setCookie('loggedUserName', name, 7);
    setCookie('loggedUserEmail', email, 7);
    setCookie('loggedUserKey', key, 7);
    setCookie('loggedUserId', user_id, 7);
}; 

// ------------ Get User Data --------------
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
};

export const getLoggedUser = () => ({
    name: getCookie('loggedUserName'),
    email: getCookie('loggedUserEmail'),
    key: getCookie('loggedUserKey'),
    user_id: getCookie('loggedUserId')
});

// ------------ Delete User Data --------------
const deleteCookie = (name) => {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
};

export const nullLoggedUser = () => {
    deleteCookie('loggedUserName');
    deleteCookie('loggedUserEmail');
    deleteCookie('loggedUserKey');
    deleteCookie('loggedUserId');
};  

// ------------ POST Request Helper --------------
const POST_request = async (endpoint, body) => {
    return await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
};

const DELETE_request = async (endpoint, body) => {
    return await fetch(`http://localhost:3000/${endpoint}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
};

// ------------ Check User Login --------------
export const isUserLoggedIn = async () => {
    const savedUser = getLoggedUser();
    const user_id = savedUser.user_id;
    const sessionKey = savedUser.key;

    if (!user_id || !sessionKey) {
        return false;
    }
    try {
        const response = await POST_request("isLoggedIn", { user_id: user_id, key: sessionKey});

        const data = await response.json();
        if (data.loggedIn) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        alert("Chyba pri kontrole prihlásenia: " + error.message);
        return false;
    }
}

// ------ Protected Pages Check ------------
const protectedPages = [
    "notes.html",
    "notesFromOthers.html",
    "contact.html",
    "settings.html",
    "friends.html"
];

// Redirect to login if user is not logged in and tries to access protected page
const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {
    document.addEventListener("DOMContentLoaded", () => {
        isUserLoggedIn().then(loggedIn => {
            if (!loggedIn) {
                window.location.replace("../account/login.html");
            }
        });
    });
}

// ------ Logout logic ------------
const logoutButton = document.getElementById("logout");
if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        const loggedUserVariable = getLoggedUser();
        try {
            const response = await DELETE_request('logout', { 
                user_id: loggedUserVariable.user_id,
                session_key: loggedUserVariable.key
            });

            if (response.ok) {
                nullLoggedUser(); 
                window.location.replace("../account/login.html");
            } else {
                alert("Logout failed.");
                alert("Response: " + response.status + " " + response.statusText);
            }
        } catch(error) {
            alert("Communication error during logout: " + error.message);
        }
    });
}

// ------ Commands for login.html ------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    document.addEventListener("DOMContentLoaded", () => {
        isUserLoggedIn().then(loggedIn => {
            if (loggedIn) {
                window.location.replace("../navigation/notes.html");
            } 
        }); 

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = loginForm.elements["email"].value;
            const password = loginForm.elements["password"].value;

            try {
                const response = await POST_request('login', { email, password });
                let data;

                if (!response.ok) {
                    try {
                        data = await response.json();
                    } catch {
                        data = {};
                    }
                    alert(data.error || `Chyba: ${response.status} ${response.statusText}`);
                    return;
                }
                data = await response.json();

                setLoggedUser(data.username, data.email, data.key, data.user_id);
                console.log(getLoggedUser());
                window.location.replace("../navigation/notes.html");
            } catch (error) {
                alert("Communication error");
            }
        });
    });
}

// ------ Commands for register.html ------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    document.addEventListener("DOMContentLoaded", () => {
        isUserLoggedIn().then(loggedIn => {
            if (loggedIn) {
                window.location.replace("../navigation/notes.html");
            }
        });

        const registerForm = document.getElementById("registerForm");
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const email = registerForm.elements["email"].value;
            const password = registerForm.elements["password"].value;
            const passwordAgain = registerForm.elements["passwordAgain"].value;

            if(password !== passwordAgain){
                alert("Passwords do not match!");
                return;
            }

            try {
                const response = await POST_request('register', { email, password });

                if(!response.ok){
                    const data = await response;
                    alert(data.error || "Chyba pri registrácii");
                    return;
                }

                alert("Registration successful! You can now log in.");
                window.location.replace("login.html");
            } catch (error) {
                alert("Communication error during registration: " + error.message);
            }
        });
    });
}
