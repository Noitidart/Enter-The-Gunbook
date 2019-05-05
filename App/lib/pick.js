import { get, isObject } from 'lodash'

export function pickAsByString(obj, ...dotpaths) {
    // can do dotpath + ' as BLAH'
    // last arg can be an options object
        // shouldIgnoreUndefined: boolean // default false - if value is undefined dont pick
        // dontOverwriteDefined: boolean // if value already picked, and it is !== undefined, should overwrite?

    // example:
        // pickDotpath({a:{b:[{c:['c','cc','ccc']},'bb']}, rawr:'hi', foo:'bar'}, 'a.b[0].c[3]', 'rawr as c', 'foo as c', { dontOverwriteDefined:true }) gives { c:'hi' }

    let options = dotpaths[dotpaths.length-1];
    const isLastOptions = isObject(options);
    if (!isLastOptions) options = {};
    else dotpaths.pop();

    const picked = {};
    for (const dotpath of dotpaths) {
        // console.log('dotpath:', dotpath);
        const ixAs = dotpath.indexOf(' as ');
        const hasAs = ixAs > -1;

        const path = hasAs ? dotpath.substr(0, ixAs) : dotpath;
        let asValue = hasAs ? dotpath.substr(ixAs + 4) : path;
        if (asValue.includes('.')) asValue = asValue.substr(asValue.lastIndexOf('.')+1);
        if (asValue.includes('[')) asValue = asValue.substr(0, asValue.lastIndexOf('['));

        const value = get(obj, path);

        if (options.shouldIgnoreUndefined && value === undefined) continue;
        if (options.dontOverwriteDefined && picked[asValue] !== undefined) continue;

        picked[asValue] = value;
    }

    return picked;
}

export function pickDotpath(obj, ...dotpaths) {
    // can do dotpath + ' as BLAH'
    const picked = {};
    for (let dotpath of dotpaths) {
        let asKey;
        const asIx = dotpath.indexOf(' as ');
        if (asIx > -1) {
            asKey = dotpath.substr(asIx + 4);
            dotpath = dotpath.substr(0, asIx);
        }
        const keys = dotpath.split('.');
        if (!asKey) asKey = keys[keys.length -1];
        if (keys.length > 1) picked[asKey] = deepAccessUsingString(obj, dotpath);
        else picked[asKey] = obj[dotpath];
    }

    return picked;
}

export function deepAccessUsingString(obj, dotpath, defaultval) {
    // defaultval is returned when it is not found, by default, defaultval is undefined, set it to "THROW" if you want it to throw

    // super simple version:
    // const deepAccessUsingString = (obj, dotpath) => dotpath.split('.').reduce((nested, key) => nested[key], obj);

    let keys = dotpath.split('.');
    let nested = obj;
    for (let key of keys) {
        if (nested && key in nested) nested = nested[key]; // `key in nested` this is point of concern. as `in` works with Array,Set,Map (and i dont know maybe more type) too. i am assuming that nested is always an object
        else
            if (defaultval === 'THROW') throw new Error('deepAccessUsingString: missing "' + dotpath + '"');
            else return defaultval;
    }

    return nested;
}
