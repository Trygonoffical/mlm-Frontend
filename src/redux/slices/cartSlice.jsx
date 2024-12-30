// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  cartCount: 0,
  subTotal: 0,
  tax: 0,
  isCartSidebarVisible: false,
  coupon: {},
  shppingPincode: {
    "state": "Delhi",
    "city": "West Delhi",
    "pincode": "110015",
  },
  couponValue: '',
  afterCouponSubtotal: 0,
  couponMsg: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.cartCount = action.payload.length;
      const subTotal = action.payload.reduce((acc, item) => acc + item.price, 0);
      state.subTotal = parseFloat(subTotal.toFixed(2));
      const tax = subTotal * 0.18;
      state.tax = parseFloat(tax.toFixed(2));
    },
    showCartSidebar: (state) => {
      state.isCartSidebarVisible = true;
    },
    hideCartSidebar: (state) => {
      // console.log('hide clicked!')
      state.isCartSidebarVisible = false;
    },
    addItemToCart: (state, action) => {
      console.log('addItemToCart Slice - ', action.payload);
      const newItem = action.payload;
      const itemIndex = state.cartItems.findIndex(
        item => item.id === newItem.id && JSON.stringify(item.selectedAttributes) === JSON.stringify(newItem.selectedAttributes)
      );

      if (itemIndex !== -1) {
        state.cartItems[itemIndex].qnt += newItem.qnt;
        state.cartItems[itemIndex].price += newItem.price;
      } else {
        state.cartItems.push(newItem);
        // state.cartCount +=  state.cartCount ;
      }
      state.cartCount += newItem.qnt;
      state.isCartSidebarVisible = true;

      // Update subTotal
      state.subTotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
      state.subTotal = parseFloat(state.subTotal.toFixed(2));
      state.tax = parseFloat((state.subTotal * 0.18).toFixed(2));


    },
    updateShippingPincode: (state, action) => {
      state.shppingPincode = action.payload;
    },
    removeItemFromCart: (state, action) => {
      const { itemID, itemAttributes } = action.payload;
      // console.log('removie item data -', action);
      // state.cartItems = state.cartItems.filter(item =>
      //   item.id !== itemID || JSON.stringify(item.itemAttributes) !== JSON.stringify(itemAttributes)
      // );
      const itemToRemove = state.cartItems.find(item =>
        item.id === itemID && JSON.stringify(item.itemAttributes) === JSON.stringify(itemAttributes)
      );
      if (itemToRemove) {
        state.cartCount -= itemToRemove.qnt;
      }
    
      state.cartItems = state.cartItems.filter(item =>
        item.id !== itemID || JSON.stringify(item.itemAttributes) !== JSON.stringify(itemAttributes)
      );

      // Update subTotal
      state.subTotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
      state.subTotal = parseFloat(state.subTotal.toFixed(2));
      state.tax = parseFloat((state.subTotal * 0.18).toFixed(2));


    },
    emptyCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.subTotal = 0;
      state.tax = 0;
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload;
    },
    setCouponValue: (state, action) => {
      state.couponValue = action.payload;
    },
    setAfterCouponSubtotal: (state, action) => {
      state.afterCouponSubtotal = action.payload;
    },
    setCouponMsg: (state, action) => {
      state.couponMsg = action.payload;
    },
    clearCoupon: (state) => {
      state.coupon = {};
      state.couponValue = '';
      state.afterCouponSubtotal = 0;
      state.couponMsg = '';
    },
    increaseQuantity: (state, action) => {
      const { itemID, selectedAttributes } = action.payload;
      const item = state.cartItems.find(item =>
        item.id === itemID && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
      );
      if (item) {
        item.qnt += 1;
        item.price += item.price; // Assuming you have unitPrice stored in item
        state.cartCount += 1;
        state.subTotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
        state.subTotal = parseFloat(state.subTotal.toFixed(2));
        state.tax = parseFloat((state.subTotal * 0.18).toFixed(2));
      }
    },
    decreaseQuantity: (state, action) => {
      const { itemID, selectedAttributes } = action.payload;
      const item = state.cartItems.find(item =>
        item.id === itemID && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
      );
      if (item && item.qnt > 1) {
        item.qnt -= 1;
        item.price -= item.price; // Assuming you have unitPrice stored in item
        state.cartCount -= 1;
        state.subTotal = state.cartItems.reduce((acc, item) => acc + item.price, 0);
        state.subTotal = parseFloat(state.subTotal.toFixed(2));
        state.tax = parseFloat((state.subTotal * 0.18).toFixed(2));
      }
    },
  },
});

export const { setCartItems, showCartSidebar, hideCartSidebar, addItemToCart, removeItemFromCart, emptyCart , setCoupon ,setCouponValue, setAfterCouponSubtotal, setCouponMsg ,clearCoupon , increaseQuantity, decreaseQuantity ,updateShippingPincode } = cartSlice.actions;
export default cartSlice.reducer;
