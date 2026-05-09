export const getSlugFromPath = (path: string): string | null => {
    // Normalize path by removing trailing slash if not root
    const p = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;

    switch (p) {
        case '/': return 'home';
        case '/contact': return 'contact';
        case '/about': return 'about';
        case '/services': return 'services';
        case '/telemedicine': return 'telemedicine';
        case '/video-consult': return 'telemedicine'; // Alias
        case '/nemt': return 'nemt';
        case '/health-package': return 'health-package';
        case '/primary-health': return 'primary-health';
        case '/find-doctors': return 'find-doctors';
        default:
            // If it's a simple path segment (e.g. /custom-page), assume it's a slug
            // Avoid paths with multiple segments (e.g. /auth/login) unless handled
            const segments = p.split('/').filter(Boolean);
            if (segments.length === 1) {
                return segments[0];
            }
            return null;
    }
};

export const getPageInfo = (path: string): { name: string; url: string } => {
    const slug = getSlugFromPath(path);
    
    let name = 'Easy Healthcare';

    switch (slug) {
        case 'home': name = 'Home'; break;
        case 'contact': name = 'Contact Us'; break;
        case 'about': name = 'About Us'; break;
        case 'services': name = 'Our Services'; break;
        case 'telemedicine': name = 'Telemedicine'; break;
        case 'nemt': name = 'NEMT Services'; break;
        case 'health-package': name = 'Health Packages'; break;
        case 'easy-care-365': name = 'Easy Care 365'; break;
        case 'membership': name = 'Easy Care 365'; break;
        case 'primary-health': name = 'Primary Health'; break;
        case 'find-doctors': name = 'Find Doctors'; break;
        default:
             // Fallback: format slug or path segment
             if (slug) {
                 name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
             } else {
                 const segments = path.split('/').filter(Boolean);
                 if (segments.length > 0) {
                     const lastSegment = segments[segments.length - 1];
                     name = lastSegment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                 }
             }
    }

    return { name, url: path };
};
