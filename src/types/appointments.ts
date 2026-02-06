// Define o tipo Appointment, representando uma consulta médica agendada
export type Appointment = {
    id: string;
    doctorId: string;
    date: string;
    time: string;
    description: string;
    status: string;
};