import { getLoggedUser } from '../account/accountManage.js';
import { createNote, createNoteForFriend } from './noteBackend.js';
import { menuClose } from '../tools/menuManage.js';
import { NOTESDATA } from './noteBackend.js';

function fadeOut(element) {
    element.style.opacity = '0';
    element.addEventListener('transitionend', () => {
        element.style.display = 'none';
    }, { once: true });
}

function fadeIn(element) {
    menuClose();
    element.style.display = 'flex';
    requestAnimationFrame(() => {
        element.style.opacity = '1';
    }, { once: true });
}

document.addEventListener("DOMContentLoaded", () => { 
    const friendNoteParent = document.getElementById('createFriendNoteParent');
    
    if(friendNoteParent)  {
        const friendForm = document.getElementById('createFriendNoteForm');
        
        friendForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const submitBtn = document.getElementById('saveFriendNoteButton');
            submitBtn.disabled = true; 

            const data = {};
            const formData = new FormData(friendForm);
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            const sendTo = document.getElementById('friendEmailShow').textContent.trim();
            const loggedUserVariable = getLoggedUser();

            const newNote = {
                note_name: data.noteFriendTitle,      
                note_content: data.friendNoteContent,
                user_email: sendTo,
                maker_id: loggedUserVariable.user_id,
                key: loggedUserVariable.key
            };

            try {
                const response = await createNoteForFriend(newNote);

                if (!response.ok) {
                    alert("Error sending note to friend.");
                    fadeOut(friendNoteParent);
                    return;
                }

                const savedNote = await response.json();
                friendForm.reset();

                if (Array.isArray(NOTESDATA)) {
                    NOTESDATA.push(savedNote);
                }

                fadeOut(friendNoteParent);
            } catch (err) {
                alert("Error sending note to friend.");
                fadeOut(friendNoteParent);
            } finally {
                submitBtn.disabled = false;
            }
        });

        const cancelFriendNoteButton = document.getElementById('cancelFriendNoteButton');
        cancelFriendNoteButton.addEventListener('click', () => {
            fadeOut(friendNoteParent);
        }, { once: false });
    }

    const noteParent = document.getElementById('createNoteParent'); 
    const form = document.getElementById('createNoteForm');
    if (!form) 
        return;

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const data = {};
        const formData = new FormData(form);
        formData.forEach((value, key) => {
            data[key] = value;
        });


        const loggedUserVariable = getLoggedUser();
        const newNote = { 
            note_name: data.noteTitle,
            note_content: data.noteContent,
            user_id: loggedUserVariable.user_id,
            key: loggedUserVariable.key
        };

        try {
            const response = await createNote(newNote);

            if (!response.ok) {
                alert(`Error while saving note. Status: ${response.status}`);
                fadeOut(noteParent);
                return;
            }
            
            const savedNote = await response.json();
            form.reset();

            if (Array.isArray(NOTESDATA)) {
                NOTESDATA.push(savedNote);
            }
        } catch (err) {
            alert("Error while saving note.");
            fadeOut(noteParent);
            return;
        }

        fadeOut(noteParent);
        location.reload();
    }, { once: true });

    const createButton = document.querySelector('.createNoteClick'); 
    createButton.addEventListener('click', () => { 
        fadeIn(noteParent);
    }, { once: false });

    const resetButton = document.getElementById('cancelNoteButton');
    resetButton.addEventListener('click', () => { 
        fadeOut(noteParent);
    }, { once: false });
});