import React, { useState, useContext } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    Platform,
    Alert,
    KeyboardAvoidingView,
    Modal,
    TextInput
} from 'react-native';
import MainLayout from '../components/MainLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import CreateTicketForm from '../components/CreateTicketForm';
import { TicketContext } from '../context/TicketContext';
import AccountInfoCard from '../components/AccountInfoCard';
import GlobalMobilityCard from '../components/GlobalMobilityCard';
import TravellerDetailsCard from '../components/TravellerDetailsCard';

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

    // One Way / Round Trip State
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [purpose, setPurpose] = useState('');
    const [costCode, setCostCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Multi-City State
    const [segments, setSegments] = useState([
        {
            id: '1', from: '', to: '', date: '',
            mode: 'Flight', accommodation: 'Not Required', food: 'Veg', seat: 'No Preference', onwardTiming: 'Any Timing'
        }
    ]);

    const addSegment = () => {
        const lastSegment = segments[segments.length - 1];
        const newFrom = lastSegment.to || '';
        setSegments([
            ...segments,
            {
                id: Date.now().toString(), from: newFrom, to: '', date: '',
                mode: 'Flight', accommodation: 'Not Required', food: 'Veg', seat: 'No Preference', onwardTiming: 'Any Timing'
            }
        ]);
    };

    const removeSegment = (id: string) => {
        if (segments.length > 1) {
            setSegments(segments.filter(s => s.id !== id));
        } else {
            Alert.alert("Minimum Limit", "Multi-city trip must have at least 1 segment.");
        }
    };

    const updateSegment = (id: string, field: string, value: string) => {
        setSegments(segments.map(s => {
            if (s.id === id) {
                // If updating 'to' of a segment, auto-update 'from' of next segment
                if (field === 'to') {
                    // Logic to update next segment's from could be here, but simpler to just let user add new segment which auto-fills
                }
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    // Dates are generated here
    const dates = getDates();

    // Preference State (Single Trip / Round Trip)
    const [mode, setMode] = useState('Flight');
    const [accommodation, setAccommodation] = useState('Not Required');
    const [food, setFood] = useState<'Veg' | 'Non-Veg'>('Veg');
    const [seat, setSeat] = useState('No Preference');
    const [onwardTiming, setOnwardTiming] = useState('Any Timing');
    const [returnTiming, setReturnTiming] = useState('Any Timing');

    // Domestic Cities Helper
    const INDIAN_CITIES = ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
    const isInternational = Boolean(
        (tripType !== 'Multi-city' && to && !INDIAN_CITIES.includes(to)) ||
        (tripType === 'Multi-city' && segments.some(s => s.to && !INDIAN_CITIES.includes(s.to)))
    );

    const isTripDefined = Boolean(
        tripType === 'Multi-city'
            ? segments.every(s => s.from && s.to && s.date)
            : from && to && startDate
    );

    const areDetailsFilled = Boolean(purpose && costCode && isTripDefined);
    // Disclaimer state
    const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    const handleSubmit = () => {
        if (!areDetailsFilled) {
            Alert.alert("Missing Details", "Please fill all trip details, purpose, and cost code.");
            return;
        }
        if (tripType === 'Round Trip' && !returnDate) {
            Alert.alert("Missing Return Date", "Please select a return date.");
            return;
        }
        if (!disclaimerAgreed) {
            Alert.alert("Disclaimer", "Please agree to the disclaimer to proceed.");
            return;
        }

        let ticketFrom = from;
        let ticketTo = to;
        let ticketDate = startDate;

        if (tripType === 'Multi-city') {
            ticketFrom = segments[0].from;
            ticketTo = segments[segments.length - 1].to; // Or maybe "Multi-City Trip"
            ticketDate = `${segments[0].date} - ${segments[segments.length - 1].date}`;
        } else if (tripType === 'Round Trip') {
            ticketDate = `${startDate} - ${returnDate}`;
        }

        const newTicket = {
            id: `TRI/27/${Math.floor(Math.random() * 10000)}`,
            from: ticketFrom,
            to: ticketTo,
            date: ticketDate,
            purpose,
            costCode,
            tripType,
            segments: tripType === 'Multi-city' ? segments : undefined
        };

        addTicket(newTicket);

        if (Platform.OS === 'web') {
            window.alert('Success: Ticket Created');
        } else {
            Alert.alert('Success', 'Ticket Created Successfully');
        }
        navigation.goBack();
    };

    const [isos, setIsos] = useState(false);
    const [forex, setForex] = useState(false);
    const [remarks, setRemarks] = useState('');

    const [currentStep, setCurrentStep] = useState(1);

    const handleDiscard = () => {
        navigation.goBack();
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!purpose || !costCode) {
                Alert.alert("Missing Details", "Please select Purpose and Cost Code.");
                return;
            }

            if (!isTripDefined) {
                Alert.alert("Missing Trip Details", "Please complete the route and date selection.");
                return;
            }

            // If international, go to step 2 (Global Mobility), else skip to step 3 (Account Info)
            setCurrentStep(isInternational ? 2 : 3);
        } else if (currentStep === 2) {
            // From Global Mobility to Account Info
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // From Account Info to Traveller Details
            setCurrentStep(4);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else if (currentStep === 3) {
            // If international, go back to step 2, else to step 1
            setCurrentStep(isInternational ? 2 : 1);
        } else if (currentStep === 4) {
            setCurrentStep(3);
        } else {
            navigation.goBack();
        }
    };

    return (
        <MainLayout>
            <View style={styles.container}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={handleBack} style={{ padding: 5 }}>
                        <Text style={{ fontSize: 24, color: '#616161' }}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('TravelRequest')}>
                        <Text style={styles.myTicketsLink}>My Tickets ↗</Text>
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={true}
                        bounces={true}
                        nestedScrollEnabled={true}
                    >

                        {/* STEP 1: TRIP DETAILS */}
                        {currentStep === 1 && (
                            <>
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
                                    // Multi-City Props
                                    segments={segments}
                                    addSegment={addSegment}
                                    removeSegment={removeSegment}
                                    updateSegment={updateSegment}
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

                                <View style={styles.actionSection}>
                                    <TouchableOpacity
                                        style={[styles.nextBtn, (!areDetailsFilled) && styles.disabledNextBtn]}
                                        onPress={handleNext}
                                        disabled={!areDetailsFilled}
                                    >
                                        <Text style={styles.nextBtnText}>Next →</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* STEP 2: GLOBAL MOBILITY */}
                        {currentStep === 2 && isInternational && (
                            <>
                                <GlobalMobilityCard />

                                <View style={styles.actionSection}>
                                    <TouchableOpacity
                                        style={styles.nextBtn}
                                        onPress={handleNext}
                                    >
                                        <Text style={styles.nextBtnText}>Next →</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* STEP 3: ACCOUNT INFORMATION */}
                        {currentStep === 3 && (
                            <>
                                <AccountInfoCard />

                                <View style={styles.actionSection}>
                                    <TouchableOpacity
                                        style={styles.nextBtn}
                                        onPress={handleNext}
                                    >
                                        <Text style={styles.nextBtnText}>Next →</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* STEP 4: TRAVELLER DETAILS + ADDITIONAL FIELDS */}
                        {currentStep === 4 && (
                            <>
                                <TravellerDetailsCard isInternational={isInternational} />

                                {/* SEPARATOR */}
                                <View style={{ height: 20 }} />

                                {/* NEW FIELDS SECTION: ISOS, FOREX, DOCS, REMARKS */}
                                <View style={styles.additionalFieldsSection}>

                                    {/* Row 1: ISOS & Forex */}
                                    <View style={styles.checkboxRow}>
                                        {/* ISOS */}
                                        <TouchableOpacity
                                            style={styles.fieldCheckboxContainer}
                                            onPress={() => setIsos(!isos)}
                                        >
                                            <View style={[styles.fieldCheckbox, isos && styles.checkboxChecked]}>
                                                {isos && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                            <Text style={styles.fieldLabel}>ISOS <Text style={styles.star}>*</Text></Text>
                                        </TouchableOpacity>

                                        {/* Forex */}
                                        <TouchableOpacity
                                            style={[styles.fieldCheckboxContainer, { marginLeft: 20 }]}
                                            onPress={() => setForex(!forex)}
                                        >
                                            <View style={[styles.fieldCheckbox, forex && styles.checkboxChecked]}>
                                                {forex && <Text style={styles.checkmark}>✓</Text>}
                                            </View>
                                            <Text style={styles.fieldLabel}>Forex advance required?</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Row 2: Notify */}
                                    <View style={styles.fieldRow}>
                                        <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Do you want to notify to someone else?</Text>
                                        <View style={styles.dummyDropdown}>
                                            <Text style={{ color: '#BDBDBD' }}>Select an Employee</Text>
                                            <Text style={{ color: '#BDBDBD' }}>▼</Text>
                                        </View>
                                    </View>

                                    {/* Row 3: Additional Documents */}
                                    <View style={styles.fieldRow}>
                                        <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Additional Documents</Text>
                                        <TouchableOpacity style={styles.uploadPlaceholder}>
                                            <Text style={{ color: '#757575' }}>Select or drop files (JPG, PNG, PDF) up to 2 MB.</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Row 4: Remarks */}
                                    <View style={styles.fieldRow}>
                                        <Text style={[styles.fieldLabel, { marginBottom: 6 }]}>Remarks</Text>
                                        <TextInput
                                            style={styles.textArea}
                                            placeholder="Enter your remarks"
                                            multiline={true}
                                            numberOfLines={3}
                                            value={remarks}
                                            onChangeText={setRemarks}
                                            textAlignVertical="top"
                                        />
                                    </View>

                                </View>


                                {/* Disclaimer Checkbox Row */}
                                <View style={styles.disclaimerRow}>
                                    <TouchableOpacity
                                        style={[styles.checkbox, disclaimerAgreed && styles.checkboxChecked]}
                                        onPress={() => setShowDisclaimer(true)} // Open modal on click
                                    >
                                        {disclaimerAgreed && <Text style={styles.checkmark}>✓</Text>}
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setShowDisclaimer(true)}>
                                        <Text style={styles.disclaimerText}>
                                            Please agree to <Text style={styles.disclaimerLink}>disclaimer</Text>
                                            <Text style={styles.star}> *</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Action Buttons: Discard & Submit */}
                                <View style={styles.actionRow}>
                                    <TouchableOpacity
                                        style={styles.discardBtn}
                                        onPress={handleDiscard}
                                    >
                                        <Text style={styles.discardText}>Discard</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.submitActionBtn, (!disclaimerAgreed || !isos) && styles.disabledActionBtn]}
                                        onPress={handleSubmit}
                                        disabled={!disclaimerAgreed || !isos}
                                    >
                                        <Text style={styles.submitActionText}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {/* Disclaimer Modal */}
                        <Modal
                            visible={showDisclaimer}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setShowDisclaimer(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity
                                        style={styles.closeIcon}
                                        onPress={() => setShowDisclaimer(false)}
                                    >
                                        <Text style={styles.closeIconText}>✕</Text>
                                    </TouchableOpacity>

                                    <ScrollView style={{ maxHeight: 400 }}>
                                        <View>
                                            <Text style={styles.modalTitle}>Travel Disclaimer:</Text>
                                            <Text style={styles.modalText}>
                                                I am authorizing Prodapt to use my information for business related/travel arrangement purposes. I understand that my personal detail like name, passport/visa details, Aadhar/PAN details, phone number, email address, home/office address, etc may be required to be stored by Prodapt and/or shared with various service providers viz Travel Agents, Online booking Tool, Airline websites, Hotels, Service Apartments, Forex agencies, Travel Insurance partners, Security partners, SIM card providers, Euro Rail websites, etc for the purpose of processing of claims/reimbursements or for making travel arrangements, as applicable. I am aware of GDPR (Data Privacy) guidelines on sharing of personal information and permit usage of my personal information for valid business purposes.
                                            </Text>

                                            <Text style={styles.modalTitle}>Non-Travel Disclaimer:</Text>
                                            <Text style={styles.modalText}>
                                                I acknowledge that I have thoroughly reviewed the provided information, and I consent to the processing of my details for the purpose of the claim/reimbursement. I am fully aware of Prodapt security and data privacy requirements.
                                            </Text>
                                        </View>
                                    </ScrollView>

                                    <View style={styles.modalFooter}>
                                        <TouchableOpacity
                                            style={styles.iAgreeBtn}
                                            onPress={() => {
                                                setDisclaimerAgreed(true);
                                                setShowDisclaimer(false);
                                            }}
                                        >
                                            <Text style={styles.iAgreeText}>I agree</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </MainLayout >
    );
};

// Simple Platform Helper
const platform = Platform.OS;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.OS === 'android' ? 25 : 0, // Manual safe area
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5'
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
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    searchBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    /* DISCLAIMER */
    disclaimerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
        marginTop: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    checkboxChecked: {
        backgroundColor: '#71B006',
        borderColor: '#71B006',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    disclaimerText: {
        fontSize: 14,
        color: '#616161',
    },
    disclaimerLink: {
        textDecorationLine: 'underline',
    },
    star: {
        color: 'red',
    },

    /* MODAL */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 24,
        position: 'relative',
        elevation: 10,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 14,
        zIndex: 10,
        padding: 5,
    },
    closeIconText: {
        fontSize: 20,
        color: '#BDBDBD',
        fontWeight: 'bold',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#616161',
        marginTop: 10,
        marginBottom: 6,
    },
    modalText: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 20,
        marginBottom: 16,
        textAlign: 'justify',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 16,
    },
    iAgreeBtn: {
        backgroundColor: '#71B006',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 6,
    },
    iAgreeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    /* NEW FIELDS */
    additionalFieldsSection: {
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    fieldCheckboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fieldCheckbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 3,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    fieldLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    fieldRow: {
        marginBottom: 20,
    },
    dummyDropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uploadPlaceholder: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 12,
        backgroundColor: '#fff',
        height: 80,
    },

    /* ACTION BUTTONS */
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        marginBottom: 30,
        gap: 12,
    },
    discardBtn: {
        borderWidth: 1,
        borderColor: '#71B006',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    discardText: {
        color: '#71B006',
        fontWeight: '600',
    },
    submitActionBtn: {
        backgroundColor: '#71B006',
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    disabledActionBtn: {
        backgroundColor: '#ccc',
    },
    submitActionText: {
        color: '#fff',
        fontWeight: '600',
    },

    // Multi-Step Navigation
    nextBtn: {
        backgroundColor: '#F5A623', // Yellowish/Orange
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#F5A623',
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
        marginBottom: 20,
    },
    disabledNextBtn: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    nextBtnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default CreateTicketScreen;
