// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
// cart
let cart = [];

//buttons
let buttonsDOM = [];

// getting the product
class Products {
  async getProducts() {
    try {
      let result = await (await fetch("products.json")).json();
      let products = result.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });

      return products;
    } catch (err) {
      console.log(err);
    }
  }
}

// display product
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
        <article class="product">
            <div class="img-container">
                <img class="product-img" src=${product.image}>
                <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>${product.price}</h4>
        </article>
      `;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "IN CART";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "IN CART";
        event.target.disabled = true;

        // get product from products
        // let cardItem = Storage.getProducts(id);
        let cartItem = { ...Storage.getProducts(id), amount: 1 }; // we convert Storage.getProducts(id) into an object and added 1 more property (key) named amount and set the value 1

        // add product to the cart
        cart = [...cart, cartItem];

        // save cart in local storge
        Storage.saveCart(cart);
        // set cart values
        // display cart item
        // show the cart
      });
    });
  }
}

// local storage
class Storage {
  static saveProduct(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProduct(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
