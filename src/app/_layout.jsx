import React from 'react';
import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../state/DoneeProvider';
function Routes() {
 const { session, starting } = useAuth();
 if (starting) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>กำลังตรวจบัญชี…</Text></View>;
 return <Stack screenOptions={{headerShown:false}}>
 <Stack.Protected guard={!session}><Stack.Screen name="login"/><Stack.Screen name="register"/></Stack.Protected>
 <Stack.Protected guard={!!session}><Stack.Screen name="(app)"/></Stack.Protected>
 </Stack>;
}
export default function RootLayout() { return <AuthProvider><Routes/></AuthProvider>; }
