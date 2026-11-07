import React from 'react';
import { Stack } from 'expo-router';
import { DoneeProvider, useAuth } from '../../state/DoneeProvider';
export default function AppLayout() { const {session}=useAuth(); if(!session)return null; return <DoneeProvider key={session.user.id} user={session.user}><Stack screenOptions={{headerShown:false}}><Stack.Screen name="(tabs)"/><Stack.Screen name="group-detail"/><Stack.Screen name="group-chat"/><Stack.Screen name="randomize"/></Stack></DoneeProvider>; }
