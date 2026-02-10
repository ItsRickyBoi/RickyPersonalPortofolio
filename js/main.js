// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// PDF Viewer State
let currentPdf = null;
let currentPage = 1;
let pageCount = 0;

// GitHub Projects Data
const githubProjects = [
    {
        title: "HR-EMS",
        description: "Modern, responsive web application designed for basic HR administrative duties. It implements full CRUD operations on employee records using a PHP API and a MySQL database for persistent storage.",
        repo: "ItsRickyBoi/HR_EMS",
        tags: ["HTML", "CSS", "Javascript", "Bootstrap 5"],
        githubUrl: "https://github.com/ItsRickyBoi/HR_EMS"
    },
    {
        title: "Anime Recommender System with Deep Q-Network",
        description: "Anime Recommender utilizing Deep Q-Network with reward based training, on user rating, global rating, and user preferences.",
        repo: "ItsRickyBoi/Anime-Recommender-System-with-DQN",
        tags: ["Python", "surprise-scikit"],
        githubUrl: "https://github.com/ItsRickyBoi/Anime-Recommender-System-with-DQN"
    },
    {
        title: "Password Manager",
        description: "Simple password manager for keeping password safe integrated with google drive and telegram API.",
        repo: "ItsRickyBoi/Password-Manager",
        tags: ["Python"],
        githubUrl: "https://github.com/ItsRickyBoi/Password-Manager"
    }
];

// Art Portfolio Data
const artworks = [
    {
        title: "Kureiji Ollie",
        description: "Hololive ID Vtuber",
        fileUrl: "https://drive.google.com/file/d/13f3BdN1P-oxCwbgAX79wybxBIIMubCaf/view",
        type: "image"
    },
    {
        title: "Amanda x Toshi",
        description: "Fanart for Amanda Brownies & Toshiba",
        fileUrl: "https://drive.google.com/file/d/1-s31MYTmFCRoi5kfxrLYQGpp_zQQ0OlI/view",
        type: "image"
    },
    {
        title: "Maomao",
        description: "Fanart for maomao from the apothecary diaries",
        fileUrl: "https://drive.google.com/file/d/1XFGoetl1tDdGY6a1zNKlwPOF7dFBQBqO/view",
        type: "image"
    },

];

// Function to convert Google Drive image URL to direct preview URL
function getGoogleDriveImageUrl(viewUrl) {
    const fileId = viewUrl.match(/\/d\/([^\/]+)/)[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

// Function to create art card with Google Drive preview
function createArtCard(artwork) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const fileId = artwork.fileUrl.match(/\/d\/([^\/]+)/)[1];

    // Use Google Drive's embed view for preview
    const previewUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;

    col.innerHTML = `
        <div class="art-item">
            <img src="${previewUrl}"
                 alt="${artwork.title}"
                 class="art-image"
                 onerror="this.src='https://via.placeholder.com/400x500/8B7BA8/FFFFFF?text=Art+Preview'">
            <div class="art-overlay">
                <h5>${artwork.title}</h5>
                <p>${artwork.description}</p>
                <p><small>Click to view full size</small></p>
            </div>
        </div>
    `;

    // Attach click event directly to this art item
    const artItem = col.querySelector('.art-item');
    artItem.addEventListener('click', function() {
        const title = this.querySelector('.art-overlay h5').textContent;

        // Open the actual Google Drive view in a new tab for full size
        const fullSizeUrl = `https://drive.google.com/file/d/${fileId}/view`;

        const artModal = new bootstrap.Modal(document.getElementById('artModal'));
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('artModalLabel');

        // For modal, use a larger thumbnail since direct access is blocked
        const modalPreviewUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

        modalImage.src = modalPreviewUrl;
        modalTitle.textContent = title;
        artModal.show();

        console.log('Opening artwork:', title, 'File ID:', fileId);
        console.log('Modal image URL:', modalPreviewUrl);
    });

    return col;
}

// Function to load all artworks
function loadArtworks() {
    const container = document.getElementById('artGallery');

    if (!container) {
        console.log('Art gallery container not found');
        return;
    }

    artworks.forEach(artwork => {
        const artCard = createArtCard(artwork);
        container.appendChild(artCard);
    });

    console.log('Loaded', artworks.length, 'artworks');
}

// Helper function to add new artworks dynamically
function addArtwork(title, description, fileUrl) {
    const artwork = {
        title,
        description,
        fileUrl,
        type: "image"
    };

    artworks.push(artwork);

    const container = document.getElementById('artGallery');
    if (container) {
        const artCard = createArtCard(artwork);
        container.appendChild(artCard);
    }
}

// Function to load all projects
function loadProjects() {
    const container = document.getElementById('projectsContainer');

    if (!container) {
        console.log('Projects container not found');
        return;
    }

    githubProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        container.appendChild(projectCard);
    });

    initializeProjectCards();
}

