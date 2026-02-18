const menu = document.getElementById('menu');
if(!menu) {
    console.warn("Menu element not found. Menu toggle will not work.");
}

const menuManage = () => { 
    if (menu.classList.contains('active')) {
        menu.classList.remove('active'); menuIcon.classList.remove('menu-open'); menu.classList.add('inactive');
    } else {
        menu.classList.remove('inactive'); menu.classList.add('active'); menuIcon.classList.add('menu-open');
    }
}

const menuIcon = document.getElementById('headerIcon');
menuIcon.addEventListener('click', (event) => {
    menuManage();
});

export const menuClose = () => {
    menu.classList.remove('active'); menuIcon.classList.remove('menu-open'); menu.classList.add('inactive');
}

export const menuOpen = () => {
    menu.classList.remove('inactive'); menu.classList.add('active'); menuIcon.classList.add('menu-open');
}