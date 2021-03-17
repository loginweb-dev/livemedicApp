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
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';

// UI
import CardBorderLeft from "../../UI/CardBorderLeft";
import BackgroundLoading from "../../UI/BackgroundLoading";
import HeaderInfo from "../../UI/HeaderInfo";

// Config
import { env } from "../../config/env";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialities: []
        }
    }

    async componentDidMount(){
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
            if(!res.message && !res.error){
                this.setState({
                    specialities: res.specialities
                });
            }
        })
        .catch(error => ({'error': error}));

        // Verificar si se dede mostrar el modal de rating
        const SessionCallRating = await AsyncStorage.getItem('SessionCallRating');
        let callRating = SessionCallRating ? JSON.parse(SessionCallRating) : {};
        if(callRating.id){
            this.props.setCallRating({
                id: callRating.id
            });
        }
        await AsyncStorage.setItem('SessionCallRating', '{}');
    }

    render(){
        if(!this.state.specialities.length){
            return(
                <BackgroundLoading/>
            )
        }

        return (
            <SafeAreaView style={ styles.container }>
                <HeaderInfo title='Elige la especialidad'>
                    Presiona sobre el nombre de la especialidad con la necesita ser atendido.
                </HeaderInfo>
                <FlatList
                    style={{ paddingVertical: 10 }}
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
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapStateToProps = (state) => {
    return {
        authLogin: state.authLogin,
        callInfo: state.callInfo,
        callInProgress: state.callInProgress
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCallInfo : (callInfo) => dispatch({
            type: 'SET_CALL_INFO',
            payload: callInfo
        }),
        setCallRating : (callRating) => dispatch({
            type: 'SET_CALL_RATING',
            payload: callRating
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);