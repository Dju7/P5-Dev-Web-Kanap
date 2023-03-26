//Stockage de la valeur de l'ID produit
const urlId = new URLSearchParams (window.location.search).get("id");
//Condition si UrlSearchParams ne renvoie aucune ID - Retour à la page D'accueil
if (!urlId) {
    window.location.href = "./index.html";
} else {
//Récupération du produit dans l'API
fetch(`http://localhost:3000/api/products/${urlId}`)
.then(response => response.json())
.then(data => {
 const productGet = data;
 // Affichage image produit selectionné
 const sectionItemImg = document.querySelector(".item__img");
 const imgElementProd = document.createElement("img");
 imgElementProd.src = productGet.imageUrl;
 imgElementProd.alt = productGet.altTxt;
 sectionItemImg.appendChild(imgElementProd);
 // affichage nom, prix, description
 document.querySelector("#title").textContent= productGet.name;
 document.querySelector("#price").textContent= productGet.price;
 document.querySelector("#description").textContent= productGet.description;

// Choix des couleurs
const selectColors = document.querySelector("#colors");
productGet.colors.forEach(color => {
    selectColors.innerHTML += `<option value="${color}">${color}</option>`;
});

// Bouton Ajout Panier
const btnBasket = document.querySelector("#addToCart");
btnBasket.addEventListener("click", () => {
    const addProduct = {
        quantity: document.querySelector("#quantity").value,
        color: document.querySelector("#colors").value,
        id: urlId    
    };
    console.log(addProduct);

    /* ------------------------------------------------------------------------------------------------------------------------------------

    Pourquoi pas ajouter ici une fonction qui contrôlerait que l'utilisateur à bien choisit une couleur et une quantité et qui l'informerait, 
    dans le cas contraire, du produit qu'il vient d'ajouter au panier ?

    -------------------------------------------------------------------------------------------------------------------------------------- */
  

let cart = localStorage.getItem('cart');

if (cart === null) {
    cart =  [];
} else  {
    cart = JSON.parse(cart);
}

const productExist = cart.find(item => item.quantity === addProduct.quantity && item.color === addProduct.color);
if (productExist) {
    const index = cart.indexOf(productExist);
    cart[index].quantity += addProduct.quantity;
} else {
    cart.push(addProduct)
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

});

}) 
.catch(error =>console.error(error));
}
