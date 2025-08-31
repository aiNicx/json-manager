// Main JSON Manager class and initialization
class JSONManager {
    constructor() {
        this.jsonData = null;
        this.currentPath = [];
        this.searchTerm = '';
        this.currentEdit = null;
        this.currentAddType = null;
        this.init();
    }

    init() {
        this.bindEvents();
        Stats.updateStats(null);
    }

    bindEvents() {
        // File upload
        document.getElementById('fileBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            Core.handleFileUpload(e.target.files[0]);
        });

        // Text paste
        document.getElementById('pasteBtn').addEventListener('click', () => {
            Core.handleTextUpload();
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            // Search is now handled by Search class
        });

        // View controls
        document.getElementById('expandAllBtn').addEventListener('click', () => {
            Core.expandAll();
        });

        document.getElementById('collapseAllBtn').addEventListener('click', () => {
            Core.collapseAll();
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => {
            Core.exportJSON();
        });

        // Reset
        document.getElementById('resetBtn').addEventListener('click', () => {
            Core.resetJSON();
        });

        // Modal
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            Modals.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            Modals.closeModal();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            Modals.saveEdit();
        });

        // Close modal on outside click
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                Modals.closeModal();
            }
        });

        // Add element functionality
        document.getElementById('addElementBtn').addEventListener('click', () => {
            Modals.showAddModal();
        });

        document.getElementById('closeAddModalBtn').addEventListener('click', () => {
            Modals.closeAddModal();
        });

        document.getElementById('cancelAddBtn').addEventListener('click', () => {
            Modals.closeAddModal();
        });

        document.getElementById('saveAddBtn').addEventListener('click', () => {
            Modals.saveAdd();
        });

        // Add modal outside click
        document.getElementById('addModal').addEventListener('click', (e) => {
            if (e.target.id === 'addModal') {
                Modals.closeAddModal();
            }
        });

        // Type selection
        document.querySelectorAll('.add-type-option').forEach(option => {
            option.addEventListener('click', (e) => {
                Modals.selectAddType(e.target.closest('.add-type-option').dataset.type);
            });
        });
    }

    navigateTo(key) {
        this.currentPath = Navigation.navigateTo(this.currentPath, key);
        // Get current search results for rendering
        const searchResults = Search.searchTerm ? Search.searchInData(this.jsonData, [], Search.searchTerm) : null;
        Rendering.renderCards(this.jsonData, this.currentPath, this.searchTerm, searchResults);

        // Update tree view selection
        if (document.getElementById('treeSidebar').style.display !== 'none') {
            TreeView.updateSelection();
        }
    }

    navigateBack(index) {
        this.currentPath = Navigation.navigateBack(this.currentPath, index);
        // Get current search results for rendering
        const searchResults = Search.searchTerm ? Search.searchInData(this.jsonData, [], Search.searchTerm) : null;
        Rendering.renderCards(this.jsonData, this.currentPath, this.searchTerm, searchResults);

        // Update tree view selection
        if (document.getElementById('treeSidebar').style.display !== 'none') {
            TreeView.updateSelection();
        }
    }

    editValue(key) {
        Core.editValue(key);
    }

    deleteValue(key) {
        Modals.deleteValue(key);
    }

    expandAll() {
        Core.expandAll();
    }

    collapseAll() {
        Core.collapseAll();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.jsonManager = new JSONManager();
});
