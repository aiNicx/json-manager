// Advanced Search functionality for JSON Manager
class Search {
    static init() {
        this.searchTerm = '';
        this.searchType = 'all';
        this.dataTypeFilter = 'all';
        this.useRegex = false;
        this.bindEvents();
    }

    static bindEvents() {
        const searchInput = document.getElementById('searchInput');
        const searchTypeSelect = document.getElementById('searchType');
        const dataTypeFilterSelect = document.getElementById('dataTypeFilter');
        const regexCheckbox = document.getElementById('regexSearch');

        // Show/hide advanced search options
        searchInput.addEventListener('focus', () => {
            document.getElementById('searchOptions').style.display = 'flex';
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (!document.activeElement.closest('.search-options')) {
                    document.getElementById('searchOptions').style.display = 'none';
                }
            }, 100);
        });

        // Search input handler
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.performSearch();
        });

        // Search type handler
        searchTypeSelect.addEventListener('change', (e) => {
            this.searchType = e.target.value;
            this.performSearch();
        });

        // Data type filter handler
        dataTypeFilterSelect.addEventListener('change', (e) => {
            this.dataTypeFilter = e.target.value;
            this.performSearch();
        });

        // Regex checkbox handler
        regexCheckbox.addEventListener('change', (e) => {
            this.useRegex = e.target.checked;
            this.performSearch();
        });
    }

    static performSearch() {
        if (!window.jsonManager.jsonData) return;

        const results = this.searchInData(window.jsonManager.jsonData, [], this.searchTerm);

        // Update rendering with search results
        Rendering.renderCards(window.jsonManager.jsonData, window.jsonManager.currentPath, this.searchTerm, results);

        // Update tree view if visible
        if (document.getElementById('treeSidebar').style.display !== 'none') {
            TreeView.renderTree(window.jsonManager.jsonData, results);
        }
    }

    static searchInData(data, path, searchTerm, results = []) {
        if (!searchTerm || searchTerm.trim() === '') {
            return results;
        }

        const searchResults = {
            matches: [],
            highlights: new Map()
        };

        try {
            const regex = this.useRegex ? new RegExp(searchTerm, 'gi') : null;

            this.traverseData(data, path, searchTerm, regex, searchResults);
            return searchResults;

        } catch (error) {
            console.warn('Search error:', error);
            Notifications.showError('Errore nella ricerca: ' + error.message);
            return { matches: [], highlights: new Map() };
        }
    }

    static traverseData(data, path, searchTerm, regex, results) {
        if (!data || typeof data !== 'object') return;

        const keys = Object.keys(data);

        for (const key of keys) {
            const value = data[key];
            const currentPath = [...path, key];
            const keyPath = currentPath.join('.');

            // Check if this matches our data type filter
            if (this.dataTypeFilter !== 'all') {
                const valueType = Utils.getValueType(value);
                if (valueType !== this.dataTypeFilter) {
                    // Still traverse children for nested matches
                    if (typeof value === 'object' && value !== null) {
                        this.traverseData(value, currentPath, searchTerm, regex, results);
                    }
                    continue;
                }
            }

            let keyMatch = false;
            let valueMatch = false;

            // Search in keys
            if (this.searchType === 'all' || this.searchType === 'keys') {
                if (this.matchesSearch(key, searchTerm, regex)) {
                    keyMatch = true;
                    results.matches.push({
                        path: currentPath,
                        type: 'key',
                        key: key,
                        value: value,
                        matchText: key
                    });
                }
            }

            // Search in values
            if (this.searchType === 'all' || this.searchType === 'values') {
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    const stringValue = String(value);
                    if (this.matchesSearch(stringValue, searchTerm, regex)) {
                        valueMatch = true;
                        results.matches.push({
                            path: currentPath,
                            type: 'value',
                            key: key,
                            value: value,
                            matchText: stringValue
                        });
                    }
                }
            }

            // Store highlights for rendering
            if (keyMatch || valueMatch) {
                results.highlights.set(keyPath, {
                    key: keyMatch,
                    value: valueMatch,
                    matchText: keyMatch ? key : String(value)
                });
            }

            // Recursively search in nested objects/arrays
            if (typeof value === 'object' && value !== null) {
                this.traverseData(value, currentPath, searchTerm, regex, results);
            }
        }
    }

    static matchesSearch(text, searchTerm, regex) {
        if (!text) return false;

        const searchText = String(text).toLowerCase();
        const term = searchTerm.toLowerCase();

        if (regex) {
            return regex.test(searchText);
        } else {
            return searchText.includes(term);
        }
    }

    static highlightText(text, searchTerm, regex) {
        if (!text || !searchTerm) return text;

        const stringText = String(text);

        if (regex) {
            return stringText.replace(regex, (match) => `<span class="search-highlight">${match}</span>`);
        } else {
            const lowerText = stringText.toLowerCase();
            const lowerTerm = searchTerm.toLowerCase();
            const index = lowerText.indexOf(lowerTerm);

            if (index === -1) return stringText;

            const before = stringText.substring(0, index);
            const match = stringText.substring(index, index + searchTerm.length);
            const after = stringText.substring(index + searchTerm.length);

            return `${before}<span class="search-highlight">${match}</span>${after}`;
        }
    }

    static getSearchSummary(results) {
        if (!results || !results.matches) return '';

        const count = results.matches.length;
        if (count === 0) return 'Nessun risultato trovato';

        const types = results.matches.reduce((acc, match) => {
            acc[match.type] = (acc[match.type] || 0) + 1;
            return acc;
        }, {});

        const summary = [];
        if (types.key) summary.push(`${types.key} chiavi`);
        if (types.value) summary.push(`${types.value} valori`);

        return `${count} risultati (${summary.join(', ')})`;
    }

    static clearSearch() {
        this.searchTerm = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('searchOptions').style.display = 'none';
        this.performSearch();
    }

    static saveSearch() {
        if (!this.searchTerm) return;

        const savedSearches = this.getSavedSearches();
        const searchConfig = {
            term: this.searchTerm,
            type: this.searchType,
            dataType: this.dataTypeFilter,
            regex: this.useRegex,
            timestamp: new Date().toISOString()
        };

        savedSearches.unshift(searchConfig);

        // Keep only last 10 searches
        if (savedSearches.length > 10) {
            savedSearches.splice(10);
        }

        localStorage.setItem('jsonManager_savedSearches', JSON.stringify(savedSearches));
        Notifications.showSuccess('Ricerca salvata');
    }

    static getSavedSearches() {
        try {
            const saved = localStorage.getItem('jsonManager_savedSearches');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Error loading saved searches:', error);
            return [];
        }
    }

    static loadSearch(searchConfig) {
        this.searchTerm = searchConfig.term;
        this.searchType = searchConfig.type;
        this.dataTypeFilter = searchConfig.dataType;
        this.useRegex = searchConfig.regex;

        document.getElementById('searchInput').value = this.searchTerm;
        document.getElementById('searchType').value = this.searchType;
        document.getElementById('dataTypeFilter').value = this.dataTypeFilter;
        document.getElementById('regexSearch').checked = this.useRegex;

        this.performSearch();
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Search.init();
});
