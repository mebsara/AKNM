document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const registrationConfirmation = document.getElementById('registrationConfirmation');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        // Réinitialiser les messages d'erreur
        firstNameError.textContent = '';
        lastNameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        registrationConfirmation.textContent = '';
        registrationConfirmation.style.display = 'none';
        registrationConfirmation.classList.remove('success', 'error');

        let isValid = true;

        // Validation des champs
        if (firstNameInput.value.trim() === '') {
            firstNameError.textContent = 'Le prénom est requis.';
            isValid = false;
        }
        if (lastNameInput.value.trim() === '') {
            lastNameError.textContent = 'Le nom est requis.';
            isValid = false;
        }
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'L\'adresse email est requise.';
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Veuillez entrer une adresse email valide.';
            isValid = false;
        }
        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'Le mot de passe est requis.';
            isValid = false;
        } else if (passwordInput.value.trim().length < 6) {
            passwordError.textContent = 'Le mot de passe doit contenir au moins 6 caractères.';
            isValid = false;
        }
        if (confirmPasswordInput.value.trim() === '') {
            confirmPasswordError.textContent = 'Veuillez confirmer le mot de passe.';
            isValid = false;
        } else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
            confirmPasswordError.textContent = 'Les mots de passe ne correspondent pas.';
            isValid = false;
        }

        if (isValid) {
            // SIMULATION DE CRÉATION DE COMPTE
            // Pour une vraie application, vous enverriez ces données à un serveur
            // et le serveur validerait et enregistrerait l'utilisateur.

            // Stocker l'email et le mot de passe dans le localStorage pour la simulation
            // ATTENTION: CE N'EST PAS SÉCURISÉ POUR UNE VRAIE APPLICATION !
            // C'est uniquement pour la démonstration côté client.
            localStorage.setItem('registeredEmail', emailInput.value.trim());
            localStorage.setItem('registeredPassword', passwordInput.value.trim());

            showConfirmationMessage('Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
            
            // Optionnel: Réinitialiser le formulaire après un court délai
            setTimeout(() => {
                registrationForm.reset();
                // Redirection vers la page de connexion après un certain temps
                window.location.href = 'connexion.html'; 
            }, 3000); // Redirige après 3 secondes
        }
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showConfirmationMessage(message, type) {
        registrationConfirmation.textContent = message;
        registrationConfirmation.classList.add(type);
        registrationConfirmation.style.display = 'block';
        setTimeout(() => {
            registrationConfirmation.style.opacity = 1;
        }, 10);
    }
});