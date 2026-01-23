import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Platform,
    Alert,
    FlatList,
    Modal,
    ActivityIndicator,
} from 'react-native';
import MainLayout from '../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { TicketContext } from '../context/TicketContext';
import { useAuth } from '../context/AuthContext';
import { fetchTravelIds } from '../services/DashboardService';

const bgImg = require('../assets/images/travelbginsidecards.png');

declare const window: any;

type TravelSettlementReportNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TravelSettlementReport = () => {
    const navigation = useNavigation<TravelSettlementReportNavigationProp>();
    const { tickets } = useContext(TicketContext);
    const { userEmail } = useAuth();

    // My Settlements State
    const [travelIds, setTravelIds] = useState<string[]>([]);
    const [isSettlementsModalVisible, setIsSettlementsModalVisible] = useState(false);
    const [isLoadingSettlements, setIsLoadingSettlements] = useState(false);

    const handleMySettlementsPress = async () => {
        if (!userEmail) return;
        setIsLoadingSettlements(true);
        setIsSettlementsModalVisible(true);
        try {
            const ids = await fetchTravelIds(userEmail);
            setTravelIds(ids);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch settlements');
            setIsSettlementsModalVisible(false);
        } finally {
            setIsLoadingSettlements(false);
        }
    };

    const [open, setOpen] = useState(false);

    // Form State
    const [expenseName, setExpenseName] = useState('');
    const [selectedTicketId, setSelectedTicketId] = useState('');

    const handleSubmit = () => {
        if (!expenseName || !selectedTicketId) {
            Alert.alert("Missing Details", "Please enter an expense name and select a travel request.");
            return;
        }

        // Generate ERI ID
        const eriId = `ERI / 27 / ${Math.floor(Math.random() * 10000)} `;

        navigation.navigate('AddExpense', {
            eriId,
            expenseName,
            ticketId: selectedTicketId
        });
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
                        <Text style={{ fontSize: 24, color: '#616161' }}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Travel Settlement</Text>
                    <TouchableOpacity onPress={handleMySettlementsPress}>
                        <Text style={{ color: '#74c657', fontWeight: 'bold' }}>My Settlements</Text>
                    </TouchableOpacity>
                </View>
                {/* CARD */}
                <View style={styles.card}>
                    <Text style={styles.heading}>
                        Create Travel Settlement Report
                    </Text>

                    {/* Expense Name */}
                    <Text style={styles.label}>
                        Expense Name <Text style={styles.star}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="Expense name"
                        style={styles.input}
                        value={expenseName}
                        onChangeText={setExpenseName}
                    />

                    {/* Travel Request Number */}
                    <Text style={styles.label}>
                        Travel Request Number <Text style={styles.star}>*</Text>
                    </Text>

                    {/* DROPDOWN */}
                    <View style={styles.dropdownWrapper}>
                        <TouchableOpacity
                            style={styles.dropdown}
                            activeOpacity={0.8}
                            onPress={() => setOpen(!open)}
                        >
                            <Text style={[styles.dropdownText, !selectedTicketId && { color: '#BDBDBD' }]}>
                                {selectedTicketId || 'Select Travel Request Number'}
                            </Text>
                            <Text style={styles.arrow}>{open ? '▲' : '▼'}</Text>
                        </TouchableOpacity>

                        {open && (
                            <View style={styles.dropdownPopup}>
                                {tickets.length === 0 ? (
                                    <Text style={styles.noOption}>No available options</Text>
                                ) : (
                                    <FlatList
                                        data={tickets}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setSelectedTicketId(item.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownItemText}>{item.id} ({item.to})</Text>
                                            </TouchableOpacity>
                                        )}
                                        style={{ maxHeight: 150 }}
                                    />
                                )}
                            </View>
                        )}
                    </View>

                    {/* BUTTONS */}
                    <View style={styles.btnRow}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* My Settlements Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isSettlementsModalVisible}
                onRequestClose={() => setIsSettlementsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>My Settlements</Text>
                            <TouchableOpacity onPress={() => setIsSettlementsModalVisible(false)}>
                                <Text style={styles.closeButton}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        {isLoadingSettlements ? (
                            <ActivityIndicator size="large" color="#74c657" style={{ marginTop: 20 }} />
                        ) : (
                            <FlatList
                                data={travelIds}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <View style={styles.ticketItem}>
                                        <Text style={styles.ticketText}>{item}</Text>
                                    </View>
                                )}
                                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No settlements found</Text>}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        </MainLayout >
    );
};

export default TravelSettlementReport;

const styles = StyleSheet.create({
    /* NAV BAR */
    navbar: {
        height: 56,
        backgroundColor: '#757575',
    },

    bg: {
        flex: 1,
        padding: 16,
    },

    backText: {
        fontSize: 16,
        marginBottom: 16,
    },

    /* CARD */
    card: {
        backgroundColor: '#F5F5F5',
        borderRadius: 14,
        padding: 20,
        elevation: 6,
    },

    heading: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        marginBottom: 6,
    },

    star: {
        color: 'red',
    },

    input: {
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 20,
        paddingVertical: 6,
    },

    /* DROPDOWN */
    dropdownWrapper: {
        position: 'relative',
        marginBottom: 8,
    },

    dropdown: {
        borderWidth: 1,
        borderColor: '#74c657',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },

    dropdownText: {
        color: '#757575',
        fontSize: 14,
    },

    arrow: {
        fontSize: 12,
        color: '#757575',
    },

    dropdownPopup: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,

        shadowColor: '#424242',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },

        elevation: 10,
        zIndex: 1000,
    },

    dropdownItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },

    dropdownItemText: {
        fontSize: 14,
        color: '#616161',
    },

    noOption: {
        fontSize: 14,
        color: '#757575',
    },

    /* BUTTONS */
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
    },

    cancelBtn: {
        borderWidth: 1,
        borderColor: '#74c657',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 6,
    },

    cancelText: {
        color: '#74c657',
        fontWeight: '500',
    },

    submitBtn: {
        backgroundColor: '#74c657',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 6,
    },

    submitText: {
        color: '#F5F5F5',
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F5F5F5',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#616161',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        color: '#74c657',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ticketItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    ticketText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});
