const urlId = new URLSearchParams (window.location.search).get("id");

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
const buttonBasket = document.querySelector("#addToCart");
buttonBasket.addEventListener("click", () => {
    const addProduct = {
        quantity: document.querySelector("#quantity"),
        color: document.querySelector("#colors"),
        id: urlId
    };
});

})
.catch(error =>console.error(error));
