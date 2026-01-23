import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MobileBg from '../assets/images/mobile-bg.svg';
import Logo from '../assets/images/applogo.svg';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const { height: screenHeight } = Dimensions.get('window');

    // Hardcoded credentials - kept for reference if needed, but logic is relaxed
    const HARDCODED_EMAIL = 'abc@example.com';

    const handleLogin = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        // For simulation/SSO replication, we just proceed with the entered email
        // Logic can be added here to validate against allowed domains/users if needed
        login(email);
        navigation.replace('Home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={StyleSheet.absoluteFill}>
                <MobileBg width="100%" height="55%" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: screenHeight * 0.025 }} />
                <MobileBg width="100%" height="45%" preserveAspectRatio="xMidYMin slice" style={{ position: 'absolute', top: screenHeight * 0.5125 }} />
            </View>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>ProTrip</Text>
                </View>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Logo width={150} height={150} />
                </View>

                {/* Login Form */}
                <View style={styles.form}>
                    <Text style={styles.label}>Email/Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#BDBDBD"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Cloudy/Light Blue-Grey
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#74c657',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 150,
        height: 150,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#74c657',
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        fontSize: 16,
        color: '#424242',
        backgroundColor: '#F5F5F5',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#F5F5F5',
        height: 50,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#424242',
    },
    eyeButton: {
        padding: 10,
    },
    button: {
        backgroundColor: '#74c657',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
