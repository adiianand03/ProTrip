import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GlobalIcon from '../assets/images/globalMobilityicon.svg';

const AccountInfoCard = () => {
    const [isBillable, setIsBillable] = useState(true);

    // Mock Data - To be replaced by DB fetch in future
    const project = "ProTrip Development";
    const costCode = "CST-2024-X1";
    const program = "Engineering";
    const reportingManager = "Jane Doe";

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <GlobalIcon width={24} height={24} style={{ marginRight: 10 }} />
                    <Text style={styles.headerTitle}>Account Information</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Billability Toggle */}
                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Billability</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, isBillable && styles.toggleButtonActive]}
                            onPress={() => setIsBillable(true)}
                        >
                            <Text style={[styles.toggleText, isBillable && styles.toggleTextActive]}>Billable</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, !isBillable && styles.toggleButtonActive]}
                            onPress={() => setIsBillable(false)}
                        >
                            <Text style={[styles.toggleText, !isBillable && styles.toggleTextActive]}>Non Billable</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Fields - Stacked Vertically/Row */}
                <View style={styles.row}>
                    <View style={[styles.fieldContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Project</Text>
                        <Text style={styles.value}>{project}</Text>
                    </View>
                    <View style={[styles.fieldContainer, { flex: 1 }]}>
                        <Text style={styles.label}>Cost Code</Text>
                        <Text style={styles.value}>{costCode}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.fieldContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Program</Text>
                        <Text style={styles.value}>{program}</Text>
                    </View>
                    <View style={[styles.fieldContainer, { flex: 1 }]}>
                        <Text style={styles.label}>Reporting Manager</Text>
                        <Text style={styles.value}>{reportingManager}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#424242',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    header: {
        backgroundColor: '#F5F5F5',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#616161',
    },
    content: {
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
        color: '#9E9E9E',
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 14,
        color: '#616161',
        fontWeight: '500',
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#EEEEEE'
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        alignSelf: 'flex-start',
        overflow: 'hidden'
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    toggleButtonActive: {
        backgroundColor: '#74c657',
    },
    toggleText: {
        fontSize: 12,
        color: '#616161',
    },
    toggleTextActive: {
        color: '#F5F5F5',
        fontWeight: 'bold'
    }
});

export default AccountInfoCard;
