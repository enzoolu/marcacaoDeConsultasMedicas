import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Importa o criador de stack navigator para navegação entre telas
import CreateAppointmentScreen from '../screens/CreateAppointmentScreen'; // Importa a tela de criação de consulta
import HomeScreen from '../screens/HomeScreen'; // Importa a tela inicial
import ProfileScreen from '../screens/ProfileScreen'; // Importa a tela de perfil

const Stack = createNativeStackNavigator(); // Cria uma instância do stack navigator

// Função principal que define as rotas da aplicação
export default function AppRoutes() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false, // Esconde o cabeçalho padrão das telas
                animation: 'slide_from_right', // Define a animação de transição entre telas
            }}
        >
            {/* Define a tela inicial */}
            <Stack.Screen name="Home" component={HomeScreen} />
            {/* Define a tela de criação de consulta */}
            <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
            {/* Define a tela de perfil */}
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>