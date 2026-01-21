import React, { useContext } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    FlatList,
} from 'react-native';
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
        return (
            <View style={styles.chainContainer}>
                {/* Line Background */}
                <View style={styles.chainLine} />
                <View style={styles.chainSteps}>
                    {APPROVAL_STEPS.map((step, index) => (
                        <View key={index} style={styles.stepWrapper}>
                            <Text style={styles.stepLabel}>{step.label}</Text>
                            <View style={styles.stepIconContainer}>
                                {step.status === 'done' ? (
                                    <StepperCheck width={24} height={24} />
                                ) : step.status === 'current' ? (
                                    <StepperUser width={24} height={24} />
                                ) : (
                                    <StepperCircle />
                                )}
                            </View>
                            <Text style={styles.stepUser}>{step.user}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6b6b6b" />

            {/* TOP NAV BAR */}
            <View style={styles.navbar}>
                <Text style={styles.navTitle}></Text>
                <Text style={styles.navSubtitle}></Text>
            </View>

            {/* BACK */}
            <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
                <ArrowBack width={24} height={24} style={{ marginRight: 8 }} />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

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
        </SafeAreaView>
    );
};



export default TravelSettlement;

const styles = StyleSheet.create({
    /* SCREEN */
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    /* NAV BAR */
    navbar: {
        backgroundColor: '#6b6b6b',
        paddingVertical: 10,
        alignItems: 'center',
    },

    navTitle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },

    navSubtitle: {
        color: '#eaeaea',
        fontSize: 11,
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
        padding: 36,
        backgroundColor: '#ffffff',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginBottom: 20, // Add space before list
    },

    /* Search Row */
    searchRow: {
        marginBottom: 20,
    },

    searchBoxExpanded: {
        width: '100%',
        height: 54,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        fontSize: 16,
        flex: 1,
        padding: 0,
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
        height: 54,
        marginRight: 12,
    },

    countText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#222',
    },

    plusBtn: {
        width: 54,
        height: 54,
        borderRadius: 27, // Circle
        backgroundColor: '#7cb518',
        justifyContent: 'center',
        alignItems: 'center',
    },

    plusIconText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 30, // Center vertically
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        marginBottom: 24,
        overflow: 'hidden',
    },
    ticketHeader: {
        backgroundColor: '#555', // Dark Grey Header
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
        marginBottom: 24,
    },
    infoDate: {
        fontSize: 12,
        color: '#666',
    },
    infoName: {
        fontSize: 12,
        color: '#666',
    },
    boldText: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 16, // works in newer RN, fallback margin if needed
        marginBottom: 30,
    },
    statusBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    statusLabel: {
        fontSize: 12,
        color: '#555',
        marginBottom: 4,
    },
    statusAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },

    /* STEPS / APPROVAL CHAIN */
    chainContainer: {
        marginTop: 10,
        marginBottom: 10,
        position: 'relative',
    },
    chainLine: {
        position: 'absolute',
        top: 36, // Align with center of circles
        left: 20,
        right: 20, // Don't go full width so line is hidden behind first/last
        height: 2,
        backgroundColor: '#e0e0e0',
        zIndex: 0,
    },
    chainSteps: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Spread out
    },
    stepWrapper: {
        alignItems: 'center',
        width: 60, // Fixed width for alignment
    },
    stepLabel: {
        fontSize: 7, // Very small as in image
        color: '#888',
        marginBottom: 6,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    stepIconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // to hide line behind
        zIndex: 1,
        marginBottom: 6,
    },
    stepUser: {
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
    },
});
