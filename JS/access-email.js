window.emailJsConfig = {
    serviceId: 'service_r1dxe4g',
    templateId: 'template_c88lz9k',
    publicKey: 'sEXVuZf2kVWiVMJ9M'
};

const emailStatus = document.querySelector('.email-status');
let reponsesFormulaire = {};

document.addEventListener('access:granted', async (event) => {
    reponsesFormulaire = event.detail;
    const { serviceId, templateId, publicKey } = window.emailJsConfig;
    const configurationComplete = [serviceId, templateId, publicKey].every((value) => value.trim());

    if (!configurationComplete) {
        emailStatus.textContent = 'EmailJS n’est pas encore configuré. Ajoute tes identifiants dans JS/access-email.js.';
        emailStatus.classList.add('is-error');
        return;
    }

    if (!window.emailjs) {
        emailStatus.textContent = 'Le service EmailJS est indisponible. Réessaie plus tard.';
        emailStatus.classList.add('is-error');
        return;
    }

    const { nom, prenom, dateNaissance, age, personnePreferee } = event.detail;
    const templateParams = {
        nom,
        prenom,
        date_naissance: dateNaissance,
        age,
        personne_preferee: personnePreferee || '(non renseigné)',
        toutes_les_reponses: [
            `Nom : ${nom}`,
            `Prénom : ${prenom}`,
            `Date de naissance : ${dateNaissance}`,
            `Âge : ${age}`,
            `Nom de la personne préférée : ${personnePreferee || '(non renseigné)'}`
        ].join('\n'),
        date_soumission: new Date().toLocaleString('fr-FR')
    };

    emailStatus.textContent = '...';
    emailStatus.classList.remove('is-error');

    try {
        await window.emailjs.send(
            serviceId,
            templateId,
            templateParams,
            { publicKey }
        );
        emailStatus.textContent = '';
    } catch (erreur) {
        console.error('Échec de l’envoi des réponses avec EmailJS.', erreur);
        emailStatus.textContent = 'L’envoi des réponses a échoué. Vérifie la configuration EmailJS ou réessaie plus tard.';
        emailStatus.classList.add('is-error');
    }
});

document.addEventListener('wish:submit', async (event) => {
    const { serviceId, templateId, publicKey } = window.emailJsConfig;
    const configurationComplete = [serviceId, templateId, publicKey].every((value) => value.trim());
    const boutonSouhait = document.querySelector('.wish-submit');

    if (!configurationComplete || !window.emailjs) {
        window.alert('Souhait non envoyé');
        return;
    }

    boutonSouhait.disabled = true;
    const { nom = '', prenom = '', dateNaissance = '', age = '', personnePreferee = '' } = reponsesFormulaire;
    const souhait = event.detail;
    const templateParams = {
        nom,
        prenom,
        date_naissance: dateNaissance,
        age,
        personne_preferee: personnePreferee || '(non renseigné)',
        souhait,
        toutes_les_reponses: [
            `Nom : ${nom}`,
            `Prénom : ${prenom}`,
            `Date de naissance : ${dateNaissance}`,
            `Âge : ${age}`,
            `Nom de la personne préférée : ${personnePreferee || '(non renseigné)'}`,
            `Souhait : ${souhait}`
        ].join('\n'),
        date_soumission: new Date().toLocaleString('fr-FR')
    };

    try {
        await window.emailjs.send(
            serviceId,
            templateId,
            templateParams,
            { publicKey }
        );
        window.alert('Votre souhait a été envoyé');
    } catch (erreur) {
        console.error('Échec de l’envoi du souhait avec EmailJS.', erreur);
        window.alert('Souhait non envoyé');
    } finally {
        boutonSouhait.disabled = false;
    }
});
