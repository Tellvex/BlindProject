const PORT = 8080;
const BASES = [
    {
        ip: "blind1.local",
        soundcard: 1,
        control: "Headphone",
    },
    {
        ip: "blind2.local",
        soundcard: 1,
        control: "Headphone",
    },
    {
        ip: "blind3.local",
        soundcard: 1,
        control: "Headphone",
    },
    {
        ip: "blind4.local",
        soundcard: 1,
        control: "Headphone",
    },
];

const { NodeSSH } = require("node-ssh");
const { exec } = require("child_process");
const express = require("express");
const app = express();
const multer = require("multer");

// array of { id: number, ip: string, connection: ssh_connection, is_playing: bool, volume: number, soundcard: number, control: string }
let bases = [];

async function start() {
    for (let i = 0; i < BASES.length; i++) {
        let ip = BASES[i].ip;
        console.log(`Connecting to ${ip}...`);
        try {
            let connection = await new NodeSSH().connect({
                host: ip,
                username: "pi",
                privateKeyPath: `${process.env.HOME}/.ssh/id_rsa`,
            });
            connection.exec("rm", ["snd_pid"]).catch(() => {});
            let base = {
                id: i,
                ip,
                connection,
                is_playing: false,
                volume: 0,
                soundcard: BASES[i].soundcard,
                control: BASES[i].control,
            };
            let volume = await get_base_volume(base);
            base.volume = volume;
            bases.push(base);
            console.log("Connected");
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
            let volume = await get_base_volume(base);
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
    let base = get_base(n);
    let playing = base && base.is_playing;
    res.json({ up: base != undefined, playing });
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
    let connection = base.connection;
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
    let connection = base.connection;
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
        set_base_volume(base, volume);
        res.end();
    }
);

app.post(
    "/api/upload/:n",
    base_by_id_middleware,
    multer({ dest: "uploads/" }).single("file"),
    (req, res) => {
        exec(`ffmpeg -i ${req.file.path} sound.wav`);
        exec(`scp sound.wav pi@${req.base.ip}:/home/pi/sound.wav`);
        res.status(200).end();
    }
);

app.use(express.static("public", { extensions: ["html"] }));

function set_base_volume(base, volume) {
    base.connection.exec("bash", [
        "-c",
        `amixer -c ${base.soundcard} sset ${base.control} ${volume}%`,
    ]);
}

async function get_base_volume(base) {
    let r = await base.connection.exec("bash", [
        "-c",
        `amixer -c ${base.soundcard} sget ${base.control} | awk -F 'Left:|[][]' 'BEGIN {RS=""}{ print $3 }' | sed 's/.$//'`,
    ]);
    return parseInt(r);
}

function get_base(id) {
    return bases.find((b) => b.id == id);
}
