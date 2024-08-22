/**
 * Function used to calculate the total price (in cents) of the products (from the cart)
 * @param {Array} products The array of products
 * @returns {Number} The total price in cents
 */
export const getTotal = (products) => {
  if (!products || products.length < 1) return 0;

  // Calculate the total price in cents directly
  const totalCents = products.reduce((sum, product) => {
    return sum + Math.round(product.price * product.quantity * 100);
  }, 0);

  return totalCents;
};
