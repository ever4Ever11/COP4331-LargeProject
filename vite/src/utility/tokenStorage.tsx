export function storeTokens(tok : any) {
    try {
        localStorage.setItem('token_data', tok.accessToken);
    }
    catch(e : any) {
        console.log(e.message);
    }
}

export function retrieveToken() {
    let ud;
    try {
        ud = localStorage.getItem('token_data');
    }
    catch(e : any) {
        console.log(e.message);
    }
    return ud;
}