import { Pressable, Text, TextInput, View } from 'react-native';
import React from 'react';
import { useDonee } from '../../../state/DoneeProvider';
export default function Page() {
  const { ScreenFrame, addButton, categoryFilter, filter, filteredTasks, hs, icon, openSheet, query, setCategoryFilter, setFilter, setQuery, taskRows } = useDonee();
  return <ScreenFrame>{<>
            <View style={hs.segment}>{['Today', 'This Week', 'All'].map(value => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[hs.segmentItem, filter === value && hs.segmentSelected]}><Text style={{ color: filter === value ? 'white' : '#8BA0C0', fontSize: 13 }}>{value}</Text></Pressable>)}</View>
            <View style={hs.searchRow}>{icon('search-outline', 19)}<TextInput accessibilityLabel="Search tasks" value={query} onChangeText={setQuery} placeholder="Search task..." placeholderTextColor="#9BAAC4" style={hs.search} />
              <Pressable accessibilityRole="button" accessibilityLabel="Filter tasks" onPress={() => openSheet('filter')}>{icon('options-outline', 24)}</Pressable></View>
            {categoryFilter !== 'All' && <Pressable onPress={() => setCategoryFilter('All')}><Text style={hs.link}>{categoryFilter}  × Clear filter</Text></Pressable>}
            {taskRows(filteredTasks, true)}<View style={hs.right}>{addButton()}</View>
          </>}</ScreenFrame>;
}
