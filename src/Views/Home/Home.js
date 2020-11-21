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

import { connect } from 'react-redux';

// UI
import CardBorderLeft from "../../UI/CardBorderLeft";
import ClearFix from "../../UI/ClearFix";

// Config
import { env } from "../../config/env";

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

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialities: []
        }
    }

    componentDidMount(){
        let headers = {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${this.props.authLogin.token}`
                },
            }
        fetch(`${env.API}/api/index`, headers)
        .then(res => res.json())
        .then(res => {
            this.setState({
                specialities: res.specialities
            });
        })
        .catch(error => ({'error': error}));
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <FlatList
                    data={this.state.specialities}
                    renderItem={({item, index})=>
                    <CardBorderLeft
                        key={item.id}
                        title={item.name}
                        count={item.specialists.length}
                        icon='car-sport-sharp'
                        borderColor={item.color}
                        onPress={() =>
                            this.props.navigation.navigate('ProfileList', { speciality: item })
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

const mapStateToProps = (state) => {
    return {
        authLogin: state.authLogin,
    }
}

export default connect(mapStateToProps)(Home);