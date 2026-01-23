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
    ActivityIndicator,
    Modal,
    FlatList,
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
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData, fetchUserEntity, DashboardData, EmployeeEntity } from '../services/DashboardService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps { }

const HomeScreen: React.FC<HomeScreenProps> = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { height: screenHeight } = Dimensions.get('window');

    const { userEmail } = useAuth();
    const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
    const [entityData, setEntityData] = React.useState<EmployeeEntity | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const loadDashboardData = async () => {
            if (userEmail) {
                setIsLoading(true);
                try {
                    const [dashData, entData] = await Promise.all([
                        fetchDashboardData(userEmail),
                        fetchUserEntity(userEmail)
                    ]);
                    setDashboardData(dashData);
                    setEntityData(entData);
                    console.log('Dashboard Data Fetched:', dashData);
                } catch (error) {
                    // console.error(error); handled in service
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadDashboardData();
    }, [userEmail]);

    const handleHomePress = () => {
        // Reload data on home press
        if (userEmail) {
            setIsLoading(true);
            Promise.all([
                fetchDashboardData(userEmail),
                fetchUserEntity(userEmail)
            ])
                .then(([dashData, entData]) => {
                    setDashboardData(dashData);
                    setEntityData(entData);
                })
                .finally(() => setIsLoading(false));
        }
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
                <View style={[styles.gridContainer, { marginBottom: 10 }]}>
                    {isLoading ? (
                        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#74c657" />
                            <Text style={{ marginTop: 10, color: '#9E9E9E' }}>Loading details...</Text>
                        </View>
                    ) : (
                        <>
                            <DashboardCard
                                title="Travel Request"
                                Icon={TravelRequestIcon}
                                onPress={() => navigation.navigate('CreateTicket')}
                                count={dashboardData?.travel_items?.length}
                            />
                            <DashboardCard
                                title="Travel Settlement"
                                Icon={ExpenseReportIcon}
                                onPress={() => navigation.navigate('TravelSettlementReport')}
                                count={dashboardData?.expense_items?.length}
                            />
                            {dashboardData?.user_role && (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <Text style={{ color: '#616161', fontStyle: 'italic' }}>
                                        Logged in as: {dashboardData.user_role}
                                    </Text>
                                    {entityData && (
                                        <Text style={{ color: '#9E9E9E', fontSize: 12, marginTop: 4 }}>
                                            {entityData.Entity} | {entityData.Currency}
                                        </Text>
                                    )}
                                </View>
                            )}
                        </>
                    )}
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
        color: '#9E9E9E',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#616161',
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
        color: '#616161',
    },
    viewAllText: {
        fontSize: 14,
        color: '#74c657',
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        marginBottom: 10,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#424242',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#b3e0a3',
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
        color: '#616161',
    },
    activityDate: {
        fontSize: 12,
        color: '#BDBDBD',
    },
    activityStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#f39c12',
    },
});

export default HomeScreen;
