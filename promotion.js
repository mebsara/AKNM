document.addEventListener('DOMContentLoaded', function() {
    // --- Fonctions utilitaires pour le panier (communiquera avec localStorage) ---
    const cartCountSpan = document.getElementById('cart-count'); // Le compteur du panier dans le header
    
    function getPanier() {
        try {
            const panier = JSON.parse(localStorage.getItem('panier')) || [];
            return Array.isArray(panier) ? panier : []; // Assure que c'est un tableau
        } catch (e) {
            console.error("Erreur lors de la lecture du panier depuis localStorage :", e);
            return [];
        }
    }

    function savePanier(panier) {
        localStorage.setItem('panier', JSON.stringify(panier));
        updateCartCount(); // Met à jour le compteur du header après sauvegarde
    }

    function updateCartCount() {
        const panier = getPanier();
        const totalItems = panier.reduce((sum, item) => sum + item.quantite, 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
        }
    }

    // --- Initialisation du compteur du panier au chargement de la page ---
    updateCartCount();

    // --- Gestion de l'ajout au panier ---
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.promo-item-card'); // Trouve la carte parente
            if (!card) {
                console.error("Impossible de trouver la carte parente pour le bouton d'ajout au panier.");
                return;
            }

            const productId = card.dataset.id;
            const productName = card.dataset.name;
            const productPrice = parseFloat(card.dataset.price);
            const productImage = card.dataset.image;

            // Vérification des données
            if (!productId || !productName || isNaN(productPrice) || !productImage) {
                console.error("Données de produit manquantes ou invalides:", { productId, productName, productPrice, productImage });
                alert("Erreur: Les informations du produit sont incomplètes.");
                return;
            }

            let panier = getPanier();
            const existingItemIndex = panier.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                // Le produit existe déjà, incrémente la quantité
                panier[existingItemIndex].quantite += 1;
            } else {
                // Le produit n'existe pas, l'ajoute au panier
                panier.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantite: 1
                });
            }

            savePanier(panier);
            alert(`${productName} a été ajouté à votre panier (${panier.find(item => item.id === productId).quantite} dans le panier) !`); 
            // Petite animation/feedback visuel (optionnel)
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 500);
        });
    });

    // --- Gestion du Code Promo ---
    const copyPromoCodeBtn = document.getElementById('copyPromoCode');
    const promoCodeDisplay = document.getElementById('promoCodeDisplay');

    if (copyPromoCodeBtn && promoCodeDisplay) {
        copyPromoCodeBtn.addEventListener('click', function() {
            const codeToCopy = promoCodeDisplay.textContent;
            navigator.clipboard.writeText(codeToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copié !';
                this.style.backgroundColor = '#28a745'; // Vert pour succès
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = ''; // Revert à la couleur d'origine (via CSS)
                }, 1500);
            }).catch(err => {
                console.error('Erreur lors de la copie : ', err);
                alert('Impossible de copier le code. Veuillez le sélectionner et le copier manuellement.');
            });
        });
    }

    // --- Gestion des Avis Clients ---
    const reviewForm = document.getElementById('reviewForm');
    const reviewRatingStars = document.getElementById('reviewRating');
    const selectedRatingInput = document.getElementById('selectedRating');
    const reviewsListDiv = document.getElementById('reviewsList');

    let currentRating = 0; // Pour stocker la note sélectionnée

    // Charger les avis existants du localStorage
    function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
        reviewsListDiv.innerHTML = '<h3>Ce que nos clients en disent :</h3>'; // Réinitialise la liste
        
        if (reviews.length === 0) {
            reviewsListDiv.innerHTML += '<p class="no-reviews-message">Aucun avis pour le moment. Soyez le premier !</p>';
        } else {
            reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                // Générer les étoiles remplies et vides
                const starsHtml = '&#9733;'.repeat(review.rating) + '&#9734;'.repeat(5 - review.rating);
                reviewItem.innerHTML = `
                    <div class="review-meta">
                        <span class="reviewer-name">${review.name}</span>
                        <span class="review-date">${review.date}</span>
                    </div>
                    <div class="review-stars">${starsHtml}</div>
                    ${review.product ? `<p class="review-product-name">Produit : ${review.product}</p>` : ''}
                    <p class="review-text">${review.text}</p>
                `;
                reviewsListDiv.appendChild(reviewItem);
            });
        }
    }

    // Gestion du système de notation par étoiles
    if (reviewRatingStars) {
        reviewRatingStars.addEventListener('mouseover', function(e) {
            if (e.target.classList.contains('fa-star')) {
                const rating = parseInt(e.target.dataset.rating);
                Array.from(reviewRatingStars.children).forEach(star => {
                    const starRating = parseInt(star.dataset.rating);
                    if (starRating <= rating) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });

        reviewRatingStars.addEventListener('mouseout', function() {
            Array.from(reviewRatingStars.children).forEach(star => {
                const starRating = parseInt(star.dataset.rating);
                if (starRating <= currentRating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        });

        reviewRatingStars.addEventListener('click', function(e) {
            if (e.target.classList.contains('fa-star')) {
                currentRating = parseInt(e.target.dataset.rating);
                selectedRatingInput.value = currentRating; // Met à jour la valeur de l'input caché
                // Appliquer les styles des étoiles sélectionnées immédiatement après le clic
                Array.from(reviewRatingStars.children).forEach(star => {
                    const starRating = parseInt(star.dataset.rating);
                    if (starRating <= currentRating) {
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
            }
        });
    }

    // Soumission du formulaire d'avis
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const reviewName = document.getElementById('reviewName').value.trim();
            const reviewProductSelect = document.getElementById('reviewProduct');
            // Récupère le texte de l'option sélectionnée, pas seulement la valeur
            const reviewProductText = reviewProductSelect.options[reviewProductSelect.selectedIndex].text; 
            const reviewText = document.getElementById('reviewText').value.trim();
            
            // Validation simple
            if (reviewName === '' || reviewText === '' || currentRating === 0) {
                alert('Veuillez remplir votre nom, votre avis et donner une note.');
                return;
            }

            const newReview = {
                name: reviewName,
                // Si l'utilisateur n'a rien sélectionné, le produit est vide
                product: reviewProductText === 'Sélectionnez un produit...' ? '' : reviewProductText, 
                rating: currentRating,
                text: reviewText,
                date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
            };

            let reviews = JSON.parse(localStorage.getItem('productReviews')) || [];
            reviews.push(newReview);
            localStorage.setItem('productReviews', JSON.stringify(reviews));

            alert('Votre avis a été envoyé avec succès ! Merci !');
            reviewForm.reset(); // Réinitialise le formulaire
            currentRating = 0; // Réinitialise la note sélectionnée
            selectedRatingInput.value = 0; // Réinitialise l'input caché
            // Réinitialise les étoiles à vide
            Array.from(reviewRatingStars.children).forEach(star => {
                star.classList.remove('fas');
                star.classList.add('far');
            });
            loadReviews(); // Recharge les avis pour afficher le nouveau
        });
    }

    // Charger les avis au premier chargement de la page
    loadReviews();
});
// Fonction pour initialiser le panier s'il n'existe pas
function initCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Fonction pour mettre à jour le compteur du panier
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Fonction pour ajouter un article au panier
function addToCart(button) {
    const productCard = button.closest('.promo-item-card');
    const product = {
        id: productCard.dataset.id,
        name: productCard.dataset.name,
        price: parseFloat(productCard.dataset.price),
        image: productCard.dataset.image,
        quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Animation de confirmation
    button.textContent = 'Ajouté !';
    button.style.backgroundColor = '#27ae60';
    setTimeout(() => {
        button.textContent = 'Ajouter au panier';
        button.style.backgroundColor = '';
    }, 2000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    updateCartCount();
    
    // Ajouter les écouteurs d'événements aux boutons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            addToCart(this);
        });
    });
});