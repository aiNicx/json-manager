// Tree View functionality for JSON Manager
class TreeView {
    static init() {
        this.expandedNodes = new Set(['root']);
        this.selectedPath = [];
        this.bindEvents();
    }

    static bindEvents() {
        // Tree view toggle
        document.getElementById('treeViewToggle').addEventListener('click', () => {
            this.toggleTreeView();
        });

        // Tree minimize button
        document.getElementById('treeMinimizeBtn').addEventListener('click', () => {
            this.hideTreeView();
        });

        // Tree content click handler (delegated)
        document.getElementById('treeContent').addEventListener('click', (e) => {
            const nodeContent = e.target.closest('.tree-node-content');
            const toggleBtn = e.target.closest('.tree-node-toggle');

            if (toggleBtn) {
                e.stopPropagation();
                this.toggleNode(toggleBtn.dataset.path);
            } else if (nodeContent) {
                this.selectNode(nodeContent.dataset.path);
            }
        });
    }

    static toggleTreeView() {
        const sidebar = document.getElementById('treeSidebar');
        const isVisible = sidebar.style.display !== 'none';

        if (isVisible) {
            this.hideTreeView();
        } else {
            this.showTreeView();
        }
    }

    static showTreeView() {
        const sidebar = document.getElementById('treeSidebar');
        sidebar.style.display = 'flex';
        sidebar.classList.add('viewer-transition');

        if (window.jsonManager.jsonData) {
            this.renderTree(window.jsonManager.jsonData);
        }
    }

    static hideTreeView() {
        const sidebar = document.getElementById('treeSidebar');
        sidebar.style.display = 'none';
    }

    static renderTree(jsonData, searchResults = null) {
        const container = document.getElementById('treeContent');

        if (!jsonData) {
            container.innerHTML = '<div class="tree-loading"><i class="fas fa-spinner"></i> Caricamento...</div>';
            return;
        }

        container.innerHTML = '';
        const rootNode = this.createTreeNode('root', jsonData, [], searchResults);
        container.appendChild(rootNode);
    }

    static createTreeNode(key, value, path, searchResults = null) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'tree-node';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'tree-node-content';
        contentDiv.dataset.path = path.join('.');

        // Check if this node matches search
        const isSearchMatch = searchResults && searchResults.highlights &&
            searchResults.highlights.has(path.join('.'));

        if (isSearchMatch) {
            contentDiv.classList.add('search-match');
        }

        // Check if this is the currently selected path
        const currentPath = window.jsonManager.currentPath;
        const isSelected = currentPath.length === path.length &&
            currentPath.every((p, i) => p === path[i]);

        if (isSelected) {
            contentDiv.classList.add('active');
        }

        const type = Utils.getValueType(value);
        const iconName = Utils.getTypeIconName(type);
        const hasChildren = (type === 'object' || type === 'array') &&
            (type === 'object' ? Object.keys(value).length > 0 : value.length > 0);

        // Toggle button for expandable nodes
        if (hasChildren) {
            const toggleBtn = document.createElement('div');
            toggleBtn.className = 'tree-node-toggle';
            toggleBtn.dataset.path = path.join('.');
            toggleBtn.innerHTML = this.expandedNodes.has(path.join('.')) ?
                '<i class="fas fa-chevron-down"></i>' : '<i class="fas fa-chevron-right"></i>';
            contentDiv.appendChild(toggleBtn);
        } else {
            // Spacer for alignment
            const spacer = document.createElement('div');
            spacer.className = 'tree-node-toggle';
            spacer.innerHTML = ' ';
            contentDiv.appendChild(spacer);
        }

        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'tree-node-icon';
        iconDiv.innerHTML = `<i class="fas ${iconName}"></i>`;
        contentDiv.appendChild(iconDiv);

        // Key/Value text
        const textSpan = document.createElement('span');
        if (key === 'root') {
            textSpan.textContent = 'JSON Root';
        } else {
            textSpan.textContent = key;
        }

