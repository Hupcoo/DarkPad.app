import { deleteNote, deleteFriendNote, NOTESDATA, NOTESDATAFROMOTHERS } from './noteBackend.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("note");
    const friendNote = params.get("friendNote");

    const deleteNoteButton = document.getElementById('removeNoteButton');

    deleteNoteButton.addEventListener('click', async () => {
        if (!noteId) {
            alert('Note ID not available.');
            return;
        }

        if (confirm('Do you really want to delete this note?')) {
            try {
                let success;

                if (friendNote === 'true') {
                    try {
                        success = await deleteFriendNote(noteId);
                    } catch (error) {
                        console.log(error);
                        alert('An error occurred while trying to delete the friend note. Please try again later.');
                        return;
                    }
                } else if (friendNote === 'false') {
                    try {
                        success = await deleteNote(noteId);
                    } catch (error) {
                        alert('An error occurred while trying to delete the note. Please try again later.');
                        return;
                    }
                } else {
                    alert('Unknown note type!');
                    return;
                }

                if (success) {
                    if (friendNote === 'true') {
                        const index = NOTESDATAFROMOTHERS.findIndex(note => note.id === noteId);
                        if (index !== -1) {
                            NOTESDATAFROMOTHERS.splice(index, 1);
                        }
                        window.location.href = '../../html/navigation/notesFromOthers.html'; 
                    } else if (friendNote === 'false') {
                        const index = NOTESDATA.findIndex(note => note.id === noteId);
                        if (index !== -1) {
                            NOTESDATA.splice(index, 1);
                        }
                        window.location.href = '../../html/navigation/notes.html'; 
                    } else {
                        console.error('Unknown note type!');
                    }
                } 
            } catch (error) {
                console.log('Error while deleting note:', error);
            }
        }
    });
});