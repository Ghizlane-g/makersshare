const sampleProjects = [
    {
        id: 1,
        title: "Bras Robotique DIY",
        author: "Alex Dupont",
        category: "Robotique",
        description: "Un bras robotique contrôlé par Arduino pour les tâches de précision.",
        image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=400&h=300&fit=crop",
        views: 1234,
        likes: 89,
        date: "2025-11-20",
        difficulty: "moyen",
        popularity: 95
    },
    {
        id: 2,
        title: "Maison Intelligente Imprimée 3D",
        author: "Marie Leblanc",
        category: "IoT",
        description: "Automatisation de l'éclairage et de la température avec Raspberry Pi.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        views: 2156,
        likes: 142,
        date: "2025-11-18",
        difficulty: "difficile",
        popularity: 88
    },
    {
        id: 3,
        title: "Station Météo Connectée",
        author: "Jean Martin",
        category: "Arduino",
        description: "Surveillez le climat local et envoyez les données vers le cloud.",
        image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop",
        views: 987,
        likes: 67,
        date: "2025-11-15",
        difficulty: "facile",
        popularity: 75
    },
    {
        id: 4,
        title: "Clavier Mécanique Custom",
        author: "Chris N.",
        category: "Programmation",
        description: "Construisez votre propre clavier mécanique de A à Z.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
        views: 3421,
        likes: 234,
        date: "2025-11-22",
        difficulty: "moyen",
        popularity: 92
    },
    {
        id: 5,
        title: "Drone de Course FPV",
        author: "Sophie L.",
        category: "Robotique",
        description: "Assemblez et programmez un drone de course ultra-rapide.",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop",
        views: 4567,
        likes: 312,
        date: "2025-11-21",
        difficulty: "difficile",
        popularity: 98
    },
    {
        id: 6,
        title: "Jardin Hydroponique Auto",
        author: "David P.",
        category: "IoT",
        description: "Un système automatisé pour cultiver des herbes à l'intérieur.",
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
        views: 2890,
        likes: 198,
        date: "2025-11-19",
        difficulty: "moyen",
        popularity: 85
    },
    {
        id: 7,
        title: "Borne d'Arcade Rétro",
        author: "Émilie R.",
        category: "Design & 3D",
        description: "Revivez la nostalgie avec une borne d'arcade multi-jeux.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
        views: 5123,
        likes: 423,
        date: "2025-11-17",
        difficulty: "moyen",
        popularity: 94
    },
    {
        id: 8,
        title: "Système Solaire Portable",
        author: "Ahmed K.",
        category: "Énergie & Systèmes",
        description: "Chargeur solaire portable pour vos appareils électroniques.",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
        views: 1876,
        likes: 134,
        date: "2025-11-16",
        difficulty: "facile",
        popularity: 78
    }
];

// ========================================
// COUNTER ANIMATION
// ========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// ========================================
// INITIALIZE HOMEPAGE
// ========================================
function initHomePage() {
    // Animate stats counters
    const projectsCount = document.getElementById('projects-count');
    const usersCount = document.getElementById('users-count');
    const viewsCount = document.getElementById('views-count');
    
    if (projectsCount) animateCounter(projectsCount, 1247);
    if (usersCount) animateCounter(usersCount, 3892);
    if (viewsCount) animateCounter(viewsCount, 45678);
    
    // Load recent projects
    const recentGrid = document.getElementById('recent-projects-grid');
    if (recentGrid) {
        const recentProjects = [...sampleProjects]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        renderProjects(recentProjects, recentGrid);
    }
    
    // Load popular projects
    const popularGrid = document.getElementById('popular-projects-grid');
    if (popularGrid) {
        const popularProjects = [...sampleProjects]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 4);
        renderProjects(popularProjects, popularGrid);
    }
}

