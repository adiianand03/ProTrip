import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ticket } from '../context/TicketContext';
import TravelIcon from '../assets/images/travel.svg'; // Using generic icon or plane if available

interface TicketCardProps {
    ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.idText}>{ticket.id}</Text>
                <Text style={styles.typeText}>{ticket.tripType.toUpperCase()}</Text>
            </View>

            {/* Body */}
            <View style={styles.body}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{ticket.date}</Text>
                    <Text style={styles.label}>Date</Text>
                </View>

                <View style={styles.routeContainer}>
                    <Text style={styles.cityText}>{ticket.from}</Text>
                    <TravelIcon width={20} height={20} style={styles.icon} />
                    <Text style={styles.cityText}>{ticket.to}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Timeline (Hardcoded visualization as requested) */}
            <View style={styles.timelineContainer}>
                <View style={styles.step}>
                    <View style={[styles.circle, styles.activeCircle]} />
                    <Text style={styles.stepLabel}>Submitted</Text>
                    <Text style={styles.personParams}>You</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.step}>
                    <View style={[styles.circle, styles.pendingCircle]} />
                    <Text style={styles.stepLabel}>Mobility</Text>
                    <Text style={styles.personParams}>Approver</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.step}>
                    <View style={styles.circle} />
                    <Text style={styles.stepLabel}>RM</Text>
                    <Text style={styles.personParams}>Manager</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#555',
        marginHorizontal: -16,
        marginTop: -16,
        padding: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        marginBottom: 16,
    },
    idText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    typeText: {
        color: '#ccc',
        fontSize: 12,
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dateContainer: {},
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        fontSize: 12,
        color: '#888',
    },
    routeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    icon: {
        // color: '#555'
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 16,
    },
    timelineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    step: {
        alignItems: 'center',
    },
    circle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#ddd',
        marginBottom: 4,
    },
    activeCircle: {
        backgroundColor: '#7cb518',
    },
    pendingCircle: {
        backgroundColor: '#ffd37d',
    },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: '#eee',
        marginHorizontal: 4,
        marginBottom: 20, // Align with dots
    },
    stepLabel: {
        fontSize: 10,
        color: '#555',
        fontWeight: '600',
    },
    personParams: {
        fontSize: 9,
        color: '#888',
    }
});

export default TicketCard;
