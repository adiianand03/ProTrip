import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Svg, { Path } from 'react-native-svg';
import GlobalIcon from '../assets/images/globalMobilityicon.svg';

// @ts-ignore
const DatePickerComponent = (DatePicker as unknown) as React.ComponentType<any>;

const DeleteIcon = () => (
    <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF4444" />
    </Svg>
);

const checklistItems = [
    "Undamaged Passport valid for minimum 6 months",
    "Minimum 4 blank pages in the passport",
    "Valid visa at the time of travel - Some countries will need 6 months validity (example Panama). This will be communicated in the email during approval for respective country.",
    "If the passport was renewed after obtaining visa, carry all old and new passport.",
    "Please carry all passports having valid visa even those are not related to this travel. You may need them if you need to transit via some countries if any change in the itinerary.",
    "Please ensure you have valid visa/authorisation to travel back to your employment country. Example: Work permit, residence permit, Entry Visa, Permanent residency etc",
    "Please make sure you have invite letter from the designation country. The Global Mobility team will provide this for locations where Prodapt operates entities. For other countries, please make sure you obtain letter from the client or event organiser.",
    "Please inform GM compliance team while requesting for approval if you hold dual citizenship so that we can provide necessary guidance if required.",
    "Ensure you have valid vaccination for certain countries. Eg: Yellow fever for African countries",
    "Ensure you download International SoS app before travel. Guidelines will be provided by travel team once ticket is issued."
];

interface VisaData {
    id: number;
    type: string;
    validity: string;
    isProcessedByProdapt: boolean;
}

const VisaDetailsItem = ({
    visa,
    onUpdate,
}: {
    visa: VisaData,
    onUpdate: (updatedVisa: VisaData) => void,
}) => {
    const [showVisaTypeDropdown, setShowVisaTypeDropdown] = useState(false);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const toggleVisaTypeDropdown = () => {
        setShowVisaTypeDropdown(!showVisaTypeDropdown);
    };

    const selectVisaType = (type: string) => {
        onUpdate({ ...visa, type });
        setShowVisaTypeDropdown(false);
    };

    return (
        <View style={styles.visaItemContainer}>
            {/* Visa Type */}
            <Text style={styles.label}>Visa Type<Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputContainer, { zIndex: 100 }]}>
                <TouchableOpacity style={styles.dropdownButton} onPress={toggleVisaTypeDropdown}>
                    <Text style={styles.dropdownButtonText} numberOfLines={1}>{visa.type}</Text>
                    <Text>▼</Text>
                </TouchableOpacity>
                {showVisaTypeDropdown && (
                    <View style={styles.dropdownMenu}>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => selectVisaType('Work Permit')}>
                            <Text>Work Permit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dropdownItem} onPress={() => selectVisaType('Business')}>
                            <Text>Business</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Validity */}
            <Text style={styles.label}>Validity<Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setOpen(true)}
                >
                    <Text style={{ color: visa.validity ? '#555' : '#888', fontSize: 12 }}>
                        {visa.validity ? `📅 ${visa.validity}` : 'Select Date'}
                    </Text>
                </TouchableOpacity>
                <DatePickerComponent
                    modal
                    open={open}
                    date={date}
                    mode="date"
                    onConfirm={(selectedDate: Date) => {
                        setOpen(false);
                        setDate(selectedDate);
                        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
                        onUpdate({
                            ...visa,
                            validity: selectedDate.toLocaleDateString('en-GB', options).replace(/ /g, ' ')
                        });
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </View>

            {/* Processed By Prodapt */}
            <Text style={styles.label}>Is visa processed By Prodapt?</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity
                    style={[styles.toggleButton, visa.isProcessedByProdapt && styles.toggleButtonActive]}
                    onPress={() => onUpdate({ ...visa, isProcessedByProdapt: true })}
                >
                    <Text style={[styles.toggleText, visa.isProcessedByProdapt && styles.toggleTextActive]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !visa.isProcessedByProdapt && styles.toggleButtonActive]}
                    onPress={() => onUpdate({ ...visa, isProcessedByProdapt: false })}
                >
                    <Text style={[styles.toggleText, !visa.isProcessedByProdapt && styles.toggleTextActive]}>No</Text>
                </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.itemDivider} />
        </View>
    );
};

