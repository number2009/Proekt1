"use strict";

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM полностью загружен и разобран");
  const basket = [];
  let basketItem = [];
  let sizeList = document.querySelectorAll(".size-list");
  let buy = document.querySelector(".product-button");

  for (let item of sizeList) {
    item.addEventListener("click", function (event) {
      let product = event.target.id;
      if (basketItem.productId != event.target.id) {
        basketItem.push(event.target.id);
      }
      //console.log(basketItem);
    });
  }

  buy.addEventListener("click", function () {
    basket.push(basketItem);
    console.log(basket);
    basketItem = []
  });
  console.log(basket);
  const slider = document.querySelectorAll(".hit-list-img");
  let activeSlide = slider.findIndex;
});
