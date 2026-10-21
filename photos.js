const photoDialog = document.querySelector('.photo-dialog');
const photoImage = photoDialog.querySelector('.photo-dialog-image');
const photoTitle = photoDialog.querySelector('#photo-dialog-title');
const photoCredit = photoDialog.querySelector('.photo-dialog-credit');

function resizePhoto() {
    if (!photoDialog.open || !photoImage.naturalWidth) return;

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

photoImage.addEventListener('load', resizePhoto);
window.addEventListener('resize', resizePhoto);

// Pour un nouvel épisode, ajouter data-photo-src, data-photo-alt et
// data-photo-title au bouton ; data-photo-credit est facultatif.
document.querySelectorAll('.lien-photo[data-photo-src]').forEach((button) => {
    button.addEventListener('click', () => {
        photoImage.src = button.dataset.photoSrc;
        photoImage.alt = button.dataset.photoAlt || '';
        photoTitle.textContent = button.dataset.photoTitle || 'Photo de l’épisode';
        photoCredit.textContent = button.dataset.photoCredit || '';
        photoCredit.hidden = !button.dataset.photoCredit;
        photoDialog.showModal();
        resizePhoto();
    });
});

photoDialog.querySelector('.photo-dialog-close').addEventListener('click', () => {
    photoDialog.close();
});

photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
});
