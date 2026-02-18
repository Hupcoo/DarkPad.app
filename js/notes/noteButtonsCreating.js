import { NOTESDATA, NOTESDATAFROMOTHERS, loadNotes, loadNotesOthers } from './noteBackend.js';
import { menuClose } from '../tools/menuManage.js';

export const noteDivMaker = async () => {
    const main_section = document.getElementsByTagName("main")[0];
    if (!main_section) 
        return;

    await loadNotes();
    
    for (const note of NOTESDATA) { 
        const itemDiv = document.createElement("div");  
        
        itemDiv.classList.add("main_item");
            const button = document.createElement("button"); 
            button.id = note.id; button.classList.add("main_item_button"); button.textContent = note.note_name;
        itemDiv.appendChild(button);  

        main_section.appendChild(itemDiv);
    }

    const addDiv = document.createElement("div"); 
    addDiv.classList.add("main_item"); addDiv.id = "main_item_add";
        const addButton = document.createElement("button"); 
        addButton.classList.add("main_item_button"); addButton.id = "main_item_add_button";
            const link = document.createElement("a"); 
            link.classList.add("createNoteClick"); link.textContent = "+";
        addButton.appendChild(link); 
    addDiv.appendChild(addButton); 

    main_section.appendChild(addDiv);  
    
    main_section.addEventListener('click', (event) => { 
        const target = event.target.closest('.main_item_button');
        if (!target) 
            return;

        if (target.id === "main_item_add_button") {
            const noteParent = document.getElementById('createNoteParent');
            menuClose();
            noteParent.style.display = 'flex';
            requestAnimationFrame(() => noteParent.style.opacity = '1');
        } else {
            const noteId = target.id.replace(/^#/, "");
            const url = new URL("../../note/note_html/note.html", window.location.href);

            url.searchParams.set("note", noteId);
            url.searchParams.set("friendNote", "false");

            window.location.href = url.toString();
        }
    });
};

export const noteOthersDivMaker = async () => {
    const main_section = document.getElementsByTagName("main")[0];
    if (!main_section)
        return;
    
    await loadNotesOthers();
    for (const note of NOTESDATAFROMOTHERS) { 
        const itemDiv = document.createElement("div");  

        itemDiv.classList.add("main_item");
            const button = document.createElement("button");
            button.id = note.id; button.classList.add("main_item_button"); button.textContent = note.note_name;
        itemDiv.appendChild(button);   

        main_section.appendChild(itemDiv);  
    }

    main_section.addEventListener('click', (event) => { 
        const target = event.target.closest('.main_item_button');
        if (!target) 
            return;

        const noteId = target.id.replace(/^#/, "");
        const url = new URL("../../note/note_html/note.html", window.location.href);
        
        url.searchParams.set("note", noteId);
        url.searchParams.set("friendNote", "true");

        window.location.href = url.toString();
    });
};
