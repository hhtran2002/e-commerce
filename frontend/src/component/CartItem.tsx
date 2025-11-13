import React from "react";

interface CartItemProps {
  product: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, onUpdateQuantity, onRemove }) => {
  return (
    <tr className="cart-item">
      <td className="product-info">
        <button className="remove-btn" onClick={() => onRemove(product.id)}>×</button>
        <img src={product.image} alt={product.name} className="product-img" />
        <span>{product.name}</span>
      </td>
      <td>${product.price.toFixed(2)}</td>
      <td>
        <button onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}>-</button>
        <span>{product.quantity}</span>
        <button onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}>+</button>
      </td>
      <td>${(product.price * product.quantity).toFixed(2)}</td>
    </tr>
  );
};

export default CartItem;