import { loadFriendRequests, loadFriends, acceptFriendRequest, declineFriendRequest, removeFriend } from './friendsBackend.js';

document.addEventListener('DOMContentLoaded', async () => {
    await createFriendsWindows();
    await createInviteWindows();
});

const addEventsForInvites = () => {
    const acceptInviteButtons = document.querySelectorAll('.acceptInviteButton');
    const declineInviteButtons = document.querySelectorAll('.declineInviteButton');

    acceptInviteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const email = event.currentTarget.dataset.email;
            try {
                await acceptFriendRequest(email);
                createFriendsWindows();
                createInviteWindows();
            } catch (err) {
                alert('Error accepting invite: ' + err);
            }
        });
    });

    declineInviteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const confirmDelete = confirm('Are you sure you want do delete this invite?');
            if(!confirmDelete) 
                return;
            
            const email = event.currentTarget.dataset.email;
            try {
                await declineFriendRequest(email);
                createInviteWindows();
            } catch (err) {
                alert('Error declining invite: ' + err.message);
            }
        });
    });
}

const createInviteWindows = async () => {
    const data = await loadFriendRequests();
    const invites = Array.isArray(data.invites) ? data.invites : [];
    const invite_section = document.getElementById("inviteDivParent");

    if (!invite_section)
        return;

    invite_section.innerHTML = '';

    if (invites.length === 0) {
        invite_section.innerHTML = '<p style="text-align: center;">No pending invites.</p>';
        return;
    }

    for (const note of invites) {
        const invite_div = document.createElement("div");
        invite_div.className = "inviteDiv";
        invite_div.innerHTML = `
            <span>${note.email}</span>
            <div>
                <button class="acceptInviteButton inviteButton" data-email="${note.email}">Accept</button>
                <button class="declineInviteButton inviteButton" data-email="${note.email}">Decline</button>
            </div>
        `;
        invite_section.appendChild(invite_div);
    }

    addEventsForInvites();
};

const addEventsForFriends = () => {
    const sendFriendNoteButtons = document.querySelectorAll('.sendFriendNote');

    sendFriendNoteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            try {
                const email = event.currentTarget.dataset.email;

                const friendNoteParent = document.getElementById('createFriendNoteParent'); 
                friendNoteParent.style.display = 'flex';
                requestAnimationFrame(() => {
                    friendNoteParent.style.opacity = '1';
                });

                const friendEmailInput = document.getElementById('friendEmailShow');
                friendEmailInput.textContent = email;  
            } catch (err) {
                alert('Error creating friend note');
            }
        });
    });

    const removeFriendButtons = document.querySelectorAll('.removeFriend');
    removeFriendButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const confirmDelete = confirm('Are you sure you want do delete this friend?');
            if(!confirmDelete) 
                return;
            
            const email = event.currentTarget.dataset.email;
            try {
                await removeFriend(email);
                createFriendsWindows();
            } catch (err) {
                alert('Error removing friend');
            }
        });
    });
}

const createFriendsWindows = async () => {
    const data = await loadFriends();
    const friends = Array.isArray(data.friends) ? data.friends : [];
    const friends_section = document.getElementById("friendsDivParent");

    if (!friends_section) 
        return;
    friends_section.innerHTML = '';

    if (friends.length === 0) {
        friends_section.innerHTML = '<p style="text-align: center;">No friends yet.</p>';
        return;
    }

    for (const note of friends) {
        const invite_div = document.createElement("div");
        invite_div.className = "friendsDiv";
        invite_div.innerHTML = `
            <span>${note.email}</span>
            <div>
                <button class="sendFriendNote friendButton" data-email="${note.email}">Create Note</button>
                <button class="removeFriend friendButton" data-email="${note.email}"><img src="../../images/trashBin.png" alt="Delete"></button>
            </div>
        `;
        friends_section.appendChild(invite_div);
    }

    addEventsForFriends();
};