import React, {Component} from "react";
// import {RecyclerListView, LayoutProvider, DataProvider} from "recyclerlistview";
import {View, Dimensions, Text, Image, FlatList} from "react-native";
import FlightCard from "./FlightCard";
import FlightData from "./FlightData";
import HotelCard from "./HotelCard";
import TopWidget from "./TopWidget";
let {height, width} = Dimensions.get('window');
export default class FlightsPage extends Component {
    constructor(args) {
        super(args);
        this.state = {
            data: FlightData
        }

        // this.state = {
        //     dataProvider: new DataProvider((r1, r2) => {
        //         return r1 !== r2
        //     }).cloneWithRows(FlightData)
        // };
        // this._layoutProvider = new LayoutProvider((i) => {
        //     return this.state.dataProvider.getDataForIndex(i).type;
        // }, (type, dim) => {
        //     switch (type) {
        //         case "HOTEL_ITEM":
        //             dim.width = width;
        //             dim.height = 83;
        //             break;
        //         case "FL_ITEM":
        //             dim.width = width;
        //             dim.height = 80;
        //             break;
        //         case "HEADER":
        //             dim.width = width;
        //             dim.height = 300;
        //             break;
        //         default:
        //             dim.width = width;
        //             dim.height = 0;

        //     }
        // });
        this._renderRow = this._renderRow.bind(this);
    }


    _renderRow(props) {
        const item = props.item
        const { type } = item

        switch (type) {
            case "HOTEL_ITEM":
                return <HotelCard/>
            case "FL_ITEM":
                return <FlightCard data={item}/>;
            case "HEADER":
                return <TopWidget data={item}/>;
            default:
                return null;

        }

    }

    render() {
        return <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Travel Mate</Text>
            </View>
            <FlatList
                renderItem={this._renderRow}
                data={this.state.data}
            />
            {/* <RecyclerListView rowRenderer={this._renderRow} dataProvider={this.state.dataProvider}
                              layoutProvider={this._layoutProvider}/> */}
            {/* <RecyclerListView rowRenderer={this._renderRow} dataProvider={this.state.dataProvider}
                              layoutProvider={this._layoutProvider}/> */}
        </View>
    }
}
const styles = {
    container: {
        flex: 1,

    },
    header:{
        height: 65,
        backgroundColor:'orange',
        alignItems:"center",
        flexDirection:"row",
        elevation:4
    },
    headerText:{
        color:'white',
        fontSize:18,
        marginLeft: 16,
        paddingBottom:3
    },
    backIcon:{
        height:23,
        width:23,
        marginLeft:16

    }
}