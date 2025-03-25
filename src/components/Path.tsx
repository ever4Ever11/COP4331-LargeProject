const app_name = 'way-finder';

export function buildPath(route : string) {
    if (process.env.NODE_ENV === 'production') {
        return 'https://' + app_name + '.xyz/' + route;
    }
    else {
        return 'http://localhost:5000/' + route;
    }
}