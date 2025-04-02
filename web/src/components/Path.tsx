const app_name = 'way-finder';

export function buildPath(route : string) {
    if (process.env.NODE_ENV === 'production') {
        //return 'https://' + app_name + '.xyz/' + route;
        return 'http://' + app_name + '.xyz:5000/' + route;
    }
    else {
        return 'http://localhost:5000/' + route;
    }
}

// for local machine use only
// export function buildPath(route : string) {
//     if (process.env.NODE_ENV === 'production') {
//         //return 'https://' + app_name + '.xyz/' + route;
//         return 'http://localhost:5000/' + route;
//     }
//     else {
//         return 'http://localhost:5000/' + route;
//     }
// }