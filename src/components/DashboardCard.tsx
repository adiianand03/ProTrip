import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SvgProps } from 'react-native-svg';

interface DashboardCardProps {
  title: string;
  Icon: React.FC<SvgProps>;
  onPress: () => void;
  count?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  Icon,
  onPress,
  count,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        {count !== undefined && (
          <View style={{ backgroundColor: '#e8f5e9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 10 }}>
            <Text style={{ color: '#74c657', fontWeight: 'bold' }}>{count} Active</Text>
          </View>
        )}
        <View style={styles.iconContainer}>
          {/* Use flex to fill available space, preserve aspect ratio to fit fully */}
          <Icon width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginVertical: 10,
    width: '90%',
    maxWidth: 340,
    alignSelf: 'center',
    height: 340, // Further increased height to ensure no clipping
    shadowColor: '#424242',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15, // Reduced padding
    paddingBottom: 5,
  },
  iconContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#b3e0a3',
    marginBottom: 10, // Reduced margin
    textAlign: 'center',
    textTransform: 'none',
  },
});

export default DashboardCard;
