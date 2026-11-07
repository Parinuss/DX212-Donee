import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { useDonee } from '../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, currentGroup, currentGroupTasks, gradientButton, hs, icon, memberName, navigate, openSheet, openTask, pendingGroupTasks, section, setSelectedMembers, setSelectedTasks, taskRows, user } = useDonee();
  return <ScreenFrame>{<>
            <View style={hs.profileHero}><View style={hs.avatar}>{icon(currentGroup.icon, 40, '#8654DA')}</View><Text style={hs.sectionTitle}>{currentGroup.name}</Text><Text style={hs.subtitle}>{currentGroup.members.length} members</Text></View>
            {section('Members')}<View style={hs.chips}>{currentGroup.members.map(member => <Text key={member.id} style={hs.memberChip}>{member.name}{member.id === user.id ? ' (คุณ)' : ''}</Text>)}</View>
            {currentGroup.id && <>
              <Pressable style={[hs.outlineButton, { marginBottom: 16 }]} onPress={() => router.push({ pathname: '/group-chat', params: { groupId: currentGroup.id } })}><Text style={hs.link}>💬 Group Chat</Text></Pressable>
              <Pressable style={hs.outlineButton} accessibilityRole="button" onPress={() => openSheet('invite')}>
                {icon('person-add-outline', 20, '#A487DD')}<Text style={hs.link}>เชิญเพื่อน · Invite Friends</Text>
              </Pressable>
              {section('Group Tasks')}
              {gradientButton('+ Add Group Task', () => openTask())}
              <View style={{ marginTop: 14 }}>{taskRows(currentGroupTasks, true)}</View>
              {section('Assigned tasks')}
              {currentGroupTasks.filter(t => t.assigned_to).map(task => <View key={task.id} style={hs.row}>{icon('person-circle-outline', 26, '#AA80DE')}<View style={hs.flex}><Text style={hs.rowText}>{memberName(task.assigned_to)}</Text><Text style={hs.small}>{task.title}</Text></View></View>)}
              {!currentGroupTasks.some(t => t.assigned_to) && <Text style={[hs.muted, { marginBottom: 20 }]}>No tasks assigned yet.</Text>}
              {gradientButton('🎲  Assign tasks randomly', () => { setSelectedTasks(pendingGroupTasks.map(t => t.id)); setSelectedMembers(currentGroup.members.map(member => member.id)); navigate('Randomize'); })}
            </>}
          </>}</ScreenFrame>;
}
