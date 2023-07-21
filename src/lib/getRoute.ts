export function getRoutePath(...atrri:string[]) {
    const path = import.meta.env.BASE_URL + atrri.join('/');
    return path.replace(/\/+/g, "/");
}