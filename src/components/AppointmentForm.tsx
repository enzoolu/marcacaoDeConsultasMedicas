// Importações de bibliotecas e tipos necessários para o componente
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import styled from 'styled-components/native';
import theme from '../styles/theme';
import { Doctor } from '../types/doctors';

// Lista fixa de médicos disponíveis para seleção
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

// Tipagem das props do formulário de agendamento
type AppointmentFormProps = {
    onSubmit: (appointment: {
        doctorId: string;
        date: Date;
        time: string;
        description: string;
    }) => void;
};

// Função utilitária para gerar os horários disponíveis (de 9h às 18h, de 30 em 30 minutos)
const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
};

// Componente principal do formulário de agendamento
const AppointmentForm: React.FC<AppointmentFormProps> = ({ onSubmit }) => {
    // Estados para armazenar os valores dos campos do formulário
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [dateInput, setDateInput] = useState('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [description, setDescription] = useState('');
    const timeSlots = generateTimeSlots();

    // Função para validar se a data inserida está no formato correto e dentro do período permitido
    const validateDate = (inputDate: string) => {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = inputDate.match(dateRegex);

        if (!match) return false;

        const [, day, month, year] = match;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        const maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

        return date >= today && date <= maxDate;
    };

    // Função para formatar a data enquanto o usuário digita
    const handleDateChange = (text: string) => {
        const numbers = text.replace(/\D/g, '');

        let formattedDate = '';
        if (numbers.length > 0) {
            if (numbers.length <= 2) {
                formattedDate = numbers;
            } else if (numbers.length <= 4) {
                formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
            } else {
                formattedDate = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
            }
        }

        setDateInput(formattedDate);
    };

    // Função chamada ao submeter o formulário, faz validações e chama o onSubmit
    const handleSubmit = () => {
        if (!selectedDoctor || !selectedTime || !description) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        if (!validateDate(dateInput)) {
            alert('Por favor, insira uma data válida (DD/MM/AAAA)');
            return;
        }

        const [day, month, year] = dateInput.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        onSubmit({
            doctorId: selectedDoctor,
            date,
            time: selectedTime,
            description,
        });
    };

    // Função para verificar se o horário está disponível (pode ser expandida futuramente)
    const isTimeSlotAvailable = (time: string) => {
        return true;
    };

    // Renderização do formulário
    return (
        <Container>
            {/* Seção de seleção do médico */}
            <Title>Selecione o Médico</Title>
            <DoctorList>
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        selected={selectedDoctor === doctor.id}
                        onPress={() => setSelectedDoctor(doctor.id)}
                    >
                        <DoctorImage source={{ uri: doctor.image }} />
                        <DoctorInfo>
                            <DoctorName>{doctor.name}</DoctorName>
                            <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
                        </DoctorInfo>
                    </DoctorCard>
                ))}
            </DoctorList>

            {/* Seção de data e hora */}
            <Title>Data e Hora</Title>
            <Input
                placeholder="Data (DD/MM/AAAA)"
                value={dateInput}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
                containerStyle={InputContainer}
                errorMessage={dateInput && !validateDate(dateInput) ? 'Data inválida' : undefined}
            />

            {/* Grade de horários disponíveis */}
            <TimeSlotsContainer>
                <TimeSlotsTitle>Horários Disponíveis:</TimeSlotsTitle>
                <TimeSlotsGrid>
                    {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(time);
                        return (
                            <TimeSlotButton
                                key={time}
                                selected={selectedTime === time}
                                disabled={!isAvailable}
                                onPress={() => isAvailable && setSelectedTime(time)}
                            >
                                <TimeSlotText selected={selectedTime === time} disabled={!isAvailable}>
                                    {time}
                                </TimeSlotText>
                            </TimeSlotButton>
                        );
                    })}
                </TimeSlotsGrid>
            </TimeSlotsContainer>

            {/* Campo para descrição da consulta */}
            <Input
                placeholder="Descrição da consulta"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                containerStyle={InputContainer}
            />

            {/* Botão para submeter o formulário */}
            <SubmitButton
                title="Agendar Consulta"
                onPress={handleSubmit}
                buttonStyle={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 8,
                    padding: 12,
                    marginTop: 20,
                }}
            />
        </Container>
    );
};

// Estilização dos componentes usando styled-components
const Container = styled.View`
  padding: ${theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.medium}px;
`;

const DoctorList = styled.ScrollView`
  margin-bottom: ${theme.spacing.large}px;
`;

const DoctorCard = styled(TouchableOpacity) <{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.medium}px;
  background-color: ${(props: { selected: boolean }) => props.selected ? theme.colors.primary : theme.colors.white};
  border-radius: 8px;
  margin-bottom: ${theme.spacing.medium}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  shadow-offset: 0px 2px;
`;

const DoctorImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${theme.spacing.medium}px;
`;

const DoctorInfo = styled.View`
  flex: 1;
`;

const DoctorName = styled.Text`
  font-size: ${theme.typography.subtitle.fontSize}px;
  font-weight: ${theme.typography.subtitle.fontWeight};
  color: ${theme.colors.text};
`;

const DoctorSpecialty = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  opacity: 0.8;
`;

const TimeSlotsContainer = styled.View`
  margin-bottom: ${theme.spacing.large}px;
`;

const TimeSlotsTitle = styled.Text`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.small}px;
`;

const TimeSlotsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.spacing.small}px;
`;

const TimeSlotButton = styled(TouchableOpacity) <{ selected: boolean; disabled: boolean }>`
  background-color: ${(props: { selected: boolean; disabled: boolean }) =>
        props.disabled
            ? theme.colors.background
            : props.selected
                ? theme.colors.primary
                : theme.colors.white};
  padding: ${theme.spacing.small}px ${theme.spacing.medium}px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props: { selected: boolean; disabled: boolean }) =>
        props.disabled
            ? theme.colors.background
            : props.selected
                ? theme.colors.primary
                : theme.colors.text};
  opacity: ${(props: { disabled: boolean }) => props.disabled ? 0.5 : 1};
`;

const TimeSlotText = styled(Text) <{ selected: boolean; disabled: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${(props: { selected: boolean; disabled: boolean }) =>
        props.disabled
            ? theme.colors.text
            : props.selected
                ? theme.colors.white
                : theme.colors.text};
`;

// Estilo para os campos de input
const InputContainer = {
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.medium,
};

// Estilo para o botão de submit
const SubmitButton = styled(Button)`
  margin-top: ${theme.spacing.large}px;
`;

// Exporta o componente para uso em outros arquivos
export default AppointmentForm;