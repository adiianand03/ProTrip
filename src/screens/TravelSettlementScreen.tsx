import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    FlatList,
} from 'react-native';
import MainLayout from '../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { TicketContext } from '../context/TicketContext';

import HeaderDoc from '../assets/images/header_doc.svg';
import HeaderLink from '../assets/images/header_link.svg';
import HeaderPlane from '../assets/images/header_plane.svg';
import ClipboardBadge from '../assets/images/clipboard_badge.svg';
import CompanyPay from '../assets/images/company_pay.svg';
import StatusCheck from '../assets/images/status_check.svg';
import StepperCheck from '../assets/images/stepper_check.svg';
import StepperUser from '../assets/images/stepper_user.svg';

import EmptyImg from '../assets/images/travel.svg';
import SearchIcon from '../assets/images/search.svg';
import ArrowBack from '../assets/images/arrow_back.svg';

type TravelSettlementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const StepperCircle = () => (
    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#ddd' }} />
);

// Mock Approval Data
const APPROVAL_STEPS = [
    { label: 'SUBMITTED', user: 'You', status: 'done' },
    { label: 'TRAVEL TEAM', user: 'travel_team_approver', status: 'current' },
    { label: 'RM APPROVAL 1', user: 'Hemanathan K', status: 'pending' },
    { label: 'FINANCE APPROVAL 1', user: 'sriramaswamy/sureshbabu', status: 'pending' },
    { label: 'EXPENSE SETTLEMENT', user: '', status: 'pending' },
];

const TravelSettlement = () => {
    const navigation = useNavigation<TravelSettlementScreenNavigationProp>();
    const { settlements } = useContext(TicketContext);

    const renderApprovalChain = () => {
        const currentIndex = APPROVAL_STEPS.findIndex(step => step.status === 'current');
        return (
            <View style={styles.approvalChain}>
                {APPROVAL_STEPS.map((step, index) => (
                    <React.Fragment key={index}>
                        <View style={styles.stepContainer}>
                            <View style={[styles.stepIconContainer, { borderColor: step.status === 'done' ? '#7cb518' : step.status === 'current' ? '#007bff' : '#e0e0e0' }]}>
                                {step.status === 'done' ? (
                                    <StepperCheck width={24} height={24} />
                                ) : step.status === 'current' ? (
                                    <StepperUser width={24} height={24} />
                                ) : (
                                    <StepperCircle />
                                )}
                            </View>
                            <Text style={styles.stepLabel}>{step.label}</Text>
                            {(index === 0 || index === APPROVAL_STEPS.length - 1) && step.user ? (
                                <Text style={styles.stepUser}>{step.user}</Text>
                            ) : null}
                        </View>
                        {index < APPROVAL_STEPS.length - 1 && (
                            <View style={[styles.verticalConnector, { backgroundColor: index < currentIndex ? '#7cb518' : '#e0e0e0' }]} />
                        )}
                    </React.Fragment>
                ))}
            </View>
        );
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#6b6b6b" />

                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowBack width={24} height={24} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Travel Settlement</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* ACTION CARD */}
                <View style={styles.card}>
                    {/* Top Row: Search full width */}
                    <View style={styles.searchRow}>
                        <View style={styles.searchBoxExpanded}>
                            <SearchIcon width={20} height={20} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search Here"
                                placeholderTextColor="#777"
                                style={styles.searchInput}
                            />
                        </View>
                    </View>

                    {/* Bottom Row: Count (left) + Plus Button (right) */}
                    <View style={styles.bottomRow}>
                        <View style={styles.countBox}>
                            <Text style={styles.countText}>Total count - {settlements.length}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.plusBtn}
                            onPress={() => navigation.navigate('TravelSettlementReport')}
                        >
                            <Text style={styles.plusIconText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LIST OR EMPTY STATE */}
                {settlements.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <EmptyImg width="100%" height={300} style={styles.image} />
                        <Text style={styles.emptyText}>
                            Give that expense request a kickstart and{"\n"}
                            let's get you on the move!
                        </Text>
                    </View>
                ) : (
                    <View style={{ flex: 1, paddingHorizontal: 16 }}>
                        <FlatList
                            data={settlements}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <View style={styles.ticketCard}>
                                    {/* Header Strip */}
                                    <View style={styles.ticketHeader}>
                                        <View style={styles.headerIdRow}>
                                            <HeaderDoc width={16} height={16} style={{ marginRight: 6 }} />
                                            <Text style={styles.headerIdText}>{item.id}</Text>
                                        </View>
                                        <HeaderLink width={16} height={16} style={{ marginHorizontal: 10 }} />
                                        <View style={styles.headerIdRow}>
                                            <HeaderPlane width={16} height={16} style={{ marginRight: 6 }} />
                                            <Text style={styles.headerIdText}>{item.ticketId}</Text>
                                        </View>
                                    </View>

                                    {/* Ticket Body */}
                                    <View style={styles.ticketBody}>
                                        {/* Info Row: Date | Name | Icon */}
                                        <View style={styles.infoRow}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.infoDate}>Travel Date: <Text style={styles.boldText}>{item.submissionDate || '25 Jan 2026'}</Text></Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.infoName}>Expense Name: <Text style={styles.boldText}>{item.expenseName}</Text></Text>
                                            </View>
                                            <View>
                                                <ClipboardBadge width={32} height={32} />
                                            </View>
                                        </View>

                                        {/* Status Cards Row */}
                                        <View style={styles.statusRow}>
                                            {/* Company to Pay */}
                                            <View style={styles.statusBox}>
                                                <CompanyPay width={40} height={40} />
                                                <View style={{ marginLeft: 10 }}>
                                                    <Text style={styles.statusLabel}>Company to Pay</Text>
                                                    <Text style={styles.statusAmount}>INR {item.totalAmount.toFixed(2)}</Text>
                                                </View>
                                            </View>

                                            {/* Approved */}
                                            <View style={styles.statusBox}>
                                                <StatusCheck width={40} height={40} />
                                                <View style={{ marginLeft: 10 }}>
                                                    <Text style={styles.statusLabel}>Approved</Text>
                                                    <Text style={styles.statusAmount}>INR {item.totalAmount.toFixed(2)}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Approval Chain */}
                                        {renderApprovalChain()}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
        </MainLayout>
    );
};

