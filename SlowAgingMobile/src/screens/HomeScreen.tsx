import React, {useCallback, useMemo, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import axios from 'axios';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {LineChart} from 'react-native-chart-kit';
import {CustomButton} from '../components';
import {RootStackParamList} from '../navigation/types';

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const chartWidth = Dimensions.get('window').width - 32;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [pingResult, setPingResult] = useState<string>('');

  const chartData = useMemo(
    () => ({
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      datasets: [
        {
          data: [0, 1, -0.5, 2, -1, 1.5, 0.5],
          color: () => 'rgba(0, 122, 255, 1)',
          strokeWidth: 2,
        },
      ],
    }),
    [],
  );

  const pickImage = useCallback(async () => {
    const res = await launchImageLibrary({mediaType: 'photo', quality: 0.7});
    if (!res.didCancel && res.assets && res.assets.length > 0) {
      setSelectedImage(res.assets[0]);
    }
  }, []);

  const ping = useCallback(async () => {
    try {
      const {data} = await axios.get('https://httpbin.org/get');
      setPingResult(`ok: ${data.url ?? 'pong'}`);
    } catch (e: any) {
      setPingResult(`error: ${e?.message ?? 'unknown'}`);
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SlowAging - Setup Validation</Text>
      <View style={styles.row}>
        <CustomButton title="Pick Image" onPress={pickImage} />
        <View style={styles.spacer} />
        <CustomButton title="Ping" onPress={ping} />
      </View>
      {!!selectedImage?.uri && (
        <Image
          source={{uri: selectedImage.uri}}
          style={styles.preview}
          resizeMode="cover"
        />
      )}
      {!!pingResult && <Text style={styles.ping}>{pingResult}</Text>}
      <Text style={styles.subtitle}>Sample Trend</Text>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={180}
        withDots
        withShadow={false}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={styles.chart}
      />
      <View style={styles.row}>
        <CustomButton
          title="Go to Details"
          onPress={() => navigation.navigate('Details', {message: 'Hello'})}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    width: 12,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#eee',
  },
  ping: {
    marginTop: 8,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default HomeScreen;
