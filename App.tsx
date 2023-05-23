import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
// npm run start
export default function App() {
  return (
    <View className="bg-gray-950 flex-1 items-center justify-center">
      <Text className="text-zinc-50 text-5xl">Rocketseat</Text>
      <StatusBar style="light" translucent />
    </View>
  )
}

/*
// css in-JS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

*/
