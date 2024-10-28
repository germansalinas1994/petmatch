import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

interface AnimatedEffectProps {
  source: any;
  show: boolean;
  onAnimationEnd: () => void;
}

export default function AnimatedEffect({
  source,
  show,
  onAnimationEnd,
}: AnimatedEffectProps) {
  if (!show) return null;

  return (
    <View style={styles.animationContainer}>
      <LottieView
        source={source}
        autoPlay
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationEnd}
        speed={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 150,
    height: 150,
  },
});