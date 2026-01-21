import React, { useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CreateTicketForm from '../components/CreateTicketForm';
import { TicketContext } from '../context/TicketContext';
import AccountInfoCard from '../components/AccountInfoCard';
import GlobalMobilityCard from '../components/GlobalMobilityCard';

// Logic for date generation
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

declare const window: any;

type CreateTicketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateTicketScreen: React.FC = () => {
    const navigation = useNavigation<CreateTicketScreenNavigationProp>();
    const { addTicket } = useContext(TicketContext);

    // State Lifting
    const [tripType, setTripType] = useState<'One Way' | 'Round Trip' | 'Multi-city'>('One Way');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [purpose, setPurpose] = useState('');
    const [costCode, setCostCode] = useState('');

    // Dates are generated here
    const dates = getDates();
    const [startDate, setStartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Preference State
    const [mode, setMode] = useState('Flight');
    const [accommodation, setAccommodation] = useState('Not Required');
    const [food, setFood] = useState<'Veg' | 'Non-Veg'>('Veg');
    const [seat, setSeat] = useState('No Preference');
    const [onwardTiming, setOnwardTiming] = useState('Any Timing');
    const [returnTiming, setReturnTiming] = useState('Any Timing');

    // Domestic Cities Helper
    const INDIAN_CITIES = ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
    const isInternational = to && !INDIAN_CITIES.includes(to);

    const areDetailsFilled = Boolean(from && to && purpose && costCode);
    const handleSubmit = () => {
        if (!areDetailsFilled || !startDate) {
            Alert.alert("Missing Details", "Please fill all details and select a date.");
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
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.navigate('TravelRequest')}>
                    <Text style={styles.myTicketsLink}>My Tickets ↗</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={platform === 'ios' ? 60 : 0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    nestedScrollEnabled={true}
                >

                    {/* Form Card */}
                    <CreateTicketForm
                        tripType={tripType}
                        setTripType={setTripType}
                        from={from}
                        setFrom={setFrom}
                        to={to}
                        setTo={setTo}
                        purpose={purpose}
                        setPurpose={setPurpose}
                        costCode={costCode}
                        setCostCode={setCostCode}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        returnDate={returnDate}
                        setReturnDate={setReturnDate}
                        dates={dates}
                        // Preferences
                        mode={mode}
                        setMode={setMode}
                        accommodation={accommodation}
                        setAccommodation={setAccommodation}
                        food={food}
                        setFood={setFood}
                        seat={seat}
                        setSeat={setSeat}
                        onwardTiming={onwardTiming}
                        setOnwardTiming={setOnwardTiming}
                        returnTiming={returnTiming}
                        setReturnTiming={setReturnTiming}
                    />

                    {/* Additional Cards (Shown when details are filled) */}
                    {areDetailsFilled && !!startDate && (
                        <>
                            {isInternational && <GlobalMobilityCard />}
                            <AccountInfoCard />
                        </>
                    )}

                    {/* Submit Logic (Outside Form) */}
                    <View style={styles.actionSection}>
                        <TouchableOpacity
                            style={[styles.searchBtn, (!areDetailsFilled || !startDate) && styles.disabledBtn]}
                            onPress={handleSubmit}
                            disabled={!areDetailsFilled || !startDate}
                        >
                            <Text style={styles.searchBtnText}>Submit Request</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

// Simple Platform Helper
const platform = Platform.OS;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f0',
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Manual safe area
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        backgroundColor: '#f8f8f0'
    },
    myTicketsLink: {
        color: '#71B006',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    actionSection: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    searchBtn: {
        backgroundColor: '#71B006',
        padding: 18,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#71B006',
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
});

export default CreateTicketScreen;
