// Navigation and breadcrumb management for JSON Manager
class Navigation {
    static navigateTo(currentPath, key) {
        currentPath.push(key);
        return currentPath;
    }

    static navigateBack(currentPath, index) {
        return currentPath.slice(0, index);
    }

    static updateBreadcrumb(currentPath) {
        const breadcrumb = document.getElementById('breadcrumb');
        breadcrumb.innerHTML = '';

        // Home
        const homeItem = document.createElement('span');
        homeItem.className = 'breadcrumb-item';
        homeItem.textContent = 'Home';
        homeItem.addEventListener('click', () => this.navigateToHome());
        breadcrumb.appendChild(homeItem);

        // Path items
        currentPath.forEach((key, index) => {
            const item = document.createElement('span');
            item.className = 'breadcrumb-item';
            item.textContent = key;
            item.addEventListener('click', () => this.navigateToIndex(index + 1));
            breadcrumb.appendChild(item);
        });

        // Mark last item as active
        const items = breadcrumb.querySelectorAll('.breadcrumb-item');
        if (items.length > 0) {
            items[items.length - 1].classList.add('active');
        }
    }

    static navigateToHome() {
        // This will be handled by the main class
        window.jsonManager.collapseAll();
    }

    static navigateToIndex(index) {
        // This will be handled by the main class
        window.jsonManager.navigateBack(index);
    }

    static getCurrentData(jsonData, currentPath) {
        let data = jsonData;
        for (const key of currentPath) {
            data = data[key];
        }
        return data;
    }
}
