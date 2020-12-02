export const env = {
    appName: "LiveMedic Edgley",
    appDescription: "Versión inical de una aplicación que incluye react-navigation y redux.",
    autor: "LoginWeb",
    API: "https://livemedic.net",
    location: {
        latitude: -14.834821,
        longitude: -64.904159,
    },
    color: {
        primary: '#2a95a5'
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