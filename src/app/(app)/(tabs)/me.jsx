import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { useDonee } from '../../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, completed, hs, icon, openSheet, profile, tasks } = useDonee();
  return <ScreenFrame>{<>
            <LinearGradient colors={['#E8D8FF', '#FFF2CC', '#DEFAF1']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={hs.profileHero}>
              <View style={hs.avatar}>{icon('person-outline', 40, '#8654DA')}</View><Text style={hs.sectionTitle}>{profile.name}</Text><Text style={hs.small}>{profile.email}</Text>
            </LinearGradient>
            <View style={hs.box}>{[['My Profile', 'person-outline', 'profile'], ['Settings', 'settings-outline', 'settings'], ['Help & Support', 'help-circle-outline', 'help'], ['Log Out', 'log-out-outline', 'logout']].map(([label, itemIcon, name]) => <Pressable key={label} style={hs.menuRow} accessibilityRole="button" onPress={() => openSheet(name, name === 'profile' ? profile : {})}>{icon(itemIcon, 21, '#797BC0')}<Text style={[hs.rowText, hs.flex]}>{label}</Text>{icon('chevron-forward', 17)}</Pressable>)}</View>
            <Text style={[hs.small, { textAlign: 'center', marginTop: 20 }]}>{completed} of {tasks.length} tasks completed</Text>
          </>}</ScreenFrame>;
}
