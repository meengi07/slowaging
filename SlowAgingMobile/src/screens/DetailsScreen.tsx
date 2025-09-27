import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../navigation/types';

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Details'
>;

const DetailsScreen: React.FC<DetailsScreenProps> = ({route}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      {route?.params?.message ? (
        <Text style={styles.subtitle}>Message: {route.params.message}</Text>
      ) : (
        <Text style={styles.subtitle}>No message provided.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
  },
});

export default DetailsScreen;
