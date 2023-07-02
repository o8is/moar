const getDapp = (hostname, dapps) => {
    const dapp = dapps.find(d => d.domain === hostname);

    if (dapp) {
        return dapp;
    }

    throw new Error('subdomain not found');
};

const getCIDs = (dapp) => Object.keys(dapp.versions).map(d => dapp.versions[d].cid);

const getCID = (dapp, version) => {
    let versionToLookup = version;
    if (typeof versionToLookup === 'undefined') {
        const versions = Object.keys(dapp.versions);
        const latestRelease = Math.max(...versions);
        versionToLookup = latestRelease;
    }

    if (typeof dapp.versions[versionToLookup] === 'undefined') {
        throw new Error('version of interface not found.');
    }

    return dapp.versions[versionToLookup].cid;
};
const sortDapps = (dapps, recent) => {
    return dapps.sort((a, b) => {
        if (typeof recent[`http://${a.domain}/`] === 'undefined') {
            return 1
        } else if (typeof recent[`http://${b.domain}/`] === 'undefined') {
            return -1;
        }
        return recent[`http://${b.domain}/`] - recent[`http://${a.domain}/`];
    });
}

module.exports = {
    getDapp,
    sortDapps,
    getCIDs,
    getCID,
}