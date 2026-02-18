import { inviteFriend, loadFriends, loadSentFriendRequests } from './friendsBackend.js';
import { getLoggedUser } from '../account/accountManage.js';

document.addEventListener('DOMContentLoaded', () => {
    const addFriendButton = document.getElementById('addFriendButton');
    const addFriendInput = document.getElementById('friendUsername');

    addFriendButton.addEventListener('click', async () => {
        const friendEmail = addFriendInput.value.trim();
        addFriendInput.value = '';

        if (!friendEmail) {
            alert('Please enter a valid email address.');
            return; 
        }

        const loggedUserVariable = getLoggedUser(); 
        if (friendEmail === loggedUserVariable.email) {
            alert('You can not add yourself as a friend.');
            return; 
        }

        const friendsData = await loadFriends();
        let friendsList = friendsData.friends; 
        if (!friendsList) {
            friendsList = [];
        }

        if (!friendsList) {
            alert('Error loading friends list');
            return;
        }

        for (let i = 0; i < friendsList.length; i++) {
            if (friendsList[i].email === friendEmail) {
                alert('This user is already your friend.');
                return; 
            }
        }

        const pendingList = await loadSentFriendRequests();
        for (let i = 0; i < pendingList.invites.length; i++) {
            if (pendingList.invites[i].email === friendEmail) {
                alert('A friend request is already pending for this user.');
                return; 
            }
        }

        await inviteFriend(friendEmail);
    });
});

