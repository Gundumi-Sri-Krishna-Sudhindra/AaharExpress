// Debug utility to examine and fix authentication state

export const debugAuthState = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log("=== Authentication Debug Info ===");
    console.log("Token exists:", !!token);
    
    if (!userStr) {
      console.log("No user data in localStorage");
      return null;
    }
    
    const userData = JSON.parse(userStr);
    console.log("User data:", {
      username: userData.username || "missing",
      id: userData.id || "missing",
      roles: userData.roles || "missing"
    });
    
    return userData;
  } catch (error) {
    console.error("Error debugging auth state:", error);
    return null;
  }
};

export const fixAuthRoles = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log("No user data to fix");
      return false;
    }
    
    const userData = JSON.parse(userStr);
    let needsFix = false;
    
    // Fix missing roles array
    if (!userData.roles || !Array.isArray(userData.roles)) {
      console.log("Fixing missing roles array");
      userData.roles = ['ROLE_CUSTOMER']; // Default to customer
      needsFix = true;
    }
    
    // Ensure roles are formatted correctly with ROLE_ prefix
    const formattedRoles = userData.roles.map(role => {
      if (typeof role !== 'string') return 'ROLE_CUSTOMER';
      
      // Convert to uppercase and add ROLE_ prefix if not present
      const upperRole = role.toUpperCase();
      if (!upperRole.startsWith('ROLE_')) {
        return `ROLE_${upperRole}`;
      }
      return upperRole;
    });
    
    // Check if we needed to reformat any roles
    if (JSON.stringify(formattedRoles) !== JSON.stringify(userData.roles)) {
      userData.roles = formattedRoles;
      needsFix = true;
      console.log("Reformatted roles:", formattedRoles);
    }
    
    // Save the fixed user data if needed
    if (needsFix) {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log("Fixed user data saved to localStorage");
      return true;
    }
    
    console.log("No fixes needed for user roles");
    return false;
  } catch (error) {
    console.error("Error fixing auth roles:", error);
    return false;
  }
};

export default {
  debugAuthState,
  fixAuthRoles
}; 