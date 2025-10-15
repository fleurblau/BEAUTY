import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LookProvider } from './src/providers/LookProvider';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <LookProvider>
        <AppNavigator />
      </LookProvider>
    </SafeAreaProvider>
  );
};

export default App;