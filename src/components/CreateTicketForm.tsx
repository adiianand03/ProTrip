import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
    Alert,
    FlatList,
    ScrollView,
    Modal,
    ImageBackground,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { TicketContext } from '../context/TicketContext';
import TravelBg from '../assets/images/travelbginsidecards.png'; // Using provided background

declare const window: any;

interface CreateTicketFormProps {
    onDiscard: () => void;
    onSubmit: () => void;
}

// Hardcoded Data
const DESTINATIONS = [
    "Chicago", "New York", "San Francisco", "London", "Paris",
    "Tokyo", "Singapore", "Dubai", "Sydney", "Mumbai",
    "Berlin", "Toronto", "Hong Kong", "Barcelona", "Rome"
];
const COST_CODES = [
    "CC-101 (Sales)", "CC-102 (Marketing)", "CC-103 (Engineering)",
    "CC-104 (HR)", "CC-105 (Operations)"
];
const PURPOSES = [
    "Client Meeting", "Conference", "Project Deployment",
    "Site Visit", "Training", "Team Offsite"
];

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onDiscard, onSubmit }) => {
    const { addTicket } = useContext(TicketContext);

    const [tripType, setTripType] = useState<'One Way' | 'Round Trip'>('One Way');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [purpose, setPurpose] = useState('');
    const [costCode, setCostCode] = useState('');

    const [startDate, setStartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Modal States
    const [activeField, setActiveField] = useState<string | null>(null); // 'FROM', 'TO', 'PURPOSE', 'COST'

    // Validation Check
    const areDetailsFilled = from && to && purpose && costCode;

    // Generate next 30 days
    const getDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 45; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push({
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                date: date.getDate(),
                fullDate: date.toISOString().split('T')[0],
                month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            });
        }
        return dates;
    };

    const dates = getDates();

    const handleCreate = () => {
        if (!areDetailsFilled) {
            Alert.alert("Missing Details", "Please fill in all details first.");
            return;
        }
        if (!startDate) {
            Alert.alert("Missing Date", "Please select a departure date.");
            return;
        }
        if (tripType === 'Round Trip' && !returnDate) {
            Alert.alert("Missing Return Date", "Please select a return date.");
            return;
        }

        const newTicket = {
            id: `TRI/27/${Math.floor(Math.random() * 10000)}`,
            from,
            to,
            date: tripType === 'Round Trip' ? `${startDate} - ${returnDate}` : startDate,
            purpose,
            costCode,
            tripType
        };

        addTicket(newTicket);

        if (Platform.OS === 'web') {
            window.alert('Success: Ticket Created');
        } else {
            Alert.alert('Success', 'Ticket Created Successfully');
        }
        onSubmit();
    };

    // Generic Selection Modal
    const renderSelectionModal = (
        visible: boolean,
        data: string[],
        onSelect: (val: string) => void,
        title: string
    ) => (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setActiveField(null)}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select {title}</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.modalItem}
                                onPress={() => {
                                    onSelect(item);
                                    setActiveField(null);
                                }}
                            >
                                <Text style={styles.modalItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={styles.mainContainer}>
            {/* Background Image for Top Part */}
            <View style={styles.bgContainer}>
                {/* Can use ImageBackground here if we want it strictly behind the card */}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Card */}
                <View style={styles.topCard}>
                    {/* Visual Header with Background */}
                    <ImageBackground
                        source={TravelBg}
                        style={styles.headerBg}
                        imageStyle={{ borderRadius: 20 }}
                    >
                        <View style={styles.headerOverlay}>
                            <View style={styles.routeRow}>
                                <View>
                                    <Text style={styles.airportCode}>{from ? from.substring(0, 3).toUpperCase() : 'ORG'}</Text>
                                    <Text style={styles.cityName}>{from || 'Origin'}</Text>
                                </View>
                                <View style={styles.planeLine}>
                                    <Text style={{ color: '#fff', fontSize: 20 }}>✈️</Text>
                                    <Text style={{ color: '#eee', fontSize: 10 }}>- - - - - - -</Text>
                                </View>
                                <View>
                                    <Text style={styles.airportCode}>{to ? to.substring(0, 3).toUpperCase() : 'DST'}</Text>
                                    <Text style={styles.cityName}>{to || 'Destination'}</Text>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>

                    {/* Form Inputs */}
                    <View style={styles.inputContainer}>
                        <View style={styles.toggleRow}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, tripType === 'One Way' && styles.activeToggle]}
                                onPress={() => setTripType('One Way')}
                            >
                                <Text style={[styles.toggleText, tripType === 'One Way' && styles.activeToggleText]}>One way</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, tripType === 'Round Trip' && styles.activeToggle]}
                                onPress={() => setTripType('Round Trip')}
                            >
                                <Text style={[styles.toggleText, tripType === 'Round Trip' && styles.activeToggleText]}>Round trip</Text>
                            </TouchableOpacity>
                        </View>

                        {/* From Input */}
                        <TouchableOpacity style={styles.inputBtn} onPress={() => setActiveField('FROM')}>
                            <Text style={[styles.inputText, !from && { color: '#999' }]}>{from || "Select Origin"}</Text>
                        </TouchableOpacity>

                        {/* To Input */}
                        <TouchableOpacity style={styles.inputBtn} onPress={() => setActiveField('TO')}>
                            <Text style={[styles.inputText, !to && { color: '#999' }]}>{to || "Select Destination"}</Text>
                        </TouchableOpacity>

                        {/* Purpose Input */}
                        <TouchableOpacity style={styles.inputBtn} onPress={() => setActiveField('PURPOSE')}>
                            <Text style={[styles.inputText, !purpose && { color: '#999' }]}>{purpose || "Purpose of Travel"}</Text>
                        </TouchableOpacity>

                        {/* Cost Code Input */}
                        <TouchableOpacity style={styles.inputBtn} onPress={() => setActiveField('COST')}>
                            <Text style={[styles.inputText, !costCode && { color: '#999' }]}>{costCode || "Select Cost Code"}</Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Date Section (Visible only when details filled) */}
                <View style={[styles.dateSection, !areDetailsFilled && styles.disabledSection]}>
                    <Text style={styles.sectionTitle}>
                        {areDetailsFilled ? "Select Departure Date" : "Fill details to select date"}
                    </Text>
                    <FlatList
                        horizontal
                        data={dates}
                        keyExtractor={(item) => item.fullDate}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        scrollEnabled={!!areDetailsFilled}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.dateItem,
                                    startDate === item.fullDate && styles.selectedDateItem,
                                    !areDetailsFilled && styles.disabledItem
                                ]}
                                onPress={() => areDetailsFilled && setStartDate(item.fullDate)}
                                disabled={!areDetailsFilled}
                            >
                                <Text style={[styles.dayText, startDate === item.fullDate && styles.selectedDayText]}>{item.day}</Text>
                                <Text style={[styles.dateNum, startDate === item.fullDate && styles.selectedDayText]}>{item.date}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Return Date Section (Visible only for Round Trip & details filled) */}
                {tripType === 'Round Trip' && (
                    <View style={[styles.dateSection, (!areDetailsFilled || !startDate) && styles.disabledSection]}>
                        <Text style={styles.sectionTitle}>
                            {startDate ? "Select Return Date" : "Select Departure first"}
                        </Text>
                        <FlatList
                            horizontal
                            data={dates}
                            keyExtractor={(item) => 'ret-' + item.fullDate}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 20 }}
                            scrollEnabled={!!startDate}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.dateItem,
                                        returnDate === item.fullDate && styles.selectedDateItem,
                                        (!startDate) && styles.disabledItem
                                    ]}
                                    onPress={() => startDate && setReturnDate(item.fullDate)}
                                    disabled={!startDate}
                                >
                                    <Text style={[styles.dayText, returnDate === item.fullDate && styles.selectedDayText]}>{item.day}</Text>
                                    <Text style={[styles.dateNum, returnDate === item.fullDate && styles.selectedDayText]}>{item.date}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {/* Submit Button */}
                <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={[styles.searchBtn, (!areDetailsFilled || !startDate) && styles.disabledBtn]}
                        onPress={handleCreate}
                        disabled={!areDetailsFilled || !startDate}
                    >
                        <Text style={styles.searchBtnText}>Create Ticket</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Modals */}
            {renderSelectionModal(activeField === 'FROM', DESTINATIONS, setFrom, 'Origin')}
            {renderSelectionModal(activeField === 'TO', DESTINATIONS, setTo, 'Destination')}
            {renderSelectionModal(activeField === 'PURPOSE', PURPOSES, setPurpose, 'Purpose')}
            {renderSelectionModal(activeField === 'COST', COST_CODES, setCostCode, 'Cost Code')}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8f8f0',
    },
    bgContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#f8f8f0',
        zIndex: -1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center', // Centers the card vertically
        paddingBottom: 40,
    },
    topCard: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        overflow: 'hidden', // for ImageBackground border radius
    },
    headerBg: {
        height: 120, // Background height
        justifyContent: 'center',
    },
    headerOverlay: {
        backgroundColor: 'rgba(0,0,0,0.3)', // Darken image slightly
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    routeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    airportCode: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 4,
    },
    cityName: {
        fontSize: 14,
        color: '#eee',
        textAlign: 'center',
        fontWeight: '500',
    },
    planeLine: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        padding: 20,
        gap: 12,
        backgroundColor: '#fff',
    },
    toggleRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        padding: 4,
        alignSelf: 'center',
        marginBottom: 10,
        width: '100%',
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#112211', // Dark Theme
    },
    toggleText: {
        color: '#555',
        fontWeight: '600',
    },
    activeToggleText: {
        color: '#fff',
    },
    inputBtn: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    inputText: {
        fontSize: 14,
        color: '#333',
    },

    dateSection: {
        marginBottom: 20,
    },
    disabledSection: {
        opacity: 0.3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 20,
        marginBottom: 10,
    },
    dateItem: {
        backgroundColor: '#fff',
        width: 60,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    disabledItem: {
        backgroundColor: '#e0e0e0',
    },
    selectedDateItem: {
        backgroundColor: '#acc938', // Lime Green
        borderColor: '#acc938',
    },
    dayText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    dateNum: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    selectedDayText: {
        color: '#fff',
    },
    actionSection: {
        paddingHorizontal: 16,
    },
    searchBtn: {
        backgroundColor: '#acc938',
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#acc938',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    disabledBtn: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    searchBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});

export default CreateTicketForm;
