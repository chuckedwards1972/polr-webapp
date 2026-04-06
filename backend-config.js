// POLR Backend Configuration
// Connect frontend to your Node.js backend

window.POLR_BACKEND_CONFIG = {
  // Backend URL - Update this to your deployed backend URL
  BACKEND_URL: 'https://polr-backend-production.up.railway.app', // Change when deployed
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/password',
    
    // Dashboard
    DASHBOARD_STATS: '/api/dashboard/stats',
    
    // Members
    MEMBERS: '/api/members',
    MEMBER: '/api/members/:id',
    MEMBER_PROGRESS: '/api/members/:id/progress',
    MEMBER_LESSONS: '/api/members/:memberId/lessons',
    
    // LMS/Walk
    WALK_STEPS: '/api/lms/steps',
    COURSES: '/api/lms/courses',
    COURSE: '/api/lms/courses/:id',
    LESSON: '/api/lms/lessons/:id',
    COMPLETE_LESSON: '/api/lms/lessons/:lessonId/complete',
    
    // Housing
    HOUSING: '/api/housing',
    HOUSING_OCCUPANCY: '/api/housing/occupancy',
    HOUSE: '/api/housing/:id',
    
    // Workforce
    EMPLOYERS: '/api/workforce/employers',
    PLACEMENTS: '/api/workforce/placements',
    
    // Financial
    FINANCIAL_OVERVIEW: '/api/financial/overview',
    DONATIONS: '/api/financial/donations',
    EXPENSES: '/api/financial/expenses',
    
    // Admin
    USERS: '/api/admin/users',
    CAMPUSES: '/api/admin/campuses',
    MODULES: '/api/admin/modules',
    SITE_CONFIG: '/api/admin/site-config',
    AUDIT_LOG: '/api/admin/audit-log'
  },
  
  // Authentication
  AUTH_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer ',
  
  // Health check
  HEALTH_CHECK: '/api/health'
};

