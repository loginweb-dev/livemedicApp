import React, { Component } from 'react';
import { SafeAreaView,
    ScrollView,
    View,
    StyleSheet,
    Text,
    Image,
    Modal,
    Dimensions
} from 'react-native';

// UI
import CardHistorial from "../../UI/CardHistorial";
import ClearFix from "../../UI/ClearFix";
import CardCustomerRounded from "../../UI/CardCustomerRounded";

// Config
import { env } from '../../config/env';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const HistorialList = [
    {
        id: 1,
        name: 'Dr. Jhoel David Alcocer Guzmán',
        avatar: 'https://livemedic.net/storage/users/October2020/QEulvV8pirCv4MbS5Ib8-cropped.jpeg',
        date: 'Hace 1 día'
    },
    {
        id: 2,
        name: 'Dra. Brisa María Montenegro Gil',
        avatar: 'https://livemedic.net/storage/users/October2020/ZfBgNQTicFQ5ItVKJ3DN-cropped.jpeg',
        date: 'Hace 1 mes'
    },
    {
        id: 3,
        name: 'Dra. Helen Zabala Melgar',
        avatar: 'https://livemedic.net/storage/users/October2020/p7Q6Gh4iQ8qLhd7obquZ-cropped.jpg',
        date: 'Hace 3 meses'
    }
];

export default class Historial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailShow: false
        }
    }

    componentDidMount(){
        
    }

    showDetailHistorial = () => {
        // this.setState({detailShow: true});
    }

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <ScrollView showsVerticalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    {
                        HistorialList.map(item => 
                            <CardHistorial
                                key={ item.id }
                                name={ item.name }
                                avatar={ item.avatar }
                                date={ item.date }
                                onPress={this.showDetailHistorial}
                            />
                        )
                    }
                    <ClearFix height={50} />
                </ScrollView>

                {/* Modal */}
                <Modal
                    animationType="slide"
                    visible={this.state.detailShow}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({detailShow: false})}
                >
                    <View>

                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    map: {
        height: screenHeight,
        width: screenWidth,
    },
    header: {
        width: screenWidth,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 0,
        zIndex:1,
        paddingHorizontal: 10
    },
});