// ========================================
// RENDER PROJECTS
// ========================================
function renderProjects(projects, container) {
    if (!container) return;
    
    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="viewProject(${project.id})">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-author">Par ${project.author}</p>
                <span class="project-category">${project.category}</span>
                <div class="project-stats">
                    <span>👁 ${project.views}</span>
                    <span>❤️ ${project.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// PROJECTS PAGE
// ========================================
function initProjectsPage() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    let filteredProjects = [...sampleProjects];
    
    // Render all projects initially
    renderProjects(filteredProjects, projectsGrid);
    
    // Search functionality
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filteredProjects = sampleProjects.filter(project =>
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.author.toLowerCase().includes(searchTerm)
            );
            applyFilters();
        });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    // Difficulty filter
    const difficultyFilter = document.getElementById('difficulty-filter');
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', applyFilters);
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        let result = [...filteredProjects];
        
        // Apply category filter
        const category = categoryFilter?.value;
        if (category) {
            result = result.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
        }
        
        // Apply difficulty filter
        const difficulty = difficultyFilter?.value;
        if (difficulty) {
            result = result.filter(p => p.difficulty === difficulty);
        }
        
        // Apply sorting
        const sort = sortFilter?.value || 'recent';
        switch(sort) {
            case 'recent':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'populaire':
                result.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'alphabetique':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'vues':
                result.sort((a, b) => b.views - a.views);
                break;
        }
        
        renderProjects(result, projectsGrid);
    }
}

// ========================================
// VIEW PROJECT
// ========================================
function viewProject(id) {
    localStorage.setItem('currentProjectId', id);
    window.location.href = 'project-view.html';
}

// ========================================
// PROJECT DETAIL PAGE
// ========================================
function initProjectDetailPage() {
    const projectId = localStorage.getItem('currentProjectId');
    if (!projectId) return;
    
    const project = sampleProjects.find(p => p.id == projectId);
    if (!project) return;
    
    document.title = `${project.title} - MakerShare`;
    
    console.log('Loading project:', project);
}

// ========================================
// FORM SUBMISSION
// ========================================
function initAddProjectPage() {
    // La soumission du formulaire est gérée par form-validation.js
    // Cette fonction est conservée si d'autres initialisations sont nécessaires à l'avenir
    console.log('Add Project Page Initialized');
}

// ========================================
// CONTACT FORM
// ========================================
function initContactPage() {
    const form = document.querySelector('form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const contactData = Object.fromEntries(formData);
        
        console.log('Contact form data:', contactData);
        
        alert('Message envoyé avec succès! Nous vous répondrons bientôt. 📧');
        form.reset();
    });
}

// ========================================
// SEARCH PAGE
// ========================================
function initSearchPage() {
    const searchForm = document.querySelector('form');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const searchTerm = document.querySelector('input[type="text"]').value;
        const category = document.getElementById('category')?.value;
        const difficulty = document.getElementById('difficulty')?.value;
        
        let results = sampleProjects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                project.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !category || project.category.toLowerCase().includes(category.toLowerCase());
            const matchesDifficulty = !difficulty || project.difficulty === difficulty;
            
            return matchesSearch && matchesCategory && matchesDifficulty;
        });
        
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            renderProjects(results, resultsContainer);
        }
    });
}

// ========================================
// DARK MODE TOGGLE
// ========================================
function initDarkMode() {
    const modeButton = document.getElementById("mode");
    if (!modeButton) return;
    
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Récupérer le thème stocké ou définir "dark" par défaut
    let currentTheme = localStorage.getItem("theme") || "dark";
    
    // Appliquer le thème au chargement
    applyTheme(currentTheme);
    
    // Fonction pour appliquer le thème
    function applyTheme(theme) {
        if (theme === "light") {
            htmlElement.classList.add("light-mode");
            bodyElement.classList.add("light-mode");
            modeButton.textContent = "🌙"; // Lune pour passer en mode sombre
        } else {
            htmlElement.classList.remove("light-mode");
            bodyElement.classList.remove("light-mode");
            modeButton.textContent = "☀️"; // Soleil pour passer en mode clair
        }
    }
    
    // Basculer le thème au clic
    modeButton.addEventListener("click", () => {
        currentTheme = currentTheme === "dark" ? "light" : "dark";
        localStorage.setItem("theme", currentTheme);
        applyTheme(currentTheme);
    });
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le mode sombre sur toutes les pages
    initDarkMode();
    
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'projects.html':
            initProjectsPage();
            break;
        case 'project-view.html':
            initProjectDetailPage();
            break;
        case 'add.html':
            initAddProjectPage();
            break;
        case 'contact.html':
            initContactPage();
            break;
        case 'search.html':
            initSearchPage();
            break;
    }
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}