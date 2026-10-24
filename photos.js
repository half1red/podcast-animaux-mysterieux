const photoDialog = document.querySelector('.photo-dialog');
let photoImage = photoDialog.querySelector('.photo-dialog-image');
const photoTitle = photoDialog.querySelector('#photo-dialog-title');
const photoCredit = photoDialog.querySelector('.photo-dialog-credit');
const photoStatus = photoDialog.querySelector('.photo-dialog-status');
const photoFigure = photoDialog.querySelector('figure');
let photoRequest = 0;

function resizePhoto() {
    if (!photoDialog.open || photoImage.hidden || !photoImage.naturalWidth) return;

    const dialogStyle = getComputedStyle(photoDialog);
    const horizontalPadding = parseFloat(dialogStyle.paddingLeft) + parseFloat(dialogStyle.paddingRight);
    const verticalPadding = parseFloat(dialogStyle.paddingTop) + parseFloat(dialogStyle.paddingBottom);
    const maxWidth = parseFloat(dialogStyle.maxWidth);
    const maxHeight = parseFloat(dialogStyle.maxHeight);

    photoDialog.style.width = `${maxWidth}px`;

    // Recalculer le crédit à la largeur obtenue, au cas où il passe sur plusieurs lignes.
    for (let pass = 0; pass < 3; pass += 1) {
        const creditHeight = photoCredit.hidden ? 0 : photoCredit.getBoundingClientRect().height
            + parseFloat(getComputedStyle(photoCredit).marginTop);
        const scale = Math.min(
            (maxWidth - horizontalPadding) / photoImage.naturalWidth,
            Math.max(1, maxHeight - verticalPadding - creditHeight) / photoImage.naturalHeight
        );
        const imageWidth = Math.floor(photoImage.naturalWidth * scale);
        const imageHeight = Math.floor(photoImage.naturalHeight * scale);

        photoImage.style.width = `${imageWidth}px`;
        photoImage.style.height = `${imageHeight}px`;
        photoDialog.style.width = `${imageWidth + horizontalPadding}px`;
    }
}

window.addEventListener('resize', resizePhoto);

// Pour un nouvel épisode, ajouter data-photo-src, data-photo-alt et
// data-photo-title au bouton ; data-photo-credit est facultatif.
document.querySelectorAll('.lien-photo[data-photo-src]').forEach((button) => {
    button.addEventListener('click', async () => {
        const request = ++photoRequest;
        photoImage.hidden = true;
        photoCredit.hidden = true;
        photoDialog.style.removeProperty('width');
        photoDialog.dataset.photoState = 'loading';
        photoFigure.setAttribute('aria-busy', 'true');
        photoStatus.hidden = false;
        photoStatus.textContent = 'Chargement…';
        photoTitle.textContent = button.dataset.photoTitle || 'Photo de l’épisode';
        if (!photoDialog.open) photoDialog.showModal();

        // Une image distincte évite de conserver les pixels de la photo précédente.
        const nextImage = new Image();
        nextImage.className = 'photo-dialog-image';
        nextImage.alt = button.dataset.photoAlt || '';
        nextImage.src = button.dataset.photoSrc;

        try {
            await nextImage.decode();
            if (request !== photoRequest || !photoDialog.open) return;

            photoImage.replaceWith(nextImage);
            photoImage = nextImage;
            photoCredit.textContent = button.dataset.photoCredit || '';
            photoCredit.hidden = !button.dataset.photoCredit;
            photoStatus.hidden = true;
            photoStatus.textContent = '';
            photoDialog.dataset.photoState = 'ready';
            photoFigure.setAttribute('aria-busy', 'false');
            resizePhoto();
        } catch {
            if (request !== photoRequest || !photoDialog.open) return;
            photoDialog.dataset.photoState = 'error';
            photoFigure.setAttribute('aria-busy', 'false');
            photoStatus.textContent = 'Impossible de charger la photo. Fermez puis réessayez.';
        }
    });
});

photoDialog.addEventListener('close', () => {
    if (photoDialog.open) return;
    // Ignorer un chargement terminé après une fermeture (y compris avec Échap).
    photoRequest += 1;
    photoFigure.setAttribute('aria-busy', 'false');
});

photoDialog.querySelector('.photo-dialog-close').addEventListener('click', () => {
    photoDialog.close();
});

photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
});
