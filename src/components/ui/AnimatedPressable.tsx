import type { PropsWithChildren } from 'react';
import type { AccessibilityState, Insets, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { animations } from '@/lib/theme';
const AnimatedPressableBase=Animated.createAnimatedComponent(Pressable);
export function AnimatedPressable({children,style,onPress,accessibilityHint,accessibilityLabel,accessibilityState,hitSlop}:{children:PropsWithChildren['children'];style?:StyleProp<ViewStyle>;onPress?:()=>void;accessibilityHint?:string;accessibilityLabel?:string;accessibilityState?:AccessibilityState;hitSlop?:number|Insets}){const scale=useSharedValue(1);const animated=useAnimatedStyle(()=>({transform:[{scale:scale.value}]}));return <AnimatedPressableBase accessibilityRole="button" accessibilityHint={accessibilityHint} accessibilityLabel={accessibilityLabel} accessibilityState={accessibilityState} hitSlop={hitSlop} onPress={onPress} onPressIn={()=>{scale.value=withTiming(animations.pressScale,{duration:animations.fast});}} onPressOut={()=>{scale.value=withTiming(1,{duration:animations.fast});}} style={[style,animated]}>{children}</AnimatedPressableBase>}
