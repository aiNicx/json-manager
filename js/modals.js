// Modal management for JSON Manager
class Modals {
    static showEditModal(key, value, type) {
        const modal = document.getElementById('editModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = `Modifica "${key}"`;

        let formHtml = '';

        if (type === 'string') {
            formHtml = `
                <div class="form-group">
                    <label for="editValue">Valore stringa:</label>
                    <textarea id="editValue" rows="4">${value}</textarea>
                </div>
            `;
        } else if (type === 'number') {
            formHtml = `
                <div class="form-group">
                    <label for="editValue">Valore numerico:</label>
                    <input type="number" id="editValue" value="${value}">
                </div>
            `;
        } else if (type === 'boolean') {
            formHtml = `
                <div class="form-group">
                    <label for="editValue">Valore booleano:</label>
                    <select id="editValue">
                        <option value="true" ${value ? 'selected' : ''}>true</option>
                        <option value="false" ${!value ? 'selected' : ''}>false</option>
                    </select>
                </div>
            `;
        } else if (type === 'object' || type === 'array') {
            formHtml = `
                <div class="form-group">
                    <label for="editValue">JSON (${type}):</label>
                    <textarea id="editValue" rows="8">${JSON.stringify(value, null, 2)}</textarea>
                </div>
            `;
        } else {
            formHtml = `
                <div class="form-group">
                    <label for="editValue">Valore:</label>
                    <input type="text" id="editValue" value="${value || ''}">
                </div>
            `;
        }

        modalBody.innerHTML = formHtml;
        modal.classList.add('show');

        // Store current edit info
        window.jsonManager.currentEdit = { key, type };
    }

    static saveEdit() {
        const valueInput = document.getElementById('editValue');
        let newValue;

        try {
            const currentEdit = window.jsonManager.currentEdit;
            if (currentEdit.type === 'string') {
                newValue = valueInput.value;
            } else if (currentEdit.type === 'number') {
                newValue = parseFloat(valueInput.value);
                if (isNaN(newValue)) throw new Error('Valore numerico non valido');
            } else if (currentEdit.type === 'boolean') {
                newValue = valueInput.value === 'true';
            } else if (currentEdit.type === 'object' || currentEdit.type === 'array') {
                newValue = JSON.parse(valueInput.value);
            } else {
                newValue = valueInput.value || null;
            }

            // Update data
            const currentData = Navigation.getCurrentData(window.jsonManager.jsonData, window.jsonManager.currentPath);
            currentData[currentEdit.key] = newValue;

            this.closeModal();

            // Get current search results for rendering
            const searchResults = Search.searchTerm ? Search.searchInData(window.jsonManager.jsonData, [], Search.searchTerm) : null;
            Rendering.renderCards(window.jsonManager.jsonData, window.jsonManager.currentPath, window.jsonManager.searchTerm, searchResults);

            // Update tree view if visible
            if (document.getElementById('treeSidebar').style.display !== 'none') {
                TreeView.renderTree(window.jsonManager.jsonData, searchResults);
            }

            Stats.updateStats(window.jsonManager.jsonData);
            Notifications.showSuccess('Valore modificato con successo!');

        } catch (error) {
            Notifications.showError('Errore nel salvataggio: ' + error.message);
        }
    }

    static closeModal() {
        document.getElementById('editModal').classList.remove('show');
        window.jsonManager.currentEdit = null;
    }

    static showAddModal() {
        // Reset form
        document.getElementById('newKey').value = '';
        document.getElementById('valueGroup').innerHTML = '';
        document.getElementById('addForm').classList.remove('show');

        // Reset type selection
        document.querySelectorAll('.add-type-option').forEach(option => {
            option.classList.remove('selected');
        });

        document.getElementById('addModal').classList.add('show');
        window.jsonManager.currentAddType = null;
    }

    static selectAddType(type) {
        // Update UI
        document.querySelectorAll('.add-type-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');

        // Generate value input
        const valueGroup = document.getElementById('valueGroup');
        let inputHtml = '';

        if (type === 'string') {
            inputHtml = `
                <label for="newValue">Valore stringa:</label>
                <textarea id="newValue" rows="4" placeholder="Inserisci il testo..."></textarea>
            `;
        } else if (type === 'number') {
            inputHtml = `
                <label for="newValue">Valore numerico:</label>
                <input type="number" id="newValue" placeholder="0">
            `;
        } else if (type === 'boolean') {
            inputHtml = `
                <label for="newValue">Valore booleano:</label>
                <select id="newValue">
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
            `;
        } else if (type === 'object') {
            inputHtml = `
                <label for="newValue">Oggetto JSON:</label>
                <textarea id="newValue" rows="6" placeholder='{}'>${JSON.stringify({}, null, 2)}</textarea>
            `;
        } else if (type === 'array') {
            inputHtml = `
                <label for="newValue">Array JSON:</label>
                <textarea id="newValue" rows="6" placeholder='[]'>${JSON.stringify([], null, 2)}</textarea>
            `;
        } else if (type === 'null') {
            inputHtml = `
                <label for="newValue">Valore null:</label>
                <input type="text" id="newValue" value="null" readonly>
            `;
        }

        valueGroup.innerHTML = inputHtml;
        document.getElementById('addForm').classList.add('show');
        window.jsonManager.currentAddType = type;
    }

    static saveAdd() {
        const keyInput = document.getElementById('newKey');
        const valueInput = document.getElementById('newValue');

        const key = keyInput.value.trim();
        if (!key) {
            Notifications.showError('Inserisci un nome per la chiave');
            return;
        }

        if (!window.jsonManager.currentAddType) {
            Notifications.showError('Seleziona un tipo di dato');
            return;
        }

        // Check if key already exists
        const currentData = Navigation.getCurrentData(window.jsonManager.jsonData, window.jsonManager.currentPath);
        if (currentData.hasOwnProperty(key)) {
            Notifications.showError('Questa chiave esiste già');
            return;
        }

        let newValue;

        try {
            const currentAddType = window.jsonManager.currentAddType;
            if (currentAddType === 'string') {
                newValue = valueInput.value;
            } else if (currentAddType === 'number') {
                newValue = parseFloat(valueInput.value);
                if (isNaN(newValue)) throw new Error('Valore numerico non valido');
            } else if (currentAddType === 'boolean') {
                newValue = valueInput.value === 'true';
            } else if (currentAddType === 'object' || currentAddType === 'array') {
                newValue = JSON.parse(valueInput.value);
            } else if (currentAddType === 'null') {
                newValue = null;
            }

            // Add to data
            currentData[key] = newValue;

            this.closeAddModal();

            // Get current search results for rendering
            const searchResults = Search.searchTerm ? Search.searchInData(window.jsonManager.jsonData, [], Search.searchTerm) : null;
            Rendering.renderCards(window.jsonManager.jsonData, window.jsonManager.currentPath, window.jsonManager.searchTerm, searchResults);

            // Update tree view if visible
            if (document.getElementById('treeSidebar').style.display !== 'none') {
                TreeView.renderTree(window.jsonManager.jsonData, searchResults);
            }

            Stats.updateStats(window.jsonManager.jsonData);
            Notifications.showSuccess('Elemento aggiunto con successo!');

        } catch (error) {
            Notifications.showError('Errore nell\'aggiunta: ' + error.message);
        }
    }

    static closeAddModal() {
        document.getElementById('addModal').classList.remove('show');
        window.jsonManager.currentAddType = null;
    }

    static deleteValue(key) {
        if (!confirm(`Sei sicuro di voler eliminare "${key}"?`)) return;

        const currentData = Navigation.getCurrentData(window.jsonManager.jsonData, window.jsonManager.currentPath);
        delete currentData[key];

        // Get current search results for rendering
        const searchResults = Search.searchTerm ? Search.searchInData(window.jsonManager.jsonData, [], Search.searchTerm) : null;
        Rendering.renderCards(window.jsonManager.jsonData, window.jsonManager.currentPath, window.jsonManager.searchTerm, searchResults);

        // Update tree view if visible
        if (document.getElementById('treeSidebar').style.display !== 'none') {
            TreeView.renderTree(window.jsonManager.jsonData, searchResults);
        }

        Stats.updateStats(window.jsonManager.jsonData);
        Notifications.showSuccess('Elemento eliminato con successo!');
    }
}
