
// ---------------------------- RECUPERATION ID PRODUIT -----------------------------------------------------

function getParamFromUrl(){
const urlId = new URLSearchParams (window.location.search).get("id");
return urlId
}
// Stockage de la valeur de l'ID produit
const urlId = getParamFromUrl();

// --------------------------- CREATION ELEMENTS D'AFFICHAGE  --------------------------------------------------

function displayProduct(product) {

// Affichage image produit selectionné
 const sectionItemImg = document.querySelector(".item__img");
 const imgElementProd = document.createElement("img");
 imgElementProd.src = product.imageUrl;
 imgElementProd.alt = product.altTxt;
 sectionItemImg.appendChild(imgElementProd);
 // affichage nom, prix, description
 document.querySelector("#title").textContent= product.name;
 document.querySelector("#price").textContent= product.price;
 document.querySelector("#description").textContent= product.description;

// Choix des couleurs
const selectColors = document.querySelector("#colors");
product.colors.forEach(color => {
  const option = document.createElement("option");
  option.value = color;
  option.textContent = color;
  selectColors.appendChild(option);
});
}

// -----------------------  RENVOIE DE LA REQUETE FETCH + RETOUR A LA PAGE D'ACCUEIL SI PAS ID -----------------------

function getProductById() {
  
  fetch(`http://localhost:3000/api/products/${urlId}`)
    .then(response => response.json())
    .then(product => { 
       displayProduct(product)
    })
    .catch(error => console.error(error));
  }

// Retour à la page D'accueil

if (!urlId) {
    window.location.href = "./index.html";
} else {
  getProductById()

// ------------------ VERIFICATION CHOIX DE LA QUANTITE ET DE LA COULEUR ------------------------------------

function validateSelection() {
    const selectQuantity = document.querySelector("#quantity").value;
    const selectColor = document.querySelector("#colors").value;
  
    if (isNaN(selectQuantity) || selectQuantity < 1 || !Number.isInteger(parseInt(selectQuantity))) {
      alert("Vous devez entrer une quantité numérique pour ajouter un produit au panier!");
      return;
    }
  
    if (selectColor === "") {
      alert("Vous devez sélectionner une couleur pour ajouter un produit au panier!");
      return;
    }
   return true;
  }

// -------------------------------- AJOUT AU PANIER  -----------------------------------

function addProductToCart(){
const btnBasket = document.querySelector("#addToCart");
btnBasket.addEventListener("click", () => {
    if (validateSelection()){
    const addProduct = {
        quantity: parseInt(document.querySelector("#quantity").value),
        color: document.querySelector("#colors").value,
        id: urlId,
    };
  console.log(addProduct);
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
const productExist = cart.find(item => item.id === addProduct.id && item.color === addProduct.color);
if (productExist) {
    const index = cart.indexOf(productExist);
    cart[index].quantity += addProduct.quantity;
} else {
    cart.push(addProduct);
}
localStorage.setItem("cart", JSON.stringify(cart));  
  }
});
}
addProductToCart()
}
