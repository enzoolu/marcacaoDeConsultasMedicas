import { StatusBar } from 'react-native'; // Importa o StatusBar para ajustar o padding superior conforme a altura da barra de status do dispositivo
import styled from 'styled-components/native'; // Importa styled-components para estilização dos componentes
import theme from '../styles/theme'; // Importa o tema de cores e espaçamentos

// Container do cabeçalho, define cor de fundo, padding, sombra e elevação
export const HeaderContainer = styled.View`
  background-color: ${theme.colors.primary}; // Cor de fundo do cabeçalho
  padding-top: ${StatusBar.currentHeight}px; // Padding superior igual à altura da barra de status
  padding: ${theme.spacing.medium}px; // Padding interno padrão
  elevation: 4; // Elevação para sombra no Android
  shadow-color: #000; // Cor da sombra
  shadow-opacity: 0.3; // Opacidade da sombra
  shadow-radius: 4px; // Raio da sombra
  shadow-offset: 0px 2px; // Deslocamento da sombra
`;

// Título do cabeçalho, define cor, tamanho e peso da fonte
export const HeaderTitle = styled.Text`
  color: ${theme.colors.white}; // Cor do texto
  font-size: ${theme.typography.title.fontSize}px; // Tamanho da fonte
  font-weight: ${theme.typography.title.fontWeight}; //