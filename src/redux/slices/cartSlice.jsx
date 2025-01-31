// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    cartCount: 0,
    subTotal: 0,
    totalGST: 0,
    totalBPPoints: 0,
    total: 0,
    isCartSidebarVisible: false,
    coupon: null,
    shippingPincode: {
        state: "Delhi",
        city: "West Delhi",
        pincode: "110015",
    },
    couponValue: '',
    afterCouponSubtotal: 0,
    couponMsg: '',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;

            // Check if item is in stock
            if (newItem.stock <= 0) {
                return;
            }

            const itemIndex = state.cartItems.findIndex(
                item => item.id === newItem.id && 
                JSON.stringify(item.selectedAttributes) === JSON.stringify(newItem.selectedAttributes)
            );

            if (itemIndex !== -1) {
                // Check stock before updating quantity
                if (state.cartItems[itemIndex].qnt + newItem.qnt <= newItem.stock) {
                    // Update existing item
                    state.cartItems[itemIndex].qnt += newItem.qnt;
                    state.cartItems[itemIndex].gst_amount = parseFloat(
                        (state.cartItems[itemIndex].selling_price * state.cartItems[itemIndex].qnt * 
                        (state.cartItems[itemIndex].gst_percentage / 100)).toFixed(2)
                    );
                    state.cartItems[itemIndex].total_price = parseFloat(
                        (state.cartItems[itemIndex].selling_price * state.cartItems[itemIndex].qnt + 
                        state.cartItems[itemIndex].gst_amount).toFixed(2)
                    );
                }
            } else {
                // Add new item
                state.cartItems.push(newItem);
            }

            // Update cart totals
            updateCartTotals(state);
            state.isCartSidebarVisible = true;
        },

        updateQuantity: (state, action) => {
            const { itemID, selectedAttributes, change } = action.payload;
            const item = state.cartItems.find(item =>
                item.id === itemID && 
                JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            );

            if (item) {
                const newQty = item.qnt + change;
                // Check if new quantity is within valid range (1 to stock limit)
                if (newQty >= 1 && newQty <= item.stock) {
                    item.qnt = newQty;
                    item.gst_amount = parseFloat(
                        (item.selling_price * newQty * (item.gst_percentage / 100)).toFixed(2)
                    );
                    item.total_price = parseFloat(
                        (item.selling_price * newQty + item.gst_amount).toFixed(2)
                    );
                    updateCartTotals(state);
                }
            }
        },

        removeItemFromCart: (state, action) => {
            const { itemID, selectedAttributes } = action.payload;
            state.cartItems = state.cartItems.filter(item =>
                item.id !== itemID || 
                JSON.stringify(item.selectedAttributes) !== JSON.stringify(selectedAttributes)
            );
            updateCartTotals(state);
        },

        showCartSidebar: (state) => {
            state.isCartSidebarVisible = true;
        },

        hideCartSidebar: (state) => {
            state.isCartSidebarVisible = false;
        },

        clearCart: (state) => {
            state.cartItems = [];
            updateCartTotals(state);
        },

        applyCoupon: (state, action) => {
            state.coupon = action.payload;
            if (action.payload) {
                // Apply coupon logic here
                // You'll need to implement the specific coupon calculation logic
                state.couponMsg = 'Coupon applied successfully';
                // Calculate afterCouponSubtotal based on coupon type and value
            }
        },

        clearCoupon: (state) => {
            state.coupon = null;
            state.couponValue = '';
            state.afterCouponSubtotal = 0;
            state.couponMsg = '';
        },
    },
});

// Helper function to update cart totals
function updateCartTotals(state) {
    state.cartCount = state.cartItems.reduce((sum, item) => sum + item.qnt, 0);
    state.subTotal = parseFloat(
        state.cartItems.reduce((sum, item) => sum + (item.selling_price * item.qnt), 0).toFixed(2)
    );
    state.totalGST = parseFloat(
        state.cartItems.reduce((sum, item) => sum + item.gst_amount, 0).toFixed(2)
    );
    state.totalBPPoints = state.cartItems.reduce((sum, item) => sum + (item.bp_value * item.qnt), 0);
    state.total = parseFloat((state.subTotal + state.totalGST).toFixed(2));

    // If there's a coupon, recalculate the after-coupon subtotal
    if (state.coupon) {
        // Implement coupon calculation logic here
    }
}

export const {
    addItemToCart,
    updateQuantity,
    removeItemFromCart,
    showCartSidebar,
    hideCartSidebar,
    clearCart,
    applyCoupon,
    clearCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;