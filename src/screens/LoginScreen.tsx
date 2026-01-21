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
import EyeIcon from '../assets/images/eye.svg';
import EyeOffIcon from '../assets/images/eye-off.svg';
import Logo from '../assets/images/applogo.svg';

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { height: screenHeight } = Dimensions.get('window');

    // Hardcoded credentials
    const HARDCODED_EMAIL = 'abc@example.com';
    const HARDCODED_PASSWORD = '123456';

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
            navigation.replace('Home');
        } else {
            Alert.alert('Error', 'Invalid email or password');
        }
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
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter your password"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? (
                                <EyeIcon width={24} height={24} />
                            ) : (
                                <EyeOffIcon width={24} height={24} />
                            )}
                        </TouchableOpacity>
                    </View>

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
        backgroundColor: '#fff', // Cloudy/Light Blue-Grey
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
        color: '#71B006',
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
        color: '#71B006',
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#fff',
        height: 50,
    },
    passwordInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
    },
    eyeButton: {
        padding: 10,
    },
    button: {
        backgroundColor: '#71B006',
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
