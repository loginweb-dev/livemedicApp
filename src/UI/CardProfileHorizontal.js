import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Linking,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';

// UI
import ButtonBlock from "./ButtonBlock";

const screenWidth = Math.round(Dimensions.get('window').width);

export default function CardProfileHorizontal(props) {
    return (
        <View style={ styles.card }>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={ styles.cardContainer }>
                    <ImageBackground
                        source={{ uri: props.avatar }}
                        style={{ width: '100%', height: 250 }}
                    />
                    <View style={{ margin: 5, flexDirection: 'row' }}>
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
                                style={{ padding: 5, flexDirection: 'row-reverse' }}
                            />
                        </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', marginTop: 10, marginBottom: 20, width: '100%' }}>
                        {
                            !props.available &&
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: 'red',  textAlign: 'center' }}>No se encuantra disponible ahora, si desea puede programar una cita para otro momento en nuestra página web.</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL('https://livemedic.net')}
                                    style={{ marginTop: 5 }}
                                >
                                    <Text style={{ color: '#0D6FAA', fontSize: 16 }}>livemedic.net</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            props.available &&
                            <ButtonBlock
                                icon='videocam-outline'
                                title='Nueva cita ahora'
                                color='green'
                                colorText='white'
                                onPress={() => ToastAndroid.showWithGravityAndOffset('Llamando...', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50)}
                            />
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        width: screenWidth,
    },
    cardContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 3 },
        backgroundColor: 'white',
        shadowOpacity: 0.8,
        shadowRadius: 2,
        width: '100%',
        elevation: 3,
        marginBottom: 10
    }
});