import { NavigationContainer } from '@react-navigation/native'; // Importa o container de navegação principal
import React from 'react';
import { StatusBar } from 'react-native'; // Importa o componente de barra de status do dispositivo
import { ThemeProvider } from 'styled-components'; // Importa o provider para tema do styled-components
import AppRoutes from './src/routes'; // Importa as rotas da aplicação
import theme from './src/styles/theme'; // Importa o tema de estilos

// Componente principal da aplicação
export default function App() {
  return (
    // Provider para disponibilizar o tema em toda a aplicação
    <ThemeProvider theme={theme}>
      {/* Container de navegação que gerencia as rotas */}
      <NavigationContainer>
        {/* Configuração da barra de status do dispositivo */}
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
        />
        {/* Componente que define as rotas da aplicação */}
        <AppRoutes />
      </NavigationContainer>
    </ThemeProvider>