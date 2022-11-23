const PORT = 8080;
const BASE_IPS = ["192.168.34.2"];
const BASE_COUNT = 1;

const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
const express = require("express");
const app = express();

// array of { connection: ssh_connection, is_playing: bool }
let bases = [];

async function start() {
    for (let i = 0; i < BASE_COUNT; i++) {
        console.log(`Connecting to ${BASE_IPS[i]}...`);
        let connection = await ssh.connect({
            host: BASE_IPS[i],
            username: "pi",
            privateKeyPath: "/home/pi/.ssh/id_rsa",
        });
        console.log("Connected");
        bases.push({ connection, is_playing: false });
    }

    app.listen(PORT, () => {
        console.log(`Started on :${PORT}`);
    });
}

start();

app.post("/api/play/:n", (req, res) => {
    const param = req.params.n;
    const id = parseInt(param);
    const base = bases[id];
    if (!base) {
        res.status(400);
        res.end(`The base ${param} doesn't exist`);
        return;
    }
    if (base.is_playing) {
        res.status(400);
        res.end(`The base ${id} is already playing sound`);
        return;
    }
    const connection = base.connection;
    console.log(`Playing sound on base ${id}`);
    base.is_playing = true;
    connection.exec("bash", ["/home/pi/startSND.sh"]).catch(() => {});
    res.end();
});

app.post("/api/stop/:n", (req, res) => {
    const param = req.params.n;
    const id = parseInt(param);
    const base = bases[id];
    if (!base) {
        res.status(400);
        res.end(`The base ${param} doesn't exist`);
        return;
    }
    if (!base.is_playing) {
        res.status(400);
        res.end(`The base ${id} is not playing sound`);
        return;
    }
    const connection = base.connection;
    console.log(`Stopping sound on base ${id}`);
    base.is_playing = false;
    connection.exec("bash", ["/home/pi/stopSND.sh"]).catch(() => {});
    res.end();
});

app.use(express.static("public", { extensions: ["html"] }));
