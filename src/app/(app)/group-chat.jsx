import React from 'react';
import { router } from 'expo-router';
import { Text, Pressable, View } from 'react-native';
import GroupChat from '../../../components/GroupChat';
import { useDonee } from '../../state/DoneeProvider';
export default function Chat() { const {currentGroup, user, groupsState}=useDonee(); const back=()=>router.canGoBack()?router.back():router.replace({pathname:'/group-detail',params:{groupId:currentGroup.id}}); if(!currentGroup.id)return <View style={{padding:24}}><Text>{groupsState==='loading'?'กำลังโหลดกลุ่ม…':'ไม่พบกลุ่ม หรือไม่มีสิทธิ์เข้าถึง'}</Text><Pressable onPress={back}><Text>กลับ</Text></Pressable></View>; return <GroupChat group={currentGroup} user={user} onClose={back}/>; }
