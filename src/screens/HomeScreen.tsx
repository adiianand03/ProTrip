import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
    Platform,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardCard from '../components/DashboardCard';
import MainLayout from '../components/MainLayout';

declare const window: any;

// SVG Imports
import TravelRequestIcon from '../assets/images/travel_request.svg';
import ExpenseReportIcon from '../assets/images/Expense.svg';
import MobileBg from '../assets/images/mobile-bg.svg';
import UploadIcon from '../assets/images/upload_folder.svg';
import ChatQnaIcon from '../assets/images/chat_qna.svg';
import ProfileIcon from '../assets/images/profile.svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { height: screenHeight } = Dimensions.get('window');

    const handleHomePress = () => {
        // Already on home, maybe scroll to top or no-op
        console.log('Home Pressed');
    };

    const handleUploadPress = () => {
        console.log('Upload Pressed');
    };

    const handleChatPress = () => {
        navigation.navigate('Dummy');
    };

    const handleProfilePress = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleProfileOption = (option: string) => {
        setIsProfileOpen(false);
        if (option === 'LogOut') {
            navigation.replace('Login');
        } else {
            navigation.navigate('Dummy');
        }
    };
    const handleTravelRequestPress = () => {
        navigation.navigate('TravelRequest');
    };

    const handleExpenseReportPress = () => {
        navigation.navigate('TravelSettlement');
    };

    return (
        <MainLayout showProfileInDrawer={true}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >


                {/* Dashboard Grid */}
                <View style={styles.gridContainer}>
                    <DashboardCard
                        title="Travel Request"
                        Icon={TravelRequestIcon}
                        onPress={() => navigation.navigate('CreateTicket')}
                    />
                    <DashboardCard
                        title="Travel Settlement"
                        Icon={ExpenseReportIcon}
                        onPress={() => navigation.navigate('TravelSettlement')}
                    />
                </View>

            </ScrollView>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    welcomeText: {
        fontSize: 14,
        color: '#666',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    gridContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllText: {
        fontSize: 14,
        color: '#71B006',
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f9eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    activityDate: {
        fontSize: 12,
        color: '#999',
    },
    activityStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#f39c12',
    },
});

export default HomeScreen;
