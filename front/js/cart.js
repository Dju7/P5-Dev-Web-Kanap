// ---------Affichage des produits dans le panier ---------------------

function createCartElement(cart){
//Récupération DIV panier
  const sectionCartItem = document.querySelector("#cart__items");
  
//Boucle pour récupérer produit ajouter dans le panier et stockés dans cart
  cart.forEach(product => {
     sectionCartItem.innerHTML +=
  `<article class="cart__item" data-id=${product.id} data-color=${product.color}>
  <div class="cart__item__img">
    <img src=${product.imageUrl} alt=${product.altTxt}>
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${product.name}</h2>
      <p>${product.color}</p>
      <p>${product.price}</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${product.quantity}>
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>` 

  }) 
}

// ----------------- Récupération donnée et appel des fonctions --------------------------

let cart;

function updateCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  
  if (!cart || cart.length === 0) {
    const sectionCartItem = document.querySelector("#cart__items");
    sectionCartItem.innerHTML = `<h2>Le panier est vide.</h2>`;
    return;
  }

  const productIdFromApi = cart.map(product =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then(response => response.json())
  );
  Promise.all(productIdFromApi)
    .then(products => {
      cart = cart.map((product, index) => {
        return Object.assign({}, product, products[index]);
      });
      createCartElement(cart);
      btnTodeleteProduct();
      modifQuantityFromInput();
      displayTotalQuantityAndPrice()
    })
    .catch(error => console.error(error));
}

updateCart();

// ----------------------- Ajout et / ou suppression de produit -------------------------

function btnTodeleteProduct(){
  const deleteButton = document.querySelectorAll('.deleteItem');
  deleteButton.forEach(button => {
  button.addEventListener('click', () => {
    // Récupérer l'element parent dont la class = cart__item
    let article = button.closest(".cart__item");
    // Récupérer l'ID et la couleur du produit à supprimer
    let id = article.dataset.id;
    let color = article.dataset.color;
    // Supprimer le produit du panier
    cart = cart.filter(item => !(item.id === id && item.color === color));
    // Mettre à jour le panier dans le stockage local
    localStorage.setItem('cart', JSON.stringify(cart));
    // Retirer l'article du DOM
    article.remove();
    displayTotalQuantityAndPrice();
  });
});
}

// ----------------- Gérer le changement de quantité depuis le panier ----------------------

function modifQuantityFromInput() {
  const inputQuantity = document.querySelectorAll(".itemQuantity");
  inputQuantity.forEach(itemQ => {
    itemQ.addEventListener('change', (event) => {
      const value = event.target.value;
      let article = itemQ.closest(".cart__item");
      let id = article.dataset.id;
      let color = article.dataset.color;
      let quantityChange = cart.find(item => item.id === id && item.color === color);
      quantityChange.quantity = parseInt(value);
      localStorage.setItem('cart', JSON.stringify(cart)); 
      displayTotalQuantityAndPrice();
    })  
  })
}
// ----------------------- affichage de la quantité et du prix total --------------
 
function displayTotalQuantityAndPrice() {

  // Calcul de la quantité totale d'articles
  let totalPrice = 0;
  let totalQuantity = 0;

  for(let i = 0; i < cart.length; i++ ) {
   totalQuantity += cart[i].quantity
   totalPrice += cart[i].price * cart[i].quantity
  }
  
  // Affichage de la quantité totale d'articles
  document.querySelector("#totalQuantity").innerHTML= `${totalQuantity}`;
  document.querySelector("#totalPrice").innerHTML= `${totalPrice}`;
}

// --- FORMULAIRE DE COMMANDE ---

// Variable champs de saisie

const form = document.querySelector('.cart__order__form');
const firstName = form.querySelector('#firstName');
const lastName = form.querySelector('#lastName');
const address = form.querySelector('#address');
const city = form.querySelector('#city');
const email = form.querySelector('#email');

// Variable RegExp

const nameRegExp = /^[a-zA-Z]+$/;
const addressRegExp = /^[0-9a-zA-Z\s]+$/;
const cityRegExp = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation champs de saisie et formulaire

firstName.addEventListener('input', function() {
  if (!nameRegExp.test(firstName.value)) {
    document.querySelector("#firstNameErrorMsg").textContent = "Veuillez saisir un prénom valide";
  } else {
    document.querySelector("#firstNameErrorMsg").textContent = "";
  }
});

lastName.addEventListener('input', function() {
  if (!nameRegExp.test(lastName.value)) {
    document.querySelector("#lastNameErrorMsg").textContent = "Veuillez saisir un nom valide";
  } else {
    document.querySelector("#lasttNameErrorMsg").textContent = "";
  }
});

address.addEventListener('input', function() {
  if (!addressRegExp.test(address.value)) {
    document.querySelector("#adressErrorMsg").textContent = "Veuillez saisir une adresse valide";
  } else {
    document.querySelector("#adressErrorMsg").textContent = "";
  }
});

city.addEventListener('input', function() {
  if (!cityRegExp.test(city.value)) {
    document.querySelector("#cityErrorMsg").textContent = "Veuillez saisir une ville valide";
  } else {
    document.querySelector("#cityErrorMsg").textContent = "";
  }
});

email.addEventListener('input', function() {
  if (!emailRegExp.test(email.value)) {
    document.querySelector("#emailErrorMsg").textContent = "Veuillez saisir une adresse email valide";
  } else {
    document.querySelector("#emailErrorMsg").textContent = ""; 
  }
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (form.checkValidity()) {
    alert('Le formulaire est valide.');
  } else {
    alert('Le formulaire n\'est pas valide. Veuillez vérifier les champs.');
  }
});

// --- PASSER COMMANDE ---

function createOrder() {
  let basketContents = [];
  for (let n = 0; n < cart.length; n++) {
    basketContents.push(cart[n].id);
  }

  return {
    clientInfo : {
      Firstname : firstName.value,
      Lastname : lastName.value,
      Adresse : address.value,
      City : city.value,
      Email : email.value,
    },
    Ordered : basketContents
  };
}

// Click sur le bouton commande

const btnToOrder = document.querySelector("#order");
btnToOrder.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (!cart || cart === null) {
    alert("Vous devez ajouter des produits dans votre panier");
  } else {
    const order = createOrder ()

    fetch("http://localhost:3000/api/products/order", {
      method: 'POST',
      body: JSON.stringify(order),
      headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
      },
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de commande");
      }
      return response.json();
    })
    .then((data) => {
      order = data;
      alert("Commande passée avec succès !");
      // Redirection de l'utilisateur vers la page de confirmation de commande
      window.location.href = "./confirmation.html";
    })
    .catch((error) => {
      alert(error.message);
    })
  }
});