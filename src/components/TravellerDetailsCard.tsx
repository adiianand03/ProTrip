import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import TravellerIcon from '../assets/images/Traveller.svg';
import ChevronDown from '../assets/images/chevron_down.svg';
import TrashIcon from '../assets/images/trash.svg';
import DatePicker from 'react-native-date-picker';

interface Traveller {
    idProof: string;
    identityNumber: string;
    expiryDate: Date;
    issuedBy: string;
    relationship: string;
}

interface TravellerDetailsCardProps {
    isInternational: boolean;
}

const TravellerDetailsCard = ({ isInternational }: TravellerDetailsCardProps) => {
    // Form State for Multiple Travellers
    const [travellers, setTravellers] = useState<Traveller[]>([{
        idProof: 'Passport',
        identityNumber: '',
        expiryDate: new Date(),
        issuedBy: '',
        relationship: 'Self'
    }]);

    // UI State for managing open dropdowns/pickers specific to an index
    const [openIdDropdownIndex, setOpenIdDropdownIndex] = useState<number | null>(null);
    const [openRelDropdownIndex, setOpenRelDropdownIndex] = useState<number | null>(null);
    const [openDatePickerIndex, setOpenDatePickerIndex] = useState<number | null>(null);

    // Options - Dynamic based on International flag
    const idOptions = isInternational
        ? ['Passport']
        : ['Passport', 'Aadhaar', 'PAN', 'Voter ID'];

    const relOptions = ['Self', 'Spouse', 'Children'];

    const handleAddTraveller = () => {
        setTravellers([...travellers, {
            idProof: 'Passport',
            identityNumber: '',
            expiryDate: new Date(),
            issuedBy: '',
            relationship: 'Spouse' // Default to Spouse for subsequent travellers
        }]);
    };

    const handleRemoveTraveller = (index: number) => {
        const newList = [...travellers];
        newList.splice(index, 1);
        setTravellers(newList);
    };

    const updateTraveller = (index: number, field: keyof Traveller, value: any) => {
        const newList = [...travellers];
        newList[index] = { ...newList[index], [field]: value };
        setTravellers(newList);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const Dropdown = ({ value, options, isOpen, onToggle, onSelect }: any) => (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownButton} onPress={onToggle}>
                <Text style={styles.dropdownText}>{value}</Text>
                <ChevronDown width={12} height={12} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdownList}>
                    {options.map((opt: string, index: number) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => onSelect(opt)}
                        >
                            <Text style={styles.dropdownItemText}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TravellerIcon width={24} height={24} style={{ marginRight: 10 }} />
                        <Text style={styles.headerTitle}>Traveller Details</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {Array.isArray(travellers) && travellers.map((traveller, index) => (
                        <View key={index} style={[styles.travellerSection, index > 0 && styles.borderTop]}>
                            {/* Title & Remove Button */}
                            <View style={styles.travellerHeader}>
                                <Text style={styles.travellerTitle}>Traveller {index + 1}</Text>
                                {travellers.length > 1 && (
                                    <TouchableOpacity onPress={() => handleRemoveTraveller(index)}>
                                        <TrashIcon width={20} height={20} />
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* ID Proof Dropdown */}
                            <View style={[styles.fieldContainer, { zIndex: openIdDropdownIndex === index ? 2000 : 1 }]}>
                                <Text style={styles.label}>ID Proof<Text style={styles.required}>*</Text></Text>
                                <Dropdown
                                    value={traveller.idProof}
                                    options={idOptions}
                                    isOpen={openIdDropdownIndex === index}
                                    onToggle={() => {
                                        setOpenIdDropdownIndex(openIdDropdownIndex === index ? null : index);
                                        setOpenRelDropdownIndex(null);
                                    }}
                                    onSelect={(val: string) => {
                                        updateTraveller(index, 'idProof', val);
                                        setOpenIdDropdownIndex(null);
                                    }}
                                />
                            </View>

                            {/* Upload Section */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Upload ID proof<Text style={styles.required}>*</Text></Text>
                                <TouchableOpacity style={styles.uploadBox}>
                                    <View style={styles.uploadContent}>
                                        <Text style={styles.uploadText}>Select or drop files</Text>
                                        <Text style={styles.uploadSubText}>(JPG, PNG, PDF) up to 2 MB.</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* Identity Number */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Identity Number<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    value={traveller.identityNumber}
                                    onChangeText={(text) => updateTraveller(index, 'identityNumber', text)}
                                    placeholder="Enter Identity Number"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Expiry Date */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Expiry Date<Text style={styles.required}>*</Text></Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setOpenDatePickerIndex(index)}
                                >
                                    <Text style={styles.dateText}>{formatDate(traveller.expiryDate)}</Text>
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    open={openDatePickerIndex === index}
                                    date={traveller.expiryDate}
                                    mode="date"
                                    onConfirm={(date) => {
                                        setOpenDatePickerIndex(null);
                                        updateTraveller(index, 'expiryDate', date);
                                    }}
                                    onCancel={() => {
                                        setOpenDatePickerIndex(null);
                                    }}
                                />
                            </View>

                            {/* Issued By */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Issued By<Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    value={traveller.issuedBy}
                                    onChangeText={(text) => updateTraveller(index, 'issuedBy', text)}
                                    placeholder="Eg. Government of India"
                                    placeholderTextColor="#999"
                                />
                            </View>

                            {/* Relationship Dropdown & Add Button Row */}
                            <View style={[styles.fieldContainer, { zIndex: openRelDropdownIndex === index ? 3000 : 1, marginBottom: (openRelDropdownIndex === index ? 150 : 15) }]}>
                                <Text style={styles.label}>Relationship<Text style={styles.required}>*</Text></Text>
                                <View style={styles.relationshipRow}>
                                    <View style={styles.relDropdownContainer}>
                                        <Dropdown
                                            value={traveller.relationship}
                                            options={relOptions}
                                            isOpen={openRelDropdownIndex === index}
                                            onToggle={() => {
                                                setOpenRelDropdownIndex(openRelDropdownIndex === index ? null : index);
                                                setOpenIdDropdownIndex(null);
                                            }}
                                            onSelect={(val: string) => {
                                                updateTraveller(index, 'relationship', val);
                                                setOpenRelDropdownIndex(null);
                                            }}
                                        />
                                    </View>

                                    {/* Add Button beside Relationship (visible only on last item) */}
                                    {index === travellers.length - 1 && (
                                        <TouchableOpacity style={styles.miniAddButton} onPress={handleAddTraveller}>
                                            <Text style={styles.miniAddButtonText}>+ Add</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginHorizontal: 16,
        shadowColor: '#000',
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
        color: '#333',
    },
    content: {
        padding: 15,
    },
    travellerSection: {
        marginBottom: 10,
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
        marginTop: 5,
    },
    travellerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    travellerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#71B006',
    },
    fieldContainer: {
        marginBottom: 15,
        zIndex: 1,
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 6,
        fontWeight: '600',
    },
    required: {
        color: 'red',
    },
    input: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
    },
    dropdownContainer: {
        zIndex: 10,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdownText: {
        fontSize: 14,
        color: '#333',
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        zIndex: 1000,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#333',
    },
    uploadBox: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 4,
        padding: 15,
        alignItems: 'center',
        marginTop: 5,
    },
    uploadContent: {
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    uploadSubText: {
        fontSize: 10,
        color: '#999',
    },
    dateButton: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dateText: {
        fontSize: 14,
        color: '#333',
    },
    relationshipRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    relDropdownContainer: {
        flex: 1,
    },
    miniAddButton: {
        backgroundColor: '#71B006',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
        elevation: 2,
    },
    miniAddButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    }
});

export default TravellerDetailsCard;
