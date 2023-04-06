// Récupération du numéro de commande dans l'URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('id');
console.log(orderId)

if (!orderId || orderId === null) {
  alert('Votre commande n\'a pas été validé, vous allez être redirigé vers la page précédente', console.log(orderId));
  window.location.href = "./cart.html"
} else {
 document.querySelector('#orderId').textContent = orderId;
 localStorage.clear()
  }
