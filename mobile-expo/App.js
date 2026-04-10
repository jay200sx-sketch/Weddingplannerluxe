import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const webAppUrl =
    process.env.EXPO_PUBLIC_WEB_APP_URL ||
    'https://jay200sx-sketch.github.io/Weddingplannerluxe/';

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: webAppUrl }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#d45188" />
            <Text style={styles.loadingText}>Loading Wedding Planner Luxe...</Text>
          </View>
        )}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9fc',
  },
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff9fc',
  },
  loadingText: {
    color: '#8a315c',
    fontSize: 16,
    fontWeight: '600',
  },
});
