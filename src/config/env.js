export const env = {
    appName: "LiveMedic Edgley",
    appDescription: "Versión inical de una aplicación que incluye react-navigation y redux.",
    autor: "LoginWeb",
    API: "https://livemedic.net",
    // API: "http://192.168.1.15/livemedic/public",
    location: {
        latitude: -14.834821,
        longitude: -64.904159,
    },
    color: {
        primary: '#2a95a5',
        textMuted: '#6A6969',
    },
    images: {
        banner: { uri: 'https://livemedic.net/storage/blocks/October2020/Pvno9mFgGRY7RJ3a2i9xxycTAVZog4Thh18MejRc.png' }
    },
    about: {
        mision: 'BRINDAR EL MEJOR SERVICIO DE ATENCIÓN MÉDICA VIRTUAL, OPTIMIZANDO EL TIEMPO Y RECURSOS DEL PACIENTE PARA UN DIAGNÓSTICO MEDICO RÁPIDO Y PROFESIONAL.',
        vision: 'SER RECONOCIDOS POR NUESTRA INNOVACIÓN Y SER LA EMPRESA LÍDER EN SERVICIOS DE ATENCIÓN MÉDICA A NIVEL NACIONA E INTERNACIONAL.',
        phones: [
            {id: 1, name: 'Gerente', number: '59176866169'},
            {id: 2, name: 'Administrador', number: '59172841731'}
        ]
    },
    location: {
        latitude: -14.834821,
        longitude: -64.904159,
    }
}

export const strRandom = (length) => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}