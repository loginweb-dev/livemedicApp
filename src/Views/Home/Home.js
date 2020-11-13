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
import CardBorderLeft from "../../UI/CardBorderLeft";
import ClearFix from "../../UI/ClearFix";

const Specialities = [
    {
        id: 1,
        title: 'Medicina Gral.',
        count: 10,
        icon: 'car-sport-sharp',
        borderColor: '#C54125'
    },
    {
        id: 2,
        title: 'Pediatra',
        count: 5,
        icon: 'car-sport-sharp',
        borderColor: '#32792E'
    },
    {
        id: 3,
        title: 'Odontólogo',
        count: 0,
        icon: 'car-sport-sharp',
        borderColor: '#C56B00'
    },
    {
        id: 4,
        title: 'Cardiólogo',
        count: 6,
        icon: 'car-sport-sharp',
        borderColor: '#2A80DB'
    },
    {
        id: 5,
        title: 'Med. Cirujano',
        count: 1,
        icon: 'car-sport-sharp',
        borderColor: '#3591DF'
    }
]

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <FlatList
                    data={Specialities}
                    renderItem={({item, index})=>
                    <CardBorderLeft
                        key={item.id}
                        title={item.title}
                        count={item.count}
                        icon={item.icon}
                        borderColor={item.borderColor}
                        onPress={() =>
                            this.props.navigation.navigate('ProfileList', {
                                speciality: 
                                    { id:  item.id, title:  item.title}
                            })
                        }
                    />
                    }
                    numColumns={2}
                />
                
                <ClearFix height={50} />
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