document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const confirmationMessage = document.getElementById('confirmationMessage');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi par défaut du formulaire

        // Réinitialiser les messages d'erreur
        clearErrors();

        let isValid = true;

        // Validation du Nom
        if (nameInput.value.trim() === '') {
            displayError('nameError', 'Veuillez entrer votre nom.');
            isValid = false;
        }

        // Validation de l'Email
        if (emailInput.value.trim() === '') {
            displayError('emailError', 'Veuillez entrer votre adresse email.');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            displayError('emailError', 'Veuillez entrer une adresse email valide.');
            isValid = false;
        }

        // Validation du Sujet
        if (subjectInput.value.trim() === '') {
            displayError('subjectError', 'Veuillez entrer un sujet.');
            isValid = false;
        }

        // Validation du Message
        if (messageInput.value.trim() === '') {
            displayError('messageError', 'Veuillez entrer votre message.');
            isValid = false;
        }

        if (isValid) {
            // Ici, vous enverriez normalement les données du formulaire à un serveur (ex: via fetch API).
            // Pour cet exemple, nous allons juste afficher un message de confirmation.
            
            // Simuler un envoi réussi
            console.log('Formulaire envoyé :', {
                name: nameInput.value,
                email: emailInput.value,
                subject: subjectInput.value,
                message: messageInput.value
            });

            confirmationMessage.textContent = 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.';
            confirmationMessage.style.display = 'block';
            contactForm.reset(); // Réinitialise le formulaire

            // Masquer le message de confirmation après quelques secondes
            setTimeout(() => {
                confirmationMessage.style.display = 'none';
            }, 5000);

        }
    });

    function displayError(id, message) {
        const errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function isValidEmail(email) {
        // Regex simple pour la validation d'email
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});