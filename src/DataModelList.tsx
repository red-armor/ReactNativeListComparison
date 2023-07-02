import { ScrollView, List } from './data-model'
import React, {Component, useCallback, useState} from "react";
// import {RecyclerListView, LayoutProvider, DataProvider} from "recyclerlistview";
import {View, Dimensions, Text, Image, FlatList} from "react-native";
import FlightCard from "./flights/FlightCard";
import FlightData from "./flights/FlightData";
import HotelCard from "./flights/HotelCard";
import TopWidget from "./flights/TopWidget";
let {height, width} = Dimensions.get('window');

const RenderItem = (props) => {
  const item = props.item
  const { type } = item

  // console.log('props ', props.item)

  switch (type) {
      case "HOTEL_ITEM":
          return <HotelCard isDataModel/>
      case "FL_ITEM":
          return <FlightCard data={item} isDataModel/>;
      case "HEADER":
          return <TopWidget data={item}/>;
      default:
          return null;
  }
}

export default () => {
  const [data] = useState(FlightData)
  const keyExtractor = useCallback((_, index) => `key_${index}`, [])
  const getItemLayout = useCallback((_, index) => ({ length: 80, index }), [])

  return (
    <ScrollView style={{ flex: 1 }} scrollEventThrottle={1}>
      <List
        data={data}
        recycleEnabled
        initialNumToRender={4}
        recycleBufferedCount={0}
        // maxToRenderPerBatch={6}
        // getItemLayout={getItemLayout}
        // itemApproximateLength={80}
        dispatchMetricsThreshold={0}
        keyExtractor={keyExtractor}
        renderItem={RenderItem}
      />
    </ScrollView>
  )
}