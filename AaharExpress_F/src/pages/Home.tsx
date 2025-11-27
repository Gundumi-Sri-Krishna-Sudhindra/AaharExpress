import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '@/hooks/useAppSelector';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';

const HomeContainer = styled.div`
  .hero {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
      url('/images/hero-bg.jpg') center/cover;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${theme.colors.text.light};
    margin-bottom: ${theme.spacing['3xl']};
  }

  .hero-content {
    max-width: 800px;
    padding: ${theme.spacing.xl};
  }

  .hero h1 {
    font-size: ${theme.typography.fontSize['4xl']};
    margin-bottom: ${theme.spacing.lg};
  }

  .hero p {
    font-size: ${theme.typography.fontSize.xl};
    margin-bottom: ${theme.spacing.xl};
  }

  .section {
    padding: ${theme.spacing['2xl']} 0;
  }

  .section-title {
    text-align: center;
    margin-bottom: ${theme.spacing.xl};
  }

  .featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: ${theme.spacing.lg};
    padding: 0 ${theme.spacing.lg};
  }

  .special-offers {
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing['2xl']} 0;
  }
`;

const Home: React.FC = () => {
  const { darkMode } = useAppSelector((state) => state.ui);

  return (
    <HomeContainer>
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food Delivered To Your Doorstep</h1>
          <p>Experience the best food delivery service in town</p>
          <Button size="lg" onClick={() => window.location.href = '/menu'}>
            Order Now
          </Button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Featured Items</h2>
        <div className="featured-grid">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} elevation="md">
              <img src={`/images/food-${item}.jpg`} alt={`Featured item ${item}`} />
              <h3>Delicious Item {item}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <Button fullWidth>Add to Cart</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="special-offers">
        <div className="container">
          <h2 className="section-title">Special Offers</h2>
          <div className="featured-grid">
            {[1, 2].map((offer) => (
              <Card key={offer} elevation="md">
                <h3>Special Offer {offer}</h3>
                <p>Get 20% off on your first order!</p>
                <Button variant="secondary" fullWidth>
                  Claim Offer
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </HomeContainer>
  );
};

export default Home; 