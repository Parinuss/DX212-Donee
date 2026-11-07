# โครงสร้างหน้า Donee (Expo Router)

เริ่มโปรแกรมด้วย `expo-router/entry` ซึ่งอ่าน `src/app/_layout.jsx`
หลังเปลี่ยนโครงสร้าง ให้หยุด Expo เดิมด้วย Control+C แล้วรัน `npm run web -- --clear`
ไม่ต้องแก้ `.env.local` หรือตาราง Supabase

## Stack

- `src/app/_layout.jsx`: ตรวจ session, เปิด Login/Register สำหรับผู้ที่ยังไม่เข้าสู่ระบบ และป้องกันหน้าภายใน
- `src/app/login.jsx`: Login (`/login`)
- `src/app/register.jsx`: Register (`/register`)
- `src/app/(app)/_layout.jsx`: Stack ภายในบัญชี พร้อมสถานะงานและกลุ่มที่ใช้ร่วมกัน
- `src/app/(app)/group-detail.jsx`: รายละเอียดกลุ่ม (`/group-detail?groupId=...`)
- `src/app/(app)/group-chat.jsx`: แชทกลุ่ม (`/group-chat?groupId=...`)
- `src/app/(app)/randomize.jsx`: สุ่มงาน (`/randomize?groupId=...`)

## Tabs

`src/app/(app)/(tabs)/_layout.jsx` กำหนดเมนูด้านล่าง 5 หน้า:

- `index.jsx`: Home (`/`)
- `tasks.jsx`: Tasks (`/tasks`)
- `groups.jsx`: Groups (`/groups`)
- `calendar.jsx`: Calendar (`/calendar`)
- `me.jsx`: Me (`/me`)

วงเล็บ `(app)` และ `(tabs)` ใช้จัดกลุ่มไฟล์ ไม่ปรากฏใน URL

## ไฟล์ที่ใช้ร่วมกัน

- `src/state/DoneeProvider.jsx`: session, สถานะงานและกลุ่ม, ฟอร์มป๊อปอัป และตัวช่วยหน้าจอ
- `components/GroupChat.js`: หน้าตาและการส่งข้อความ/ไฟล์ของแชท
- `lib/`: ติดต่อ Supabase เหมือนเดิม
- `App.js`: ไฟล์อ้างอิงเพื่อความเข้ากันได้ ไม่ใช่จุดเริ่มโปรแกรมแล้ว

หน้า Add/Edit Task, Invite Friends, Join Group และผลสุ่ม ยังคงเป็นป๊อปอัปในหน้าปัจจุบัน
การแยกหน้าไม่ได้เปลี่ยน SQL policy หรือสิทธิ์ข้อมูลในฐานข้อมูล
