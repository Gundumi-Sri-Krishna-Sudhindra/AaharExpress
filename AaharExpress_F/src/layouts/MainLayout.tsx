import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { theme } from '@/styles/theme';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: ${theme.spacing.xl} 0;
  background-color: ${theme.colors.surface};
`;

const MainLayout: React.FC = () => {
  return (
    <LayoutContainer>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout; 