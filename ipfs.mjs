import { create } from 'ipfs-http-client';
import isPortReachable from 'is-port-reachable';

const getClient = async() => {
    let port = 5001;

    // IPFS can also run on 5002.
    if (!await isPortReachable(port, {host: '127.0.0.1'})) {
        port = 5002;
    }

    return create({ url: `http://127.0.0.1:${port}/api/v0` });   
}


const getPins = async () => {
    const client = await getClient();
    const cids = [];
    for await (const { cid } of client.pin.ls({ type: 'recursive' })) {
        cids.push(cid.toString());
    }

    return cids;
};

const addPin = async (cid) => {
    const client = await getClient();
    return client.pin.add(cid);
};

export { getPins, addPin };
