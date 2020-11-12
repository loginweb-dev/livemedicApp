import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    FlatList
} from 'react-native';

// UI
import CardProfileHorizontal from "../../UI/CardProfileHorizontal";
import ClearFix from "../../UI/ClearFix";

export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialist: this.props.route.params.specialist
        }
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <CardProfileHorizontal
                    name={this.state.specialist.name}
                    location={this.state.specialist.location}
                    avatar={this.state.specialist.avatar}
                    price={this.state.specialist.price}
                    rating={this.state.specialist.rating}
                    available={this.state.specialist.available}
                    // onPress={() => this.props.navigation.navigate('ProfileView', { specialist: item })}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});