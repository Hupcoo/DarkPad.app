import { NOTESDATA, NOTESDATAFROMOTHERS, loadNotes, loadNotesOthers } from '../../js/notes/noteBackend.js';

const makeNote = async () => {
    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("note");
    const friendNote = params.get("friendNote");

    let note;
    if (friendNote == "true") {
        await loadNotesOthers();
        console.log(NOTESDATAFROMOTHERS);
        note = NOTESDATAFROMOTHERS.find(n => n.id === noteId);
    } else if (friendNote == "false") {
        await loadNotes();
        note = NOTESDATA.find(n => n.id === noteId);
    }
    
    if (!note) 
        return;

    const noteContentHTML = document.getElementById("noteContentParagraph");    
    const noteNameHTML = document.getElementById("noteContentName");
    if (noteNameHTML) {
        noteNameHTML.textContent = note.note_name;
    } 
    if (noteContentHTML) {
        noteContentHTML.textContent = note.note_content;
    }
    
    document.title = note.note_name;

    const backToMenuFromNote = document.getElementById("backToMenuFromNote");
    if(friendNote == "true") {
        backToMenuFromNote.addEventListener("click", () => {
            window.location.replace("../../html/navigation/notesFromOthers.html");
        });
    } else if(friendNote == "false") {
        backToMenuFromNote.addEventListener("click", () => {
            window.location.replace("../../html/navigation/notes.html");
        });
    }
};
makeNote();