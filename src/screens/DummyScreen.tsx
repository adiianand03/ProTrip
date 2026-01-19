import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface DummyScreenProps {
    title: string;
    onBack: () => void;
}

const DummyScreen: React.FC<DummyScreenProps> = ({ title, onBack }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
            <TouchableOpacity onPress={onBack} style={styles.button}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        padding: 10,
        backgroundColor: '#4A4A4A',
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default DummyScreen;
