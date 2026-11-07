import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { useDonee } from '../../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, addButton, completed, groupRows, groups, hs, icon, localDate, navigate, personalTasks, section, setFilter, taskRows } = useDonee();
  return <ScreenFrame>{<>
            <Pressable accessibilityRole="button" onPress={() => { setFilter('Today'); navigate('Tasks'); }}>
              <LinearGradient colors={['#FAD8FA', '#FCD9EF', '#FFF5C5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.8 }} style={hs.banner}>
                <View style={hs.star}>{icon('star-outline', 29, '#EBD05E')}</View><View style={hs.flex}><Text style={hs.bannerTitle}>Today&apos;s Task</Text><Text style={hs.bannerSubtitle}>{completed ? `${completed} tasks completed` : 'Keep going!'}</Text></View><View style={hs.bannerArrow}>{icon('chevron-forward', 21, '#70C8DC')}</View>
              </LinearGradient>
            </Pressable>
            {section('My Tasks', 'Tasks')}{taskRows(personalTasks.filter(t => t.date === localDate()).slice(0, 3))}
            {section('Group Assignment', 'Groups')}{groupRows(groups.filter(g => g.joined).slice(0, 1))}
            <View style={hs.actions}><Pressable accessibilityRole="button" style={hs.random} onPress={() => navigate('Randomize')}><Text style={{ fontSize: 23 }}>🎲</Text><Text style={hs.randomText}>Randomize Tasks</Text></Pressable>{addButton()}</View>
          </>}</ScreenFrame>;
}
