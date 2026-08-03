import type { PropsWithChildren } from 'react';
import type { AccessibilityState, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { animations } from '@/lib/theme';
const AnimatedPressableBase=Animated.createAnimatedComponent(Pressable);
export function AnimatedPressable({children,style,onPress,accessibilityLabel,accessibilityState}:{children:PropsWithChildren['children'];style?:StyleProp<ViewStyle>;onPress?:()=>void;accessibilityLabel?:string;accessibilityState?:AccessibilityState}){const scale=useSharedValue(1);const animated=useAnimatedStyle(()=>({transform:[{scale:scale.value}]}));return <AnimatedPressableBase accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={accessibilityState} onPress={onPress} onPressIn={()=>{scale.value=withTiming(animations.pressScale,{duration:animations.fast});}} onPressOut={()=>{scale.value=withTiming(1,{duration:animations.fast});}} style={[style,animated]}>{children}</AnimatedPressableBase>}