export default TravelSettlement;

const styles = StyleSheet.create({
    /* SCREEN */
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    /* HEADER (New) */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },

    /* BACK */
    backRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    backText: {
        fontSize: 14,
        color: '#222',
    },

    /* ACTION CARD (Search + Total) */
    card: {
        marginHorizontal: 16,
        marginTop: 16,
        padding: 24,
        backgroundColor: '#ffffff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        marginBottom: 20,
    },

    /* Search Row */
    searchRow: {
        marginBottom: 20,
    },

    searchBoxExpanded: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        backgroundColor: '#f9f9f9',
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        fontSize: 16,
        flex: 1,
        padding: 0,
        color: '#333',
    },

    /* Bottom Row: Count + Plus Btn */
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    countBox: {
        flex: 1,
        backgroundColor: '#ffd37d',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 8,
        height: 50,
        marginRight: 12,
    },

    countText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },

    plusBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#71B006',
        justifyContent: 'center',
        alignItems: 'center',
    },

    plusIconText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 30,
    },

    /* EMPTY STATE */
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    image: {
        marginBottom: 12,
    },

    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },

    /* TICKET CARD (New Design) */
    ticketCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    ticketHeader: {
        backgroundColor: '#555',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
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
    ticketBody: {
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    infoDate: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    infoName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    boldText: {
        color: '#222',
        fontWeight: '600',
        fontSize: 14,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statusBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    statusLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 2,
    },
    statusAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },

    /* STEPS / APPROVAL CHAIN */
    approvalChain: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
        paddingHorizontal: 0,
    },
    stepContainer: {
        alignItems: 'center',
        marginVertical: 2,
    },
    verticalConnector: {
        width: 2,
        height: 20,
        backgroundColor: '#e0e0e0',
        marginVertical: 2,
    },
    stepIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        marginBottom: 4,
    },
    stepLabel: {
        fontSize: 10,
        color: '#888',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 2,
    },
    stepUser: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
});
