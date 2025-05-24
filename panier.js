document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour mettre à jour le compteur du panier dans l'en-tête
    function updateCartCount() {
        const panier = JSON.parse(localStorage.getItem('panier')) || [];
        const count = panier.reduce((total, item) => total + item.quantite, 0);
        const compteur = document.getElementById('cart-count'); 
        if (compteur) {
            compteur.textContent = count;
        }
    }

    // Fonction pour afficher les articles dans le panier
    function displayPanierItems() {
        const panierItemsContainer = document.getElementById('panier-items');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        let panier = JSON.parse(localStorage.getItem('panier')) || [];

        panierItemsContainer.innerHTML = ''; // Vide le conteneur existant

        if (panier.length === 0) {
            emptyCartMessage.style.display = 'block'; // Affiche le message "panier vide"
        } else {
            emptyCartMessage.style.display = 'none'; // Cache le message
            panier.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('panier-item');
                itemDiv.dataset.id = item.id; // Ajouté pour faciliter la sélection

                itemDiv.innerHTML = `
                    <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.nom}">
                    <div class="item-details">
                        <h3>${item.nom}</h3>
                        <p>Prix unitaire: ${item.prix.toFixed(2)}€</p>
                        <div class="quantity-controls">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantite}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <p>Total: ${(item.prix * item.quantite).toFixed(2)}€</p>
                        <button class="remove-item" data-id="${item.id}">Supprimer</button>
                    </div>
                `;
                panierItemsContainer.appendChild(itemDiv);
            });
        }
        updatePanierTotal(); // Met à jour le total après avoir affiché les items
        updateCartCount(); // Met à jour le compteur du header
    }

    // Fonction pour mettre à jour le total du panier
    function updatePanierTotal() {
        const panier = JSON.parse(localStorage.getItem('panier')) || [];
        const totalPrice = panier.reduce((total, item) => total + (item.prix * item.quantite), 0);
        document.getElementById('total-price').textContent = totalPrice.toFixed(2) + '€';
    }

    // Fonctions pour manipuler le panier (ajout, suppression, modification de quantité)
    function addToPanier(product) {
        let panier = JSON.parse(localStorage.getItem('panier')) || [];
        const existingItem = panier.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantite++;
        } else {
            panier.push({ ...product, quantite: 1 });
        }
        localStorage.setItem('panier', JSON.stringify(panier));
        displayPanierItems(); // Re-afficher le panier après modification
    }

    function updateQuantity(productId, action) {
        let panier = JSON.parse(localStorage.getItem('panier')) || [];
        const itemIndex = panier.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            if (action === 'increase') {
                panier[itemIndex].quantite++;
            } else if (action === 'decrease') {
                if (panier[itemIndex].quantite > 1) {
                    panier[itemIndex].quantite--;
                } else {
                    // Si la quantité est 1 et on décrémente, on supprime l'article
                    panier.splice(itemIndex, 1);
                }
            }
            localStorage.setItem('panier', JSON.stringify(panier));
            displayPanierItems();
        }
    }

    function removeItemFromPanier(productId) {
        let panier = JSON.parse(localStorage.getItem('panier')) || [];
        panier = panier.filter(item => item.id !== productId);
        localStorage.setItem('panier', JSON.stringify(panier));
        displayPanierItems();
    }

    // Écouteurs d'événements pour les boutons du panier (sur les items dynamiques)
    document.getElementById('panier-items').addEventListener('click', function(event) {
        const target = event.target;
        const productId = target.dataset.id;

        if (target.classList.contains('increase-quantity')) {
            updateQuantity(productId, 'increase');
        } else if (target.classList.contains('decrease-quantity')) {
            updateQuantity(productId, 'decrease');
        } else if (target.classList.contains('remove-item')) {
            removeItemFromPanier(productId);
        }
    });

    // Écouteur d'événement pour le bouton "Procéder au paiement"
    const btnCommander = document.querySelector('.btn-commander');
    if (btnCommander) {
        btnCommander.addEventListener('click', function() {
            const selectedPaymentMethod = document.querySelector('input[name="payment_method"]:checked');
            
            if (selectedPaymentMethod) {
                const method = selectedPaymentMethod.value;
                console.log('Méthode de paiement sélectionnée :', method);
                
                // Ici, vous pouvez ajouter votre logique de paiement réelle.
                // Par exemple :
                // - Rediriger vers une page de paiement spécifique (ex: pour PayPal).
                // - Ouvrir une modale pour les détails de carte bancaire.
                // - Envoyer les données du panier et la méthode au serveur.

                alert(`Vous avez choisi de payer par : ${method}. (Ceci est une simulation pour l'exemple)`);

                // Exemple d'action après le clic (à adapter à votre backend/API de paiement)
                // if (method === 'paypal') {
                //     window.location.href = 'https://www.paypal.com/fr/cgi-bin/webscr?cmd=_flow&SESSION=...';
                // } else if (method === 'carte_bancaire') {
                //     // Afficher un formulaire de carte bancaire
                //     alert('Affichage du formulaire de paiement par carte bancaire...');
                // } else if (method === 'paiement_livraison') {
                //     alert('Votre commande sera payée à la livraison. Confirmation envoyée.');
                //     // Vider le panier après une commande "à la livraison" par exemple
                //     localStorage.removeItem('panier');
                //     displayPanierItems();
                // }

            } else {
                alert('Veuillez sélectionner une méthode de paiement pour continuer.');
            }
        });
    }

    // Appel initial pour afficher les articles du panier et les totaux
    displayPanierItems(); 
});