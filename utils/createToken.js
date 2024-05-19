const createToken = (email) => {
    let token = email + '-';
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 100; i++){
        token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return token;
}

export {createToken};