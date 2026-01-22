import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { TicketContext } from '../context/TicketContext';
import ProfileIcon from '../assets/images/profile.svg';

// Icons
import TravelRequestIcon from '../assets/images/travel_request.svg';
import ExpenseIcon from '../assets/images/Expense.svg';
import HeadphoneIcon from '../assets/images/headphone.svg';
import HomeIcon from '../assets/images/header_plane.svg';

interface CustomDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    showProfileHeader: boolean;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({ isOpen, onClose, showProfileHeader }) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { userEmail } = useContext(TicketContext);
    const route = useRoute();
    const isHomeScreen = route.name === 'Home';
    const insets = useSafeAreaInsets();

    if (!isOpen) return null;

    const navigateTo = (screen: keyof RootStackParamList) => {
        onClose();
        navigation.navigate(screen as any);
    };

    const handleLogout = () => {
        onClose();
        // Reset navigation stack
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
            <View style={[styles.drawerContainer, { marginTop: insets.top, marginBottom: insets.bottom }]}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
                    {/* Profile Header - Conditional */}
                    {showProfileHeader && (
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <ProfileIcon width={50} height={50} />
                            </View>
                            <Text style={styles.userName}>Varun Adithya</Text>
                            <Text style={styles.userEmail}>{userEmail || 'varun.adithya@example.com'}</Text>
                        </View>
                    )}

                    {!showProfileHeader && <View style={{ height: 40 }} />}

                    {/* Menu Items */}
                    <View style={styles.menuContainer}>
                        {!isHomeScreen && (
                            <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
                                <HomeIcon width={24} height={24} style={styles.menuIcon} />
                                <Text style={styles.menuText}>Home</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('CreateTicket')}>
                            <TravelRequestIcon width={24} height={24} style={styles.menuIcon} />
                            <Text style={styles.menuText}>Travel Request</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('TravelSettlementReport')}>
                            <ExpenseIcon width={24} height={24} style={styles.menuIcon} />
                            <Text style={styles.menuText}>Travel Settlement</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('TravelRequest')}>
                            <Text style={[styles.menuText, { marginLeft: 36 }]}>My Tickets</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('TravelSettlement')}>
                            <Text style={[styles.menuText, { marginLeft: 36 }]}>My Expense Requests</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Help Center", "Coming Soon")}>
                            <HeadphoneIcon width={20} height={20} style={styles.menuIcon} />
                            <Text style={styles.menuText}>Help Center</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Footer - Logout */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        flexDirection: 'row',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawerContainer: {
        width: '75%',
        backgroundColor: '#F5F5F5',
        shadowColor: "#424242",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        display: 'flex',
        flexDirection: 'column'
    },
    scrollContent: {
        paddingBottom: 20,
    },
    profileHeader: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        marginBottom: 10,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        overflow: 'hidden'
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#616161',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#9E9E9E',
    },
    menuContainer: {
        paddingTop: 10,
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        fontSize: 16,
        color: '#616161',
        fontWeight: '500',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        padding: 20,
    },
    logoutBtn: {
        backgroundColor: '#74c657', // Updated to standard green
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    logoutText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default CustomDrawer;
