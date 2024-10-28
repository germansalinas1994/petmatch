// components/AnimatedEffect.js

import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

interface AnimatedEffectProps {
  source: any;
  show: boolean;
  onAnimationEnd: () => void;
  delayAfterAnimation?: number; // Nueva propiedad para retrasar la finalización
}

export default function AnimatedEffect({
  source,
  show,
  onAnimationEnd,
  delayAfterAnimation = 0, // Por defecto no se añade retraso
}: AnimatedEffectProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (show && animationRef.current) {
      animationRef.current.play();
    }
  }, [show]);

  if (!show) return null;

  return (
    <View style={styles.animationContainer}>
      <LottieView
        ref={animationRef}
        source={source}
        loop={false}
        style={styles.animation}
        onAnimationFinish={() => {
          // Espera el tiempo definido en delayAfterAnimation antes de llamar a onAnimationEnd
          setTimeout(onAnimationEnd, delayAfterAnimation);
        }}
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
