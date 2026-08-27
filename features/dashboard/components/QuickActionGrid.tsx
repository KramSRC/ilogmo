import React from 'react';
import { View, Text } from 'react-native';
import { QuickActionCard } from './QuickActionCard';

export function QuickActionGrid() {
  return (
    <View className="mb-6">
      <Text className="text-base font-bold font-sans text-neutral-900 mb-3">Quick Actions</Text>

      {/* Row 1: Attendance & Journal */}
      <View className="flex-row space-x-3 mb-3">
        <QuickActionCard
          id="qa-attendance"
          title="Attendance"
          subtitle="Track hours"
          icon="attendance"
          route="/(app)/attendance"
        />
        <View className="w-3" />
        <QuickActionCard
          id="qa-journal"
          title="Daily Journal"
          subtitle="Log your day"
          icon="journal"
          route="/(app)/journal"
        />
      </View>

      {/* Row 2: Calendar & Reports */}
      <View className="flex-row space-x-3">
        <QuickActionCard
          id="qa-calendar"
          title="Calendar"
          subtitle="View schedule"
          icon="calendar"
          route="/(app)/calendar"
        />
        <View className="w-3" />
        <QuickActionCard
          id="qa-reports"
          title="Reports"
          subtitle="View records"
          icon="reports"
          route="/(app)/reports"
        />
      </View>
    </View>
  );
}

export default QuickActionGrid;
