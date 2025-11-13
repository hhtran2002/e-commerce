import React from "react";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, shipping, onCheckout }) => {
  return (
    <div className="cart-summary">
      <h3>Cart Totals</h3>
      <div className="summary-item">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-item">
        <span>Shipping:</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="summary-item total">
        <span>Total:</span>
        <span>${(subtotal + shipping).toFixed(2)}</span>
      </div>
      <button className="checkout-btn" onClick={onCheckout}>PROCEED TO CHECKOUT</button>
    </div>
  );
};

export default CartSummary;