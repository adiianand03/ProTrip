import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CreateTicketForm from '../components/CreateTicketForm';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type CreateTicketScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CreateTicketScreen = () => {
    const navigation = useNavigation<CreateTicketScreenNavigationProp>();

    const handleDiscard = () => {
        navigation.goBack();
    };

    const handleSubmit = () => {
        // Form component handles alert logic or we can move it here.
        // Current Form component handles alert. We just need to navigate Home after.
        // Changing to goBack() to return to the TravelRequest list as requested.
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#6b6b6b" />
            {/* Navbar filler to match others if needed, though form handles its own header/back usually. 
                 The Form component has a "Back" button text. 
                 Since user said "clicking back should take us only one page back", 
                 and Form has "Discard" (which acts as back).
              */}
            <CreateTicketForm onDiscard={handleDiscard} onSubmit={handleSubmit} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default CreateTicketScreen;
