// Card rendering and preview generation for JSON Manager
class Rendering {
    static renderCards(jsonData, currentPath, searchTerm, searchResults = null) {
        const container = document.getElementById('cardsContainer');
        const currentData = Navigation.getCurrentData(jsonData, currentPath);

        if (!currentData || typeof currentData !== 'object') {
            container.innerHTML = '<div class="card"><div class="card-title">Valore semplice</div><div class="card-preview">' + Utils.formatValue(currentData) + '</div></div>';
            return;
        }

        const keys = Object.keys(currentData);
        let filteredKeys = keys;

        // Apply search filtering
        if (searchTerm && searchResults) {
            filteredKeys = keys.filter(key => {
                const path = [...currentPath, key].join('.');
                return searchResults.highlights && searchResults.highlights.has(path);
            });
        } else if (searchTerm) {
            // Fallback to simple search
            filteredKeys = keys.filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        container.innerHTML = '';

        filteredKeys.forEach(key => {
            const value = currentData[key];
            const card = this.createCard(key, value, currentPath, searchResults);
            container.appendChild(card);
        });

        Navigation.updateBreadcrumb(currentPath);
    }

    static createCard(key, value, currentPath = [], searchResults = null) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.key = key;

        const type = Utils.getValueType(value);
        const iconClass = Utils.getTypeIcon(type);
        const preview = this.generatePreview(value, currentPath, key, searchResults);

        // Check if this card matches search
        const path = [...currentPath, key].join('.');
        const isSearchMatch = searchResults && searchResults.highlights &&
            searchResults.highlights.has(path);

        if (isSearchMatch) {
            card.classList.add('search-match');
        }

        // Generate count badge for objects and arrays
        let countBadge = '';
        if (type === 'object') {
            const count = Object.keys(value).length;
            countBadge = `<span class="card-badge">${count} prop</span>`;
        } else if (type === 'array') {
            const count = value.length;
            countBadge = `<span class="card-badge">${count} elem</span>`;
        }

        // Highlight key if it matches search
        let highlightedKey = key;
        if (isSearchMatch && searchResults.highlights.get(path)) {
            const highlight = searchResults.highlights.get(path);
            if (highlight.key) {
                highlightedKey = Search.highlightText(key, Search.searchTerm, Search.useRegex ? new RegExp(Search.searchTerm, 'gi') : null);
            }
        }

        card.innerHTML = `
            <div class="card-header">
                <div class="card-title-section">
                    <h3 class="card-title">${highlightedKey}</h3>
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

    static generatePreview(value, currentPath = [], key = '', searchResults = null) {
        const type = Utils.getValueType(value);
        const path = [...currentPath, key].join('.');

        if (type === 'object') {
            const keys = Object.keys(value);
            const previewKeys = keys.slice(0, 3);
            let preview = '';

            previewKeys.forEach(previewKey => {
                const val = value[previewKey];
                const valType = Utils.getValueType(val);
                let formattedValue = Utils.formatValue(val, true);

                // Highlight value if it matches search
                if (searchResults && searchResults.highlights) {
                    const valuePath = [...currentPath, key, previewKey].join('.');
                    const highlight = searchResults.highlights.get(valuePath);
                    if (highlight && highlight.value) {
                        formattedValue = Search.highlightText(
                            String(val),
                            Search.searchTerm,
                            Search.useRegex ? new RegExp(Search.searchTerm, 'gi') : null
                        );
                    }
                }

                preview += `<div class="preview-item">${previewKey}: ${formattedValue}</div>`;
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
                let formattedValue = Utils.formatValue(item, true);

                // Highlight array item if it matches search
                if (searchResults && searchResults.highlights) {
                    const itemPath = [...currentPath, key, index.toString()].join('.');
                    const highlight = searchResults.highlights.get(itemPath);
                    if (highlight && highlight.value) {
                        formattedValue = Search.highlightText(
                            String(item),
                            Search.searchTerm,
                            Search.useRegex ? new RegExp(Search.searchTerm, 'gi') : null
                        );
                    }
                }

                preview += `<div class="preview-item">[${index}]: ${formattedValue}</div>`;
            });

            if (value.length > 3) {
                preview += `<div class="preview-item">... e altri ${value.length - 3} elementi</div>`;
            }

            return preview;
        } else {
            let formattedValue = Utils.formatValue(value);

            // Highlight primitive value if it matches search
            if (searchResults && searchResults.highlights) {
                const highlight = searchResults.highlights.get(path);
                if (highlight && highlight.value) {
                    formattedValue = Search.highlightText(
                        String(value),
                        Search.searchTerm,
                        Search.useRegex ? new RegExp(Search.searchTerm, 'gi') : null
                    );
                }
            }

            return `<div class="preview-item">${formattedValue}</div>`;
        }
    }
}
