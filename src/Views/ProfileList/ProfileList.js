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
import CardProfile from "../../UI/CardProfile";
import ClearFix from "../../UI/ClearFix";

const Specialities = [
    {
        id: 1,
        name: 'Dr. Jhoel David Alcocer Guzmán',
        avatar: 'https://livemedic.net/storage/users/October2020/QEulvV8pirCv4MbS5Ib8-cropped.jpeg',
        location: 'Cochabamba',
        price: 20,
        rating: 3,
        available: true
    },
    {
        id: 2,
        name: 'Dra. Brisa María Montenegro Gil',
        avatar: 'https://livemedic.net/storage/users/October2020/ZfBgNQTicFQ5ItVKJ3DN-cropped.jpeg',
        location: 'Santísima trinidad - Beni',
        price: 70,
        rating: 4,
        available: true
    },
    {
        id: 3,
        name: 'Dra. Helen Zabala Melgar',
        avatar: 'https://livemedic.net/storage/users/October2020/p7Q6Gh4iQ8qLhd7obquZ-cropped.jpg',
        location: 'Santísima Trinidad - Beni',
        price: 70,
        rating: 1,
        available: false
    },
    {
        id: 4,
        name: 'Dr. Jesus Alexis Moscoso Agreda',
        avatar: 'https://livemedic.net/storage/users/October2020/N1SJZVzq9hcBzmf8nSXy-cropped.jpeg',
        location: 'Santísima trinidad - Beni',
        price: 90,
        rating: 2,
        available: true
    },
    {
        id: 5,
        name: 'Dr. Everth Sejas Guevara',
        avatar: 'https://livemedic.net/storage/users/October2020/bLyt63xt1BIKQRRkEOno-cropped.jpeg',
        location: 'Cochabamba',
        price: 70,
        rating: 5,
        available: true
    }
]

export default class ProfileList extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <FlatList
                    data={Specialities}
                    renderItem={({item, index})=>
                    <CardProfile
                        key={item.id}
                        name={item.name}
                        location={item.location}
                        avatar={item.avatar}
                        price={item.price}
                        rating={item.rating}
                        available={item.available}
                        onPress={() => this.props.navigation.navigate('ProfileView', { specialist: item })}
                    />
                    }
                    numColumns={2}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
    }
});