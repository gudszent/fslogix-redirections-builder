// FSLogix Redirections.xml Generator - Community Redirections
// Copyright (c) 2026 All Rights Reserved
// See LICENSE file for usage terms
//
// Community FSLogix Exclusions and Inclusions
// Add or modify entries here to customize quick add options
// Each entry can have multiple paths that will all be added together
// 
// Fields:
//   label        - Display name for the button
//   paths        - Array of paths (for single-type entries)
//   excludePaths - Array of paths to exclude (for mixed entries)
//   includePaths - Array of paths to include (for mixed entries)
//   shortPath    - Short description shown below label
//   comment      - Comment included in XML output (Application | Description)
//   type         - Redirection type: "1"=Exclude (default), "2"=Include, "mixed"=Both
//   copyFlags    - Copy attribute (excludes only): "0"=empty, "1"=from, "2"=to, "3"=both
//   proof        - Reference URL or notes for development (NOT included in XML)

const COMMUNITY_REDIRECTIONS = [
    {
        label: "Adobe Cache",
        paths: [
            "AppData\\Roaming\\com.adobe.formscentral.FormsCentralForAcrobat",
            "AppData\\Roaming\\Adobe\\Acrobat\\DC",
            "AppData\\Roaming\\Adobe\\SLData"
        ],
        shortPath: "Adobe (3 paths)",
        comment: "Adobe | Acrobat DC cache and licensing data",
        type: "1",
        copyFlags: "0",
        proof: "Adobe cache folders regenerate automatically"
    },
    {
        label: "Chrome",
        excludePaths: [
            "AppData\\Local\\Google\\Chrome\\",
            "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Service Worker",
            "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache",
            "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Code Cache"
        ],
        includePaths: [
            "AppData\\Local\\Google\\Chrome\\User Data"
        ],
        shortPath: "Chrome (4 excl, 1 incl)",
        comment: "Google Chrome | Cache exclusions with user data inclusion",
        type: "mixed",
        copyFlags: "0",
        proof: "Cache regenerates; User Data preserved per docs.jeffriechers.com"
    },
    {
        label: "Citrix Cache",
        paths: [
            "AppData\\Roaming\\ICAClient\\Cache"
        ],
        shortPath: "ICAClient\\Cache",
        comment: "Citrix Receiver | ICA client cache",
        type: "1",
        copyFlags: "0",
        proof: "Citrix client cache is session-specific"
    },
    {
        label: "Edge Cache",
        paths: [
            "AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Service Worker",
            "AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Cache",
            "AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Code Cache",
            "AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\blob_storage"
        ],
        shortPath: "Edge (4 paths)",
        comment: "Microsoft Edge | Browser cache, service workers, and blob storage",
        type: "1",
        copyFlags: "0",
        proof: "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-enterprise-sync"
    },
    {
        label: "Firefox Cache",
        paths: [
            "AppData\\Local\\Mozilla\\Firefox\\Profiles",
            "AppData\\Local\\Mozilla\\Firefox"
        ],
        shortPath: "Firefox (2 paths)",
        comment: "Mozilla Firefox | Browser cache and profile data",
        type: "1",
        copyFlags: "0",
        proof: "Firefox local cache separate from roaming profile"
    },
    {
        label: "Flash Player",
        paths: [
            "AppData\\Roaming\\Macromedia\\Flash Player\\macromedia.com\\support\\flashplayer\\sys\\",
            "AppData\\Roaming\\Macromedia\\Flash Player\\macromedia.com\\support\\flashplayer\\flashplayer\\#SharedObjects\\"
        ],
        shortPath: "Flash (2 paths)",
        comment: "Adobe Flash Player | Legacy shared objects and cache",
        type: "1",
        copyFlags: "0",
        proof: "Flash Player is deprecated, safe to exclude"
    },
    {
        label: "FSLogix Local",
        paths: [
            "AppData\\Local\\FSLogix"
        ],
        shortPath: "AppData\\Local\\FSLogix",
        comment: "FSLogix | Local agent data (must exclude)",
        type: "1",
        copyFlags: "0",
        proof: "FSLogix agent folder should never be in profile container"
    },
    {
        label: "Google Earth",
        paths: [
            "AppData\\LocalLow\\Google\\GoogleEarth\\Cache"
        ],
        shortPath: "GoogleEarth\\Cache",
        comment: "Google Earth | Map cache data",
        type: "1",
        copyFlags: "0",
        proof: "https://github.com/andy2002a/PowerShell - Google Earth cache"
    },
    {
        label: "IE/Web Cache",
        paths: [
            "AppData\\Local\\Microsoft\\Internet Explorer\\DOMStore",
            "AppData\\Local\\Microsoft\\Internet Explorer\\Recovery",
            "AppData\\Local\\Microsoft\\Windows\\WebCache",
            "AppData\\Local\\Microsoft\\Windows\\WebCache.old",
            "AppData\\Local\\Microsoft\\Windows\\Temporary Internet Files",
            "AppData\\Local\\Microsoft\\Windows\\IECompatCache",
            "AppData\\Local\\Microsoft\\Windows\\iecompatuaCache",
            "AppData\\Local\\Microsoft\\Windows\\PrivacIE",
            "AppData\\Local\\Microsoft\\Windows\\DNTException",
            "AppData\\Local\\Microsoft\\Windows\\INetCache"
        ],
        shortPath: "IE/Web (10 paths)",
        comment: "Internet Explorer | DOM storage, recovery, and cache",
        type: "1",
        copyFlags: "0",
        proof: "Legacy IE cache folders, safe to exclude"
    },
    {
        label: "Java",
        excludePaths: [
            "AppData\\Local\\Sun",
            "AppData\\Roaming\\Sun\\Java\\Deployment\\cache",
            "AppData\\Roaming\\Sun\\Java\\Deployment\\log",
            "AppData\\Roaming\\Sun\\Java\\Deployment\\tmp"
        ],
        includePaths: [
            "AppData\\LocalLow\\Sun\\Java\\Deployment\\security"
        ],
        shortPath: "Java (4 excl, 1 incl)",
        comment: "Oracle Java | Cache exclusions with security inclusion",
        type: "mixed",
        copyFlags: "0",
        proof: "Cache regenerates; Security preserved per docs.jeffriechers.com"
    },
    {
        label: "Office Cache",
        paths: [
            "AppData\\Local\\Microsoft\\Office\\16.0\\PowerQuery",
            "AppData\\Roaming\\Microsoft\\Document Building Blocks"
        ],
        shortPath: "Office (2 paths)",
        comment: "Microsoft Office | PowerQuery cache and document building blocks",
        type: "1",
        copyFlags: "0",
        proof: "https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings"
    },
    {
        label: "OneDrive Cache",
        paths: [
            "AppData\\Local\\Microsoft\\OneDrive\\logs",
            "AppData\\Local\\Microsoft\\OneDrive\\setup\\logs"
        ],
        shortPath: "OneDrive (2 paths)",
        comment: "Microsoft OneDrive | Sync logs and setup logs",
        type: "1",
        copyFlags: "0",
        proof: "https://learn.microsoft.com/en-us/sharepoint/sync-vdi-support"
    },
    {
        label: "OneNote Cache",
        paths: [
            "AppData\\Local\\Microsoft\\OneNote\\16.0\\cache\\tmp"
        ],
        shortPath: "OneNote cache\\tmp",
        comment: "Microsoft OneNote | Temporary cache files",
        type: "1",
        copyFlags: "0",
        proof: "OneNote temporary files regenerate automatically"
    },
    {
        label: "Outlook Cache",
        paths: [
            "AppData\\Local\\Microsoft\\Outlook",
            "AppData\\Local\\Microsoft\\Outlook\\RoamCache"
        ],
        shortPath: "Outlook (2 paths)",
        comment: "Microsoft Outlook | OST files and roam cache",
        type: "1",
        copyFlags: "0",
        proof: "https://learn.microsoft.com/en-us/outlook/troubleshoot/performance/office-365-slow-performance"
    },
    {
        label: "RDP Cache",
        paths: [
            "AppData\\Local\\Microsoft\\Terminal Server Client"
        ],
        shortPath: "Terminal Server Client",
        comment: "Remote Desktop | Connection cache and bitmap data",
        type: "1",
        copyFlags: "0",
        proof: "RDP bitmap cache regenerates on connection"
    },
    {
        label: "Spotify Cache",
        paths: [
            "AppData\\Local\\Spotify\\Storage",
            "AppData\\Local\\Spotify\\Data"
        ],
        shortPath: "Spotify (2 paths)",
        comment: "Spotify | Music cache and offline streaming data",
        type: "1",
        copyFlags: "0",
        proof: "Spotify caches music locally, regenerates on demand"
    },
    {
        label: "Teams Classic Cache",
        paths: [
            "AppData\\Local\\Microsoft\\Teams\\Packages\\SquirrelTemp",
            "AppData\\Roaming\\Microsoft\\Teams\\Service Worker\\CacheStorage",
            "AppData\\Roaming\\Microsoft\\Teams\\Application Cache",
            "AppData\\Roaming\\Microsoft\\Teams\\Cache",
            "AppData\\Roaming\\Microsoft\\Teams\\Code Cache",
            "AppData\\Roaming\\Microsoft Teams\\Logs",
            "AppData\\Roaming\\Microsoft\\Teams\\Media-Stack",
            "AppData\\Roaming\\Microsoft\\Teams\\meeting-addin\\Cache"
        ],
        shortPath: "Teams Classic (8 paths)",
        comment: "Microsoft Teams Classic | Cache, logs, media stack, and meeting addin",
        type: "1",
        copyFlags: "0",
        proof: "https://learn.microsoft.com/en-us/microsoftteams/teams-for-vdi"
    },
    {
        label: "Teams New (MSIX)",
        paths: [
            "AppData\\Local\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams\\Logs",
            "AppData\\Local\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams\\PerfLogs",
            "AppData\\Local\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Microsoft\\MSTeams\\EBWebView\\WV2Profile_tfw\\WebStorage"
        ],
        shortPath: "Teams New (3 paths)",
        comment: "Microsoft Teams New | MSIX app logs and WebView cache",
        type: "1",
        copyFlags: "0",
        proof: "https://learn.microsoft.com/en-us/microsoftteams/new-teams-vdi-requirements-deploy"
    },
    {
        label: "Token Broker",
        paths: [
            "AppData\\Local\\Microsoft\\TokenBroker\\Cache"
        ],
        shortPath: "TokenBroker\\Cache",
        comment: "Windows | Authentication token cache",
        type: "1",
        copyFlags: "0",
        proof: "Token cache is machine-specific for security"
    },
    {
        label: "User Folders",
        paths: [
            "Downloads",
            "Desktop",
            "Documents",
            "Favorites"
        ],
        shortPath: "User Folders (4 paths)",
        comment: "Windows | Standard user folders (use with ExcludeCommonFolders)",
        type: "1",
        copyFlags: "0",
        proof: "https://github.com/andy2002a/PowerShell - Common user folders to exclude"
    },
    {
        label: "VSCode Cache",
        paths: [
            "AppData\\Roaming\\Code\\Cache",
            "AppData\\Roaming\\Code\\CachedData",
            "AppData\\Roaming\\Code\\CachedExtensions",
            "AppData\\Roaming\\Code\\logs"
        ],
        shortPath: "VSCode (4 paths)",
        comment: "Visual Studio Code | Editor cache, extensions cache, and logs",
        type: "1",
        copyFlags: "0",
        proof: "VSCode regenerates cache on startup"
    },
    {
        label: "Webex Cache",
        paths: [
            "AppData\\Local\\webex",
            "AppData\\Local\\CiscoSparkLauncher",
            "AppData\\Local\\WebEx\\wbxcache"
        ],
        shortPath: "Webex (3 paths)",
        comment: "Cisco Webex | Meeting cache and launcher data",
        type: "1",
        copyFlags: "0",
        proof: "Webex cache regenerates on app start"
    },
    {
        label: "Windows Explorer",
        paths: [
            "AppData\\Local\\Microsoft\\Windows\\Explorer",
            "AppData\\Local\\Microsoft\\Windows\\RoamingTiles",
            "AppData\\Local\\Microsoft\\Windows\\SchCache",
            "AppData\\Local\\Microsoft\\Windows\\PRICache",
            "AppData\\Local\\Microsoft\\Windows\\AppCache",
            "AppData\\Local\\Microsoft\\Windows\\Application Shortcuts"
        ],
        shortPath: "Explorer (6 paths)",
        comment: "Windows Explorer | Thumbnail cache, tiles, and shortcuts",
        type: "1",
        copyFlags: "0",
        proof: "Explorer cache regenerates on user logon"
    },
    {
        label: "Windows Misc",
        paths: [
            "Saved Games",
            "Tracing",
            "AppData\\Local\\Microsoft\\Windows\\Mail",
            "AppData\\Local\\Microsoft\\Windows\\0030",
            "AppData\\Local\\Microsoft\\Media Player",
            "AppData\\Local\\Microsoft\\Messenger",
            "AppData\\Local\\Microsoft\\UEV",
            "AppData\\Local\\Microsoft\\MSOIdentityCRL\\Tracing",
            "AppData\\Roaming\\Microsoft\\Windows\\Network Shortcuts",
            "AppData\\Roaming\\Microsoft\\Windows\\Printer Shortcuts"
        ],
        shortPath: "Misc (10 paths)",
        comment: "Windows | Saved games, tracing, mail, and shortcuts",
        type: "1",
        copyFlags: "0",
        proof: "Miscellaneous Windows folders safe to exclude"
    },
    {
        label: "Windows Notifications",
        paths: [
            "AppData\\Local\\Microsoft\\Notifications",
            "AppData\\Local\\Microsoft\\Windows\\Notifications"
        ],
        shortPath: "Notifications (2 paths)",
        comment: "Windows | Notification cache and history",
        type: "1",
        copyFlags: "0",
        proof: "Notifications are session-specific"
    },
    {
        label: "Windows System Cache",
        paths: [
            "AppData\\Local\\ConnectedDevicesPlatform",
            "AppData\\Local\\Downloaded Installations",
            "AppData\\Local\\CEF",
            "AppData\\Local\\Comms",
            "AppData\\Local\\Deployment",
            "AppData\\Local\\VirtualStore",
            "AppData\\Local\\CrashDumps",
            "AppData\\Local\\Package Cache"
        ],
        shortPath: "System (8 paths)",
        comment: "Windows | System cache, deployments, and crash dumps",
        type: "1",
        copyFlags: "0",
        proof: "Windows system cache folders regenerate automatically"
    },
    {
        label: "Windows Temp",
        paths: [
            "AppData\\Local\\Temp"
        ],
        shortPath: "AppData\\Local\\Temp",
        comment: "Windows | Temporary files and session data",
        type: "1",
        copyFlags: "0",
        proof: "Standard Windows temp folder, always safe to exclude"
    },
    {
        label: "Zoom",
        paths: [
            "AppData\\Roaming\\Zoom"
        ],
        shortPath: "AppData\\Roaming\\Zoom",
        comment: "Zoom | Video conferencing data (Copy TO at sign-out)",
        type: "1",
        copyFlags: "2",
        proof: "Copy=2 preserves Zoom settings at sign-out per Microsoft recommendation"
    }
];