        // Add type indicator and count for objects/arrays
        if (type === 'object') {
            const count = Object.keys(value).length;
            textSpan.textContent += ` (${count})`;
        } else if (type === 'array') {
            const count = value.length;
            textSpan.textContent += ` [${count}]`;
        } else if (type !== 'object' && type !== 'array') {
            // Show preview for primitive values
            const preview = Utils.formatValue(value, true);
            if (preview.length > 20) {
                textSpan.textContent += `: ${preview.substring(0, 20)}...`;
            } else {
                textSpan.textContent += `: ${preview}`;
            }
        }

        contentDiv.appendChild(textSpan);
        nodeDiv.appendChild(contentDiv);

        // Children container
        if (hasChildren && this.expandedNodes.has(path.join('.'))) {
            const childrenDiv = document.createElement('div');
            childrenDiv.className = 'tree-node-children';

            if (type === 'object') {
                Object.keys(value).forEach(childKey => {
                    const childPath = [...path, childKey];
                    const childNode = this.createTreeNode(childKey, value[childKey], childPath, searchResults);
                    childrenDiv.appendChild(childNode);
                });
            } else if (type === 'array') {
                value.forEach((item, index) => {
                    const childPath = [...path, index.toString()];
                    const childNode = this.createTreeNode(`[${index}]`, item, childPath, searchResults);
                    childrenDiv.appendChild(childNode);
                });
            }

            nodeDiv.appendChild(childrenDiv);
        }

        return nodeDiv;
    }

    static toggleNode(pathStr) {
        const path = pathStr === 'root' ? [] : pathStr.split('.');

        if (this.expandedNodes.has(pathStr)) {
            this.expandedNodes.delete(pathStr);
        } else {
            this.expandedNodes.add(pathStr);
        }

        // Re-render tree to reflect changes
        if (window.jsonManager.jsonData) {
            this.renderTree(window.jsonManager.jsonData);
        }
    }

    static selectNode(pathStr) {
        const path = pathStr === 'root' ? [] : pathStr.split('.');

        // Update current path in main manager
        window.jsonManager.currentPath = path;
        window.jsonManager.searchTerm = '';

        // Update UI
        document.getElementById('searchInput').value = '';

        // Re-render cards
        Rendering.renderCards(window.jsonManager.jsonData, path, '');

        // Update breadcrumb
        Navigation.updateBreadcrumb(path);

        // Re-render tree to show selection
        if (window.jsonManager.jsonData) {
            this.renderTree(window.jsonManager.jsonData);
        }
    }

    static expandAll() {
        this.expandedNodes.clear();
        this.expandAllRecursive(window.jsonManager.jsonData, []);
        this.renderTree(window.jsonManager.jsonData);
    }

    static collapseAll() {
        this.expandedNodes.clear();
        this.expandedNodes.add('root');
        this.renderTree(window.jsonManager.jsonData);
    }

    static expandAllRecursive(data, path) {
        if (!data || typeof data !== 'object') return;

        const pathStr = path.join('.') || 'root';
        this.expandedNodes.add(pathStr);

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                this.expandAllRecursive(item, [...path, index.toString()]);
            });
        } else {
            Object.keys(data).forEach(key => {
                this.expandAllRecursive(data[key], [...path, key]);
            });
        }
    }

    static updateSelection() {
        // Re-render tree to update selection highlighting
        if (window.jsonManager.jsonData && document.getElementById('treeSidebar').style.display !== 'none') {
            this.renderTree(window.jsonManager.jsonData);
        }
    }

    static scrollToNode(path) {
        const pathStr = path.join('.');
        const nodeElement = document.querySelector(`[data-path="${pathStr}"]`);

        if (nodeElement) {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    static getNodeStats() {
        const stats = {
            totalNodes: 0,
            expandedNodes: this.expandedNodes.size,
            maxDepth: 0
        };

        this.calculateStatsRecursive(window.jsonManager.jsonData, [], stats, 0);
        return stats;
    }

    static calculateStatsRecursive(data, path, stats, depth) {
        stats.totalNodes++;
        stats.maxDepth = Math.max(stats.maxDepth, depth);

        if (!data || typeof data !== 'object') return;

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                this.calculateStatsRecursive(item, [...path, index.toString()], stats, depth + 1);
            });
        } else {
            Object.keys(data).forEach(key => {
                this.calculateStatsRecursive(data[key], [...path, key], stats, depth + 1);
            });
        }
    }
}

// Initialize tree view when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TreeView.init();
});