// Initialize POLR_API object to match frontend expectations
window.POLR_API = {
  // Base API method
  _request: async function(endpoint, options = {}) {
    const url = window.POLR_BACKEND_CONFIG.BACKEND_URL + endpoint;
    const token = localStorage.getItem('polr_token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    if (token) {
      config.headers[window.POLR_BACKEND_CONFIG.AUTH_HEADER] = 
        window.POLR_BACKEND_CONFIG.TOKEN_PREFIX + token;
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired - clear and redirect to login
          localStorage.removeItem('polr_token');
          localStorage.removeItem('polr_session');
          window.location.reload();
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  // Authentication
  auth: {
    login: async (credentials) => {
      const result = await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify(credentials)
        }
      );
      
      if (result.token) {
        localStorage.setItem('polr_token', result.token);
        localStorage.setItem('polr_session', JSON.stringify(result.user));
      }
      
      return result;
    },
    
    getProfile: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.PROFILE
      );
    },
    
    changePassword: async (passwordData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
        {
          method: 'PUT',
          body: JSON.stringify(passwordData)
        }
      );
    }
  },
  
  // Members
  members: {
    getAll: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.MEMBERS
      );
    },
    
    get: async (id) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.MEMBER.replace(':id', id)
      );
    },
    
    create: async (memberData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.MEMBERS,
        {
          method: 'POST',
          body: JSON.stringify(memberData)
        }
      );
    },
    
    update: async (id, memberData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.MEMBER.replace(':id', id),
        {
          method: 'PUT',
          body: JSON.stringify(memberData)
        }
      );
    },
    
    getProgress: async (id) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.MEMBER_PROGRESS.replace(':id', id)
      );
    }
  },
  
  // Dashboard
  dashboard: {
    getStats: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.DASHBOARD_STATS
      );
    }
  },
  
  // LMS
  lms: {
    getSteps: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.WALK_STEPS
      );
    },
    
    getCourses: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.COURSES
      );
    },
    
    getCourse: async (id) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.COURSE.replace(':id', id)
      );
    },
    
    getLesson: async (id) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.LESSON.replace(':id', id)
      );
    },
    
    completeLesson: async (lessonId, data) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.COMPLETE_LESSON.replace(':lessonId', lessonId),
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );
    }
  },
  
  // Housing
  housing: {
    getAll: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.HOUSING
      );
    },
    
    get: async (id) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.HOUSE.replace(':id', id)
      );
    },
    
    create: async (housingData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.HOUSING,
        {
          method: 'POST',
          body: JSON.stringify(housingData)
        }
      );
    },
    
    update: async (id, housingData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.HOUSE.replace(':id', id),
        {
          method: 'PUT',
          body: JSON.stringify(housingData)
        }
      );
    },
    
    getOccupancy: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.HOUSING_OCCUPANCY
      );
    }
  },
  
  // Workforce
  workforce: {
    getEmployers: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.EMPLOYERS
      );
    },
    
    createEmployer: async (employerData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.EMPLOYERS,
        {
          method: 'POST',
          body: JSON.stringify(employerData)
        }
      );
    },
    
    getPlacements: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.PLACEMENTS
      );
    },
    
    createPlacement: async (placementData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.PLACEMENTS,
        {
          method: 'POST',
          body: JSON.stringify(placementData)
        }
      );
    }
  },
  
  // Financial
  financial: {
    getOverview: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.FINANCIAL_OVERVIEW
      );
    },
    
    getDonations: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.DONATIONS
      );
    },
    
    createDonation: async (donationData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.DONATIONS,
        {
          method: 'POST',
          body: JSON.stringify(donationData)
        }
      );
    },
    
    getExpenses: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.EXPENSES
      );
    },
    
    createExpense: async (expenseData) => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.EXPENSES,
        {
          method: 'POST',
          body: JSON.stringify(expenseData)
        }
      );
    }
  },
  
  // Admin
  admin: {
    getUsers: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.USERS
      );
    },
    
    getCampuses: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.CAMPUSES
      );
    },
    
    getModuleConfig: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.MODULES
      );
    },
    
    getSiteConfig: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.SITE_CONFIG
      );
    },
    
    getAuditLog: async () => {
      return await window.POLR_API._request(
        window.POLR_BACKEND_CONFIG.ENDPOINTS.AUDIT_LOG
      );
    }
  },
  
  // Actions (for alerts, notifications, etc.)
  actions: {
    assignPrayer: async (residentId, member, assignedBy, actor) => {
      // This would need to be implemented in your backend
      return await window.POLR_API._request('/api/actions/assign-prayer', {
        method: 'POST',
        body: JSON.stringify({ residentId, member, assignedBy, actor })
      });
    },
    
    followUp: async (residentId, member, followDate, notes, actor) => {
      return await window.POLR_API._request('/api/actions/follow-up', {
        method: 'POST',
        body: JSON.stringify({ residentId, member, followDate, notes, actor })
      });
    },
    
    resolve: async (residentId, member, notes, actor) => {
      return await window.POLR_API._request('/api/actions/resolve', {
        method: 'POST',
        body: JSON.stringify({ residentId, member, notes, actor })
      });
    }
  }
};

// Backend connection check
window.POLR_BACKEND_LIVE = false;

// Health check function
window.checkBackendConnection = async function() {
  try {
    const response = await fetch(
      window.POLR_BACKEND_CONFIG.BACKEND_URL + window.POLR_BACKEND_CONFIG.HEALTH_CHECK
    );
    
    if (response.ok) {
      window.POLR_BACKEND_LIVE = true;
      console.log('âœ… Backend connected:', await response.json());
      return true;
    }
  } catch (error) {
    console.log('âš ï¸ Backend not available, using localStorage fallback');
    window.POLR_BACKEND_LIVE = false;
    return false;
  }
};

// Auto-check connection on load
setTimeout(window.checkBackendConnection, 1000);

