import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const bgImg = require('../assets/images/travelbginsidecards.png');

declare const window: any;

type TravelSettlementReportNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TravelSettlementReport = () => {
    const navigation = useNavigation<TravelSettlementReportNavigationProp>();
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        if (Platform.OS === 'web') {
            window.alert('Success: Settlement Created Successfully');
        } else {
            Alert.alert('Success', 'Settlement Created Successfully');
        }
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* NAV BAR */}
            <View style={styles.navbar} />

            <ImageBackground source={bgImg} style={styles.bg} resizeMode="cover">
                {/* BACK */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

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
                            <Text style={styles.dropdownText}>
                                Select Travel Request Number
                            </Text>
                            <Text style={styles.arrow}>{open ? '▲' : '▼'}</Text>
                        </TouchableOpacity>

                        {open && (
                            <View style={styles.dropdownPopup}>
                                <Text style={styles.noOption}>
                                    No available options
                                </Text>
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
            </ImageBackground>
        </SafeAreaView>
    );
};

export default TravelSettlementReport;

const styles = StyleSheet.create({
    /* NAV BAR */
    navbar: {
        height: 56,
        backgroundColor: '#6b6b6b',
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
        backgroundColor: '#fff',
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
        borderColor: '#ccc',
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
        borderColor: '#7cc000',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    dropdownText: {
        color: '#555',
        fontSize: 14,
    },

    arrow: {
        fontSize: 12,
        color: '#555',
    },

    dropdownPopup: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,

        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },

        elevation: 10,
        zIndex: 1000,
    },

    noOption: {
        fontSize: 14,
        color: '#555',
    },

    /* BUTTONS */
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 28,
    },

    cancelBtn: {
        borderWidth: 1,
        borderColor: '#7cc000',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 6,
    },

    cancelText: {
        color: '#7cc000',
        fontWeight: '500',
    },

    submitBtn: {
        backgroundColor: '#7cc000',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 6,
    },

    submitText: {
        color: '#fff',
        fontWeight: '600',
    },
});
