import { Pressable, Text, View } from 'react-native';
import React from 'react';
import { useDonee } from '../../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, groupRows, groupTab, groups, hs, icon, openSheet, setGroupTab } = useDonee();
  return <ScreenFrame>{<>
            <Pressable style={[hs.outlineButton, { marginBottom: 16 }]} accessibilityRole="button" onPress={() => openSheet('join-group', { invite_code: '' })}>
              {icon('key-outline', 20, '#A487DD')}<Text style={hs.link}>เข้าร่วมด้วยรหัส · Join with Code</Text>
            </Pressable>
            <View style={hs.segment}>{['My Groups', 'Join Group'].map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: groupTab === value }} onPress={() => setGroupTab(value)} style={[hs.segmentItem, groupTab === value && hs.segmentSelected]}><Text style={{ color: groupTab === value ? 'white' : '#8BA0C0', fontSize: 13 }}>{value}</Text></Pressable>)}</View>
            {groupTab === 'My Groups' ? groupRows(groups) : <Text style={hs.subtitle}>กลุ่มเป็นส่วนตัว กดเข้าร่วมด้วยรหัสด้านบนเพื่อเข้ากลุ่มของเพื่อน</Text>}
          </>}</ScreenFrame>;
}
