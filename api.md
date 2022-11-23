# Documentation du serveur

## Endpoints:

**n est l'indices de la base sélectionnée**

- ### GET /api/battery/n:
  _Retourne le % de batterie de la base n_  
   Retour (json):
  ```json
  {
      "battery": number
  }
  ```

- ### GET /api/volume/n:
  _Retourne le % du volume de la base n_  
   Retour:
  ```json
  {
      "volume": number
  }
  ```

- ### POST /api/play/n:
  _Lance le son sur la base n_

- ### POST /api/stop/n:
  _Arrete de jouer le son sur la base n_

- ### POST /api/volume/n:
  _Règle le volume de la base n_  
   Body:
  ```json
  {
      "volume": number
  }
  ```
