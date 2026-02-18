export let NOTESDATA = [];
export let NOTESDATAFROMOTHERS = [];

import { getLoggedUser } from '../account/accountManage.js';
import { isUserLoggedIn } from '../account/accountManage.js';
import { nullLoggedUser } from '../account/accountManage.js';

// ------- Helper functions for API requests -------
const API_URL = "http://localhost:3000";
const HEADERS = {
    "Content-Type": "application/json"
};

const POST_request = async (endpoint, body) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(body)
    });
    return await response;
}

const DELETE_request = async (endpoint, body) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "DELETE",
        headers: HEADERS,
        body: JSON.stringify(body)
    });
    return await response;
}

const getUserAuth = () => {
    const user = getLoggedUser();
    return { 
        user_id: user.user_id, 
        key: user.key 
    };
}
// ---- Exported functions ----
export const loadNotes = async () => {
    const loggedIn = await isUserLoggedIn();    
    if (!loggedIn) {
        nullLoggedUser(); 
        window.location.replace("../../html/account/login.html"); 
        return; 
    }

    const response = await POST_request("notesGet", getUserAuth());

    NOTESDATA = await response.json();
    if (!Array.isArray(NOTESDATA)) {
        NOTESDATA = [];
    }
};

export const loadNotesOthers = async () => {
    const loggedIn = await isUserLoggedIn();    
    if (!loggedIn) {
        nullLoggedUser(); 
        window.location.replace("../../html/account/login.html"); 
        return; 
    }

    const response = await POST_request("notesOthersGet", getUserAuth());

    NOTESDATAFROMOTHERS = await response.json();
    if (!Array.isArray(NOTESDATAFROMOTHERS)) {
        NOTESDATAFROMOTHERS = [];
    }
};

export const deleteNote = async (noteID) => {
    const body = {
        ...getUserAuth(), 
        noteID            
    };
    const response = await DELETE_request("notesRemove", body);
    
    if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "An error occurred while deleting the note.");
    }
    return response.ok;
};

export const deleteFriendNote = async (noteID, user_id) => {
    const body = {
        ...getUserAuth(), 
        noteID            
    };
    const response = await DELETE_request("friendNotesRemove", body);
    
    if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "An error occurred while deleting the note.");
    }
    return response.ok;
};

export const createNoteForFriend = async (newNote) => {
    const response = await POST_request("friendNotesAdd", newNote, getUserAuth());
    return response;
}

export const createNote = async (newNote) => {
    const response = await POST_request("notesAdd", newNote, getUserAuth());
    return response;
}