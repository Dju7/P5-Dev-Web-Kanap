//Récupération donnée du LocalStorage
const getBasketStorage = JSON.parse(localStorage.getItem("cart"));
console.log(getBasketStorage);

//Récupération DIV panier
const sectionCartItem = document.querySelector("#cart__items");

function createCart(){
if (getBasketStorage === null){
    sectionCartItem.innerHTML = `<p> Il n'y a aucun produit dans le panier </p>`;
} else {
    console.log("jusque là tout va bien");
    //Boucle pour récupérer produit ajouter dans le panier et stockés dans getBasketStorage
    getBasketStorage.forEach(productWanted => {

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
    cartItemImg.src = productWanted.image;
    cartItemImg.alt = productWanted.alt;
    divCartItemImage.appendChild(cartItemImg);

   //création balise div détails produit
   const divCartItemContent = document.createElement("div");
   divCartItemContent.className = "cart__item__content";
   cartItemArticle.appendChild(divCartItemContent);

   const cartItemDescription = document.createElement("div");
   cartItemDescription.className = "cart__item__content__description";
   divCartItemContent.appendChild(cartItemDescription);

   const productName = document.createElement("h2");
   productName.innerText = productWanted.nom;
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
}
createCart()

// fonction supprimer produit

function deleteProduct() {
    const btnDelete = document.querySelector("deleteItem");
    btnDelete.addEventListener("clik", () => {
        

    })


}



// Fonction modifier la quantité du produit

function modifQuantity () {

    
}
