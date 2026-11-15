export function groupFromRow(row) {
  return {
    id: String(row.id), name: row.name, created_by: row.created_by,
    invite_code: row.invite_code, created_at: row.created_at,
    icon: 'people-outline', joined: true,
    members: (row.members || []).map(member => ({ id: member.id, name: member.name || 'Member' })),
  };
}
export function createGroupRepository(client) {
  return {
    async list() {
      const { data, error } = await client.rpc('donee_list_groups');
      if (error) throw error;
      return (data || []).map(groupFromRow);
    },
    async create(name) {
      const { data, error } = await client.rpc('donee_create_group', { p_name: name.trim() });
      if (error) throw error;
      return String(data.id);
    },
    async join(code) {
      const { data, error } = await client.rpc('donee_join_group', { p_invite_code: code.trim().toUpperCase() });
      if (error) throw error;
      return { id: String(data.id), alreadyJoined: data.already_joined };
    },
    async rename(groupId, name) {
      const { data, error } = await client.rpc('donee_rename_group', { p_group_id: groupId, p_name: name.trim() });
      if (error) throw error;
      return data;
    },
    async remove(groupId) {
      let previous = '';
      for (;;) {
        const { data: paths, error } = await client.rpc('donee_begin_delete_group', { p_group_id: groupId });
        if (error) throw error;
        if (!Array.isArray(paths)) throw new Error('ตรวจรายการไฟล์แนบไม่สำเร็จ กรุณาลองใหม่');
        if (!paths.length) break;
        if (paths.some(path => typeof path !== 'string' || !path.startsWith(`${groupId}/`))) throw new Error('เส้นทางไฟล์แนบไม่ปลอดภัย กรุณาให้ผู้ดูแลตรวจสอบ');
        const batch = JSON.stringify(paths);
        if (batch === previous) throw new Error('ลบไฟล์แนบไม่ครบ กรุณาลองลบกลุ่มอีกครั้ง');
        previous = batch;
        const removed = await client.storage.from('chat-images').remove(paths);
        if (removed.error) throw new Error(`ลบไฟล์แนบบางส่วนไม่สำเร็จ กลุ่มยังรอลบ กรุณาลองอีกครั้ง: ${removed.error.message}`);
      }
      const { data, error } = await client.rpc('donee_finish_delete_group', { p_group_id: groupId });
      if (error) throw error;
      if (data !== true) throw new Error('ลบกลุ่มไม่สำเร็จ กรุณาลองอีกครั้ง');
    },
    async assign(groupId, results) {
      const { data, error } = await client.rpc('donee_assign_group_tasks', {
        p_group_id: groupId,
        p_assignments: results.map(row => ({ task_id: row.task_id, member_id: row.member_id })),
      });
      if (error) throw error;
      if (data !== results.length) throw new Error('บันทึกผลมอบหมายไม่ครบ กรุณาโหลดใหม่');
    },
  };
}
