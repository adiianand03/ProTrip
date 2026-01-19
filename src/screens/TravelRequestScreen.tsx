import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import EmptyImg from '../assets/images/travel.svg';
import SearchIcon from '../assets/images/search.svg';
import { TicketContext } from '../context/TicketContext';
import TicketCard from '../components/TicketCard';

type TravelRequestScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TravelRequestScreen: React.FC = () => {
    const navigation = useNavigation<TravelRequestScreenNavigationProp>();
    const { tickets } = useContext(TicketContext);

    const handleCreateTicket = () => {
        navigation.navigate('CreateTicket');
    };

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
                    onPress={handleCreateTicket}
                >
                    <Text style={styles.primaryBtnText}>Create Ticket</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                    <View style={styles.countBox}>
                        <Text style={styles.countText}>Total count - {tickets.length}</Text>
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

            {/* CONTENT: List or Empty State */}
            {tickets.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <EmptyImg width="100%" height={300} style={styles.image} />
                    <Text style={styles.emptyText}>
                        Make a new trip request and get moving!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={tickets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TicketCard ticket={item} />}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
                />
            )}
        </SafeAreaView>
    );
};

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
        marginBottom: 20,
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
        marginBottom: 12,
    },

    emptyText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});

export default TravelRequestScreen;
