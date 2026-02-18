const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const passwordAgainInput = document.getElementById('passwordInputAgain');

const emailStatus = document.getElementById('emailStatus');
const passwordStatus = document.getElementById('passwordStatus');
const passwordAgainStatus = document.getElementById('passwordAgainStatus');

function updateStatus(input, status) {
    if (input.checkValidity()) { 
        status.src = '../../images/AcceptMark.png';  
    } else if (input.value === '') {
        status.src = '../../images/QuestionMark.png';
    } else {
        status.src = '../../images/RejectMark.png';
    }
}

function validatePasswordMatch(input, status) {
    if (passwordInput.value === input.value && passwordInput.value !== '') {
        status.src = '../../images/AcceptMark.png';
    } else if (input.value === '') {
        status.src = '../../images/QuestionMark.png'; 
    } else { 
        status.src = '../../images/RejectMark.png'; 
    }
}

emailInput.addEventListener('input', () => updateStatus(emailInput, emailStatus));
passwordInput.addEventListener('input', () => updateStatus(passwordInput, passwordStatus));
if (passwordAgainInput) {
    passwordAgainInput.addEventListener('input', () => validatePasswordMatch(passwordAgainInput, passwordAgainStatus));
}
