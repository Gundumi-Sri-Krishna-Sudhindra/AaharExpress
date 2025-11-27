import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { theme } from '@/styles/theme';

const CartContainer = styled.div`
  padding: ${theme.spacing.xl} 0;

  .cart-header {
    text-align: center;
    margin-bottom: ${theme.spacing.xl};
  }

  .cart-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.lg};
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: 1fr;
    }
  }

  .cart-items {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
  }

  .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto;
    gap: ${theme.spacing.md};
    align-items: center;
    padding: ${theme.spacing.md};
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.sm};

    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: ${theme.borderRadius.sm};
    }

    .item-details {
      h3 {
        margin-bottom: ${theme.spacing.xs};
      }

      p {
        color: ${theme.colors.text.secondary};
        margin-bottom: ${theme.spacing.sm};
      }
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: ${theme.spacing.sm};

      button {
        width: 30px;
        height: 30px;
        border-radius: ${theme.borderRadius.full};
        border: 1px solid ${theme.colors.text.secondary};
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${theme.typography.fontSize.lg};
      }

      span {
        min-width: 30px;
        text-align: center;
      }
    }
  }

  .cart-summary {
    position: sticky;
    top: ${theme.spacing.xl};
    height: fit-content;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.sm};
  }

  .total {
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    margin-top: ${theme.spacing.md};
    padding-top: ${theme.spacing.md};
    border-top: 1px solid ${theme.colors.text.secondary};
  }
`;

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <CartContainer>
        <div className="cart-header">
          <h1>Your Cart</h1>
          <p>Your cart is empty</p>
          <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
        </div>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <div className="cart-header">
        <h1>Your Cart</h1>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span>${item.price.toFixed(2)}</span>
              </div>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <Card className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="summary-item total">
            <span>Total</span>
            <span>${(total + 2.99).toFixed(2)}</span>
          </div>
          <Button fullWidth onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </Card>
      </div>
    </CartContainer>
  );
};

export default Cart; 