const GlobalMobilityCard = () => {
    const [travelPurpose, setTravelPurpose] = useState('');
    const [visaNotRequired, setVisaNotRequired] = useState(false);
    const [checklistChecked, setChecklistChecked] = useState(false);
    const [showChecklistModal, setShowChecklistModal] = useState(false);

    // State for multiple visas
    const [visas, setVisas] = useState<VisaData[]>([
        { id: Date.now(), type: 'Select visa type', validity: '', isProcessedByProdapt: true }
    ]);

    const addVisa = () => {
        setVisas([
            ...visas,
            { id: Date.now() + Math.random(), type: 'Select visa type', validity: '', isProcessedByProdapt: true }
        ]);
    };

    const updateVisa = (updatedVisa: VisaData) => {
        setVisas(visas.map(v => v.id === updatedVisa.id ? updatedVisa : v));
    };

    const removeVisa = (id: number) => {
        if (visas.length > 1) {
            setVisas(visas.filter(v => v.id !== id));
        }
    };

    const handleChecklistPress = () => {
        if (!checklistChecked) {
            setShowChecklistModal(true);
        } else {
            setChecklistChecked(false);
        }
    };

    const confirmChecklist = () => {
        setChecklistChecked(true);
        setShowChecklistModal(false);
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <GlobalIcon width={24} height={24} style={{ marginRight: 10 }} />
                    <Text style={styles.headerTitle}>Global Mobility</Text>
                </View>
            </View>

            <View style={styles.content}>
                {/* Travel Purpose */}
                <Text style={styles.label}>Travel Purpose<Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={travelPurpose}
                    onChangeText={setTravelPurpose}
                    placeholder=""
                />

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Visa Not Required Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setVisaNotRequired(!visaNotRequired)}
                >
                    <View style={[styles.checkbox, visaNotRequired && styles.checkboxChecked]}>
                        {visaNotRequired && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxLabel}>Visa Not Required?</Text>
                </TouchableOpacity>

                {/* Visa Details Section - Multiple Visas */}
                {!visaNotRequired && visas.map((visa, index) => (
                    <View key={visa.id}>
                        {visas.length > 1 && (
                            <View style={styles.visaHeader}>
                                <Text style={styles.visaCounter}>Visa {index + 1}</Text>
                                <TouchableOpacity onPress={() => removeVisa(visa.id)} style={styles.deleteButton}>
                                    <DeleteIcon />
                                </TouchableOpacity>
                            </View>
                        )}
                        <VisaDetailsItem
                            visa={visa}
                            onUpdate={updateVisa}
                        />
                    </View>
                ))}

                {/* File Upload & Add Button Row */}
                {!visaNotRequired && (
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.fileUploadArea}>
                            <Text style={styles.fileUploadText}>Select or drop files</Text>
                            <Text style={styles.fileUploadSubText}>(JPG, PNG, PDF) up to 2 MB.</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.addButton} onPress={addVisa}>
                            <Text style={styles.addButtonText}>+ Add Visa</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Travel Document Checklist */}
                <View style={styles.checklistContainer}>
                    <TouchableOpacity
                        style={[styles.checkboxSquare, checklistChecked && styles.checkboxSquareChecked]}
                        onPress={handleChecklistPress}
                    >
                        {checklistChecked && <Text style={styles.checkmarkWhite}>✓</Text>}
                    </TouchableOpacity>
                    <Text style={styles.checklistLabel}>Travel Document Checklist <Text style={styles.required}>*</Text></Text>
                </View>

                {/* Checklist Modal */}
                <Modal
                    visible={showChecklistModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowChecklistModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Document Checklist for Travel</Text>
                            <ScrollView style={styles.modalScroll}>
                                {checklistItems.map((item, index) => (
                                    <View key={index} style={styles.checklistItem}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.checklistText}>{item}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity style={styles.okButton} onPress={confirmChecklist}>
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'visible', // For dropdown
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
        color: '#333',
    },
    content: {
        padding: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    required: {
        color: 'red',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
        fontSize: 14,
        marginBottom: 15,
    },
    inputContainer: {
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#fff',
    },
    checkmark: {
        color: '#333',
        fontSize: 12,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#555',
    },
    visaItemContainer: {
        marginBottom: 10,
    },
    visaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 5,
    },
    visaCounter: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#71B006',
    },
    deleteButton: {
        padding: 4,
    },
    itemDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 15,
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    dropdownButtonText: {
        fontSize: 12,
        color: '#555',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 2,
        zIndex: 100,
        elevation: 5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    toggleButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 2,
    },
    toggleButtonActive: {
        backgroundColor: '#71B006', // Green
    },
    toggleText: {
        fontSize: 12,
        color: '#333',
    },
    toggleTextActive: {
        color: '#fff',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    fileUploadArea: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        backgroundColor: '#F9F9F9',
        padding: 15,
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 4,
    },
    fileUploadText: {
        fontSize: 12,
        color: '#333',
    },
    fileUploadSubText: {
        fontSize: 10,
        color: '#777',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#71B006', // Green
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    checklistContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxSquare: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#71B006',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSquareChecked: {
        backgroundColor: '#71B006',
    },
    checkmarkWhite: {
        color: '#fff',
        fontSize: 12,
    },
    checklistLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        width: '100%',
        maxHeight: '80%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center',
    },
    modalScroll: {
        marginBottom: 20,
    },
    checklistItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        fontSize: 14,
        marginRight: 8,
        color: '#71B006',
        marginTop: 2,
    },
    checklistText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        lineHeight: 20,
    },
    okButton: {
        backgroundColor: '#71B006',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    okButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default GlobalMobilityCard;
