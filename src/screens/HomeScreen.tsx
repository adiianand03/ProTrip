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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardCard from '../components/DashboardCard';

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
        <SafeAreaView style={styles.container}>
            <View style={[StyleSheet.absoluteFill, { top: '10%' }]}>
                <MobileBg width="100%" height="100%" preserveAspectRatio="xMidYMin slice" />
            </View>
            <StatusBar barStyle="light-content" backgroundColor="#4A4A4A" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={handleHomePress}>
                        <Text style={styles.headerIcon}>🏠</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Expenses</Text>
                    <View style={styles.iconButton}>
                        {/* Visual only, not clickable */}
                        <UploadIcon width={34} height={34} preserveAspectRatio="xMidYMid meet" />
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={handleChatPress} style={styles.iconButton}>
                        <ChatQnaIcon width={30} height={30} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleProfilePress} style={styles.iconButton}>
                        <ProfileIcon width={30} height={30} />
                    </TouchableOpacity>
                </View>
            </View>

            {isProfileOpen && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleProfileOption('Settings')}>
                        <Text style={styles.dropdownText}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleProfileOption('Help')}>
                        <Text style={styles.dropdownText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem} onPress={() => handleProfileOption('LogOut')}>
                        <Text style={styles.dropdownText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Main Content */}
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Decorative background elements can be added here if needed, 
            but the design shows a clean background with some subtle clouds/lines.
            We will keep it clean white/grey for now or add a subtle background color.
        */}

                <DashboardCard
                    title="Travel Request"
                    Icon={TravelRequestIcon}
                    onPress={handleTravelRequestPress}
                />

                <DashboardCard
                    title="Travel Settlement"
                    Icon={ExpenseReportIcon}
                    onPress={handleExpenseReportPress}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5', // Removed for SVG background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4A4A4A', // Dark grey/black header
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'normal',
        marginLeft: 10,
        marginRight: 10,
    },
    headerIcon: {
        fontSize: 24,
        color: '#FFFFFF',
        marginLeft: 15,
    },
    headerIconSmall: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    uploadIconContainer: {
        backgroundColor: '#669900', // Green box for upload
        padding: 4,
        borderRadius: 4,
        marginLeft: 5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContent: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 15,
        padding: 5,
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        right: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
        width: 150,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownText: {
        fontSize: 16,
        color: '#333',
    },
});

export default HomeScreen;
