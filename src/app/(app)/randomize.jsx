import { Text } from 'react-native';
import React from 'react';
import { useDonee } from '../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, currentGroup, hs, renderRandom } = useDonee();
  return <ScreenFrame>{currentGroup.id ? renderRandom() : <Text style={hs.subtitle}>กรุณาสร้างหรือเข้าร่วมกลุ่มจากหน้า Groups ก่อนสุ่มงาน</Text>}</ScreenFrame>;
}
