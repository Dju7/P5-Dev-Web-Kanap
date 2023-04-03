// ---------Affichage des produits dans le panier ---------------------

function createCart(cartWithProductData){
//Récupération DIV panier
  const sectionCartItem = document.querySelector("#cart__items");
  
//Boucle pour récupérer produit ajouter dans le panier et stockés dans cartWithproductData
  cartWithProductData.forEach(productWanted => {
  
//Création des balises article avec nom du produit
  const cartItemArticle = document.createElement("article");
  cartItemArticle.dataset.id = productWanted.id;
  cartItemArticle.dataset.color = productWanted.color;
  cartItemArticle.className = "cart__item";
  sectionCartItem.appendChild(cartItemArticle);
  
//création balise Div avec image du produit
  const divCartItemImage = document.createElement("div");
  divCartItemImage.className = "cart__item__img";
  cartItemArticle.appendChild(divCartItemImage);
  const cartItemImg = document.createElement("img");
  cartItemImg.src = productWanted.imageUrl;
  cartItemImg.alt = productWanted.altTxt;
  divCartItemImage.appendChild(cartItemImg);
  
//création balise div détails produit
  const divCartItemContent = document.createElement("div");
  divCartItemContent.className = "cart__item__content";
  cartItemArticle.appendChild(divCartItemContent);
  
  const cartItemDescription = document.createElement("div");
  cartItemDescription.className = "cart__item__content__description";
  divCartItemContent.appendChild(cartItemDescription);
  
  const productName = document.createElement("h2");
  productName.innerText = productWanted.name;
  cartItemDescription.appendChild(productName);
  
  const productColor = document.createElement("p");
  productColor.innerText = `Couleur: ${productWanted.color}`;
  cartItemDescription.appendChild(productColor);
  
  const productPrice = document.createElement("p");
  productPrice.innerText = `Prix: ${productWanted.price} €`;
  cartItemDescription.appendChild(productPrice);
  
//Création balise div quantité du produit
  const divCartItemSettings = document.createElement("div");
  divCartItemSettings.className = "cart__item__content__settings";
  divCartItemContent.appendChild(divCartItemSettings);
  
  const divCartItemSettingsQuantity = document.createElement("div");
  divCartItemSettingsQuantity.className = "cart__item__content__settings__quantity";
  divCartItemSettings.appendChild(divCartItemSettingsQuantity);
  
  const productQuantity = document.createElement("p");
  productQuantity.innerText = `Quantité: ${productWanted.quantity}`;
  divCartItemSettingsQuantity.appendChild(productQuantity);
  
  divCartItemSettings.innerHTML += `<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${productWanted.quantity}>`;
  
  const divCartItemDelete = document.createElement("div");
  divCartItemDelete.className = "cart__item__content__settings__delete";
  divCartItemSettings.appendChild(divCartItemDelete);
  
  const deleteQuantity = document.createElement("p");
  deleteQuantity.className ="deleteItem";
  deleteQuantity.innerText = "supprimer";
  divCartItemDelete.appendChild(deleteQuantity);
  
  })
}


// ----------------- Récupération donnée et appel des fonctions --------------------------

let cart;
let cartWithProductData; 

function updateCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  console.log(cart);

  if (!cart) {
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
      cartWithProductData = cart.map((product, index) => {
        return Object.assign({}, product, products[index]);
      });
      console.log(cartWithProductData);

      createCart(cartWithProductData);
      deleteProduct();
      modifQuantity();
      displayTotalQuantityAndPrice()
    })
    .catch(error => console.error(error));
}

updateCart();

// ----------------------- Ajout et / ou suppression de produit -------------------------

function deleteProduct(){
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
    document.location.reload();
  });
});
}

// ----------------- Gérer le changement de quantité depuis le panier ----------------------

function modifQuantity() {
  const inputQuantity = document.querySelectorAll(".itemQuantity");
  inputQuantity.forEach(itemQ => {
    itemQ.addEventListener('change', (event) => {
      const value = event.target.value;
      let article = itemQ.closest(".cart__item");
      let id = article.dataset.id;
      let color = article.dataset.color;
      let quantityChange = cart.find(item => item.id === id && item.color === color);
      quantityChange.quantity = parseInt(value);

      if (quantityChange != cart.quantity) {
        cart.splice(0, 1, quantityChange)
        localStorage.setItem('cart', JSON.stringify(cart)); 
        document.location.reload();
      }
    })  
  })
}
// ----------------------- gestion de l'affichage de la quantité et du prix total --------------
 
function displayTotalQuantityAndPrice() {

  // Calcul de la quantité totale d'articles
  let totalProduct = [];
  let totalArticle = 0;

  for(let i = 0; i < cart.length; i++ ) {
    let totalOfProduct = parseInt(cart[i].quantity);
    totalProduct.push(totalOfProduct);
    totalArticle += totalProduct[i]
  }

  // Affichage de la quantité totale d'articles
  const displayPTotalArticle = document.querySelector("#totalQuantity").innerHTML= `${totalArticle}`;

  // Calcul du prix total
  let prixTotal = [];
  let qtyProduct = 0;

  // Récupération de tous les prix des produits dans le panier
  for (let i = 0; i < cartWithProductData.length; i++) {
    let priceFromBasket = parseInt(cartWithProductData[i].price);
    qtyProduct += parseInt(cartWithProductData[i].quantity);
    prixTotal.push(priceFromBasket);  
  }

  // Somme des prix
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalAmount = prixTotal.reduce(reducer) * qtyProduct ;

  // Affichage du prix total
  const displayPriceTotal = document.querySelector("#totalPrice").innerHTML= `${totalAmount} €`;
}
