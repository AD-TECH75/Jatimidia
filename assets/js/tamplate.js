// js/template.js
async function loadTemplate(templateFile, elementId) {
    try {
        const response = await fetch(templateFile);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error('Error loading template:', error);
    }
}

function loadAllTemplates() {
    loadTemplate('template/header.html', 'header-container');
    loadTemplate('template/footer.html', 'footer-container');
}

document.addEventListener('DOMContentLoaded', loadAllTemplates);