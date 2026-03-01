const isMobile = () => window.innerWidth <= 768;
const mainContainer = document.querySelector('main');
const allInputs = document.querySelectorAll('input');

allInputs.forEach(input => {
    input.addEventListener('focus', () => {
        if (isMobile()) {
            mainContainer.style.transform = 'translateY(-10vh)'; 
        }
    });

    input.addEventListener('blur', () => {
        if (isMobile()) {
            mainContainer.style.transform = 'translateY(0)';
        }
    });
});