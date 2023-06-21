import React, { useCallback, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  FlatList,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {ListsProfiler, FlatListPerformanceView} from '@shopify/react-native-performance-lists-profiler';
import {RenderPassReport, PerformanceProfiler} from '@shopify/react-native-performance';
import { Dimensions } from 'react-native'
import Flight from './src/flights/FlightsPage'

import DataModelList from './src/DataModelList';

import FlashList from './src/Flashlist'

const { width: deviceWidth } = Dimensions.get('window')

type DataItem = {
  key: string
}

const buildData = (count: number, startIndex: number = 0) =>
  new Array(count).fill(1).map((v, index) => ({
    key: `${index + startIndex}`,
  }))


// @ts-ignore
const RenderItem = props => {
  const styles = StyleSheet.create({
    container: {
      height: 98,
      width: deviceWidth,
      backgroundColor: '#eee',
      marginBottom: 2,
    },
  })
  return (
    <View style={styles.container}>
      <Text>{`${props.item.key}`}</Text>
    </View>
  )
}

const List = () => {
  const [data, setData] = useState<Array<DataItem>>(buildData(20))
  const onEndReached = useCallback(({ cb }) => {
    console.log('hell0')
    setData(data => {
      // cb()
      const newData = buildData(10, data.length)
      return ([] as Array<DataItem>).concat(data, newData)
    })
  }, [])

  return (
    <Flight />
  )
}

const App = () => {
  const onInteractiveCallback = useCallback((TTI: number, listName: string) => {
    console.log(`${listName}'s TTI: ${TTI}`);
  }, []);
  const onBlankAreaCallback = useCallback((offsetStart: number, offsetEnd: number, listName: string) => {
    console.log(`Blank area for ${listName}: ${Math.max(offsetStart, offsetEnd)}`);
  }, []);

  return (
    // <PerformanceProfiler>
      <ListsProfiler 
        onInteractive={onInteractiveCallback} 
        onBlankArea={onBlankAreaCallback}
      >
        {/* <DataModelList /> */}
        {/* <Flight /> */}
        <FlashList />
      </ListsProfiler>      
    // </PerformanceProfiler>
  );
};

export default App;
