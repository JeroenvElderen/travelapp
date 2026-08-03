import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/lib/theme';

export function ExploreMap() {
  return <View style={styles.root}><Text style={styles.title}>Mapbox is available in native builds</Text><Text style={styles.text}>Run the iOS or Android development build to use the interactive map.</Text></View>;
}

const styles = StyleSheet.create({root:{flex:1,minHeight:310,alignItems:'center',justifyContent:'center',padding:spacing.xl,backgroundColor:'#DCE4CE'},title:{fontFamily:'Georgia',fontSize:22,fontWeight:'700',color:colors.ink},text:{maxWidth:300,marginTop:spacing.sm,textAlign:'center',lineHeight:20,color:colors.muted}});