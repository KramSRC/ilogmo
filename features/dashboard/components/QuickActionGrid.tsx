import React from 'react';
import { View, Text } from 'react-native';
import { QuickActionCard } from './QuickActionCard';

export function QuickActionGrid() {
  return (
    <View className="mb-6">
      <Text className="text-base font-bold font-sans text-neutral-900 mb-3">Quick Actions</Text>

      {/* Row 1: Attendance & Daily Journal */}
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

      {/* Row 2: Tasks & Calendar */}
      <View className="flex-row space-x-3 mb-3">
        <QuickActionCard
          id="qa-tasks"
          title="Tasks"
          subtitle="Check deliverables"
          icon="tasks"
          route="/(app)/tasks"
        />
        <View className="w-3" />
        <QuickActionCard
          id="qa-calendar"
          title="Calendar"
          subtitle="View schedule"
          icon="calendar"
          route="/(app)/calendar"
        />
      </View>

      {/* Row 3: Reports & Documents */}
      <View className="flex-row space-x-3">
        <QuickActionCard
          id="qa-reports"
          title="OJT Reports"
          subtitle="Export progress"
          icon="reports"
          route="/(app)/reports"
        />
        <View className="w-3" />
        <QuickActionCard
          id="qa-documents"
          title="Documents"
          subtitle="OJT files"
          icon="documents"
          route="/(app)/documents"
        />
      </View>
    </View>
  );
}

export default QuickActionGrid;
