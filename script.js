// FSLogix Redirections.xml Generator
// Copyright (c) 2026 All Rights Reserved
// See LICENSE file for usage terms
//
// No external dependencies

(function() {
    'use strict';

    // State
    let redirections = [];

    // DOM Elements
    const addForm = document.getElementById('addForm');
    const addFormPanel = document.getElementById('addFormPanel');
    const folderPathInput = document.getElementById('folderPath');
    const redirectTypeSelect = document.getElementById('redirectType');
    const copyFlagsSelect = document.getElementById('copyFlags');
    const redirectionsList = document.getElementById('redirectionsList');
    const xmlOutput = document.getElementById('xmlOutput');
    const xmlInput = document.getElementById('xmlInput');
    const xmlGutter = document.getElementById('xmlGutter');
    const activityLog = document.getElementById('activityLog');
    const clearLogBtn = document.getElementById('clearLogBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const parseBtn = document.getElementById('parseBtn');
    const syntaxCheckBtn = document.getElementById('syntaxCheckBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let quickAddButtons = [];
    const addNewBtn = document.getElementById('addNewBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const bulkInsertBtn = document.getElementById('bulkInsertBtn');
    const bulkInsertPanel = document.getElementById('bulkInsertPanel');
    const bulkInput = document.getElementById('bulkInput');
    const bulkAddBtn = document.getElementById('bulkAddBtn');
    const cancelBulkBtn = document.getElementById('cancelBulkBtn');
    const helpToggleBtn = document.getElementById('helpToggleBtn');
    const helpDetails = document.getElementById('helpDetails');
    const viewRegularBtn = document.getElementById('viewRegularBtn');
    const viewCompactBtn = document.getElementById('viewCompactBtn');
    const sortSelect = document.getElementById('sortSelect');
    const sortOrderBtn = document.getElementById('sortOrderBtn');
    const toggleQuickAddPaths = document.getElementById('toggleQuickAddPaths');
    const quickAddContainer = document.getElementById('quickAddContainer');
    const quickAddFilter = document.getElementById('quickAddFilter');
    const redirectionsFilter = document.getElementById('redirectionsFilter');
    const importPanel = document.getElementById('importPanel');
    const importToggle = document.getElementById('importToggle');
    const addAllQuickBtn = document.getElementById('addAllQuickBtn');
    const removeAllQuickBtn = document.getElementById('removeAllQuickBtn');

    // State for inline editing
    let insertAfterId = null;
    let editingCommentId = null;
    let sortAscending = true;
    let lastSortBy = '';

    // Initialize
    function init() {
        loadFromStorage();
        // Apply theme early (default: dark)
        const storedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(storedTheme);

        generateQuickAddButtons();
        bindEvents();
        render();
        updateXmlInputLineNumbers();
    }

    // Generate quick add buttons from community.js data
    function generateQuickAddButtons() {
        if (!quickAddContainer || typeof COMMUNITY_REDIRECTIONS === 'undefined') return;
        
        quickAddContainer.innerHTML = '';
        
        COMMUNITY_REDIRECTIONS.forEach(item => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-small';
            
            // Handle mixed, include, or exclude types
            if (item.type === 'mixed') {
                btn.classList.add('mixed-btn');
                btn.dataset.excludePaths = JSON.stringify(item.excludePaths || []);
                btn.dataset.includePaths = JSON.stringify(item.includePaths || []);
                const allPaths = [...(item.excludePaths || []), ...(item.includePaths || [])];
                btn.title = 'Excludes:\n' + (item.excludePaths || []).join('\n') + '\n\nIncludes:\n' + (item.includePaths || []).join('\n');
            } else {
                if (item.type === '2') btn.classList.add('include-btn');
                btn.dataset.paths = JSON.stringify(item.paths);
                btn.title = item.paths.join('\n');
            }
            
            btn.dataset.comment = item.comment || '';
            btn.dataset.type = item.type || '1';
            btn.dataset.copyFlags = item.copyFlags || '0';
            btn.dataset.label = item.label || '';
            
            let typeIndicator = '';
            if (item.type === '2') typeIndicator = '<span class="type-indicator include">+</span>';
            else if (item.type === 'mixed') typeIndicator = '<span class="type-indicator mixed">±</span>';
            
            btn.innerHTML = `${typeIndicator}<span class="qa-label">${item.label}</span><span class="qa-path">${item.shortPath}</span>`;
            quickAddContainer.appendChild(btn);
        });
        
        // Update quickAddButtons reference
        quickAddButtons = quickAddContainer.querySelectorAll('button');
    }

    // Event Bindings
    function bindEvents() {
        if (addForm) addForm.addEventListener('submit', handleAddRedirection);
        if (copyBtn) copyBtn.addEventListener('click', handleCopy);
        if (downloadBtn) downloadBtn.addEventListener('click', handleDownload);
        if (clearBtn) clearBtn.addEventListener('click', handleClear);
        if (parseBtn) parseBtn.addEventListener('click', handleParse);
        if (syntaxCheckBtn) syntaxCheckBtn.addEventListener('click', handleSyntaxCheck);
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

        quickAddButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type || '1';
                const comment = btn.dataset.comment || '';
                const copyFlags = btn.dataset.copyFlags || '0';
                const label = btn.dataset.label || 'Unknown';
                
                // Handle mixed type (both exclude and include paths)
                if (type === 'mixed') {
                    const excludePaths = JSON.parse(btn.dataset.excludePaths || '[]');
                    const includePaths = JSON.parse(btn.dataset.includePaths || '[]');
                    const allPaths = [...excludePaths, ...includePaths];
                    
                    // Check if all paths already exist (toggle mode)
                    const allExist = allPaths.every(path => {
                        const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
                        return redirections.some(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
                    });
                    
                    if (allExist && allPaths.length > 0) {
                        // Remove all paths from this template
                        let removed = 0;
                        allPaths.forEach(path => {
                            const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
                            const idx = redirections.findIndex(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
                            if (idx !== -1) {
                                redirections.splice(idx, 1);
                                removed++;
                            }
                        });
                        if (removed > 0) {
                            saveToStorage();
                            render();
                            logActivity('Removed', `${label}: ${removed} path(s) removed`, 'info');
                        }
                    } else {
                        // Add paths that don't exist yet
                        let added = 0;
                        excludePaths.forEach(path => {
                            if (addRedirection(path, '1', copyFlags, null, comment)) {
                                added++;
                            }
                        });
                        includePaths.forEach(path => {
                            if (addRedirection(path, '2', '0', null, comment)) {
                                added++;
                            }
                        });
                        if (added > 0) {
                            logActivity('Added', `${label}: ${added} path(s) added`, 'success');
                        }
                    }
                } else {
                    // Handle single-type entries (exclude or include only)
                    const paths = JSON.parse(btn.dataset.paths);
                    const typeLabel = type === '2' ? 'Include' : 'Exclude';
                    
                    // Check if all paths already exist (toggle mode)
                    const allExist = paths.every(path => {
                        const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
                        return redirections.some(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
                    });
                    
                    if (allExist && paths.length > 0) {
                        // Remove all paths from this template
                        let removed = 0;
                        paths.forEach(path => {
                            const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
                            const idx = redirections.findIndex(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
                            if (idx !== -1) {
                                redirections.splice(idx, 1);
                                removed++;
                            }
                        });
                        if (removed > 0) {
                            saveToStorage();
                            render();
                            logActivity('Removed', `${label}: ${removed} ${typeLabel} path(s) removed`, 'info');
                        }
                    } else {
                        // Add paths that don't exist yet
                        let added = 0;
                        paths.forEach(path => {
                            if (addRedirection(path, type, copyFlags, null, comment)) {
                                added++;
                            }
                        });
                        if (added > 0) {
                            logActivity('Added', `${label}: ${added} ${typeLabel} path(s) added`, 'success');
                        }
                    }
                }
            });
        });

        // New/Bulk buttons
        if (addNewBtn) addNewBtn.addEventListener('click', () => showAddForm());
        if (cancelAddBtn) cancelAddBtn.addEventListener('click', () => hideAddForm());
        if (bulkInsertBtn) bulkInsertBtn.addEventListener('click', () => showBulkInsert());
        if (cancelBulkBtn) cancelBulkBtn.addEventListener('click', () => hideBulkInsert());
        if (bulkAddBtn) bulkAddBtn.addEventListener('click', handleBulkAdd);

        // Disable copy flags for Include type
        if (redirectTypeSelect) {
            redirectTypeSelect.addEventListener('change', updateCopyFlagsAvailability);
        }

        // Help toggle
        if (helpToggleBtn && helpDetails) {
            helpToggleBtn.addEventListener('click', () => {
                helpDetails.classList.toggle('expanded');
                helpToggleBtn.textContent = helpDetails.classList.contains('expanded') ? '▲ Less' : '▼ More';
            });
        }

        // Import/Debug panel toggle
        if (importToggle && importPanel) {
            importToggle.addEventListener('click', () => {
                importPanel.classList.toggle('collapsed');
            });
        }

        // View toggle (Regular/Compact)
        if (viewRegularBtn) viewRegularBtn.addEventListener('click', () => setViewMode('regular'));
        if (viewCompactBtn) viewCompactBtn.addEventListener('click', () => setViewMode('compact'));

        // Sort dropdown
        if (sortSelect) sortSelect.addEventListener('change', handleSort);
        if (sortOrderBtn) sortOrderBtn.addEventListener('click', toggleSortOrder);

        // Toggle quick add paths visibility
        if (toggleQuickAddPaths) {
            toggleQuickAddPaths.addEventListener('click', () => {
                if (quickAddContainer) {
                    quickAddContainer.classList.toggle('show-paths');
                    toggleQuickAddPaths.textContent = quickAddContainer.classList.contains('show-paths') ? '✕' : 'ℹ';
                }
            });
        }

        // Add All quick add button
        if (addAllQuickBtn) {
            addAllQuickBtn.addEventListener('click', addAllCommunityRedirections);
        }

        // Remove All quick add button
        if (removeAllQuickBtn) {
            removeAllQuickBtn.addEventListener('click', removeAllCommunityRedirections);
        }

        // Clear activity log button
        if (clearLogBtn) {
            clearLogBtn.addEventListener('click', clearActivityLog);
        }

        // Quick add filter
        if (quickAddFilter) {
            quickAddFilter.addEventListener('input', filterQuickAddButtons);
        }

        // Redirections filter
        if (redirectionsFilter) {
            redirectionsFilter.addEventListener('input', filterRedirectionsList);
        }

        // XML Input gutter (line numbers)
        if (xmlInput && xmlGutter) {
            xmlInput.addEventListener('input', updateGutter);
            xmlInput.addEventListener('scroll', syncGutterScroll);
            updateGutter(); // Initialize
        }

        // Load saved view mode
        loadViewMode();
    }

    // Update gutter line numbers
    function updateGutter() {
        if (!xmlInput || !xmlGutter) return;
        
        const text = xmlInput.value;
        const lineCount = (text.match(/\n/g) || []).length + 1;
        const lines = Math.max(lineCount, 10); // Minimum 10 lines
        
        let html = '';
        for (let i = 1; i <= lines; i++) {
            html += '<div class="gutter-line">' + i + '</div>';
        }
        xmlGutter.innerHTML = html;
        syncGutterScroll();
    }

    // Sync gutter scroll with textarea using transform
    function syncGutterScroll() {
        if (!xmlInput || !xmlGutter) return;
        const scrollTop = xmlInput.scrollTop;
        xmlGutter.style.transform = 'translateY(-' + scrollTop + 'px)';
    }

    // Add all community redirections
    function addAllCommunityRedirections() {
        if (typeof COMMUNITY_REDIRECTIONS === 'undefined') return;
        
        let added = 0;
        COMMUNITY_REDIRECTIONS.forEach(item => {
            const type = item.type || '1';
            const comment = item.comment || '';
            const copyFlags = item.copyFlags || '0';

            if (type === 'mixed') {
                // Handle mixed type entries
                const excludePaths = item.excludePaths || [];
                const includePaths = item.includePaths || [];
                excludePaths.forEach(path => {
                    if (addRedirection(path, '1', copyFlags, null, comment)) added++;
                });
                includePaths.forEach(path => {
                    if (addRedirection(path, '2', '0', null, comment)) added++;
                });
            } else {
                // Handle single-type entries
                const paths = item.paths || [];
                paths.forEach(path => {
                    if (addRedirection(path, type, copyFlags, null, comment)) added++;
                });
            }
        });
        
        if (added > 0) {
            logActivity('Bulk Add', `Added ${added} path(s) from ${COMMUNITY_REDIRECTIONS.length} community templates`, 'success');
        } else {
            logActivity('Bulk Add', 'All community paths already added', 'info');
        }
    }

    // Theme helpers
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️ Light';
        } else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙 Dark';
        }
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const current = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    }

    // Remove all community redirections
    function removeAllCommunityRedirections() {
        if (typeof COMMUNITY_REDIRECTIONS === 'undefined') return;
        
        let removed = 0;
        COMMUNITY_REDIRECTIONS.forEach(item => {
            const type = item.type || '1';
            let paths = [];
            
            if (type === 'mixed') {
                paths = [...(item.excludePaths || []), ...(item.includePaths || [])];
            } else {
                paths = item.paths || [];
            }
            
            paths.forEach(path => {
                const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
                const idx = redirections.findIndex(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
                if (idx !== -1) {
                    redirections.splice(idx, 1);
                    removed++;
                }
            });
        });
        
        if (removed > 0) {
            saveToStorage();
            render();
            logActivity('Bulk Remove', `Removed ${removed} path(s) from community templates`, 'info');
        } else {
            logActivity('Bulk Remove', 'No community paths to remove', 'info');
        }
    }

    // Filter quick add buttons
    function filterQuickAddButtons() {
        const filterText = quickAddFilter.value.toLowerCase();
        quickAddButtons.forEach(btn => {
            const label = btn.querySelector('.qa-label')?.textContent.toLowerCase() || '';
            const paths = btn.dataset.paths ? JSON.parse(btn.dataset.paths).join(' ').toLowerCase() : '';
            const matches = label.includes(filterText) || paths.includes(filterText);
            btn.style.display = matches ? '' : 'none';
        });
    }

    // Filter redirections list
    function filterRedirectionsList() {
        const filterText = redirectionsFilter.value.toLowerCase();
        const items = redirectionsList.querySelectorAll('.redirection-item');
        items.forEach(item => {
            const path = item.querySelector('.redirection-path')?.textContent.toLowerCase() || '';
            const comment = item.querySelector('.redirection-comment')?.textContent.toLowerCase() || '';
            const matches = path.includes(filterText) || comment.includes(filterText);
            item.style.display = matches ? '' : 'none';
        });
    }

    // View mode functions
    function setViewMode(mode) {
        if (!redirectionsList) return;
        if (mode === 'compact') {
            redirectionsList.classList.add('compact');
            if (viewCompactBtn) viewCompactBtn.classList.add('active');
            if (viewRegularBtn) viewRegularBtn.classList.remove('active');
        } else {
            redirectionsList.classList.remove('compact');
            if (viewRegularBtn) viewRegularBtn.classList.add('active');
            if (viewCompactBtn) viewCompactBtn.classList.remove('active');
        }
        try {
            localStorage.setItem('fslogix_viewmode', mode);
        } catch (e) {}
    }

    function loadViewMode() {
        try {
            const mode = localStorage.getItem('fslogix_viewmode') || 'regular';
            setViewMode(mode);
        } catch (e) {
            setViewMode('regular');
        }
    }

    // Toggle sort order
    function toggleSortOrder() {
        sortAscending = !sortAscending;
        sortOrderBtn.textContent = sortAscending ? '↑' : '↓';
        sortOrderBtn.title = sortAscending ? 'Ascending (click to change)' : 'Descending (click to change)';
        
        // Re-apply last sort if there was one
        if (lastSortBy) {
            applySort(lastSortBy);
        }
    }

    // Apply sort with current direction
    function applySort(sortBy) {
        const dir = sortAscending ? 1 : -1;

        switch (sortBy) {
            case 'type':
                redirections.sort((a, b) => {
                    if (a.type === b.type) return a.path.localeCompare(b.path) * dir;
                    return (a.type === '1' ? -1 : 1) * dir;
                });
                logActivity('Sort', `Sorted ${redirections.length} items by Type ${sortAscending ? '(Excludes first)' : '(Includes first)'}`, 'info');
                break;
            case 'path':
                redirections.sort((a, b) => a.path.localeCompare(b.path) * dir);
                logActivity('Sort', `Sorted ${redirections.length} items by Path ${sortAscending ? '(A-Z)' : '(Z-A)'}`, 'info');
                break;
            case 'copy':
                redirections.sort((a, b) => {
                    const aFlag = a.copyFlags || '-1';
                    const bFlag = b.copyFlags || '-1';
                    if (aFlag === bFlag) return a.path.localeCompare(b.path) * dir;
                    return aFlag.localeCompare(bFlag) * dir;
                });
                logActivity('Sort', `Sorted ${redirections.length} items by Copy Flag ${sortAscending ? '(0→2)' : '(2→0)'}`, 'info');
                break;
            case 'comment':
                redirections.sort((a, b) => {
                    const aComment = a.comment || '';
                    const bComment = b.comment || '';
                    if (aComment === bComment) return a.path.localeCompare(b.path) * dir;
                    return aComment.localeCompare(bComment) * dir;
                });
                logActivity('Sort', `Sorted ${redirections.length} items by Comment ${sortAscending ? '(A-Z)' : '(Z-A)'}`, 'info');
                break;
        }

        saveToStorage();
        render();
    }

    // Sort handler
    function handleSort() {
        const sortBy = sortSelect.value;
        if (!sortBy) return;

        lastSortBy = sortBy;
        applySort(sortBy);
        // Keep the selection visible so user knows what's active
    }

    // Update copy flags availability based on type
    function updateCopyFlagsAvailability() {
        if (!copyFlagsSelect ||!redirectTypeSelect) return;
        
        if (redirectTypeSelect.value === '2') {
            // Include - disable copy flags
            copyFlagsSelect.disabled = true;
            copyFlagsSelect.value = '';
            copyFlagsSelect.title = 'Copy flags not available for Include type';
        } else {
            // Exclude - enable copy flags
            copyFlagsSelect.disabled = false;
            copyFlagsSelect.title = '';
        }
    }

    // Edit comment
    function editComment(id) {
        editingCommentId = id;
        render();
    }

    function saveComment(id, comment) {
        const item = redirections.find(r => r.id === id);
        if (item) {
            item.comment = comment.trim();
            saveToStorage();
        }
        editingCommentId = null;
        render();
    }

    function cancelEditComment() {
        editingCommentId = null;
        render();
    }

    // Show/Hide add form
    function showAddForm(afterId = null) {
        insertAfterId = afterId;
        if (addFormPanel) addFormPanel.style.display = 'block';
        if (bulkInsertPanel) bulkInsertPanel.style.display = 'none';
        if (folderPathInput) folderPathInput.focus();
    }

    function hideAddForm() {
        if (addFormPanel) addFormPanel.style.display = 'none';
        insertAfterId = null;
        if (folderPathInput) folderPathInput.value = '';
    }

    // Show/Hide bulk insert
    function showBulkInsert() {
        if (bulkInsertPanel) bulkInsertPanel.style.display = 'block';
        if (addFormPanel) addFormPanel.style.display = 'none';
        if (bulkInput) bulkInput.focus();
    }

    function hideBulkInsert() {
        if (bulkInsertPanel) bulkInsertPanel.style.display = 'none';
        if (bulkInput) bulkInput.value = '';
    }

    // Bulk add handler
    function handleBulkAdd() {
        const lines = bulkInput.value.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length === 0) {
            showError('Please enter at least one path');
            return;
        }

        let added = 0;
        lines.forEach(path => {
            const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
            const exists = redirections.some(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
            if (!exists) {
                redirections.push({
                    id: Date.now() + added,
                    path: normalizedPath,
                    type: '1',
                    copyFlags: ''
                });
                added++;
            }
        });

        if (added > 0) {
            saveToStorage();
            render();
            logActivity('Bulk Insert', `Added ${added} Exclude redirection(s) from ${paths.length} lines`, 'success');
        } else {
            logActivity('Bulk Insert', 'All paths already exist, nothing added', 'info');
        }
        hideBulkInsert();
    }

    // Add redirection from form
    function handleAddRedirection(e) {
        e.preventDefault();
        const path = folderPathInput.value.trim();
        const type = redirectTypeSelect.value;
        const copyFlags = copyFlagsSelect.value;

        if (path) {
            const result = addRedirection(path, type, copyFlags, insertAfterId);
            if (result) {
                const typeLabel = type === '2' ? 'Include' : 'Exclude';
                const pathName = path.split('\\').pop();
                logActivity('Add', `Added ${typeLabel}: ${pathName}`, 'success');
            } else {
                logActivity('Add', `Path already exists: ${path.split('\\').pop()}`, 'error');
            }
            folderPathInput.value = '';
            copyFlagsSelect.value = '';
            hideAddForm();
        }
    }

    // Add a redirection to the list
    function addRedirection(path, type, copyFlags, afterId = null, comment = '') {
        // Normalize path
        const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
        
        // Check for duplicates
        const exists = redirections.some(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
        if (exists) {
            return false;
        }

        const newItem = {
            id: Date.now() + Math.random(),
            path: normalizedPath,
            type: type,
            copyFlags: copyFlags,
            comment: comment
        };

        if (afterId !== null) {
            const index = redirections.findIndex(r => r.id === afterId);
            if (index !== -1) {
                redirections.splice(index + 1, 0, newItem);
            } else {
                redirections.push(newItem);
            }
        } else {
            redirections.push(newItem);
        }

        saveToStorage();
        render();
        hideError();
        return true;
    }

    // Toggle type
    function toggleType(id) {
        const item = redirections.find(r => r.id === id);
        if (item) {
            const oldType = item.type === '1' ? 'Exclude' : 'Include';
            item.type = item.type === '1' ? '2' : '1';
            const newType = item.type === '1' ? 'Exclude' : 'Include';
            // Clear copy flags when switching to Include
            if (item.type === '2') {
                item.copyFlags = '';
            }
            saveToStorage();
            render();
            logActivity('Type', `Changed to ${newType}: ${item.path.split('\\\\').pop()}`, 'info');
        }
    }

    // Cycle copy flags
    function cycleCopyFlags(id) {
        const item = redirections.find(r => r.id === id);
        if (item) {
            // Copy flags only available for Exclude type
            if (item.type === '2') return;
            
            const flags = ['', '0', '1', '2', '3'];
            const currentIndex = flags.indexOf(item.copyFlags);
            item.copyFlags = flags[(currentIndex + 1) % flags.length];
            saveToStorage();
            render();
            const flagDesc = item.copyFlags === '' ? 'None' : item.copyFlags;
            logActivity('Copy', `Set Copy=${flagDesc} for: ${item.path.split('\\\\').pop()}`, 'info');
        }
    }

    // Remove redirection
    function removeRedirection(id) {
        const item = redirections.find(r => r.id === id);
        const pathName = item ? item.path.split('\\').pop() : 'Unknown';
        redirections = redirections.filter(r => r.id !== id);
        saveToStorage();
        render();
        logActivity('Delete', `Removed: ${pathName}`, 'info');
    }

    // Generate XML
    function generateXML() {
        if (redirections.length === 0) {
            return '';
        }

        const excludes = redirections.filter(r => r.type === '1');
        const includes = redirections.filter(r => r.type === '2');

        // Helper to group items by comment and generate XML
        function generateGroupedEntries(items, tagName, includeCopyAttr) {
            let result = '';
            let lastComment = null;
            let isFirstGroup = true;

            items.forEach((r, index) => {
                const comment = r.comment || '';
                
                // Check if comment changed (new group)
                if (comment !== lastComment) {
                    // Add 2 blank lines before new group (except for the first group)
                    if (!isFirstGroup) {
                        result += '\n\n';
                    }
                    isFirstGroup = false;
                    
                    // Add comment only once per group (if there is a comment)
                    if (comment) {
                        result += `  <!-- ${escapeXml(comment)} -->\n`;
                    }
                    lastComment = comment;
                }
                
                // Add the entry
                if (includeCopyAttr) {
                    const copyAttr = r.copyFlags !== '' ? r.copyFlags : '0';
                    result += `  <${tagName} Copy="${copyAttr}">${escapeXml(r.path)}</${tagName}>\n`;
                } else {
                    result += `  <${tagName}>${escapeXml(r.path)}</${tagName}>\n`;
                }
            });

            return result;
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<FrxProfileFolderRedirection ExcludeCommonFolders="0">\n';
        
        // Excludes section
        xml += '<Excludes>\n';
        xml += generateGroupedEntries(excludes, 'Exclude', true);
        xml += '</Excludes>\n';
        
        // Includes section
        xml += '<Includes>\n';
        xml += generateGroupedEntries(includes, 'Include', false);
        xml += '</Includes>\n';
        
        xml += '</FrxProfileFolderRedirection>';
        return xml;
    }

    // Parse XML
    function parseXML(xmlString) {
        const parsed = [];
        const errors = [];
        const warnings = [];
        const lines = xmlString.split('\n');

        // Helper to find line number for a string
        function findLine(searchStr) {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(searchStr)) {
                    return i + 1;
                }
            }
            return null;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, 'text/xml');

            // Check for parse errors
            const parseError = doc.querySelector('parsererror');
            if (parseError) {
                const errorText = parseError.textContent;
                const lineMatch = errorText.match(/line\s*(\d+)/i);
                const lineNum = lineMatch ? lineMatch[1] : '?';
                errors.push(`Line ${lineNum}: XML syntax error`);
                return { parsed, errors, warnings };
            }

            // Find root element
            const root = doc.querySelector('FrxProfileFolderRedirection');
            if (!root) {
                errors.push('Line 1: Missing root element &lt;FrxProfileFolderRedirection&gt;');
                return { parsed, errors, warnings };
            }

            // Check for incorrect section names (common typos)
            const incorrectSections = ['Excludes2', 'Includes2', 'Exclude2', 'Include2', 
                                       'Exclusions', 'Inclusions', 'ExcludeFolders', 'IncludeFolders'];
            incorrectSections.forEach(sectionName => {
                const badSection = doc.querySelector(sectionName);
                if (badSection) {
                    const lineNum = findLine('<' + sectionName);
                    errors.push(`Line ${lineNum || '?'}: Invalid element &lt;${sectionName}&gt; - use &lt;Excludes&gt; or &lt;Includes&gt;`);
                }
            });

            // Check for unknown child elements under root
            const validRootChildren = ['Excludes', 'Includes', 'Exclude', 'Include'];
            Array.from(root.children).forEach(child => {
                if (!validRootChildren.includes(child.tagName) && child.nodeType === 1) {
                    const lineNum = findLine('<' + child.tagName);
                    warnings.push(`Line ${lineNum || '?'}: Unknown element &lt;${child.tagName}&gt; will be ignored`);
                }
            });

            // New format: <Excludes><Exclude Copy="0">path</Exclude></Excludes>
            const excludesSection = doc.querySelector('Excludes');
            const includesSection = doc.querySelector('Includes');

            if (excludesSection || includesSection) {
                // New format
                if (excludesSection) {
                    // Check for invalid children in Excludes section
                    Array.from(excludesSection.children).forEach(child => {
                        if (child.tagName !== 'Exclude') {
                            const lineNum = findLine('<' + child.tagName);
                            warnings.push(`Line ${lineNum || '?'}: Invalid element &lt;${child.tagName}&gt; inside &lt;Excludes&gt; - use &lt;Exclude&gt;`);
                        }
                    });
                    
                    const excludes = excludesSection.querySelectorAll('Exclude');
                    excludes.forEach((el, index) => {
                        const path = el.textContent.trim();
                        const copy = el.getAttribute('Copy') || '';
                        
                        // Validate Copy attribute value
                        if (copy && !['0', '1', '2', '3'].includes(copy)) {
                            const lineNum = findLine(path) || findLine('<Exclude');
                            warnings.push(`Line ${lineNum || '?'}: Invalid Copy="${copy}" - valid values are 0, 1, 2, 3`);
                        }
                        
                        if (path) {
                            parsed.push({
                                id: Date.now() + index,
                                path: path,
                                type: '1',
                                copyFlags: ['0', '1', '2', '3'].includes(copy) ? copy : '',
                                comment: ''
                            });
                        } else {
                            const lineNum = findLine('<Exclude');
                            warnings.push(`Line ${lineNum || '?'}: Empty &lt;Exclude&gt; element - path is missing`);
                        }
                    });
                }

                if (includesSection) {
                    // Check for invalid children in Includes section
                    Array.from(includesSection.children).forEach(child => {
                        if (child.tagName !== 'Include') {
                            const lineNum = findLine('<' + child.tagName);
                            warnings.push(`Line ${lineNum || '?'}: Invalid element &lt;${child.tagName}&gt; inside &lt;Includes&gt; - use &lt;Include&gt;`);
                        }
                    });
                    
                    const includes = includesSection.querySelectorAll('Include');
                    includes.forEach((el, index) => {
                        const path = el.textContent.trim();
                        const copy = el.getAttribute('Copy');
                        
                        // Include elements should not have Copy attribute
                        if (copy) {
                            const lineNum = findLine(path) || findLine('<Include');
                            warnings.push(`Line ${lineNum || '?'}: Copy attribute on &lt;Include&gt; is ignored`);
                        }
                        
                        if (path) {
                            parsed.push({
                                id: Date.now() + 1000 + index,
                                path: path,
                                type: '2',
                                copyFlags: '',
                                comment: ''
                            });
                        } else {
                            const lineNum = findLine('<Include');
                            warnings.push(`Line ${lineNum || '?'}: Empty &lt;Include&gt; element - path is missing`);
                        }
                    });
                }
            } else {
                // Old format: <Exclude Path="..." Flags="1" CopyBase="0" />
                const excludes = doc.querySelectorAll('Exclude');
                excludes.forEach((el, index) => {
                    const path = el.getAttribute('Path') || el.textContent.trim();
                    const flags = el.getAttribute('Flags');
                    const copyBase = el.getAttribute('CopyBase') || el.getAttribute('Copy') || '';

                    if (!path) {
                        const lineNum = findLine('<Exclude');
                        errors.push(`Line ${lineNum || '?'}: &lt;Exclude&gt; missing Path attribute`);
                        return;
                    }

                    parsed.push({
                        id: Date.now() + index,
                        path: path,
                        type: flags || '1',
                        copyFlags: copyBase,
                        comment: ''
                    });
                });

                // Also check for Include elements in old format
                const includes = doc.querySelectorAll('Include');
                includes.forEach((el, index) => {
                    const path = el.getAttribute('Path') || el.textContent.trim();
                    const copyBase = el.getAttribute('CopyBase') || el.getAttribute('Copy') || '';
                    
                    if (path) {
                        parsed.push({
                            id: Date.now() + 2000 + index,
                            path: path,
                            type: '2',
                            copyFlags: copyBase,
                            comment: ''
                        });
                    }
                });
                
                // If no standard sections found but elements exist under wrong parents, warn
                if (excludes.length === 0 && includes.length === 0) {
                    errors.push('No valid &lt;Exclude&gt; or &lt;Include&gt; elements found in the XML');
                }
            }

        } catch (e) {
            errors.push('Error parsing XML: ' + e.message);
        }

        return { parsed, errors, warnings };
    }

    // Handle syntax check button (validates without importing)
    function handleSyntaxCheck() {
        const xmlString = xmlInput.value.trim();
        if (!xmlString) {
            showError('Please paste XML content to check');
            return;
        }

        const { parsed, errors, warnings } = parseXML(xmlString);
        
        // Check for valid FSLogix structure
        const fslogixErrors = [];
        const fslogixWarnings = [];
        
        // Try to parse as XML first
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlString, 'application/xml');
        const parseError = doc.querySelector('parsererror');
        
        if (parseError) {
            // XML parsing failed - already captured in errors
        } else {
            // Check FSLogix-specific structure
            const root = doc.documentElement;
            
            // Check root element
            if (root.tagName !== 'FrxProfileFolderRedirection') {
                fslogixErrors.push('Root element must be &lt;FrxProfileFolderRedirection&gt;, found &lt;' + escapeHtml(root.tagName) + '&gt;');
            } else {
                // Check ExcludeCommonFolders attribute
                const excludeCommonFolders = root.getAttribute('ExcludeCommonFolders');
                if (excludeCommonFolders === null) {
                    fslogixWarnings.push('Missing ExcludeCommonFolders attribute on root element (will default to "0")');
                } else if (!['0', '1'].includes(excludeCommonFolders)) {
                    fslogixWarnings.push('ExcludeCommonFolders should be "0" or "1", found "' + escapeHtml(excludeCommonFolders) + '"');
                }
            }
            
            // Check Excludes section
            const excludes = doc.querySelectorAll('Excludes > Exclude');
            excludes.forEach((exclude, index) => {
                const path = exclude.textContent.trim();
                const copy = exclude.getAttribute('Copy');
                
                if (!path) {
                    fslogixWarnings.push('Exclude #' + (index + 1) + ': Empty path');
                }
                if (copy !== null && !['0', '1', '2', '3'].includes(copy)) {
                    fslogixErrors.push('Exclude #' + (index + 1) + ': Invalid Copy attribute "' + escapeHtml(copy) + '" (must be 0-3)');
                }
            });
            
            // Check Includes section
            const includes = doc.querySelectorAll('Includes > Include');
            includes.forEach((include, index) => {
                const path = include.textContent.trim();
                const copy = include.getAttribute('Copy');
                
                if (!path) {
                    fslogixWarnings.push('Include #' + (index + 1) + ': Empty path');
                }
                if (copy !== null) {
                    fslogixWarnings.push('Include #' + (index + 1) + ': Copy attribute is not used for Includes');
                }
            });
            
            // Check for unknown elements
            const allChildren = root.children;
            for (let i = 0; i < allChildren.length; i++) {
                const child = allChildren[i];
                if (!['Excludes', 'Includes'].includes(child.tagName)) {
                    fslogixWarnings.push('Unknown element &lt;' + escapeHtml(child.tagName) + '&gt; (FSLogix expects only Excludes and Includes)');
                }
            }
        }
        
        // Combine all errors and warnings
        const allErrors = [...errors, ...fslogixErrors];
        const allWarnings = [...warnings, ...fslogixWarnings];
        
        // Build result message
        if (allErrors.length === 0 && allWarnings.length === 0) {
            logActivity('Syntax Check', `Valid FSLogix XML - ${parsed.length} redirection(s) found`, 'success');
            hideError();
        } else {
            const messages = [];
            if (allErrors.length > 0) {
                messages.push('<strong>Errors:</strong><br>' + allErrors.map(e => '❌ ' + e).join('<br>'));
            }
            if (allWarnings.length > 0) {
                messages.push('<strong>Warnings:</strong><br>' + allWarnings.map(w => '⚠️ ' + w).join('<br>'));
            }
            showError(messages.join('<br><br>'));
            
            if (allErrors.length > 0) {
                logActivity('Syntax Check', `Invalid XML - ${allErrors.length} error(s), ${allWarnings.length} warning(s)`, 'error');
            } else {
                logActivity('Syntax Check', `Valid XML with ${allWarnings.length} warning(s) - ${parsed.length} redirection(s) found`, 'info');
            }
        }
    }

    // Handle parse button
    function handleParse() {
        const xmlString = xmlInput.value.trim();
        if (!xmlString) {
            showError('Please paste XML content to parse');
            return;
        }

        // Warn user if there are existing redirections
        if (redirections.length > 0) {
            if (!confirm(`Warning: This will replace your current ${redirections.length} redirection(s) with the imported XML content.\n\nDo you want to continue?`)) {
                return;
            }
        }

        const { parsed, errors, warnings } = parseXML(xmlString);

        // Build message with errors and warnings
        const messages = [];
        if (errors.length > 0) {
            messages.push('<strong>Errors:</strong><br>' + errors.map(e => '❌ ' + e).join('<br>'));
        }
        if (warnings.length > 0) {
            messages.push('<strong>Warnings:</strong><br>' + warnings.map(w => '⚠️ ' + w).join('<br>'));
        }

        if (messages.length > 0) {
            showError(messages.join('<br><br>'));
        } else {
            hideError();
        }

        if (parsed.length > 0) {
            redirections = parsed;
            saveToStorage();
            render();
            const warningNote = warnings.length > 0 ? ` (with ${warnings.length} warning(s))` : '';
            logActivity('Import', `Imported ${parsed.length} redirection(s) - previous list was replaced${warningNote}`, 'success');
        } else if (errors.length === 0) {
            logActivity('Import', 'No redirections found in the XML', 'error');
        }
    }

    // Copy to clipboard
    function handleCopy() {
        const xml = generateXML();
        if (!xml) {
            logActivity('Copy', 'No redirections to copy', 'error');
            return;
        }

        const excludeCount = redirections.filter(r => r.type === '1').length;
        const includeCount = redirections.filter(r => r.type === '2').length;

        navigator.clipboard.writeText(xml).then(() => {
            logActivity('Copy', `Copied XML to clipboard (${excludeCount} excludes, ${includeCount} includes)`, 'success');
        }).catch(() => {
            // Fallback for older browsers
            xmlOutput.select();
            document.execCommand('copy');
            logActivity('Copy', `Copied XML to clipboard (${excludeCount} excludes, ${includeCount} includes)`, 'success');
        });
    }

    // Download XML file
    function handleDownload() {
        const xml = generateXML();
        if (!xml) {
            logActivity('Download', 'No redirections to download', 'error');
            return;
        }

        const excludeCount = redirections.filter(r => r.type === '1').length;
        const includeCount = redirections.filter(r => r.type === '2').length;

        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'redirections.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        logActivity('Download', `Downloaded redirections.xml (${excludeCount} excludes, ${includeCount} includes)`, 'success');
    }

    // Clear all
    function handleClear() {
        if (redirections.length === 0) return;
        
        const count = redirections.length;
        if (confirm('Are you sure you want to clear all redirections?')) {
            redirections = [];
            saveToStorage();
            render();
            logActivity('Clear', `Cleared all ${count} redirection(s)`, 'info');
        }
    }

    // Render the UI
    function render() {
        renderList();
        renderXML();
        updateQuickAddButtons();
    }

    function renderList() {
        if (redirections.length === 0) {
            redirectionsList.innerHTML = '<p class="empty-state">No redirections added yet. Click "Add New Redirection" or use Quick Add buttons below.</p>';
            return;
        }

        const html = redirections.map(r => {
            const typeClass = r.type === '1' ? 'exclude' : 'include';
            const typeBadge = r.type === '1' 
                ? '<span class="badge badge-exclude">Exclude</span>' 
                : '<span class="badge badge-include">Include</span>';
            
            let copyBadge = '';
            if (r.type === '2') {
                // Include type - copy not available
                copyBadge = '<span class="badge badge-copy-na" title="Copy not available for Include">Copy:N/A</span>';
            } else if (r.copyFlags !== '') {
                const copyClass = `badge-copy-${r.copyFlags}`;
                copyBadge = `<span class="badge ${copyClass}">Copy:${r.copyFlags}</span>`;
            } else {
                copyBadge = '<span class="badge badge-copy-0" style="opacity:0.5">Copy:–</span>';
            }

            // Comment field
            let commentHtml;
            if (editingCommentId === r.id) {
                commentHtml = `<input type="text" class="comment-input" value="${escapeHtml(r.comment || '')}" 
                    onblur="window.saveComment(${r.id}, this.value)" 
                    onkeydown="if(event.key==='Enter'){window.saveComment(${r.id}, this.value)}else if(event.key==='Escape'){window.cancelEditComment()}"
                    placeholder="Add comment..." autofocus>`;
            } else {
                const commentText = r.comment ? escapeHtml(r.comment) : '+ comment';
                const emptyClass = r.comment ? '' : 'empty';
                commentHtml = `<span class="redirection-comment ${emptyClass}" onclick="window.editComment(${r.id})" title="${r.comment ? escapeHtml(r.comment) : 'Click to add comment'}">${commentText}</span>`;
            }

            return `
                <div class="redirection-item ${typeClass}">
                    <div class="redirection-path" title="${escapeHtml(r.path)}">${escapeHtml(r.path)}</div>
                    ${commentHtml}
                    <div class="redirection-badges">
                        <span onclick="window.toggleType(${r.id})" style="cursor:pointer" title="Click to toggle">${typeBadge}</span>
                        <span onclick="window.cycleCopyFlags(${r.id})" style="cursor:pointer" title="Click to cycle: None → 0 → 1 → 2">${copyBadge}</span>
                    </div>
                    <div class="redirection-actions">
                        <button class="btn btn-small btn-icon" onclick="window.insertAfter(${r.id})" title="Add new after this">+</button>
                        <button class="btn btn-small btn-danger" onclick="window.removeRedirection(${r.id})" title="Remove">×</button>
                    </div>
                </div>
            `;
        }).join('');

        redirectionsList.innerHTML = html;
    }

    function renderXML() {
        xmlOutput.value = generateXML();
    }

    // Update quick add buttons - show state based on added paths
    function updateQuickAddButtons() {
        quickAddButtons.forEach(btn => {
            const type = btn.dataset.type || '1';
            let paths = [];
            
            // Handle mixed type (both exclude and include paths)
            if (type === 'mixed') {
                const excludePaths = btn.dataset.excludePaths ? JSON.parse(btn.dataset.excludePaths) : [];
                const includePaths = btn.dataset.includePaths ? JSON.parse(btn.dataset.includePaths) : [];
                paths = [...excludePaths, ...includePaths];
            } else {
                paths = btn.dataset.paths ? JSON.parse(btn.dataset.paths) : [];
            }
            
            let allExist = true;
            let someExist = false;
            
            paths.forEach(path => {
                const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '').replace(/\\+$/, '');
                const exists = redirections.some(r => r.path.toLowerCase() === normalizedPath.toLowerCase());
                if (exists) {
                    someExist = true;
                } else {
                    allExist = false;
                }
            });
            
            // Always keep button enabled for toggle behavior
            btn.disabled = false;
            
            if (allExist && paths.length > 0) {
                btn.classList.add('added');
                btn.classList.remove('partial');
                btn.title = `Click to remove ${paths.length} path(s)`;
            } else if (someExist) {
                btn.classList.remove('added');
                btn.classList.add('partial');
                btn.title = paths.join('\n') + '\n(some already added, click to add remaining)';
            } else {
                btn.classList.remove('added');
                btn.classList.remove('partial');
                if (type === 'mixed') {
                    const excludePaths = btn.dataset.excludePaths ? JSON.parse(btn.dataset.excludePaths) : [];
                    const includePaths = btn.dataset.includePaths ? JSON.parse(btn.dataset.includePaths) : [];
                    btn.title = 'Excludes:\n' + excludePaths.join('\n') + '\n\nIncludes:\n' + includePaths.join('\n');
                } else {
                    btn.title = paths.join('\n');
                }
            }
        });
    }

    // Storage
    function saveToStorage() {
        try {
            localStorage.setItem('fslogix_redirections', JSON.stringify(redirections));
        } catch (e) {
            // Storage not available
        }
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem('fslogix_redirections');
            if (stored) {
                redirections = JSON.parse(stored);
            }
        } catch (e) {
            redirections = [];
        }
    }

    // Utility functions
    function escapeXml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Activity log state
    let activityLogEntries = [];

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function logActivity(action, details, type = 'success') {
        activityLogEntries.unshift({
            id: Date.now(),
            action: action,
            details: details,
            type: type,
            time: new Date()
        });
        
        renderActivityLog();
    }

    function clearActivityLog() {
        activityLogEntries = [];
        renderActivityLog();
    }

    function renderActivityLog() {
        if (!activityLog) return;
        
        if (activityLogEntries.length === 0) {
            activityLog.innerHTML = '<p class="empty-state">No activity yet</p>';
            return;
        }

        let html = '';
        activityLogEntries.forEach(entry => {
            html += `<div class="log-entry log-entry-${entry.type}">
                <span class="log-time">${formatTime(entry.time)}</span>
                <span class="log-action">${entry.action}</span>
                <span class="log-details">${entry.details}</span>
            </div>`;
        });
        
        activityLog.innerHTML = html;
    }

    function showError(message, details = '') {
        logActivity('Error', details ? `${message} - ${details}` : message, 'error');
    }

    function showSuccess(message, details = '') {
        logActivity('Success', details ? `${message} - ${details}` : message, 'success');
    }

    function showInfo(message, details = '') {
        logActivity('Info', details ? `${message} - ${details}` : message, 'info');
    }

    function hideError() {
        // Keep for compatibility
    }

    // Expose functions globally for onclick
    window.removeRedirection = removeRedirection;
    window.toggleType = toggleType;
    window.cycleCopyFlags = cycleCopyFlags;
    window.insertAfter = function(id) {
        showAddForm(id);
    };
    window.editComment = editComment;
    window.saveComment = saveComment;
    window.clearActivityLog = clearActivityLog;
    window.cancelEditComment = cancelEditComment;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
