import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { theme } from '@/styles/theme';

const MenuContainer = styled.div`
  padding: ${theme.spacing.xl} 0;

  .menu-header {
    text-align: center;
    margin-bottom: ${theme.spacing.xl};
  }

  .search-bar {
    max-width: 600px;
    margin: 0 auto ${theme.spacing.xl};
  }

  .categories {
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.xl};
    overflow-x: auto;
    padding: ${theme.spacing.sm} 0;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.primary};
      border-radius: ${theme.borderRadius.full};
    }
  }

  .category-button {
    white-space: nowrap;
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.surface};
    color: ${theme.colors.text.primary};
    border: none;
    cursor: pointer;
    transition: all ${theme.transitions.default};

    &.active {
      background: ${theme.colors.primary};
      color: ${theme.colors.text.light};
    }
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
    padding: 0 ${theme.spacing.lg};
  }
`;

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const categories = ['All', 'Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Drinks'];

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'Pizza',
    image: '/images/pizza-1.jpg',
  },
  {
    id: '2',
    name: 'Cheeseburger',
    description: 'Angus beef patty with cheese, lettuce, and special sauce',
    price: 9.99,
    category: 'Burger',
    image: '/images/burger-1.jpg',
  },
  // Add more menu items here
];

const Menu: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      description: item.description,
    }));
  };

  return (
    <MenuContainer>
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Discover our delicious offerings</p>
      </div>

      <div className="search-bar">
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </div>

      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map((item) => (
          <Card key={item.id} elevation="md">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.md }}>
              <span style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.bold }}>
                ${item.price.toFixed(2)}
              </span>
              <Button onClick={() => handleAddToCart(item)}>Add to Cart</Button>
            </div>
          </Card>
        ))}
      </div>
    </MenuContainer>
  );
};

export default Menu; 