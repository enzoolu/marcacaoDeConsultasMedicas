import { FontAwesome } from '@expo/vector-icons'; // Importa ícones do FontAwesome
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para armazenamento local
import { useFocusEffect } from '@react-navigation/native'; // Importa hook para executar efeito ao focar na tela
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importa tipagem para navegação stack
import React, { useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native'; // Importa componentes nativos
import { Button, Icon } from 'react-native-elements'; // Importa componentes de UI
import styled from 'styled-components/native'; // Importa styled-components para estilização
import { HeaderContainer, HeaderTitle } from '../components/Header'; // Importa componentes do cabeçalho
import theme from '../styles/theme'; // Importa tema de estilos
import { Appointment } from '../types/appointments'; // Importa tipagem de consulta
import { Doctor } from '../types/doctors'; // Importa tipagem de médico
import { RootStackParamList } from '../types/navigation'; // Importa tipagem das rotas

// Tipagem das props da tela, incluindo navegação
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// Lista fixa de médicos disponíveis para exibir informações nas consultas
const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. João Silva',
    specialty: 'Cardiologista',
    image: 'https://mighty.tools/mockmind-api/content/human/91.jpg',
  },
  {
    id: '2',
    name: 'Dra. Maria Santos',
    specialty: 'Dermatologista',
    image: 'https://mighty.tools/mockmind-api/content/human/97.jpg',
  },
  {
    id: '3',
    name: 'Dr. Pedro Oliveira',
    specialty: 'Oftalmologista',
    image: 'https://mighty.tools/mockmind-api/content/human/79.jpg',
  },
];

// Componente principal da tela inicial
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Estados para armazenar as consultas e o estado de atualização
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar as consultas do AsyncStorage
  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  // Carrega as consultas toda vez que a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  // Função para atualizar a lista ao puxar para baixo
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  // Função para buscar informações do médico pelo id
  const getDoctorInfo = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  // Função para renderizar cada item da lista de consultas
  const renderAppointment = ({ item }: { item: Appointment }) => {
    const doctor = getDoctorInfo(item.doctorId);

    return (
      <AppointmentCard>
        <DoctorImage source={{ uri: doctor?.image || 'https://via.placeholder.com/100' }} />
        <InfoContainer>
          <DoctorName>{doctor?.name || 'Médico não encontrado'}</DoctorName>
          <DoctorSpecialty>{doctor?.specialty || 'Especialidade não encontrada'}</DoctorSpecialty>
          <DateTime>{new Date(item.date).toLocaleDateString()} - {item.time}</DateTime>
          <Description>{item.description}</Description>
          <Status status={item.status}>
            {item.status === 'pending' ? 'Pendente' : 'Confirmado'}
          </Status>
          <ActionButtons>
            <ActionButton>
              <Icon name="edit" type="material" size={20} color={theme.colors.primary} />
            </ActionButton>
            <ActionButton>
              <Icon name="delete" type="material" size={20} color={theme.colors.error} />
            </ActionButton>
          </ActionButtons>
        </InfoContainer>
      </AppointmentCard>
    );
  };

  // Renderização da tela, incluindo cabeçalho, botão e lista de consultas
  return (
    <Container>
      <HeaderContainer>
        <HeaderTitle>Minhas Consultas</HeaderTitle>
      </HeaderContainer>

      <Content>
        {/* Botão para agendar nova consulta */}
        <Button
          title="Agendar Nova Consulta"
          icon={
            <FontAwesome
              name="calendar-plus-o"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          }
          buttonStyle={{
            backgroundColor: theme.colors.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: theme.spacing.medium
          }}
          onPress={() => navigation.navigate('CreateAppointment')}
        />

        {/* Lista de consultas agendadas */}
        <AppointmentList
          data={appointments}
          keyExtractor={(item: Appointment) => item.id}
          renderItem={renderAppointment}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyText>Nenhuma consulta agendada</EmptyText>
          }
        />
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

// Estilização da lista de consultas
const AppointmentList = styled(FlatList)`
  flex: 1;
`;

// Estilização do cartão de cada consulta
const AppointmentCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 8px;
  padding: ${theme.spacing.medium}px;
  margin-bottom: ${theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

// Estilização da imagem do médico
const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

// Estilização do container das informações da consulta
const InfoContainer = styled.View`
  flex: 1;
`;

// Estilização do nome do médico
const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

// Estilização da especialidade do médico
const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-bottom: 4px;
`;

// Estilização da data e hora da consulta
const DateTime = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.primary};
  margin-top: 4px;
`;

// Estilização da descrição da consulta
const Description = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
  margin-top: 4px;
`;

// Estilização do status da consulta
const Status = styled.Text<{ status: string }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { status: string }) => props.status === 'pending' ? theme.colors.error : theme.colors.success};
  margin-top: 4px;
  font-weight: bold;
`;

// Estilização do container dos botões de ação
const ActionButtons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${theme.spacing.small}px;
`;

// Estilização dos botões de ação (editar/excluir)
const ActionButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.small}px;
  margin-left: ${theme.spacing.small}px;
`;

// Estilização do texto exibido quando não há consultas
const EmptyText = styled.Text`
  text-align: center;
  color: ${theme.colors.text};
  opacity: 0.6;
  margin-top: ${theme.spacing.large}px;
`;

export default HomeScreen; // Exporta o componente para uso nas rotas