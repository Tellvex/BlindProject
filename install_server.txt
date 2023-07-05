# Prérequis:

- Un Raspberry Pi
- Une carte SD
- Ordinateur avec accès internet + lecteur carte SD
- Réseau Wifi local


# Installer l'OS sur une carte SD:

- Lancer Raspberry Pi Imager (https://www.raspberrypi.com/software/).
- Sélectionner en OS Rapsberry Pi OS Lite (32 ou 64 bit en fonction du raspberry) (other)
- Sélectionner la carte SD
- Dans les options avancées:
    - Mettre le hostname au nouveau nom de la carte (par exemple blind0).
    - Activer le ssh en authentification par mot de passe:
        - username: pi
        - password: raspberry
    - Configurer le réseau sans fil (SSID et password) (réseau utilisé seulement pendant la création de la base)
- Lancer l'écriture puis retirer la carte SD une fois fini.


# Configurer la carte:

- Insérer la carte SD dans le Raspberry et le brancher pour qu'il démarre.
- Se connecter en ssh au rpi: `ssh pi@hostname.local` (remplacer hostname par le nom de la carte défini précédemment) avec le mot de passe 'raspberry'.
- Mise à jour: `sudo apt update && sudo apt full-upgrade -y && sudo apt autoremove`.
- Installer ffmpeg: `sudo apt install ffmpeg`.
- Fixer l'ip: `sudo nano /etc/dhcpcd.conf` et ajouter:
    interface wlan0
    static ip_address=IP/MASK (remplacer par exemple par 192.168.34.1/24
- Connaitre l'architecture du CPU: `uname -m`
- Installer NodeJs (architecture = "aarch64" ou "armv7l"):
    `sudo apt install nodejs`
- Installer NodeJs (autre architecture (par exemple "armv6l")):
    - `curl -sL https://unofficial-builds.nodejs.org/download/release/v18.16.0/node-v18.16.0-linux-$(uname -m).tar.gz | sudo tar -xz  --strip-components=1 -C /usr/local/`
- Installer git: `sudo apt-get install git`
- Installer le serveur:
    git clone chrisChampo`\server server
    cd server
    npm install
- Installer raspap:
    - wget https://install.raspap.com -O raspap.sh
    - sudo chmod +x raspap.sh
    - sudo ./raspap.sh
        ne pas garder openVPN
    - configuration sur la page raspAP : admin / secret
        - hotspot Basic : name BlindNet
        - hotspot Security : Pwd : BlindNetProject
        - hotspot advanced : 20 clients max
        - DHCP Server : Static IP 192.168.34.1/24 GTW 192.168.34.1
            start 192.168.34.10 end 192.168.34.50
        - Authentication : secret / BlindNetProject
    - diminution d'utilisation de ressources par dnsmasq :
        sudo nano /etc/default/dnsmasq
            on active : 	IGNORE_RESOLVCONF=yes
                    DNSMASQ_EXCEPT="lo"
        sudo nano /etc/resolv.conf
            on supprime tout
        sudo service dnsmasq restart
        sudo systemctl stop systemd-resolved
        sudo systemctl disable systemd-resolved
- Creation des cles SSH:
    - `ssh-keygen -t rsa`
    - Pour chaque base: `ssh-copy-id pi@192.168.34.X`
- Redemarrer: sudo reboot now


# Démarrer le serveur:
- `cd ~/server`
- `npm start`
