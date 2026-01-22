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
import MainLayout from '../components/MainLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import EmptyImg from '../assets/images/travel.svg';
import SearchIcon from '../assets/images/search.svg';
import ArrowBack from '../assets/images/arrow_back.svg';
import { TicketContext } from '../context/TicketContext';
import TicketCard from '../components/TicketCard';

type TravelRequestScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TravelRequestScreen: React.FC = () => {
    const navigation = useNavigation<TravelRequestScreenNavigationProp>();
    const { tickets } = useContext(TicketContext);
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleCreateTicket = () => {
        navigation.navigate('CreateTicket');
    };

    const filteredTickets = tickets.filter((ticket) =>
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout>
            <View style={styles.container}>
                {/* BACK */}
                <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
                    <ArrowBack width={24} height={24} style={{ marginRight: 8 }} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                {/* ACTION CARD */}
                <View style={styles.card}>
                    {/* Top Row: Search full width */}
                    <View style={styles.searchRow}>
                        <View style={styles.searchBoxExpanded}>
                            <SearchIcon width={20} height={20} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search Here"
                                placeholderTextColor="#9E9E9E"
                                style={styles.searchInput}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* Bottom Row: Count (left) + Plus Button (right) */}
                    <View style={styles.bottomRow}>
                        <View style={styles.countBox}>
                            <Text style={styles.countText}>Total count - {tickets.length}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.plusBtn}
                            onPress={handleCreateTicket}
                        >
                            <Text style={styles.plusIconText}>+</Text>
                        </TouchableOpacity>
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
                ) : filteredTickets.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { fontSize: 18, marginTop: 20 }]}>
                            NO tickets found
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTickets}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <TicketCard ticket={item} />}
                        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
                    />
                )}
            </View>
        </MainLayout>
    );
};

const styles = StyleSheet.create({
    /* SCREEN */
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

    /* NAV BAR */
    navbar: {
        backgroundColor: '#757575',
        paddingVertical: 10,
        alignItems: 'center',
    },

    navTitle: {
        color: '#F5F5F5',
        fontSize: 14,
        fontWeight: '600',
    },

    navSubtitle: {
        color: '#E0E0E0',
        fontSize: 11,
    },

    /* BACK */
    backRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    backText: {
        fontSize: 14,
        color: '#424242',
    },

    /* ACTION CARD (Search + Total) */
    card: {
        marginHorizontal: 16,
        padding: 36,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,

        shadowColor: '#424242',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginBottom: 20, // Add space before list
    },

    /* Search Row */
    searchRow: {
        marginBottom: 20,
    },

    searchBoxExpanded: {
        width: '100%',
        height: 54,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },

    searchIcon: {
        marginRight: 10,
    },

    searchInput: {
        fontSize: 16,
        flex: 1,
        padding: 0,
    },

    /* Bottom Row: Count + Plus Btn */
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    countBox: {
        flex: 1,
        backgroundColor: '#f39c12',
        paddingHorizontal: 16,
        justifyContent: 'center',
        borderRadius: 8,
        height: 54,
        marginRight: 12,
    },

    countText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#424242',
    },

    plusBtn: {
        width: 54,
        height: 54,
        borderRadius: 27, // Circle
        backgroundColor: '#74c657',
        justifyContent: 'center',
        alignItems: 'center',
    },

    plusIconText: {
        color: '#F5F5F5',
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 30, // Center vertically
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
        color: '#757575',
        lineHeight: 20,
    },
});

export default TravelRequestScreen;
