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

type TravelSettlementScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList>;

const StepperCircle = () => <View style={styles.pendingCircle} />;

const APPROVAL_STEPS = [
    { label: 'SUBMITTED', user: 'You', status: 'done' },
    { label: 'TRAVEL TEAM', user: '', status: 'current' },
    { label: 'RM APPROVAL 1', user: '', status: 'pending' },
    { label: 'FINANCE APPROVAL 1', user: '', status: 'pending' },
    { label: 'EXPENSE SETTLEMENT', user: '', status: 'pending' },
];

const TravelSettlement = () => {
    const navigation = useNavigation<TravelSettlementScreenNavigationProp>();
    const { settlements } = useContext(TicketContext);

    const renderApprovalChain = () => (
        <View style={styles.timelineWrapper}>
            <View style={styles.timelineLine} />

            {APPROVAL_STEPS.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    <View
                        style={[
                            styles.stepIconContainer,
                            {
                                borderColor:
                                    step.status === 'done'
                                        ? '#7cb518'
                                        : step.status === 'current'
                                            ? '#74c657'
                                            : '#E0E0E0',
                            },
                        ]}
                    >
                        {step.status === 'done' ? (
                            <StepperCheck width={14} height={14} />
                        ) : step.status === 'current' ? (
                            <StepperUser width={14} height={14} />
                        ) : (
                            <StepperCircle />
                        )}
                    </View>

                    <Text style={styles.stepLabel}>{step.label}</Text>
                    {step.user ? (
                        <Text style={styles.stepUser}>{step.user}</Text>
                    ) : null}
                </View>
            ))}
        </View>
    );

    return (
        <MainLayout>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />

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
                    <View style={styles.searchRow}>
                        <View style={styles.searchBoxExpanded}>
                            <SearchIcon width={18} height={18} />
                            <TextInput
                                placeholder="Search Here"
                                style={styles.searchInput}
                            />
                        </View>
                    </View>

                    <View style={styles.bottomRow}>
                        <View style={styles.countBox}>
                            <Text style={styles.countText}>
                                Total count - {settlements.length}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.plusBtn}
                            onPress={() =>
                                navigation.navigate('TravelSettlementReport')
                            }
                        >
                            <Text style={styles.plusIconText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* LIST */}
                <FlatList
                    contentContainerStyle={{ padding: 16 }}
                    data={settlements}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.ticketCard}>
                            {/* CARD HEADER */}
                            <View style={styles.ticketHeader}>
                                <View style={styles.ticketHeaderCenter}>
                                    <View style={styles.headerGroup}>
                                        <HeaderDoc width={16} height={16} />
                                        <Text style={styles.headerIdText}>
                                            {item.id}
                                        </Text>
                                    </View>

                                    <HeaderLink width={16} height={16} />

                                    <View style={styles.headerGroup}>
                                        <HeaderPlane width={16} height={16} />
                                        <Text style={styles.headerIdText}>
                                            {item.ticketId}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* BODY */}
                            <View style={styles.ticketBody}>
                                <View style={styles.leftTimeline}>
                                    {renderApprovalChain()}
                                </View>

                                <View style={styles.verticalDivider} />

                                <View style={styles.rightContent}>
                                    <Text style={styles.infoLabel}>
                                        Travel Date :
                                    </Text>
                                    <Text style={styles.infoValue}>
                                        {item.submissionDate || '2026-01-22'}
                                    </Text>

                                    <Text style={styles.infoLabel}>
                                        Expense Name :
                                    </Text>
                                    <Text style={styles.infoValue}>
                                        {item.expenseName}
                                    </Text>

                                    <View style={styles.statusStack}>
                                        <View style={styles.statusBox}>
                                            <CompanyPay width={34} height={34} />
                                            <View>
                                                <Text style={styles.statusLabel}>
                                                    Company to Pay
                                                </Text>
                                                <Text style={styles.statusAmount}>
                                                    INR{' '}
                                                    {item.totalAmount.toFixed(
                                                        2
                                                    )}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.statusBox}>
                                            <StatusCheck
                                                width={34}
                                                height={34}
                                            />
                                            <View>
                                                <Text style={styles.statusLabel}>
                                                    Approved
                                                </Text>
                                                <Text style={styles.statusAmount}>
                                                    INR{' '}
                                                    {item.totalAmount.toFixed(
                                                        2
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.clipboardIcon}>
                                    <ClipboardBadge width={40} height={40} />
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </MainLayout>
    );
};

export default TravelSettlement;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },

    header: {
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
    },
    headerTitle: { fontSize: 18, fontWeight: '600' },

    card: {
        margin: 16,
        padding: 20,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        elevation: 3,
    },

    searchRow: { marginBottom: 16 },
    searchBoxExpanded: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 46,
    },
    searchInput: { flex: 1, marginLeft: 8 },

    bottomRow: { flexDirection: 'row' },
    countBox: {
        flex: 1,
        backgroundColor: '#f39c12',
        borderRadius: 8,
        padding: 12,
        marginRight: 12,
    },
    countText: { fontWeight: '600' },

    plusBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#71B006',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIconText: { color: '#fff', fontSize: 26 },

    ticketCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        elevation: 3,
        marginBottom: 16,
        overflow: 'hidden',
    },

    /* CARD HEADER */
    ticketHeader: {
        backgroundColor: '#757575',
        paddingVertical: 12,
    },
    ticketHeaderCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    headerGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerIdText: {
        color: '#F5F5F5',
        fontWeight: '600',
        fontSize: 14,
    },

    ticketBody: { flexDirection: 'row', padding: 14 },

    leftTimeline: { width: 80, alignItems: 'center' },
    verticalDivider: {
        width: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 10,
    },
    rightContent: { flex: 1 },

    infoLabel: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 6,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#424242',
    },

    statusStack: { marginTop: 10, gap: 10 },
    statusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        gap: 12,
    },
    statusLabel: {
        fontSize: 11,
        color: '#9E9E9E',
        fontWeight: '500',
    },
    statusAmount: {
        fontSize: 15,
        fontWeight: '600',
        color: '#424242',
    },

    clipboardIcon: {
        position: 'absolute',
        top: 14,
        right: 14,
    },

    /* TIMELINE */
    timelineWrapper: { alignItems: 'center', position: 'relative' },
    timelineLine: {
        position: 'absolute',
        top: 24,
        bottom: 24,
        width: 2,
        backgroundColor: '#E0E0E0',
        left: 39,
    },
    stepContainer: { alignItems: 'center', marginBottom: 14 },
    stepIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    pendingCircle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    stepLabel: {
        fontSize: 9.5,
        color: '#555',
        fontWeight: '500',
        textAlign: 'center',
        marginLeft: 6,
    },
    stepUser: {
        fontSize: 10,
        fontWeight: '500',
        color: '#444',
        marginLeft: 6,
    },
});
