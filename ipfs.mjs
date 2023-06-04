import { create } from 'ipfs-http-client';

const client = create({ url: "http://127.0.0.1:5002/api/v0" });

const getPins = async () => {
    const cids = [];
    for await (const { cid } of client.pin.ls({ type: 'recursive' })) {
        cids.push(cid.toString());
    }

    return cids;
};

const addPin = async (cid) => {
    return client.pin.add(cid);
};

export { getPins, addPin };
