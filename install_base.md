# Prérequis:

- Un Raspberry Pi (Zero W)
- Une carte SD
- Ordinateur avec accès internet + lecteur carte SD
- Réseau Wifi local


# Installer l'OS sur une carte SD:

- Lancer Raspberry Pi Imager (https://www.raspberrypi.com/software/).
- Sélectionner en OS Rapsberry Pi OS Lite (32 ou 64 bit en fonction du raspberry) (other)
- Sélectionner la carte SD
- Dans les options avancées:
    - Mettre le hostname au nouveau nom de la carte (par exemple blind1).
    - Activer le ssh en authentification par mot de passe:
        - username: pi
        - password: raspberry
    - Configurer le réseau sans fil (SSID et password) (réseau utilisé seulement pendant la création de la base)
- Lancer l'écriture puis retirer la carte SD une fois fini.


# Configurer la carte:

- Insérer la carte SD dans le Raspberry et le brancher pour qu'il démarre.
- Se connecter en ssh au rpi: `ssh pi@hostname.local` (remplacer hostname par le nom de la carte défini précédemment) avec le mot de passe 'raspberry'.
- Mise à jour: `sudo apt update && sudo apt full-upgrade -y && sudo apt autoremove`.
- Fixer l'ip: `sudo nano /etc/dhcpcd.conf` et ajouter:
    interface wlan0
    static ip_address=IP/MASK (remplacer par exemple par 192.168.34.2/24)
    static routers=SERVER_IP (remplacer par exemple par 192.168.34.1)
- Copier les fichiers `startSND.sh` et `stopSND.sh` dans le dossier home (/home/pi)
- Installer git: `sudo apt-get install git`
- Installer le driver son pour la carte respeaker:
    git clone https://github.com/waveshare/WM8960-Audio-HAT
    cd seeed-voicecard
    sudo ./install.sh
- Modifier le fichier wpa_supplicant.conf (sudo nano /etc/wpa_supplicant/wpa_supplicant.conf):
    Remplacer le contenu par:
        ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
        update_config=1
        country=FR

        network={
        ssid="SSID"
        psk="PASSWORD"
        key_mgmt=WPA-PSK
        }
    en mettant SSID et PASSWORD adaptés (le nom et le mdp du réseau crée par le serveur).
- Redemarrer: sudo reboot now
