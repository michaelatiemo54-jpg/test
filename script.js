let cart = 0;

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function addToCart() {
  cart++;
  document.getElementById("cartCount").innerText = `Cart: ${cart} items`;
}
