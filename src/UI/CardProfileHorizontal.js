import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Linking,
    ToastAndroid,
    Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';

// UI
import ButtonBlock from "./ButtonBlock";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default function CardProfileHorizontal(props) {
    
    const [showSchedules, setShowSchedules] = useState(false);
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {

        let days = ['', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        var schedules = [];
        for (let index = 1; index <= 7; index++) {
            let schedules_details = [];
            props.schedules.map(data => {
                if(index == data.day){
                    schedules_details.push(`${data.start.slice(0, -3)} a ${data.end.slice(0, -3)}`);
                }
            });
            schedules.push({
                id: index,
                day: days[index],
                detail: schedules_details
            });
        }
        setSchedules(schedules);
    }, []);

    return (
        <View style={styles.cardContainer} >
            <ImageBackground
                source={{ uri: props.avatar }}
                style={{ width: '100%', height: 250 }}
            />
            <View style={{ margin: 5, flexDirection: 'row',  }}>
                <View style={{ width: '65%' }}>
                    <Text style={{ fontSize: 18, color: '#616161' }} numberOfLines={1}>{ props.name }</Text>
                    <Text style={{ fontSize: 15, color: '#858585' }} numberOfLines={1}>{ props.location }</Text>
                    <Text style={{ fontSize: 18, color: '#858585' }} numberOfLines={1}>{ props.price } Bs.</Text>
                </View>
                <View style={{ width: '35%' }}>
                    <Rating
                        type='star'
                        startingValue={props.rating}
                        readonly
                        imageSize={20}
                        style={{ padding: 5, flexDirection: 'row-reverse', marginBottom: 5 }}
                    />
                    <Icon.Button name="calendar-sharp" backgroundColor="#3b5998" onPress={ () => setShowSchedules(true) } >
                        <Text style={{ fontFamily: 'Arial', fontSize: 13, color: 'white' }}>
                            Ver horarios
                        </Text>
                    </Icon.Button>
                </View>
            </View>
            <View style={{ margin: 5,  }}>
                <Text style={{ color: '#858585' }}>{props.description}</Text>
            </View>

            <ScrollView style={{ margin: 5, marginTop: 20 }} showsVerticalScrollIndicator={false}>
                {props.CustomDateTimePicker}
            </ScrollView>
            
            <View style={{ alignItems: 'center', position: 'absolute', bottom: 0 }}>
                {
                    props.available == 0 &&
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <Text style={{ color: 'red',  textAlign: 'center' }}>{ props.errorMessage }</Text>
                    </View>
                }
                {
                    props.available == 1 &&
                    <ButtonBlock
                        icon='videocam-outline'
                        title='Nueva consulta ahora'
                        color='green'
                        colorText='white'
                        onPress={ props.onPress }
                        style={{ width: screenWidth, marginBottom: 0, paddingVertical: 5 }}
                    />
                }
                {
                    props.available == 'programmer' &&
                    <ButtonBlock
                        icon='ios-calendar'
                        title='Programa consulta'
                        color='#4CC5FA'
                        colorText='white'
                        onPress={ props.onPress }
                        style={{ width: screenWidth, marginBottom: 0, paddingVertical: 5 }}
                    />
                }
            </View>

            {/* Modal description */}
            <Modal
                animationType="slide"
                visible={showSchedules}
                // height={230}
                onRequestClose={()=> setShowSchedules(false)}
            >
                <View style={{flex: 1}}>
                    <View style={{paddingTop: 50}}>
                        <Text style={{textAlign: 'center', fontSize: 30}}>Horarios de atención</Text>
                    </View>
                    <View style={{paddingHorizontal: 20, paddingTop: 30}}>
                        {
                            schedules.map(item => 
                                <View key={item.id} style={{flexDirection: 'row', paddingBottom: 15}}>
                                    <View style={{width: '30%'}}><Text style={{fontSize: 25, color: '#747373'}}>{item.day}</Text></View>
                                    <View style={{width: '70%', alignItems: 'center', justifyContent: 'center'}}>
                                        {
                                            item.detail.map(detail =>
                                                <Text key={`text-${item}`} style={{backgroundColor: '#4879C6', color: 'white', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10}}>{detail}</Text>
                                            )
                                        }
                                        {
                                            !item.detail.length && <Text style={{color: 'red'}}>No atiende</Text>
                                        }
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 10
    }
});