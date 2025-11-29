// FORM VALIDATION SCRIPT


// Animation au chargement de la page
window.addEventListener('load', () => {
    const form = document.getElementById('projectForm');
    if (form) {
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        form.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Charger les données sauvegardées depuis les cookies
window.addEventListener('DOMContentLoaded', () => {
    loadFromCookies();
    setupFormValidation();
    setupCharacterCounter();
    setupFilePreview();
});

// GESTION DES COOKIES
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function loadFromCookies() {
    const nomInput = document.getElementById('nom');
    const emailInput = document.getElementById('email');
    
    if (nomInput && getCookie('userName')) {
        nomInput.value = getCookie('userName');
    }
    
    if (emailInput && getCookie('userEmail')) {
        emailInput.value = getCookie('userEmail');
    }
}

function saveToCookies() {
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    
    if (nom) setCookie('userName', nom, 30);
    if (email) setCookie('userEmail', email, 30);
}

// COMPTEUR DE CARACTÈRES
function setupCharacterCounter() {
    const descriptionField = document.getElementById('description');
    const charCount = document.getElementById('char-count');
    
    if (descriptionField && charCount) {
        descriptionField.addEventListener('input', () => {
            const currentLength = descriptionField.value.length;
            const maxLength = descriptionField.getAttribute('maxlength') || 500;
            charCount.textContent = `(${currentLength}/${maxLength} caractères)`;
            
            if (currentLength > maxLength * 0.9) {
                charCount.style.color = 'var(--warning)';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }
}

// PRÉVISUALISATION DE PHOTO
function setupFilePreview() {
    const photoInput = document.getElementById('photo');
    const documentInput = document.getElementById('document');
    
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Vérifier le format
                const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validFormats.includes(file.type)) {
                    showError('photo', 'Format invalide. Utilisez .jpg, .jpeg ou .png');
                    photoInput.value = '';
                    return;
                }
                
                // Prévisualisation avec FileReader
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('photo-preview');
                    const previewImage = document.getElementById('preview-image');
                    
                    if (preview && previewImage) {
                        previewImage.src = event.target.result;
                        preview.style.display = 'block';
                        
                        // Animation d'apparition
                        preview.style.opacity = '0';
                        preview.style.transform = 'scale(0.9)';
                        preview.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        
                        setTimeout(() => {
                            preview.style.opacity = '1';
                            preview.style.transform = 'scale(1)';
                        }, 50);
                    }
                };
                reader.readAsDataURL(file);
                clearError('photo');
            }
        });
    }
    
    if (documentInput) {
        documentInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const documentName = document.getElementById('document-name');
            
            if (file) {
                // Vérifier le format PDF
                if (file.type !== 'application/pdf') {
                    showError('document', 'Format invalide. Utilisez uniquement .pdf');
                    documentInput.value = '';
                    if (documentName) documentName.textContent = '';
                    return;
                }
                
                if (documentName) {
                    documentName.textContent = `📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
                    documentName.style.color = 'var(--success)';
                }
                clearError('document');
            }
        });
    }
}

// VALIDATION DU FORMULAIRE
function setupFormValidation() {
    const form = document.getElementById('projectForm');
    
    if (!form) return;
    
    // Validation en temps réel pour chaque champ
    const fields = ['titre', 'Categorie', 'description', 'composants', 'niveau', 
                    'nom', 'dateNaissance', 'email', 'password', 'confirmPassword', 'photo'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    clearError(fieldId);
                }
            });
        }
    });
    
    // Validation à la soumission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            saveToCookies();
            showSuccessMessage();
            
            // Redirection après 2 secondes
            setTimeout(() => {
                window.location.href = 'projects.html';
            }, 2000);
        }
    });
}

function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    
    let isValid = true;
    
    switch(fieldId) {
        case 'titre':
        case 'description':
        case 'composants':
        case 'nom':
            if (!field.value.trim()) {
                showError(fieldId, 'Ce champ est obligatoire');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'Categorie':
        case 'niveau':
            if (!field.value) {
                showError(fieldId, 'Veuillez sélectionner une option');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'dateNaissance':
            const age = calculateAge(field.value);
            if (!field.value) {
                showError(fieldId, 'La date de naissance est obligatoire');
                isValid = false;
            } else if (age < 18) {
                showError(fieldId, 'Vous devez avoir au moins 18 ans');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!field.value) {
                showError(fieldId, 'L\'email est obligatoire');
                isValid = false;
            } else if (!emailRegex.test(field.value)) {
                showError(fieldId, 'Format d\'email invalide');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'password':
            if (!field.value) {
                showError(fieldId, 'Le mot de passe est obligatoire');
                isValid = false;
            } else if (field.value.length < 6) {
                showError(fieldId, 'Le mot de passe doit contenir au moins 6 caractères');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!field.value) {
                showError(fieldId, 'Veuillez confirmer votre mot de passe');
                isValid = false;
            } else if (field.value !== password) {
                showError(fieldId, 'Les mots de passe ne correspondent pas');
                isValid = false;
            } else {
                clearError(fieldId);
            }
            break;
            
        case 'photo':
            if (!field.files || field.files.length === 0) {
                showError(fieldId, 'Veuillez sélectionner une photo');
                isValid = false;
            } else {
                const file = field.files[0];
                const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
                if (!validFormats.includes(file.type)) {
                    showError(fieldId, 'Format invalide. Utilisez .jpg, .jpeg ou .png');
                    isValid = false;
                } else {
                    clearError(fieldId);
                }
            }
            break;
    }
    
    return isValid;
}

function validateForm() {
    let isValid = true;
    
    // Valider tous les champs obligatoires
    const requiredFields = ['titre', 'Categorie', 'description', 'composants', 'niveau',
                           'nom', 'dateNaissance', 'email', 'password', 'confirmPassword', 'photo'];
    
    requiredFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    // Validation du document PDF (optionnel mais si présent, doit être valide)
    const documentInput = document.getElementById('document');
    if (documentInput && documentInput.files && documentInput.files.length > 0) {
        const file = documentInput.files[0];
        if (file.type !== 'application/pdf') {
            showError('document', 'Le document doit être au format PDF');
            isValid = false;
        }
    }
    
    return isValid;
}

function calculateAge(birthDate) {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.add('error');
        field.style.borderColor = 'var(--danger)';
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.style.color = 'var(--danger)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.5rem';
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
        field.classList.remove('error');
        field.style.borderColor = '';
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submitBtn');
    
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-10px)';
        successMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 50);
    }
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publication en cours...';
        submitBtn.style.opacity = '0.6';
    }
}