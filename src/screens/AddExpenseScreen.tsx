import React, { useContext, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import ArrowBack from '../assets/images/arrow_back.svg';
import TrashIcon from '../assets/images/trash.svg';
import UploadIcon from '../assets/images/upload_dark.svg';
import ChevronDownIcon from '../assets/images/chevron_down.svg';

import HeaderDoc from '../assets/images/header_doc.svg';
import HeaderLink from '../assets/images/header_link.svg';
import HeaderPlane from '../assets/images/header_plane.svg';

import { TicketContext } from '../context/TicketContext';

type AddExpenseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type AddExpenseRouteProp = RouteProp<RootStackParamList, 'AddExpense'>;

const AddExpenseScreen = () => {
    const navigation = useNavigation<AddExpenseScreenNavigationProp>();
    const route = useRoute<AddExpenseRouteProp>();
    const { tickets, addSettlement } = useContext(TicketContext);

    const { eriId, expenseName, ticketId } = route.params;

    // Find the original travel request to show details
    const relatedTicket = tickets.find(t => t.id === ticketId);

    // Options
    const EXPENSE_TYPES = ['Meals', 'Travel', 'Hotel', 'Office Supplies', 'Other'];
    const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

    // Dropdown State
    const [openDropdown, setOpenDropdown] = useState<{ rowId: string, field: 'type' | 'currency' } | null>(null);

    // Expenses State
    const [expenses, setExpenses] = useState([
        { id: Date.now().toString(), type: '', merchant: '', date: '', currency: 'INR', amount: '' }
    ]);

    // Handlers
    const addExpenseRow = () => {
        setExpenses([
            ...expenses,
            { id: Date.now().toString(), type: '', merchant: '', date: '', currency: 'INR', amount: '' }
        ]);
        setOpenDropdown(null);
    };

    // Helper to toggle dropdown
    const toggleDropdown = (rowId: string, field: 'type' | 'currency') => {
        if (openDropdown?.rowId === rowId && openDropdown?.field === field) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown({ rowId, field });
        }
    };

    const removeExpenseRow = (id: string) => {
        if (expenses.length > 1) {
            setExpenses(expenses.filter(e => e.id !== id));
        } else {
            Alert.alert("Cannot delete", "At least one expense is required.");
        }
    };

    const updateExpense = (id: string, field: string, value: string) => {
        setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
        setOpenDropdown(null);
    };

    const handleSave = () => {
        Alert.alert("Saved", "Progress saved locally.");
    };

    const handleSubmit = () => {
        // Validate
        const invalid = expenses.some(e => !e.type || !e.merchant || !e.date || !e.amount);
        if (invalid) {
            Alert.alert("Missing Details", "Please fill all fields for all expenses.");
            return;
        }

        // Calculate Total
        const total = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        // Create Settlement Object
        const newSettlement = {
            id: eriId,
            ticketId,
            expenseName,
            expenses,
            status: 'Submitted',
            totalAmount: total,
            submissionDate: new Date().toISOString().split('T')[0]
        };

        addSettlement(newSettlement);
        Alert.alert("Success", "Expense Report Created Successfully");
        navigation.navigate('TravelSettlement'); // Navigate back to the settlement list
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Nav Header */}
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowBack width={24} height={24} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Expense Entry</Text>
                <View style={{ width: 60 }} />
            </View>

            {/* DARK HEADER STRIP */}
            <View style={styles.headerStrip}>
                <View style={styles.headerIdRow}>
                    <HeaderDoc width={16} height={16} style={{ marginRight: 6 }} />
                    <Text style={styles.headerIdText}>{eriId}</Text>
                </View>
                <HeaderLink width={16} height={16} style={{ marginHorizontal: 10 }} />
                <View style={styles.headerIdRow}>
                    <HeaderPlane width={16} height={16} style={{ marginRight: 6 }} />
                    <Text style={styles.headerIdText}>{ticketId}</Text>
                </View>
            </View>

            <TouchableOpacity
                activeOpacity={1}
                style={styles.contentContainer}
                onPress={() => setOpenDropdown(null)}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Expense Name:</Text>
                            <Text style={styles.infoValue}>{expenseName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Travel Date:</Text>
                            <Text style={styles.infoValue}>{relatedTicket?.date || 'N/A'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Purpose:</Text>
                            <Text style={styles.infoValue}>{relatedTicket?.purpose || 'N/A'}</Text>
                        </View>
                    </View>

                    {/* TITLE */}
                    <Text style={styles.sectionHeader}>Expenses Borne By Employee</Text>

                    {/* VERTICAL CARDS LIST */}
                    {expenses.map((item, index) => (
                        <View key={item.id} style={[styles.expenseCard, { zIndex: expenses.length - index }]}>
                            {/* Card Header: Index and Delete */}
                            <View style={styles.cardHeader}>
                                <View style={styles.indexBadge}>
                                    <Text style={styles.indexText}>{index + 1}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeExpenseRow(item.id)}>
                                    <TrashIcon width={20} height={20} />
                                </TouchableOpacity>
                            </View>

                            {/* Row 1: Upload Receipt (First) */}
                            <View style={{ marginBottom: 16 }}>
                                <TouchableOpacity style={styles.uploadBtnRow}>
                                    <UploadIcon width={20} height={20} style={{ marginRight: 8 }} />
                                    <Text style={styles.uploadText}>Attach Receipt</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Row 2: Type (Full Width) */}
                            <View style={[styles.inputGroup, { marginBottom: 16, zIndex: 10 }]}>
                                <Text style={styles.label}>Expense Type</Text>
                                <TouchableOpacity
                                    style={styles.dropdownTrigger}
                                    onPress={(e) => { e.stopPropagation(); toggleDropdown(item.id, 'type'); }}
                                >
                                    <Text style={{ color: item.type ? '#222' : '#999' }}>
                                        {item.type || 'Select Type'}
                                    </Text>
                                    <ChevronDownIcon width={14} height={14} />
                                </TouchableOpacity>
                                {openDropdown?.rowId === item.id && openDropdown?.field === 'type' && (
                                    <View style={styles.dropdownList}>
                                        {EXPENSE_TYPES.map(type => (
                                            <TouchableOpacity
                                                key={type}
                                                style={styles.dropdownItem}
                                                onPress={(e) => { e.stopPropagation(); updateExpense(item.id, 'type', type); }}
                                            >
                                                <Text style={styles.dropdownItemText}>{type}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Row 3: Merchant & Date */}
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Merchant</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Name"
                                        value={item.merchant}
                                        onChangeText={(t) => updateExpense(item.id, 'merchant', t)}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Date</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="YYYY-MM-DD"
                                        value={item.date}
                                        onChangeText={(t) => updateExpense(item.id, 'date', t)}
                                    />
                                </View>
                            </View>

                            {/* Row 4: Currency & Amount */}
                            <View style={[styles.row, { zIndex: 5 }]}>
                                <View style={[styles.inputGroup, { flex: 1, zIndex: 5 }]}>
                                    <Text style={styles.label}>Currency</Text>
                                    <TouchableOpacity
                                        style={styles.dropdownTrigger}
                                        onPress={(e) => { e.stopPropagation(); toggleDropdown(item.id, 'currency'); }}
                                    >
                                        <Text style={{ color: '#222' }}>{item.currency}</Text>
                                        <ChevronDownIcon width={14} height={14} />
                                    </TouchableOpacity>
                                    {openDropdown?.rowId === item.id && openDropdown?.field === 'currency' && (
                                        <View style={styles.dropdownList}>
                                            {CURRENCIES.map(curr => (
                                                <TouchableOpacity
                                                    key={curr}
                                                    style={styles.dropdownItem}
                                                    onPress={(e) => { e.stopPropagation(); updateExpense(item.id, 'currency', curr); }}
                                                >
                                                    <Text style={styles.dropdownItemText}>{curr}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Amount</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={item.amount}
                                        onChangeText={(t) => updateExpense(item.id, 'amount', t)}
                                    />
                                </View>
                            </View>

                        </View>
                    ))}

                    <View style={{ height: 20 }} />

                    {/* Action Row: Save and Add Expense - Below the cards */}
                    <View style={styles.localActionRow}>
                        <TouchableOpacity style={styles.localSaveBtn} onPress={handleSave}>
                            <Text style={styles.localSaveText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.localAddBtn} onPress={addExpenseRow}>
                            <Text style={styles.localAddText}>+ Add Expense</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                    <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        height: 56,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        elevation: 2,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 8,
        color: '#222',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    /* DARK HEADER STRIP */
    headerStrip: {
        backgroundColor: '#444',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIdRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIdText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fcfcfc',
    },
    /* INFO SECTION */
    infoSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    infoLabel: {
        width: 100,
        color: '#666',
        fontSize: 14,
    },
    infoValue: {
        flex: 1,
        color: '#222',
        fontWeight: '600',
        fontSize: 14,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 16,
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
    /* CARD STYLES */
    expenseCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        borderLeftWidth: 5,
        borderLeftColor: '#7cc000'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    indexBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indexText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    inputGroup: {
        // base style
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        height: 44,
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#222',
        backgroundColor: '#fafafa',
    },
    dropdownTrigger: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        height: 44,
        paddingHorizontal: 12,
        fontSize: 14,
        backgroundColor: '#fafafa',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownList: {
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        elevation: 5,
        zIndex: 100,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },
    uploadBtnRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        backgroundColor: '#fafafa',
        width: '100%'
    },
    uploadText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500'
    },
    /* LOCAL ACTION ROW (Save / Add) */
    localActionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 16,
        marginBottom: 30,
        marginTop: 10
    },
    localSaveBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#7cc000',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    localSaveText: {
        color: '#7cc000',
        fontWeight: 'bold',
        fontSize: 14,
    },
    localAddBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: '#acc938',
        alignItems: 'center'
    },
    localAddText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    /* FOOTER */
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    cancelBtnText: {
        color: '#555',
        fontSize: 16,
    },
    submitBtn: {
        backgroundColor: '#7cc000',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 4,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default AddExpenseScreen;
