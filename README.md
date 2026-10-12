# idealy.github.io

Pour ajouter le morceau à la page, place un fichier MP3 nommé `chanson.mp3` dans le dossier `AUDIO`. Un petit bouton flottant en bas à droite permet de lancer la musique et de la mettre en pause.

## Formulaire d’accès

Les réponses attendues pour le nom, le prénom, la date de naissance et l'âge sont configurées dans `reponsesAttendues` dans `index.html`. Le champ « personne préférée » est facultatif et n'est pas vérifié. La date doit être au format `AAAA-MM-JJ`. Le formulaire ignore les majuscules, les accents et les espaces superflus.

Ce formulaire est une porte d’entrée visuelle uniquement : comme le site est hébergé de façon statique, les réponses définies dans le code ne constituent pas une protection confidentielle.

## Envoi des réponses avec EmailJS

Après une identification réussie, les réponses du formulaire (y compris le champ facultatif s'il est rempli) sont envoyées avec EmailJS. Renseigne `serviceId`, `templateId` et `publicKey` dans `JS/access-email.js`, puis configure ton adresse comme destinataire du modèle dans le tableau de bord EmailJS avec les variables suivantes :

- `{{nom}}`
- `{{prenom}}`
- `{{date_naissance}}`
- `{{age}}`
- `{{personne_preferee}}`
- `{{toutes_les_reponses}}`
- `{{date_soumission}}`
- `{{souhait}}`

Le souhait écrit dans la section « Écrire ton souhait » est envoyé uniquement lorsque la personne clique sur « Envoyer votre souhait » ; il est disponible dans `{{souhait}}` et `{{toutes_les_reponses}}`. La Public Key EmailJS est utilisée côté navigateur. N'ajoute jamais de clé privée au site. Comme le formulaire est statique, limite l'utilisation du service à ton domaine dans EmailJS et active ses protections anti-abus.