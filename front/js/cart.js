// ------------------------ RECUPERATION DES DONNEES ET APPEL DES FONCTIONS -----------------------------

let cart;
// Récupération des produits dans le localStorage
function updateCart() {
  cart = JSON.parse(localStorage.getItem("cart"));

  if (!cart || cart.length === 0) {
    const sectionCartItem = document.querySelector("#cart__items");
    sectionCartItem.innerHTML = `<h2>Le panier est vide.</h2>`;
    return;
  }

  // Appel API et fusion des données dans cart

  const productIdFromApi = cart.map((product) =>
    fetch(`http://localhost:3000/api/products/${product.id}`).then((response) =>
      response.json()
    )
  );
  Promise.all(productIdFromApi)
    .then((products) => {
      cart = cart.map((product, index) => {
        return Object.assign({}, product, products[index]);
      });
      createCartElement(cart);
      btnTodeleteProduct();
      modifQuantityFromInput();
      displayTotalQuantityAndPrice();
    })
    .catch((error) => console.error(error));
}

updateCart();

// --------------------------- AFFICHAGE DES PRODUITS DANS LE PANIER ----------------------------------

function createCartElement(cart) {
  //Récupération DIV panier
  const sectionCartItem = document.querySelector("#cart__items");

  //Boucle pour récupérer produits ajoutés dans le panier et stockés dans cart
  cart.forEach((product) => {
    sectionCartItem.innerHTML += `<article class="cart__item" data-id=${product.id} data-color=${product.color}>
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
      </article>`;
  });
}

// ---------------------------------  SUPPRESSION DES PRODUITS -------------------------------------

function btnTodeleteProduct() {
  const deleteButton = document.querySelectorAll(".deleteItem");
  deleteButton.forEach((button) => {
    button.addEventListener("click", () => {
      const article = button.closest(".cart__item");
      const id = article.dataset.id;
      const color = article.dataset.color;
      cart = cart.filter((item) => !(item.id === id && item.color === color));
      localStorage.setItem("cart", JSON.stringify(cart));
      article.remove();
      displayTotalQuantityAndPrice();
    });
  });
}

// ------------------------------------ MODIFIER QUANTITE DES PRODUITS ---------------------------------

function modifQuantityFromInput() {
  const inputQuantity = document.querySelectorAll(".itemQuantity");
  inputQuantity.forEach((itemQ) => {
    itemQ.addEventListener("change", (event) => {
      const value = event.target.value;
      const article = itemQ.closest(".cart__item");
      const id = article.dataset.id;
      const color = article.dataset.color;
      const quantityChange = cart.find(
        (item) => item.id === id && item.color === color
      );
      quantityChange.quantity = parseInt(value);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayTotalQuantityAndPrice();
    });
  });
}
// ------------------------------------------ AFFICHAGE QUANTITE ET PRIX TOTAL -----------------------------

function displayTotalQuantityAndPrice() {
  // Calcul de la quantité totale d'articles
  let totalPrice = 0;
  let totalQuantity = 0;

  for (let i = 0; i < cart.length; i++) {
    totalQuantity += cart[i].quantity;
    totalPrice += cart[i].price * cart[i].quantity;
  }

  // Affichage de la quantité totale d'articles
  document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`;
  document.querySelector("#totalPrice").innerHTML = `${totalPrice}`;
}

// --------------------------------------- FORMULAIRE DE COMMANDE ------------------------------------------

// Variable champs de saisie

const form = document.querySelector(".cart__order__form");
const firstName = form.querySelector("#firstName");
const lastName = form.querySelector("#lastName");
const address = form.querySelector("#address");
const city = form.querySelector("#city");
const email = form.querySelector("#email");

// Variable RegExp

const nameRegExp = /^[a-zA-Z]+$/;
const addressRegExp = /^[0-9a-zA-Z\s]+$/;
const cityRegExp = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation champs de saisie et formulaire

function validateForm() {
  let isValid = true;

  if (!nameRegExp.test(firstName.value)) {
    document.querySelector("#firstNameErrorMsg").textContent =
      "Veuillez saisir un prénom valide";
    isValid = false;
  } else {
    document.querySelector("#firstNameErrorMsg").textContent = "";
  }

  if (!nameRegExp.test(lastName.value)) {
    document.querySelector("#lastNameErrorMsg").textContent =
      "Veuillez saisir un nom valide";
    isValid = false;
  } else {
    document.querySelector("#lastNameErrorMsg").textContent = "";
  }

  if (!addressRegExp.test(address.value)) {
    document.querySelector("#addressErrorMsg").textContent =
      "Veuillez saisir une adresse valide";
    isValid = false;
  } else {
    document.querySelector("#addressErrorMsg").textContent = "";
  }

  if (!cityRegExp.test(city.value)) {
    document.querySelector("#cityErrorMsg").textContent =
      "Veuillez saisir une ville valide";
    isValid = false;
  } else {
    document.querySelector("#cityErrorMsg").textContent = "";
  }

  if (!emailRegExp.test(email.value)) {
    document.querySelector("#emailErrorMsg").textContent =
      "Veuillez saisir une adresse email valide";
    isValid = false;
  } else {
    document.querySelector("#emailErrorMsg").textContent = "";
  }

  return isValid;
}

function createOrder() {
  let basketContents = [];
  for (let n = 0; n < cart.length; n++) {
    basketContents.push(cart[n].id);
  }

  return {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: basketContents,
  };
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!cart || cart.length === 0) {
    alert("Vous devez ajouter au moins un produit dans votre panier");
    return;
  }
  if (validateForm()) {
    const order = createOrder();
    console.log(order);
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Une erreur est survenue lors de la commande");
        }
        return response.json();
      })
      .then((data) => {
        alert("Commande passée avec succès !");
        window.location.href = `./confirmation.html?id=${data.orderId}`;
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});
