import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';
import MenuIcon from '../assets/images/menu.svg';
import NotificationIcon from '../assets/images/notification.svg';
import FlightTicketIcon from '../assets/images/Flight_ticket_inheader.svg';

interface MainLayoutProps {
    children: React.ReactNode;
    showProfileInDrawer?: boolean; // Default false
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showProfileInDrawer = false }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#616161" />

            {/* Top Navigation Bar */}
            <View style={styles.navbar}>
                {/* Left: Hamburger */}
                <TouchableOpacity onPress={() => setIsDrawerOpen(true)} style={styles.iconButton}>
                    <MenuIcon width={24} height={24} color="#fff" />
                </TouchableOpacity>

                {/* Center: Branding */}
                <View style={styles.headerCenter}>
                    <FlightTicketIcon width={34} height={34} style={styles.headerIcon} />
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.headerTitleText}>Travel Request & Travel Settlement</Text>
                        <Text style={styles.headerSubtitleText}>Total Travel Management</Text>
                    </View>
                </View>

                {/* Right: Notification */}
                <TouchableOpacity style={styles.iconButton}>
                    <NotificationIcon width={24} height={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>

            {/* Custom Drawer Overlay */}
            <CustomDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                showProfileHeader={showProfileInDrawer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#616161', // Match navbar for safe area top
    },
    navbar: {
        height: 70,
        backgroundColor: '#74c657',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 1000,
    },
    iconButton: {
        padding: 5,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIcon: {
        marginRight: 8,
    },
    headerTitleText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 2,
    },
    headerSubtitleText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Content bg
        zIndex: 1,
    }
});

export default MainLayout;
