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

// Config
import { env } from "../../config/env";

export default class ProfileList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialities: this.props.route.params.speciality.specialists
        }
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <FlatList
                    data={this.state.specialities}
                    renderItem={({item, index}) => {
                        var rating = 0;
                        var count = 0;
                        item.appointments.map(appointment => {
                            if(appointment.rating.length){
                                rating += appointment.rating[0].rating;
                                count++;
                            }
                        })

                        if(rating){
                            rating = rating / count;
                        }

                        return (
                            <CardProfile
                                key={item.id}
                                name={item.full_name}
                                location={item.location}
                                avatar={`${env.API}/storage/${item.user.avatar}`}
                                price={this.props.route.params.speciality.price}
                                rating={ rating }
                                available={item.status == 1 ? true : false }
                                onPress={() => this.props.navigation.navigate('ProfileView', {
                                    specialist: item,
                                    avatar: `${env.API}/storage/${item.user.avatar}`,
                                    rating: rating,
                                    price: this.props.route.params.speciality.price
                                })}
                            />
                        )
                    }
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