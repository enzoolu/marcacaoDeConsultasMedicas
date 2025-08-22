import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para armazenamento local
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importa tipagem para navegação stack
import React from 'react';
import styled from 'styled-components/native'; // Importa styled-components para estilização
import AppointmentForm from '../components/AppointmentForm'; // Importa o formulário de agendamento
import { HeaderContainer, HeaderTitle } from '../components/Header'; // Importa componentes do cabeçalho
import theme from '../styles/theme'; // Importa o tema de estilos
import { RootStackParamList } from '../types/navigation'; // Importa tipagem das rotas

// Tipagem das props da tela, incluindo navegação
type CreateAppointmentScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CreateAppointment'>;
};

// Componente principal da tela de criação de consulta
const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({ navigation }) => {
    // Função chamada ao submeter o formulário de agendamento
    const handleSubmit = async (appointment: {
        doctorId: string;
        date: Date;
        time: string;
        description: string;
    }) => {
        try {
            // Recuperar consultas existentes do AsyncStorage
            const existingAppointments = await AsyncStorage.getItem('appointments');
            const appointments = existingAppointments ? JSON.parse(existingAppointments) : [];

            // Adicionar nova consulta ao array
            const newAppointment = {
                id: Date.now().toString(),
                ...appointment,
                status: 'pending',
            };

            appointments.push(newAppointment);

            // Salvar o array atualizado no AsyncStorage
            await AsyncStorage.setItem('appointments', JSON.stringify(appointments));

            // Navegar de volta para a tela inicial após salvar
            navigation.navigate('Home');
        } catch (error) {
            // Em caso de erro, exibe mensagem e loga no console
            console.error('Erro ao salvar consulta:', error);
            alert('Erro ao salvar a consulta. Tente novamente.');
        }
    };

    // Renderização da tela, incluindo cabeçalho e formulário
    return (
        <Container>
            <HeaderContainer>
                <HeaderTitle>Agendar Consulta</HeaderTitle>
            </HeaderContainer>

            <Content>
                <AppointmentForm onSubmit={handleSubmit} />
            </Content>
        </Container>
    );
};

// Estilização do container principal da tela
const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

// Estilização do conteúdo principal (scrollável)
const Content = styled.ScrollView`
  flex: 1;
`;

export default CreateAppointmentScreen; // Exporta o componente para uso nas rotas