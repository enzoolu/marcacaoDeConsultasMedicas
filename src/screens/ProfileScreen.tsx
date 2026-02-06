import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importa tipagem para navegação stack
import React from 'react';
import { Button } from 'react-native-elements'; // Importa componente de botão estilizado
import styled from 'styled-components/native'; // Importa styled-components para estilização
import { HeaderContainer, HeaderTitle } from '../components/Header'; // Importa componentes do cabeçalho
import theme from '../styles/theme'; // Importa tema de estilos

// Tipagem das rotas disponíveis na navegação
type RootStackParamList = {
    Home: undefined;
    CreateAppointment: undefined;
    Profile: undefined;
};

// Tipagem das props da tela, incluindo navegação
type ProfileScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

// Componente principal da tela de perfil do usuário
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
    return (
        <Container>
            {/* Cabeçalho da tela */}
            <HeaderContainer>
                <HeaderTitle>Meu Perfil</HeaderTitle>
            </HeaderContainer>

            {/* Conteúdo principal da tela */}
            <Content>
                {/* Botão para voltar à tela anterior */}
                <Button
                    title="Voltar"
                    icon={{
                        name: 'arrow-left',
                        type: 'font-awesome',
                        size: 20,
                        color: 'white'
                    }}
                    buttonStyle={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 20
                    }}
                    onPress={() => navigation.goBack()}
                />

                {/* Informações do perfil do usuário */}
                <ProfileInfo>
                    <Avatar source={{ uri: 'https://via.placeholder.com/150' }} />
                    <Name>Nome do Usuário</Name>
                    <Email>usuario@email.com</Email>
                </ProfileInfo>
            </Content>
        </Container>
    );
};

// Estilização do container principal da tela
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Estilização do conteúdo principal da tela
const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.medium}px;
`;

// Estilização do container das informações do perfil
const ProfileInfo = styled.View`
  align-items: center;
  margin-top: ${theme.spacing.large}px;
`;

// Estilização do avatar do usuário
const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: ${theme.spacing.medium}px;
`;

// Estilização do nome do usuário
const Name = styled.Text`
  font-size: ${theme.typography.title.fontSize}px;
  font-weight: ${theme.typography.title.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

// Estilização do e-mail do usuário
const Email = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

export default ProfileScreen; // Exporta o componente para