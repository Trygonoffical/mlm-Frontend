
// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: [],
    cartCount: 0,
    subTotal: 0,
    totalGST: 0,
    totalBPPoints: 0,
    total: 0,
    regular_price: 0,
    isCartSidebarVisible: false,
    coupon: null,
    shippingPincode: {
        state: "Delhi",
        city: "West Delhi",
        pincode: "110015",
    },
    shipping: {
        isFreeShipping: false,
        baseRate: 0,
        taxPercentage: 0,
        totalShippingCost: 0
    },
    couponValue: '',
    afterCouponSubtotal: 0,
    couponMsg: '',
    mlmDiscount: 0,
    discountedSubTotal: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const newItem = action.payload;
            const mlmDiscountPercentage = action.payload.mlmDiscountPercentage || 0;
            console.log('userInfo?.user_data?.position?.discount_percentage -', mlmDiscountPercentage)
            // Check if item is in stock
            if (newItem.stock <= 0) {
                return;
            }
            //Calculate standard price (selling price + GST)
            const standardPrice = calculateStandardPrice(newItem);
            const itemIndex = state.cartItems.findIndex(
                item => item.id === newItem.id && 
                JSON.stringify(item.selectedAttributes) === JSON.stringify(newItem.selectedAttributes)
            );
            if (itemIndex !== -1) {
                // Check stock before updating quantity
                if (state.cartItems[itemIndex].qnt + newItem.qnt <= newItem.stock) {
                    // Update existing item
                    state.cartItems[itemIndex].qnt += newItem.qnt;
                    
                    // Base calculations are done in the updateCartTotals function
                    // We're not calculating individual item properties here anymore
                    // Recalculate standard price for the updated quantity
                    state.cartItems[itemIndex].standard_price = calculateStandardPrice(
                        {...newItem, qnt: state.cartItems[itemIndex].qnt}
                    );
                }
            } else {
                // Add new item without standard price - we'll calculate it centrally
                state.cartItems.push({
                    ...newItem,
                    discount_amount: 0, // Will be calculated centrally
                    gst_amount: 0, // Will be calculated centrally
                    total_price: 0, // Will be calculated centrally
                    standard_price: standardPrice
                });
            }
            // Update cart totals, which will also update all individual item calculations
            updateCartTotals(state, mlmDiscountPercentage);
            state.isCartSidebarVisible = true;
        },
        updateShippingConfig: (state, action) => {
            const { isFreeShipping, baseRate, taxPercentage } = action.payload;
            
            state.shipping.isFreeShipping = isFreeShipping;
            state.shipping.baseRate = baseRate;
            state.shipping.taxPercentage = taxPercentage;
            
            // Calculate shipping cost based on configuration
            if (isFreeShipping) {
                state.shipping.totalShippingCost = 0;
            } else {
                const shippingTax = parseFloat((baseRate * (taxPercentage / 100)).toFixed(2));
                state.shipping.totalShippingCost = parseFloat((baseRate + shippingTax).toFixed(2));
            }
            
            // Update total cart amount with shipping
            updateCartTotals(state, state.cartItems[0]?.mlmDiscountPercentage || 0);
        },

        updateQuantity: (state, action) => {
            const { itemID, selectedAttributes, change, mlmDiscountPercentage } = action.payload;
            const item = state.cartItems.find(item =>
                item.id === itemID && 
                JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            );

            if (item) {
                const newQty = item.qnt + change;
                // Check if new quantity is within valid range (1 to stock limit)
                if (newQty >= 1 && newQty <= item.stock) {
                    item.qnt = newQty;
                    // Recalculate standard price for the updated quantity
                    item.standard_price = calculateStandardPrice({
                        ...item, 
                        qnt: newQty
                    });
                    // All other calculations will be done in updateCartTotals
                    updateCartTotals(state, mlmDiscountPercentage);
                }
            }
        },

        removeItemFromCart: (state, action) => {
            const { itemID, selectedAttributes, mlmDiscountPercentage } = action.payload;
            state.cartItems = state.cartItems.filter(item =>
                item.id !== itemID || 
                JSON.stringify(item.selectedAttributes) !== JSON.stringify(selectedAttributes)
            );
            updateCartTotals(state, mlmDiscountPercentage);
        },

        showCartSidebar: (state) => {
            state.isCartSidebarVisible = true;
        },

        hideCartSidebar: (state) => {
            state.isCartSidebarVisible = false;
        },

        clearCart: (state) => {
            state.cartItems = [];
            updateCartTotals(state, 0);
        },

        applyCoupon: (state, action) => {
            state.coupon = action.payload;
            const mlmDiscountPercentage = state.cartItems[0]?.mlmDiscountPercentage || 0;
            
            if (action.payload) {
                // Apply coupon logic here
                // You'll need to implement the specific coupon calculation logic
                state.couponMsg = 'Coupon applied successfully';
                // Calculate afterCouponSubtotal based on coupon type and value
            }
            
            // Recalculate totals after applying coupon
            updateCartTotals(state, mlmDiscountPercentage);
        },

        clearCoupon: (state) => {
            state.coupon = null;
            state.couponValue = '';
            state.afterCouponSubtotal = 0;
            state.couponMsg = '';
            
            // Get the current MLM discount percentage to recalculate
            const mlmDiscountPercentage = state.cartItems[0]?.mlmDiscountPercentage || 0;
            updateCartTotals(state, mlmDiscountPercentage);
        },

        updateCartPrices: (state, action) => {
            const { mlmDiscountPercentage } = action.payload;
            updateCartTotals(state, mlmDiscountPercentage);
        },
    },
});
// Helper function to calculate standard price (selling price + GST)
function calculateStandardPrice(item) {
    // Calculate standard price: selling price * quantity + GST for the entire quantity
    const basePrice = item.selling_price * item.qnt;
    const gstAmount = basePrice * (item.gst_percentage / 100);
    return parseFloat((basePrice + gstAmount).toFixed(2));
}
// Helper function to update cart totals and recalculate all item prices
function updateCartTotals(state, mlmDiscountPercentage = 0) {
    // Calculate cart count
    state.cartCount = state.cartItems.reduce((sum, item) => sum + item.qnt, 0);
    
    // Calculate original subtotal (before any discounts)
    state.subTotal = parseFloat(
        state.cartItems.reduce((sum, item) => sum + (item.selling_price * item.qnt), 0).toFixed(2)
    );

    
    
    // Calculate MLM discount if applicable
    if (mlmDiscountPercentage > 0) {
        state.mlmDiscount = parseFloat((state.subTotal * mlmDiscountPercentage / 100).toFixed(2));
        state.discountedSubTotal = parseFloat((state.subTotal - state.mlmDiscount).toFixed(2));
    } else {
        state.mlmDiscount = 0;
        state.discountedSubTotal = state.subTotal;
    }
    
    // Now update each item with its individual calculations
    state.cartItems = state.cartItems.map(item => {
        // Base calculations for each item
        const itemBasePrice = parseFloat((item.selling_price * item.qnt).toFixed(2));
        // Calculate base price for this item (price × quantity)
        const itemSubtotal = parseFloat((item.selling_price * item.qnt).toFixed(2));
        
        // Calculate discount for this item
        const itemDiscount = mlmDiscountPercentage > 0 
            ? parseFloat((itemSubtotal * mlmDiscountPercentage / 100).toFixed(2))
            : 0;
            
        // Calculate discounted subtotal for this item
        const itemDiscountedSubtotal = parseFloat((itemSubtotal - itemDiscount).toFixed(2));
        
        // Calculate GST on the discounted amount
        const itemGST = parseFloat((itemDiscountedSubtotal * (item.gst_percentage / 100)).toFixed(2));
        
        // Calculate total price for this item (discounted subtotal + GST)
        const itemTotalPrice = parseFloat((itemDiscountedSubtotal + itemGST).toFixed(2));
        
        // Store MLM discount percentage with the item so we can access it later
        return {
            ...item,
            mlmDiscountPercentage,
            discount_amount: itemDiscount,
            // discounted_price: parseFloat((item.selling_price - (item.selling_price * mlmDiscountPercentage / 100)).toFixed(2)),
            discounted_price: parseFloat((item.selling_price * (1 - mlmDiscountPercentage / 100)).toFixed(2)),
            gst_amount: itemGST,
            total_price: itemTotalPrice
        };
    });
    
    // Calculate total GST from updated items
    state.totalGST = parseFloat(
        state.cartItems.reduce((sum, item) => sum + item.gst_amount, 0).toFixed(2)
    );
    
    // Calculate total BP points
    state.totalBPPoints = state.cartItems.reduce((sum, item) => sum + (item.bp_value * item.qnt), 0);
    
    // Calculate final total (discounted subtotal + GST)
    // state.total = parseFloat((state.discountedSubTotal + state.totalGST).toFixed(2));

    // Calculate final total (discounted subtotal + GST + shipping)
    state.total = parseFloat((state.discountedSubTotal + state.totalGST + state.shipping.totalShippingCost).toFixed(2));
    
    // Handle coupon if present
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
    updateCartPrices,
    updateShippingConfig,
} = cartSlice.actions;

export default cartSlice.reducer;