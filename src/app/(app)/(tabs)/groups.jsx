import { Pressable, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useDonee } from '../../../state/DoneeProvider';

export default function Page() {
  const { ScreenFrame, gradientButton, groupBusy, groupRows, groupTab, groups, hs, joinByCode, setGroupTab } = useDonee();
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const joinGroup = () => joinByCode(inviteCode, setJoinError);

  return <ScreenFrame>
    <View style={hs.segment}>
      {['My Groups', 'Join Group'].map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: groupTab === value }} onPress={() => { setJoinError(''); setGroupTab(value); }} style={[hs.segmentItem, groupTab === value && hs.segmentSelected]}>
        <Text style={{ color: groupTab === value ? 'white' : '#8BA0C0', fontSize: 13 }}>{value}</Text>
      </Pressable>)}
    </View>
    {groupTab === 'My Groups' ? groupRows(groups) : <View>
      <View style={{ marginTop: 13 }}>
        <Text style={hs.inputLabel}>รหัสเชิญ · Invite code</Text>
        <TextInput
          accessibilityLabel="รหัสเชิญ · Invite code"
          value={inviteCode}
          onChangeText={value => { setInviteCode(value); setJoinError(''); }}
          placeholder="รหัสเชิญจากเพื่อน"
          placeholderTextColor="#A0AEC6"
          style={hs.input}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={32}
          editable={!groupBusy}
          onSubmitEditing={joinGroup}
          returnKeyType="go"
        />
      </View>
      <Text style={[hs.small, { marginTop: 12 }]}>ใช้รหัสของกลุ่มจริงที่เพื่อนส่งให้ ระบบจะตรวจสอบรหัสเชิญ</Text>
      {!!joinError && <Text accessibilityRole="alert" style={{ color: '#C1769E', marginTop: 12 }}>{joinError}</Text>}
      <View style={{ marginTop: 20 }}>
        {gradientButton(groupBusy ? 'กำลังเข้าร่วม…' : 'เข้าร่วมกลุ่ม · Join Group', joinGroup, groupBusy)}
      </View>
    </View>}
  </ScreenFrame>;
}
