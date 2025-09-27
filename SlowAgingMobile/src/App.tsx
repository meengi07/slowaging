import React, {useCallback, useMemo, useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {LineChart} from 'react-native-chart-kit';

type RootStackParamList = {
  Home: undefined;
  Details: {message: string} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({navigation}: {navigation: any}): React.JSX.Element {
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

  const chartWidth = Dimensions.get('window').width - 32;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SlowAging - Setup Validation</Text>
      <View style={styles.row}>
        <Button title="Pick Image" onPress={pickImage} />
        <View style={styles.spacer} />
        <Button title="Ping" onPress={ping} />
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
        <Button
          title="Go to Details"
          onPress={() => navigation.navigate('Details', {message: 'Hello'})}
        />
      </View>
    </ScrollView>
  );
}

function DetailsScreen({route}: {route: any}): React.JSX.Element {
  return (
    <View style={styles.center}>
      <Text style={styles.details}>Details Screen</Text>
      {route?.params?.message ? (
        <Text style={styles.details}>Message: {route.params.message}</Text>
      ) : null}
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default App;