// Certificates Data
const certificates = [
    {
        title: "IELTS General Training",
        issuer: "IDP IELTS Indonesia",
        date: "October 2025",
        type: "pdf",
        fileUrl: "https://drive.google.com/file/d/1zZCq_HqWUtX6WbPvJMKrhGjHqI5SU1a_/view",
        credentialUrl: "#",
        skills: ["English for career", "English as second language"]
    },
    {
        title: "TOEFL itp",
        issuer: "ESQ English Course",
        date: "October 2025",
        type: "pdf",
        fileUrl: "https://drive.google.com/file/d/1TkLXvNRVo4WlsTYr3rNoVSUR3uno8Rqh/view",
        credentialUrl: "#",
        skills: ["English for career", "English as second language"]
    },
];

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(88, 90, 138, 1)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.backgroundColor = 'rgba(88, 90, 138, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Art gallery modal functionality
const artItems = document.querySelectorAll('.art-item');
const artModal = new bootstrap.Modal(document.getElementById('artModal'));
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('artModalLabel');

artItems.forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('.art-overlay h5').textContent;

        modalImage.src = img.src;
        modalTitle.textContent = title;
        artModal.show();
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Project cards hover effect enhancement
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Skill items animation on hover
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.skill-icon i');
        icon.style.transform = 'rotate(360deg) scale(1.2)';
        icon.style.transition = 'transform 0.5s ease';
    });

    item.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.skill-icon i');
        icon.style.transform = 'rotate(0deg) scale(1)';
    });
});

// Helper function to add new projects dynamically
function addProject(title, description, imageUrl, githubUrl, tags) {
    const projectsContainer = document.getElementById('projectsContainer');

    const projectCol = document.createElement('div');
    projectCol.className = 'col-md-6 col-lg-4';

    const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    projectCol.innerHTML = `
        <div class="project-card">
            <div class="project-preview">
                <img src="${imageUrl}" alt="${title}">
            </div>
            <div class="project-content">
                <h4>${title}</h4>
                <p>${description}</p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <a href="${githubUrl}" target="_blank" class="btn btn-sm btn-outline-primary mt-3">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        </div>
    `;

    projectsContainer.appendChild(projectCol);
}

// Helper function to add new art pieces dynamically
function addArtwork(title, imageUrl) {
    const artGallery = document.getElementById('artGallery');

    const artCol = document.createElement('div');
    artCol.className = 'col-md-6 col-lg-4';

    artCol.innerHTML = `
        <div class="art-item">
            <img src="${imageUrl}" alt="${title}">
            <div class="art-overlay">
                <h5>${title}</h5>
                <p>Click to view full size</p>
            </div>
        </div>
    `;

    artGallery.appendChild(artCol);

    // Reattach click event for modal
    const newArtItem = artCol.querySelector('.art-item');
    newArtItem.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('.art-overlay h5').textContent;

        modalImage.src = img.src;
        modalTitle.textContent = title;
        artModal.show();
    });
}

// GitHub Projects Helper Functions
function addGitHubProject(title, description, repo, tags, githubUrl) {
    const project = {
        title,
        description,
        repo,
        tags,
        githubUrl: githubUrl || `https://github.com/${repo}`
    };

    const container = document.getElementById('projectsContainer');
    const projectCard = createProjectCard(project);
    container.appendChild(projectCard);

    // Reinitialize hover effects
    initializeProjectCards();
}

// Function to create project card with GitHub preview
function createProjectCard(project) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const tagsHTML = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

    col.innerHTML = `
        <div class="project-card">
            <div class="project-preview">
                <img src="https://opengraph.githubassets.com/1/${project.repo}"
                     alt="${project.title} GitHub Preview"
                     class="github-preview"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x250/667BC6/FFFFFF?text=${encodeURIComponent(project.title)}'">
            </div>
            <div class="project-content">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <a href="${project.githubUrl}" target="_blank" class="btn btn-sm btn-outline-primary mt-3">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        </div>
    `;

    return col;
}

