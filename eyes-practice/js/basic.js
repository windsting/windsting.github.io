function parseURLParams(url) {
    url = url || window.location.href;
    if (!url) {
        return {};
    }
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "")
        return {};

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        
        n = decodeURIComponent(nv[0]);
        if(nv.length === 1)
            parms[n] = true;
        else if (nv.length !== 2)
            continue;

        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = v;
        } else {
            if (!Array.isArray(parms[n])) {
                parms[n] = [parms[n]];
            }
            parms[n].push(v);
        }
    }
    return parms;
}

function has(obj, key) {
    return key in obj;
}
