// Récupération du numéro de commande

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("id");
console.log(orderId);

if (!orderId || orderId === null) {
  alert(
    "Votre commande n'a pas été validé, vous allez être redirigé vers la page panier"
  );
  window.location.href = "./cart.html";
} else {
  document.querySelector("#orderId").textContent = orderId;
  localStorage.clear();
}
