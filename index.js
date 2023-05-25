const PORT = 8080;
const BASES = ["192.168.34.2"];
const DEFAULT_FILE = "/usr/share/sounds/alsa/Front_Center.wav";

const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
const express = require("express");
const app = express();

// array of { id: number, connection: ssh_connection, is_playing: bool, volume: number, file: string }
let bases = [];

async function start() {
    for (let i = 0; i < BASES.length; i++) {
        let ip = BASES[i];
        console.log(`Connecting to ${ip}...`);
        try {
            let connection = await ssh.connect({
                host: ip,
                username: "pi",
                privateKeyPath: `${process.env.HOME}/.ssh/id_rsa`,
            });
            let volume = await get_base_volume(connection);
            console.log("Connected");
            bases.push({
                id: i,
                connection,
                is_playing: false,
                volume,
                file: DEFAULT_FILE,
            });
        } catch (e) {
            console.error(`Failed to connect to ${ip}: ${e}`);
        }
    }

    console.log(bases);

    app.listen(PORT, () => {
        console.log(`Started on :${PORT}`);
    });

    setInterval(() => {
        bases.forEach(async (base) => {
            let volume = await get_base_volume(base.connection);
            base.volume = volume;
        });
    }, 5000);
}

start();

function base_by_id_middleware(req, res, next) {
    const param = req.params.n;
    const id = parseInt(param);
    const base = get_base(id);
    if (!base) {
        res.status(400);
        res.end(`The base ${param} doesn't exist`);
        return;
    }

    req.id = id;
    req.base = base;
    next();
}

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url} from ${req.ip}`);
    next();
});

app.get("/api/ping/:n", (req, res) => {
    let n = parseInt(req.params.n);
    if (isNaN(n)) {
        res.status(400);
        res.end(`Invalid number ${req.params.n}`);
        return;
    }
    res.json({ up: get_base(n) != undefined });
    res.end();
});

app.get("/api/volume/:n", base_by_id_middleware, (req, res) => {
    res.json({ volume: req.base.volume });
});

app.post("/api/play/:n", base_by_id_middleware, (req, res) => {
    let id = req.id;
    let base = req.base;
    if (base.is_playing) {
        res.status(400);
        res.end(`The base ${id} is already playing sound`);
        return;
    }
    const connection = base.connection;
    console.log(`Playing sound on base ${id}`);
    base.is_playing = true;
    connection.exec("bash", ["/home/pi/startSND.sh"]).catch(console.error);
    res.end();
});

app.post("/api/stop/:n", base_by_id_middleware, (req, res) => {
    let id = req.id;
    let base = req.base;
    if (!base.is_playing) {
        res.status(400);
        res.end(`The base ${id} is not playing sound`);
        return;
    }
    const connection = base.connection;
    console.log(`Stopping sound on base ${id}`);
    base.is_playing = false;
    connection.exec("bash", ["/home/pi/stopSND.sh"]).catch(console.error);
    res.end();
});

app.post(
    "/api/volume/:n",
    express.json({ type: "*/*" }),
    base_by_id_middleware,
    (req, res) => {
        let id = req.id;
        let base = req.base;
        let volume = parseInt(req.body.volume);
        if (isNaN(parseInt(volume)) || volume < 0) {
            res.status(400).end(`Invalid volume ${req.body.volume}`);
            return;
        }
        console.log(`The volume of the base ${id} is now ${volume}%`);
        base.volume = volume;
        set_base_volume(base.connection, volume);
        res.end();
    }
);

app.use(express.static("public", { extensions: ["html"] }));

function set_base_volume(connection, volume) {
    connection.exec("bash", ["-c", `amixer -c 1 sset Speaker ${volume}%`]);
}

async function get_base_volume(connection) {
    let r = await connection.exec("bash", [
        "-c",
        `amixer -c 1 sget Speaker | awk -F 'Left:|[][]' 'BEGIN {RS=""}{ print $3 }' | sed 's/.$//'`,
    ]);
    return parseInt(r);
}

function get_base(id) {
    return bases.find((b) => b.id == id);
}
