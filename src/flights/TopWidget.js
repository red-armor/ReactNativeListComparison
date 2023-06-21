import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import { Image as DataModelImage } from '../data-model'

export default class TopWidget extends Component {
    render() {
        const C = this.props.isDataModel ? Image : DataModelImage

        return (
            <View style={styles.container}>
                <C style={styles.imageFlag} source={{uri: this.props.data.values.fromImage}} />
                <View style={styles.line}></View>
                <C style={styles.imageFlag} source={{uri: this.props.data.values.toImage}} />
            </View>
        );
    }
}
const styles = {
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor:'orange'

    },
    line: {
        height: 2,
        width:300,
        backgroundColor: "white"
    },
    imageFlag: {
        width: 120,
        height: 120
    },

};
