// Card rendering and preview generation for JSON Manager
class Rendering {
    static renderCards(jsonData, currentPath, searchTerm) {
        const container = document.getElementById('cardsContainer');
        const currentData = Navigation.getCurrentData(jsonData, currentPath);

        if (!currentData || typeof currentData !== 'object') {
            container.innerHTML = '<div class="card"><div class="card-title">Valore semplice</div><div class="card-preview">' + Utils.formatValue(currentData) + '</div></div>';
            return;
        }

        const keys = Object.keys(currentData);
        const filteredKeys = searchTerm ?
            keys.filter(key => key.toLowerCase().includes(searchTerm)) :
            keys;

        container.innerHTML = '';

        filteredKeys.forEach(key => {
            const value = currentData[key];
            const card = this.createCard(key, value);
            container.appendChild(card);
        });

        Navigation.updateBreadcrumb(currentPath);
    }

    static createCard(key, value) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.key = key;

        const type = Utils.getValueType(value);
        const iconClass = Utils.getTypeIcon(type);
        const preview = this.generatePreview(value);

        // Generate count badge for objects and arrays
        let countBadge = '';
        if (type === 'object') {
            const count = Object.keys(value).length;
            countBadge = `<span class="card-badge">${count} prop</span>`;
        } else if (type === 'array') {
            const count = value.length;
            countBadge = `<span class="card-badge">${count} elem</span>`;
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title-section">
                    <h3 class="card-title">${key}</h3>
                    ${countBadge}
                </div>
                <div class="card-icon ${iconClass}">
                    <i class="fas ${Utils.getTypeIconName(type)}"></i>
                </div>
            </div>
            <div class="card-preview">
                ${preview}
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-secondary edit-btn" data-key="${key}">
                    <i class="fas fa-edit"></i> Modifica
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-key="${key}">
                    <i class="fas fa-trash"></i> Elimina
                </button>
            </div>
        `;

        // Bind events
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-actions')) {
                // This will be handled by the main class
                window.jsonManager.navigateTo(key);
            }
        });

        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            // This will be handled by the main class
            window.jsonManager.editValue(key);
        });

        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            // This will be handled by the main class
            window.jsonManager.deleteValue(key);
        });

        return card;
    }

    static generatePreview(value) {
        const type = Utils.getValueType(value);

        if (type === 'object') {
            const keys = Object.keys(value);
            const previewKeys = keys.slice(0, 3);
            let preview = '';

            previewKeys.forEach(key => {
                const val = value[key];
                const valType = Utils.getValueType(val);
                preview += `<div class="preview-item">${key}: ${Utils.formatValue(val, true)}</div>`;
            });

            if (keys.length > 3) {
                preview += `<div class="preview-item">... e altri ${keys.length - 3} elementi</div>`;
            }

            return preview;
        } else if (type === 'array') {
            const previewItems = value.slice(0, 3);
            let preview = '';

            previewItems.forEach((item, index) => {
                const itemType = Utils.getValueType(item);
                preview += `<div class="preview-item">[${index}]: ${Utils.formatValue(item, true)}</div>`;
            });

            if (value.length > 3) {
                preview += `<div class="preview-item">... e altri ${value.length - 3} elementi</div>`;
            }

            return preview;
        } else {
            return `<div class="preview-item">${Utils.formatValue(value)}</div>`;
        }
    }
}
