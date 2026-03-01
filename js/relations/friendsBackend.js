import { getLoggedUser } from '../account/accountManage.js';

// Requests helper
const API_URL = "https://darkpad-app.onrender.com";
const HEADERS = {
    "Content-Type": "application/json"
};

const POST_request = async (endpoint, body) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(body)
    });

    return await response
}

// Friends backend functions
export const loadFriends = async () => {
    const user = getLoggedUser();
    const body = { 
        user_id: user.user_id, 
        key: user.key 
    };

    const response = await POST_request("friendsGet", body);
    if (!response.ok) {
        alert('Error loading friends');
    }
    const result = await response.json();
    return result;
};

const getUserAuth = () => {
    const user = getLoggedUser();
    return { 
        user_id: user.user_id, 
        key: user.key 
    };
}

export const removeFriend = async (friendEmail) => {
    const body = {
        ...getUserAuth(),
        email: friendEmail
    };

    const response = await POST_request("friendsRemove", body);
    if (!response.ok) {
        alert('Error removing friend');
    }

    return await response.json();
}

export const inviteFriend = async (friendEmail) => {
    const body = {
        ...getUserAuth(),
        friendEmail: friendEmail
    };

    const response = await POST_request("friendsInvite", body);
    if (!response.ok) {
        alert('Error sending friend request');
    }

    return await response.json();
};

export const loadSentFriendRequests = async () => {    
    const response = await POST_request("pendingInvitesFromMe", getUserAuth());
    const result = await response.json();

    return result;
};

export const loadFriendRequests = async () => {
    const response = await POST_request("pendingInvites", getUserAuth());
    const result = await response.json();
    
    return result;
};

export const declineFriendRequest = async (friendEmail) => {
    const body = {
        ...getUserAuth(),
        friendEmail: friendEmail
    };

    const response = await POST_request("inviteDecline", body);
    const result = await response.json();

    location.reload();

    return result;
};

export const acceptFriendRequest = async (friendEmail) => {
    const body = {
        ...getUserAuth(),
        friendEmail: friendEmail
    };

    const response = await POST_request("inviteAccept", body);
    const result = await response.json();

    location.reload();

    return result;
};
