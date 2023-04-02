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

// ----------------- Récupération donnée du LocalStorage + API + fusion --------------------------

let cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);
let cartWithProductData = [];

// promise all
if (cart) {
  const productIdFromApi = cart.map(product =>
    fetch(`http://localhost:3000/api/products/${product.id}`)
      .then(response => response.json())
  );
  Promise.all(productIdFromApi)
    .then(products => {
      let cartWithProductData = cart.map((product, index) => {
        return Object.assign({}, product, products[index]);
      });
      console.log(cartWithProductData);
      createCart(cartWithProductData);
      deleteProduct();
      modifQuantity();
    });
} else {
  const sectionCartItem = document.querySelector("#cart__items").innerHTML = `<h2>il n'y a pas de produit dans le panier</h2>`
}

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

/*
// --------------------- afficher la quantité d'article total et le prix total ---------------------

// --------------- Quantité d'article ------------------

let totalProduct = [];
let add = 0;

for(let qty = 0; qty < cart.lenght; qty++ ) {
  let totalOfProduct = cart.quantity;
  totalProduct.psuch(totalOfProduct);
  add += totalOfProduct[i]
}

console.log(cart.quantity);

// ---------- Prix total ---------------

let prixTotal = [];

// récupération de tout les prix des produits dans le panier

for (let i = 0; i < cartWithProductData.length; i++) {
  let priceFromBasket = cartWithProductData.price;
  prixTotal.push(priceFromBasket);  
}

// Somme des prix

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const totalAmount = prixTotal.reduce(reducer);

// affichage du prix Total

const displayPriceTotal = document.querySelector("#totalPrice").innerHTML= `${totalAmount}`;
*/
