import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const emptyImg = require('../assets/images/travel.svg'); // User said first page image is travel.svg. Assuming they meant to replace empty data image
// BUT wait, in the provided code they require '../assets/images/empty-data-travel.png'. 
// And in the prompt they said "image inside the first page is travel.svg".
// I don't have empty-data-travel.png in the file list I saw earlier (only travel.svg). 
// I will use travel.svg. Since it's an SVG, I need to import it as component, not require.

import EmptyImg from '../assets/images/travel.svg';
import SearchIcon from '../assets/images/search.svg';

type TravelSettlementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TravelSettlement = () => {
    const navigation = useNavigation<TravelSettlementScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6b6b6b" />

            {/* TOP NAV BAR */}
            <View style={styles.navbar}>
                <Text style={styles.navTitle}></Text>
                <Text style={styles.navSubtitle}></Text>
            </View>

            {/* BACK */}
            <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {/* ACTION CARD */}
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() =>
                        navigation.navigate('TravelSettlementReport')
                    }
                >
                    <Text style={styles.primaryBtnText}>Create Travel Settlement</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                    <View style={styles.countBox}>
                        <Text style={styles.countText}>Total count - 0</Text>
                    </View>

                    <View style={styles.searchBox}>
                        <SearchIcon width={20} height={20} style={styles.searchIcon} />
                        <TextInput
                            placeholder="Search Here"
                            placeholderTextColor="#777"
                            style={styles.searchInput}
                        />
                    </View>
                </View>
            </View>

            {/* EMPTY STATE */}
            <View style={styles.emptyContainer}>
                <EmptyImg width="100%" height={300} style={styles.image} />
                {/* <Image source={emptyImg} style={styles.image} /> */}
                <Text style={styles.emptyText}>
                    Give that expense request a kickstart and{"\n"}
                    let's get you on the move!
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default TravelSettlement;

const styles = StyleSheet.create({
    /* SCREEN */
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },

    /* NAV BAR */
    navbar: {
        backgroundColor: '#6b6b6b',
        paddingVertical: 10,
        alignItems: 'center',
    },

    navTitle: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },

    navSubtitle: {
        color: '#eaeaea',
        fontSize: 11,
    },

    /* BACK */
    backRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    backText: {
        fontSize: 14,
        color: '#222',
    },

    /* CARD */
    card: {
        marginHorizontal: 16,
        padding: 30,
        backgroundColor: '#ffffff',
        borderRadius: 12,

        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },

    primaryBtn: {
        height: 48,
        backgroundColor: '#7cb518',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },

    primaryBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },

    row: {
        flexDirection: 'row',
        gap: 12,
    },

    countBox: {
        backgroundColor: '#ffd37d',
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 6,
        height: 44,
    },

    countText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },

    searchBox: {
        flex: 1,
        height: 44,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },

    searchIcon: {
        marginRight: 8,
    },

    searchInput: {
        fontSize: 14,
        flex: 1,
        padding: 0,
    },

    /* EMPTY STATE */
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    image: {
        // width: '100%',
        // height: 300, // tuned for 912dp height
        // resizeMode: 'contain',
        marginBottom: 12,
    },

    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
