import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Modal
} from 'react-native';
import TravelBg from '../assets/images/Frame 11810.svg';
import PlaneIcon from '../assets/images/Frame 11811.svg';

interface DateItem {
    day: string;
    date: number;
    fullDate: string;
    month: string;
}

interface CreateTicketFormProps {
    tripType: 'One Way' | 'Round Trip' | 'Multi-city';
    setTripType: (type: 'One Way' | 'Round Trip' | 'Multi-city') => void;
    from: string;
    setFrom: (val: string) => void;
    to: string;
    setTo: (val: string) => void;
    purpose: string;
    setPurpose: (val: string) => void;
    costCode: string;
    setCostCode: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    returnDate: string;
    setReturnDate: (val: string) => void;
    dates: DateItem[];
    // New Preferences Props
    mode: string;
    setMode: (val: string) => void;
    accommodation: string;
    setAccommodation: (val: string) => void;
    food: 'Veg' | 'Non-Veg';
    setFood: (val: 'Veg' | 'Non-Veg') => void;
    seat: string;
    setSeat: (val: string) => void;
    onwardTiming: string;
    setOnwardTiming: (val: string) => void;
    returnTiming: string;
    setReturnTiming: (val: string) => void;
    // Multi-City Props
    segments?: {
        id: string; from: string; to: string; date: string;
        mode: string; accommodation: string; food: string; seat: string; onwardTiming: string;
    }[];
    addSegment?: () => void;
    removeSegment?: (id: string) => void;
    updateSegment?: (id: string, field: string, value: string) => void;
}

const DESTINATIONS = [
    "Chicago", "New York", "San Francisco", "London", "Paris",
    "Tokyo", "Singapore", "Dubai", "Sydney", "Mumbai",
    "Berlin", "Toronto", "Hong Kong", "Barcelona", "Rome",
    "New Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"
];
const COST_CODES = [
    "CC-101 (Sales)", "CC-102 (Marketing)", "CC-103 (Engineering)",
    "CC-104 (HR)", "CC-105 (Operations)"
];
const PURPOSES = [
    "Client Meeting", "Conference", "Project Deployment",
    "Site Visit", "Training", "Team Offsite"
];

