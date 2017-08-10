export function hasProperty (obj, prop = "") {
    const props = prop.split(".");
    for (let i = 0; i < props.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(obj, props[i])) {
            return false;
        }
        obj = obj[props[i]];
    }
    return true;
}

export function capitalize (string) {
    if (typeof string === "string") {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return null;
}
