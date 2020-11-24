export const env = {
    appName: "LiveMedic",
    appDescription: "Versión inical de una aplicación que incluye react-navigation y redux.",
    autor: "LoginWeb",
    API: "http://192.168.1.22/livemedic/public",
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