// Preference Options
const MODES = ["Flight", "Train", "Bus", "Cab"];
const ACCOMMODATION = ["Not Required", "Hotel", "Guest House"];
const SEATS = ["No Preference", "Window", "Aisle", "Middle"];
const TIMINGS = ["Any Timing", "Morning (6AM - 12PM)", "Afternoon (12PM - 6PM)", "Evening (6PM - 12AM)"];

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({
    tripType, setTripType,
    from, setFrom,
    to, setTo,
    purpose, setPurpose,
    costCode, setCostCode,
    startDate, setStartDate,
    returnDate, setReturnDate,
    dates,
    mode, setMode,
    accommodation, setAccommodation,
    food, setFood,
    seat, setSeat,
    onwardTiming, setOnwardTiming,
    returnTiming, setReturnTiming,
    // Destructure new props
    segments, addSegment, removeSegment, updateSegment
}) => {
    const [activeField, setActiveField] = useState<string | null>(null);
    const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null); // For tracking which segment is active

    const lastSegment = segments && segments.length > 0 ? segments[segments.length - 1] : null;

    // Show dates validation
    const showDates = (tripType === 'Multi-city')
        ? (segments && segments.some(s => s.id === activeSegmentId || s.id === lastSegment?.id))
        : (from && to);

    // Show preferences logic
    const showPreferences = (tripType === 'Multi-city')
        ? (lastSegment && lastSegment.from && lastSegment.to && lastSegment.date)
        : (showDates && startDate);

    // Check if adding new trip is allowed
    const canAddTrip = tripType === 'Multi-city' && showPreferences;

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
                onPress={() => {
                    setActiveField(null);
                    setActiveSegmentId(null);
                }}
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
                                    setActiveSegmentId(null);
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
        <View style={styles.cardContainer}>
            {/* Main Card */}
            <View style={styles.topCard}>

                {/* SECTION 1: Purpose & Cost */}
                <View style={styles.upperInputSection}>
                    <TouchableOpacity style={styles.inputBtn} onPress={() => setActiveField('PURPOSE')}>
                        <Text style={styles.inputLabel}>Purpose Of Travel</Text>
                        <Text style={[styles.inputText, !purpose && { color: '#ccc' }]}>{purpose || "Select Purpose"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.inputBtn} onPress={() => setActiveField('COST')}>
                        <Text style={styles.inputLabel}>Cost Code</Text>
                        <Text style={[styles.inputText, !costCode && { color: '#ccc' }]}>{costCode || "Select Cost Code"}</Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION 2: Toggle */}
                <View style={styles.middleSection}>
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
                        <TouchableOpacity
                            style={[styles.toggleBtn, tripType === 'Multi-city' && styles.activeToggle]}
                            onPress={() => setTripType('Multi-city')}
                        >
                            <Text style={[styles.toggleText, tripType === 'Multi-city' && styles.activeToggleText]}>Multi-city</Text>
                        </TouchableOpacity>
                    </View>

                    {/* DYNAMIC CONTENT AREA */}
                    {tripType === 'Multi-city' && segments ? (
                        // ================= MULTI-CITY FLOW =================
                        <View style={styles.multiCityContainer}>
                            {segments.map((seg, index) => {
                                const isSegmentFilled = seg.from && seg.to && seg.date;

                                return (
                                    <View key={seg.id} style={styles.segmentBlock}>
                                        <View style={styles.segmentHeader}>
                                            <Text style={styles.segmentTitle}>Trip {index + 1}</Text>
                                            {segments.length > 1 && index === segments.length - 1 && (
                                                <TouchableOpacity onPress={() => removeSegment && removeSegment(seg.id)}>
                                                    <Text style={{ color: 'red', fontSize: 12 }}>Remove</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>

                                        {/* ROUTE ROW */}
                                        <View style={styles.headerBg}>
                                            <TravelBg
                                                width="100%"
                                                height="100%"
                                                preserveAspectRatio="xMidYMid slice"
                                                style={StyleSheet.absoluteFill}
                                            />
                                            <View style={styles.headerOverlay}>
                                                <View style={styles.routeRow}>
                                                    <TouchableOpacity
                                                        style={styles.routeTouch}
                                                        onPress={() => {
                                                            setActiveSegmentId(seg.id);
                                                            setActiveField('FROM_SEG');
                                                        }}
                                                    >
                                                        <Text style={[styles.airportCode, seg.from ? { color: '#424242' } : {}]}>
                                                            {seg.from ? seg.from.substring(0, 3).toUpperCase() : '--'}
                                                        </Text>
                                                        <Text style={[styles.cityName, seg.from ? { color: '#424242' } : {}]}>{seg.from || 'From'}</Text>
                                                    </TouchableOpacity>

                                                    <View style={styles.planeLine}>
                                                        <PlaneIcon width={30} height={30} />
                                                    </View>

                                                    <TouchableOpacity
                                                        style={styles.routeTouch}
                                                        onPress={() => {
                                                            setActiveSegmentId(seg.id);
                                                            setActiveField('TO_SEG');
                                                        }}
                                                    >
                                                        <Text style={[styles.airportCode, seg.to ? { color: '#424242' } : {}]}>
                                                            {seg.to ? seg.to.substring(0, 3).toUpperCase() : '--'}
                                                        </Text>
                                                        <Text style={[styles.cityName, seg.to ? { color: '#424242' } : {}]}>{seg.to || 'To'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>

                                        {/* DATE SELECTION (Specific to Segment) */}
                                        <View style={{ marginTop: 15 }}>
                                            <Text style={styles.sectionTitle}>Select Departure Date</Text>
                                            <FlatList
                                                horizontal
                                                data={dates}
                                                keyExtractor={(item) => item.fullDate}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{ paddingHorizontal: 0 }}
                                                renderItem={({ item }) => {
                                                    const isSelected = seg.date === item.fullDate;
                                                    return (
                                                        <TouchableOpacity
                                                            style={[styles.dateItem, isSelected && styles.selectedDateItem]}
                                                            onPress={() => updateSegment && updateSegment(seg.id, 'date', item.fullDate)}
                                                        >
                                                            <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{item.day}</Text>
                                                            <Text style={[styles.dateNum, isSelected && styles.selectedDayText]}>{item.date}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                }}
                                            />
                                        </View>

                                        {/* PREFERENCES (Per Segment) */}
                                        {isSegmentFilled && (
                                            <View style={styles.preferencesContainer}>
                                                <View style={styles.prefHeaderPill}>
                                                    <Text style={styles.prefHeaderText}>Preferences for Trip {index + 1}</Text>
                                                </View>

                                                <View style={styles.prefCard}>
                                                    {/* Row 1 */}
                                                    <View style={styles.prefRow}>
                                                        <TouchableOpacity style={styles.prefItem} onPress={() => { setActiveSegmentId(seg.id); setActiveField('MODE_SEG'); }}>
                                                            <Text style={styles.prefLabel}>Mode*</Text>
                                                            <Text style={styles.prefValue}>{seg.mode || 'Flight'} ⌄</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.prefItem} onPress={() => { setActiveSegmentId(seg.id); setActiveField('ACCOM_SEG'); }}>
                                                            <Text style={styles.prefLabel}>Accom.</Text>
                                                            <Text style={styles.prefValue}>{seg.accommodation || 'Not Req'} ⌄</Text>
                                                        </TouchableOpacity>

                                                        <View style={styles.prefItem}>
                                                            <Text style={styles.prefLabel}>Food</Text>
                                                            <View style={styles.foodToggleContainer}>
                                                                <TouchableOpacity
                                                                    style={[styles.foodOption, seg.food === 'Veg' && styles.foodActive]}
                                                                    onPress={() => updateSegment && updateSegment(seg.id, 'food', 'Veg')}
                                                                >
                                                                    <Text style={[styles.foodText, seg.food === 'Veg' && styles.foodActiveText]}>Veg</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity
                                                                    style={[styles.foodOption, seg.food === 'Non-Veg' && styles.foodActive]}
                                                                    onPress={() => updateSegment && updateSegment(seg.id, 'food', 'Non-Veg')}
                                                                >
                                                                    <Text style={[styles.foodText, seg.food === 'Non-Veg' && styles.foodActiveText]}>Non-Veg</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    {/* Row 2 */}
                                                    <View style={styles.prefRow}>
                                                        <TouchableOpacity style={styles.prefItem} onPress={() => { setActiveSegmentId(seg.id); setActiveField('SEAT_SEG'); }}>
                                                            <Text style={styles.prefLabel}>Seat</Text>
                                                            <Text style={styles.prefValue}>{seg.seat || 'No Pref'} ⌄</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={styles.prefItem} onPress={() => { setActiveSegmentId(seg.id); setActiveField('TIMING_SEG'); }}>
                                                            <Text style={styles.prefLabel}>Timing</Text>
                                                            <Text style={styles.prefValue}>{seg.onwardTiming || 'Any'} ⌄</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}

                            {/* ADD TRIP BUTTON */}
                            {lastSegment && lastSegment.from && lastSegment.to && lastSegment.date && (
                                <TouchableOpacity style={styles.addTripBtn} onPress={addSegment}>
                                    <Text style={styles.addTripText}>+ Add another trip</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        // ================= STANDARD FLOW (One Way / Round Trip) =================
                        <>
                            {/* SVG Background Container */}
                            <View style={styles.headerBg}>
                                <TravelBg
                                    width="100%"
                                    height="100%"
                                    preserveAspectRatio="xMidYMid slice"
                                    style={StyleSheet.absoluteFill}
                                />

                                <View style={styles.headerOverlay}>
                                    <View style={styles.routeRow}>
                                        <TouchableOpacity style={styles.routeTouch} onPress={() => setActiveField('FROM')}>
                                            <Text style={[styles.airportCode, from ? { color: '#424242' } : {}]}>
                                                {from ? from.substring(0, 3).toUpperCase() : '--'}
                                            </Text>
                                            <Text style={[styles.cityName, from ? { color: '#424242' } : {}]}>{from || 'From'}</Text>
                                        </TouchableOpacity>

                                        <View style={styles.planeLine}>
                                            <PlaneIcon width={40} height={40} />
                                        </View>

                                        <TouchableOpacity style={styles.routeTouch} onPress={() => setActiveField('TO')}>
                                            <Text style={[styles.airportCode, to ? { color: '#424242' } : {}]}>
                                                {to ? to.substring(0, 3).toUpperCase() : '--'}
                                            </Text>
                                            <Text style={[styles.cityName, to ? { color: '#424242' } : {}]}>{to || 'To'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            {/* Date Section */}
                            {showDates && (
                                <View style={styles.dateContainer}>
                                    <View style={styles.dateSection}>
                                        <Text style={styles.sectionTitle}>Select Departure Date</Text>
                                        <FlatList
                                            horizontal
                                            data={dates}
                                            keyExtractor={(item) => item.fullDate}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingHorizontal: 0 }}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[styles.dateItem, startDate === item.fullDate && styles.selectedDateItem]}
                                                    onPress={() => setStartDate(item.fullDate)}
                                                >
                                                    <Text style={[styles.dayText, startDate === item.fullDate && styles.selectedDayText]}>{item.day}</Text>
                                                    <Text style={[styles.dateNum, startDate === item.fullDate && styles.selectedDayText]}>{item.date}</Text>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>

                                    {tripType === 'Round Trip' && (
                                        <View style={styles.dateSection}>
                                            <Text style={styles.sectionTitle}>Select Return Date</Text>
                                            <FlatList
                                                horizontal
                                                data={dates}
                                                keyExtractor={(item) => 'ret-' + item.fullDate}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={{ paddingHorizontal: 0 }}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={[styles.dateItem, returnDate === item.fullDate && styles.selectedDateItem]}
                                                        onPress={() => setReturnDate(item.fullDate)}
                                                    >
                                                        <Text style={[styles.dayText, returnDate === item.fullDate && styles.selectedDayText]}>{item.day}</Text>
                                                        <Text style={[styles.dateNum, returnDate === item.fullDate && styles.selectedDayText]}>{item.date}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* PREFERENCES SECTION (Standard) */}
                            {showPreferences && (
                                <View style={styles.preferencesContainer}>
                                    <View style={styles.prefHeaderPill}>
                                        <Text style={styles.prefHeaderText}>You can edit your preference here</Text>
                                    </View>

                                    <View style={styles.prefCard}>
                                        {/* Row 1 */}
                                        <View style={styles.prefRow}>
                                            <TouchableOpacity style={styles.prefItem} onPress={() => setActiveField('MODE')}>
                                                <Text style={styles.prefLabel}>Mode of Travel*</Text>
                                                <Text style={styles.prefValue}>{mode} ⌄</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.prefItem} onPress={() => setActiveField('ACCOM')}>
                                                <Text style={styles.prefLabel}>Accommodation</Text>
                                                <Text style={styles.prefValue}>{accommodation} ⌄</Text>
                                            </TouchableOpacity>

                                            <View style={styles.prefItem}>
                                                <Text style={styles.prefLabel}>Food</Text>
                                                <View style={styles.foodToggleContainer}>
                                                    <TouchableOpacity
                                                        style={[styles.foodOption, food === 'Veg' && styles.foodActive]}
                                                        onPress={() => setFood('Veg')}
                                                    >
                                                        <Text style={[styles.foodText, food === 'Veg' && styles.foodActiveText]}>Veg</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.foodOption, food === 'Non-Veg' && styles.foodActive]}
                                                        onPress={() => setFood('Non-Veg')}
                                                    >
                                                        <Text style={[styles.foodText, food === 'Non-Veg' && styles.foodActiveText]}>Non-Veg</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Row 2 */}
                                        <View style={styles.prefRow}>
                                            <TouchableOpacity style={styles.prefItem} onPress={() => setActiveField('SEAT')}>
                                                <Text style={styles.prefLabel}>Seat (i)</Text>
                                                <Text style={styles.prefValue}>{seat} ⌄</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.prefItem} onPress={() => setActiveField('ONWARD_TIME')}>
                                                <Text style={styles.prefLabel}>Onward Timing</Text>
                                                <Text style={styles.prefValue}>{onwardTiming} ⌄</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Return Timing */}
                                        {tripType === 'Round Trip' && (
                                            <View style={styles.prefRow}>
                                                <TouchableOpacity style={[styles.prefItem, { flex: 1 }]} onPress={() => setActiveField('RETURN_TIME')}>
                                                    <Text style={styles.prefLabel}>Return Timing</Text>
                                                    <Text style={styles.prefValue}>{returnTiming} ⌄</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>

            {/* Modals */}
            {renderSelectionModal(activeField === 'FROM', DESTINATIONS, setFrom, 'Origin')}
            {renderSelectionModal(activeField === 'TO', DESTINATIONS, setTo, 'Destination')}

            {/* Multi-City Specific Modals */}
            {renderSelectionModal(
                activeField === 'FROM_SEG',
                DESTINATIONS,
                (val) => activeSegmentId && updateSegment && updateSegment(activeSegmentId, 'from', val),
                'Origin'
            )}
            {renderSelectionModal(
                activeField === 'TO_SEG',
                DESTINATIONS,
                (val) => activeSegmentId && updateSegment && updateSegment(activeSegmentId, 'to', val),
                'Destination'
            )}

            {renderSelectionModal(activeField === 'PURPOSE', PURPOSES, setPurpose, 'Purpose')}
            {renderSelectionModal(activeField === 'COST', COST_CODES, setCostCode, 'Cost Code')}

            {/* Preference Modals (Standard) */}
            {renderSelectionModal(activeField === 'MODE', MODES, setMode, 'Mode of Travel')}
            {renderSelectionModal(activeField === 'ACCOM', ACCOMMODATION, setAccommodation, 'Accommodation')}
            {renderSelectionModal(activeField === 'SEAT', SEATS, setSeat, 'Seat Preference')}
            {renderSelectionModal(activeField === 'ONWARD_TIME', TIMINGS, setOnwardTiming, 'Onward Timing')}
            {renderSelectionModal(activeField === 'RETURN_TIME', TIMINGS, setReturnTiming, 'Return Timing')}

            {/* Preference Modals (Multi-City Segment) */}
            {renderSelectionModal(
                activeField === 'MODE_SEG',
                MODES,
                (val) => activeSegmentId && updateSegment && updateSegment(activeSegmentId, 'mode', val),
                'Mode of Travel'
            )}
            {renderSelectionModal(
                activeField === 'ACCOM_SEG',
                ACCOMMODATION,
                (val) => activeSegmentId && updateSegment && updateSegment(activeSegmentId, 'accommodation', val),
                'Accommodation'
            )}
            {renderSelectionModal(
                activeField === 'SEAT_SEG',
                SEATS,
                (val) => activeSegmentId && updateSegment && updateSegment(activeSegmentId, 'seat', val),
                'Seat Preference'
            )}
            {renderSelectionModal(
                activeField === 'TIMING_SEG',
                TIMINGS,
                (val) => activeSegmentId && updateSegment && updateSegment(activeSegmentId, 'onwardTiming', val),
                'Timing'
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 20,
    },
    topCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        padding: 20,
    },

    // ... Existing Styles ... (Copied from previous functionality)
    upperInputSection: { marginBottom: 20, gap: 12 },
    inputBtn: { borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 10 },
    inputLabel: { fontSize: 12, color: '#888', marginBottom: 4, fontWeight: '600' },
    inputText: { fontSize: 16, color: '#333', fontWeight: '500' },
    middleSection: { gap: 16 },
    toggleRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 25, padding: 4 },
    toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
    activeToggle: { backgroundColor: '#71B006' },
    toggleText: { color: '#555', fontWeight: '600', fontSize: 12 },
    activeToggleText: { color: '#fff' },
    headerBg: { height: 100, justifyContent: 'center', marginTop: 10, borderRadius: 12, overflow: 'hidden' },
    headerOverlay: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 12 },
    routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    routeTouch: { alignItems: 'center', padding: 10 },
    airportCode: { fontSize: 36, fontWeight: '900', color: '#71B006', textAlign: 'center' },
    cityName: { fontSize: 14, color: '#555', fontWeight: '600', textAlign: 'center' },
    planeLine: { flex: 1, alignItems: 'center' },
    dateContainer: { marginHorizontal: 16, marginBottom: 10 },
    dateSection: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 10 },
    dateItem: { backgroundColor: '#fff', width: 60, height: 75, justifyContent: 'center', alignItems: 'center', borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: '#eee' },
    selectedDateItem: { backgroundColor: '#71B006', borderColor: '#71B006' },
    dayText: { fontSize: 12, color: '#888', marginBottom: 4 },
    dateNum: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    selectedDayText: { color: '#fff' },

    // PREFERENCES
    preferencesContainer: {
        marginHorizontal: 16,
        marginBottom: 20,
    },
    prefHeaderPill: {
        backgroundColor: '#F5A623', // Orange-ish from Image
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: -10, // Overlap slightly or just sit on top
        zIndex: 1,
    },
    prefHeaderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    prefCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderTopLeftRadius: 0, // Visual style
        padding: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderWidth: 1,
        borderColor: '#eee',
    },
    prefRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 10,
    },
    prefItem: {
        flex: 1, // Distribute evenly
        minWidth: '30%',
        borderRightWidth: 1,
        borderRightColor: '#eee',
        paddingRight: 8,
    },
    prefLabel: {
        fontSize: 10,
        color: '#555',
        marginBottom: 4,
        fontWeight: '600',
    },
    prefValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    // Food Toggle
    foodToggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        borderRadius: 4,
        overflow: 'hidden',
        height: 30,
        width: 100,
    },
    foodOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    foodActive: {
        backgroundColor: '#71B006', // Green
    },
    foodText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#555',
    },
    foodActiveText: {
        color: '#fff',
    },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 20, padding: 20, maxHeight: '60%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalItemText: { fontSize: 16, color: '#333', textAlign: 'center' },

    // Add Trip Button
    addTripBtn: {
        backgroundColor: '#71B006',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    addTripText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

    // Multi-City Styles
    multiCityContainer: {
        marginTop: 10,
    },
    segmentBlock: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 20,
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
        overflow: 'hidden'
    },
    segmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#eee',
    },
    segmentTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
    },
});

export default CreateTicketForm;
