import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// import {ListsProfiler, FlatListPerformanceView} from '@shopify/react-native-performance-lists-profiler';
// import {RenderPassReport, PerformanceProfiler} from '@shopify/react-native-performance';
import { Dimensions } from 'react-native'
import Flight from './src/flights/FlightsPage'

import DataModelList from './src/DataModelList';

import FlashList from './src/Flashlist'


const App = () => {
  const onInteractiveCallback = useCallback((TTI: number, listName: string) => {
    console.log(`${listName}'s TTI: ${TTI}`);
  }, []);
  const onBlankAreaCallback = useCallback((offsetStart: number, offsetEnd: number, listName: string) => {
    console.log(`Blank area for ${listName}: ${Math.max(offsetStart, offsetEnd)}`);
  }, []);

  return (
    <>
      {/* <DataModelList /> */}
      {/* <Flight /> */}
      <FlashList />
    </>
  )

  // return (
  //   // <PerformanceProfiler>
  //     <ListsProfiler 
  //       onInteractive={onInteractiveCallback} 
  //       onBlankArea={onBlankAreaCallback}
  //     >
  //       {/* <DataModelList /> */}
  //       {/* <Flight /> */}
  //       <FlashList />
  //     </ListsProfiler>      
  //   // </PerformanceProfiler>
  // );
};

export default App;
