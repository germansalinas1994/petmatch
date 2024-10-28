// SkeletonItem.tsx
import React from 'react';
import { ViewStyle } from 'react-native';
import { MotiView } from 'moti';

type SkeletonItemProps = {
  width: number;
  height: number;
  borderRadius: number;
  color?: string; 
  style?: ViewStyle; 
};

const SkeletonItem = ({ width, height, borderRadius, color = '#e0e0e0', style }: SkeletonItemProps) => (
  <MotiView
    style={[
      { width, height, borderRadius, backgroundColor: color },
      style,
    ]}
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{
      type: 'timing',
      duration: 900,
      loop: true,
    }}
  />
);

export default SkeletonItem;
