// SkeletonItem.tsx
import React from 'react';
import { ViewStyle, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

type SkeletonItemProps = {
  width: number;
  height: number;
  borderRadius: number;
  style?: ViewStyle; // Optional style prop
};

const SkeletonItem = ({ width, height, borderRadius, style }: SkeletonItemProps) => (
  <MotiView
    style={[{ width, height, borderRadius }, styles.skeleton, style]}
    from={{ opacity: 0.3 }}
    animate={{ opacity: 1 }}
    transition={{
      type: 'timing',
      duration: 900,
      loop: true,
    }}
  />
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
  },
});

export default SkeletonItem;
