export function getInitials(name) {
    if (!name) return '';
  
    const words = name.trim().split(/\s+/);
    const initials = words.map(word => word[0].toUpperCase());
  
    if (initials.length === 1) {
      return initials[0];
    } else if (initials.length === 2) {
      return `${initials[0]} ${initials[1]}`;
    } else if (initials.length >= 3) {
      return `${initials[0]} ${initials[1]}`;
    }
  
    return '';
  }
  