// Reinitialize project cards after loading
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Certificate Functions
function getGoogleDrivePreviewUrl(viewUrl) {
    const fileId = viewUrl.match(/\/d\/([^\/]+)/)[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
}

function getGoogleDriveDirectUrl(viewUrl) {
    const fileId = viewUrl.match(/\/d\/([^\/]+)/)[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
}

function createCertificateCard(certificate) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';

    const skillsHTML = certificate.skills.map(skill => `<span class="certificate-tag">${skill}</span>`).join('');
    const pdfBadge = certificate.type === 'pdf' ? '<span class="pdf-badge"><i class="fas fa-file-pdf"></i> PDF</span>' : '';

    const previewUrl = certificate.type === 'pdf'
        ? getGoogleDrivePreviewUrl(certificate.fileUrl)
        : certificate.fileUrl;

    col.innerHTML = `
        <div class="certificate-card">
            <div class="certificate-preview">
                <img src="${previewUrl}"
                     alt="${certificate.title}"
                     class="certificate-image"
                     onerror="this.src='https://via.placeholder.com/400x300/667BC6/FFFFFF?text=Preview+Not+Available'">
                <div class="certificate-overlay">
                    ${certificate.type === 'pdf' ?
                        `<button class="btn btn-sm btn-light view-pdf-btn"
                            data-file="${getGoogleDriveDirectUrl(certificate.fileUrl)}"
                            data-title="${certificate.title}">
                            <i class="fas fa-file-pdf"></i> View PDF
                        </button>` :
                        `<button class="btn btn-sm btn-light view-image-btn"
                            data-image="${certificate.fileUrl}"
                            data-title="${certificate.title}">
                            <i class="fas fa-expand"></i> View Certificate
                        </button>`
                    }
                </div>
                ${pdfBadge}
            </div>
            <div class="certificate-content">
                <h4>${certificate.title}</h4>
                <div class="certificate-meta">
                    <span class="issuer"><i class="fas fa-building"></i> ${certificate.issuer}</span>
                    <span class="date"><i class="fas fa-calendar"></i> ${certificate.date}</span>
                </div>
                <div class="certificate-skills">
                    ${skillsHTML}
                </div>
                ${certificate.credentialUrl !== '#' ?
                    `<a href="${certificate.credentialUrl}" target="_blank" class="btn btn-sm btn-outline-primary mt-2">
                        <i class="fas fa-external-link-alt"></i> Verify
                    </a>` : ''
                }
            </div>
        </div>
    `;

    return col;
}

async function loadPdf(directUrl, title) {
    const pdfModal = new bootstrap.Modal(document.getElementById('pdfModal'));
    const pdfLabel = document.getElementById('pdfModalLabel');
    const downloadLink = document.getElementById('downloadPdf');

    pdfLabel.textContent = title;
    downloadLink.href = directUrl.replace('/preview', '/view');

    try {
        const loadingTask = pdfjsLib.getDocument(directUrl);
        currentPdf = await loadingTask.promise;
        pageCount = currentPdf.numPages;
        currentPage = 1;

        await renderPage(currentPage);
        updatePagination();
        pdfModal.show();

    } catch (error) {
        console.error('Error loading PDF:', error);
        window.open(directUrl.replace('/preview', '/view'), '_blank');
    }
}

async function renderPage(pageNum) {
    const canvas = document.getElementById('pdfCanvas');
    const ctx = canvas.getContext('2d');

    const page = await currentPdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: ctx,
        viewport: viewport
    };

    await page.render(renderContext).promise;
}

function updatePagination() {
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${pageCount}`;
    document.getElementById('prevPage').disabled = currentPage <= 1;
    document.getElementById('nextPage').disabled = currentPage >= pageCount;
}

function loadCertificates() {
    const container = document.getElementById('achievementsContainer');

    if (!container) {
        console.log('Achievements container not found');
        return;
    }

    certificates.forEach(certificate => {
        const certificateCard = createCertificateCard(certificate);
        container.appendChild(certificateCard);
    });

    initializeCertificateEvents();
}

function initializeCertificateEvents() {
    document.querySelectorAll('.view-pdf-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const fileUrl = this.getAttribute('data-file');
            const title = this.getAttribute('data-title');
            loadPdf(fileUrl, title);
        });
    });

    document.querySelectorAll('.view-image-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const imageUrl = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');

            const modal = new bootstrap.Modal(document.getElementById('artModal'));
            const modalImage = document.getElementById('modalImage');
            const modalTitle = document.getElementById('artModalLabel');

            modalImage.src = imageUrl;
            modalTitle.textContent = title;
            modal.show();
        });
    });

    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', async () => {
            if (currentPage > 1) {
                currentPage--;
                await renderPage(currentPage);
                updatePagination();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', async () => {
            if (currentPage < pageCount) {
                currentPage++;
                await renderPage(currentPage);
                updatePagination();
            }
        });
    }
}

function addCertificate(title, issuer, date, fileUrl, skills, credentialUrl = "#") {
    const certificate = {
        title,
        issuer,
        date,
        type: "pdf",
        fileUrl,
        credentialUrl,
        skills
    };

    certificates.push(certificate);

    const container = document.getElementById('achievementsContainer');
    if (container) {
        const certificateCard = createCertificateCard(certificate);
        container.appendChild(certificateCard);
        initializeCertificateEvents();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting initialization');

    loadProjects();
    loadCertificates();
    loadArtworks();
});


console.log('Portfolio website loaded successfully!');
console.log('To add new projects, use: addProject(title, description, imageUrl, githubUrl, [tags])');
console.log('To add new artwork, use: addArtwork(title, imageUrl)');
console.log('To add new certificates, use: addCertificate(title, issuer, date, fileUrl, [skills], credentialUrl)');


