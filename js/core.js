// Core functionality for JSON Manager
class Core {
    static handleFileUpload(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                this.loadJSON(json);
            } catch (error) {
                Notifications.showError('File JSON non valido: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    static handleTextUpload() {
        const text = document.getElementById('jsonTextarea').value.trim();
        if (!text) {
            Notifications.showError('Inserisci del testo JSON valido');
            return;
        }

        try {
            const json = JSON.parse(text);
            this.loadJSON(json);
        } catch (error) {
            Notifications.showError('Testo JSON non valido: ' + error.message);
        }
    }

    static loadJSON(json) {
        window.jsonManager.jsonData = json;
        window.jsonManager.currentPath = [];
        window.jsonManager.searchTerm = '';
        document.getElementById('searchInput').value = '';

        // Switch to viewer
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('viewerSection').style.display = 'block';
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
        document.getElementById('addElementBtn').style.display = 'block';

        Rendering.renderCards(json, [], '');
        Stats.updateStats(json);
        Notifications.showSuccess('JSON caricato con successo!');
    }

    static exportJSON() {
        const dataStr = JSON.stringify(window.jsonManager.jsonData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'config.json';
        link.click();

        Notifications.showSuccess('File esportato con successo!');
    }

    static resetJSON() {
        // Show confirmation dialog
        const confirmed = confirm('Sei sicuro di voler resettare il JSON? Tutti i dati verranno persi.');

        if (!confirmed) return;

        // Reset all data and UI state
        window.jsonManager.jsonData = null;
        window.jsonManager.currentPath = [];
        window.jsonManager.searchTerm = '';

        // Reset form inputs
        document.getElementById('jsonTextarea').value = '';
        document.getElementById('searchInput').value = '';

        // Switch back to loading section
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('viewerSection').style.display = 'none';

        // Update UI elements
        document.getElementById('exportBtn').disabled = true;
        document.getElementById('resetBtn').disabled = true;
        document.getElementById('addElementBtn').style.display = 'none';

        // Reset breadcrumb
        document.getElementById('breadcrumb').innerHTML = '<span class="breadcrumb-item active">Home</span>';

        // Update stats
        Stats.updateStats(null);

        Notifications.showSuccess('JSON resettato con successo!');
    }

    static expandAll() {
        // This would expand all nested objects/arrays - simplified for now
        Notifications.showSuccess('Funzionalità espandi tutto in sviluppo');
    }

    static collapseAll() {
        window.jsonManager.currentPath = [];
        Rendering.renderCards(window.jsonManager.jsonData, [], window.jsonManager.searchTerm);
    }

    static editValue(key) {
        const currentData = Navigation.getCurrentData(window.jsonManager.jsonData, window.jsonManager.currentPath);
        const value = currentData[key];
        const type = Utils.getValueType(value);

        Modals.showEditModal(key, value, type);
    }
}
