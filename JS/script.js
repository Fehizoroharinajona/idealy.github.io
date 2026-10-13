const reponsesAttendues = {
            nom: 'LOHARANONIANDOHANA',
            prenom: 'Tsiky',
            dateNaissance: '2006-10-13',
            age: '20'
        };

        const formulaireAcces = document.querySelector('.access-form');
        const messageAcces = document.querySelector('.access-error');

        const normaliserReponse = (reponse) => reponse
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .toLocaleLowerCase('fr');

        formulaireAcces.addEventListener('submit', (evenement) => {
            evenement.preventDefault();

            const reponsesSaisies = new FormData(formulaireAcces);
            const identiteValide = Object.entries(reponsesAttendues).every(([champ, reponseAttendue]) =>
                normaliserReponse(String(reponsesSaisies.get(champ) || '')) === normaliserReponse(reponseAttendue)
            );

            if (!identiteValide) {
                messageAcces.textContent = 'Certaines réponses sont incorrectes. Vérifie tes informations et réessaie.';
                return;
            }

            document.dispatchEvent(new CustomEvent('access:granted', {
                detail: Object.fromEntries(reponsesSaisies.entries())
            }));

            document.querySelector('.access-gate').hidden = true;
            document.querySelector('header').hidden = false;
            document.querySelector('main').hidden = false;
            document.querySelector('.audio-toggle').hidden = false;
            demarrerAudio();
            document.querySelector('main').focus();
        });

        const formulaireSouhait = document.querySelector('.wish-form');

        formulaireSouhait.addEventListener('submit', (evenement) => {
            evenement.preventDefault();

            const souhait = new FormData(formulaireSouhait).get('souhait').trim();
            if (!souhait) {
                const champSouhait = formulaireSouhait.elements.souhait;
                champSouhait.setCustomValidity('Écris ton souhait avant de l’envoyer.');
                champSouhait.reportValidity();
                return;
            }

            formulaireSouhait.elements.souhait.setCustomValidity('');
            document.dispatchEvent(new CustomEvent('wish:submit', { detail: souhait }));
        });

        formulaireSouhait.elements.souhait.addEventListener('input', (evenement) => {
            evenement.currentTarget.setCustomValidity('');
        });

        const piste = document.getElementById('piste');

        if (piste) {
            [...piste.children].forEach((element) => {
                const copie = element.cloneNode(true);
                copie.setAttribute('aria-hidden', 'true');
                piste.appendChild(copie);
            });
        }

        const sectionsAnimees = document.querySelectorAll('#accueil, #voeux');
        const lecteurAudio = document.querySelector('.audio-player');
        const statutAudio = document.querySelector('.audio-status');
        const boutonAudio = document.querySelector('.audio-toggle');

        const demarrerAudio = async () => {
            try {
                await lecteurAudio.play();
                statutAudio.textContent = '';
            } catch (erreur) {
                statutAudio.textContent = 'La lecture automatique a été bloquée. Utilise le bouton musique pour lancer la lecture.';
            }
        };

        if (lecteurAudio && statutAudio && boutonAudio) {
            const iconeAudio = boutonAudio.querySelector('span');
            const mettreAJourEtatAudio = (enLecture) => {
                const action = enLecture ? 'Mettre la musique en pause' : 'Lire la musique';
                iconeAudio.textContent = enLecture ? 'Ⅱ' : '▶';
                boutonAudio.setAttribute('aria-label', action);
                boutonAudio.setAttribute('aria-pressed', String(enLecture));
                boutonAudio.title = action;
            };

            boutonAudio.addEventListener('click', async () => {
                if (lecteurAudio.paused) {
                    await demarrerAudio();
                } else {
                    lecteurAudio.pause();
                }
            });

            lecteurAudio.addEventListener('play', () => mettreAJourEtatAudio(true));
            lecteurAudio.addEventListener('pause', () => mettreAJourEtatAudio(false));
            lecteurAudio.addEventListener('ended', () => mettreAJourEtatAudio(false));
            lecteurAudio.addEventListener('error', () => {
                statutAudio.textContent = 'Impossible de charger le morceau. Vérifie que AUDIO/chanson.mp3 est bien présent.';
                boutonAudio.title = statutAudio.textContent;
            });
        }

        if ('IntersectionObserver' in window) {
            const observateur = new IntersectionObserver((entrees) => {
                entrees.forEach((entree) => {
                    entree.target.classList.toggle('is-visible', entree.isIntersecting);
                });
            }, { threshold: 0.15 });

            sectionsAnimees.forEach((section) => observateur.observe(section));
        }