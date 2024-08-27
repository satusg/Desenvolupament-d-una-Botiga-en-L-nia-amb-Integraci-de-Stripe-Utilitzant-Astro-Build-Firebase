/**
 * Function used to calculate the total price (in cents) of the products (from the cart)
 * @param {Object} products The array of products
 * @returns {Number} The total price in cents
 */
export const getTotal = (products) => {
  if(products === undefined) return 0;
  const productsArray = Object.values(products);
  if(!productsArray.length) return 0;
  const productsPrices = productsArray.map(product => {
    return Math.round(product.price * product.quantity * 100);
  }); 
  // Calculate the total price in cents
  const totalCents = productsPrices.reduce((sum, price) => {
    return sum + price;
  }, 0);

  return totalCents;
};
