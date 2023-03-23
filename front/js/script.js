 // Récupération des données depuis l'API
 fetch('http://localhost:3000/api/products')
 // Retourner sous forme Json
 .then(response => response.json())
 // stockage des données dans la variable products
 .then(data => {
   const products = data;
 // déclaration de la section items qui recevra les articles
   const sectionItems = document.querySelector('.items');

   for (let i = 0; i < products.length; i++) {
     const canap = products[i];
     // création lien sur chaque produit afficher
     const linkElement = document.createElement("a");
     // créer un objet avec urlSearchParam avec l'ID du produit comme paramètre de recherche
     linkElement.href = `./product.html?id=${canap._id}`;
      //Création balise <article> qui affichera les produits
     const productElement = document.createElement("article");
     // création des balises affichant l'image, le nom et la description des produits
     const imageElement = document.createElement("img");
     imageElement.src = canap.imageUrl;
     imageElement.alt = canap.altTxt;
     const nameElement = document.createElement("h3");
     nameElement.innerText = canap.name;
     const descriptionElement = document.createElement("p");
     descriptionElement.innerText = canap.description;

     // Ajout des éléments à l'élément parent
     sectionItems.appendChild(linkElement);
     linkElement.appendChild(productElement);
     productElement.appendChild(imageElement);
     productElement.appendChild(nameElement);
     productElement.appendChild(descriptionElement);
   }
 })
 .catch(error => console.error(error));