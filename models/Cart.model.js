import cartItemSchema from './CartItem.model';

const cartModel = {
  items: [],         // An array to store cart items
  total: 0,          // Total price of all items in the cart
  addItem(item) {
    // Add an item to the cart
    this.items.push({ ...cartItemSchema, ...item });
    this.calculateTotal();
  },
  removeItem(itemId) {
    // Remove an item from the cart based on its ID
    this.items = this.items.filter(item => item.id !== itemId);
    this.calculateTotal();
  },
  updateQuantity(itemId, newQuantity) {
    // Update the quantity of an item in the cart
    const item = this.items.find(item => item.id === itemId);
    if (item) {
      item.quantity = newQuantity;
      this.calculateTotal();
    }
  },
  calculateTotal() {
    // Calculate the total price of all items in the cart
    this.total = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
};

export default cartModel;
