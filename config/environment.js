// Environment configuration handler
const environment = {
  // Determine the client URL based on the environment
  getClientUrl: () => {
    // Vercel automatically sets VERCEL_URL
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    
    // Use provided CLIENT_URL environment variable
    if (process.env.CLIENT_URL) {
      return process.env.CLIENT_URL;
    }
    
    // Default to localhost for development
    return 'http://localhost:3000';
  },
  
  // Determine if we're in production
  isProduction: () => {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  },
  
  // Get the current environment
  getEnvironment: () => {
    if (process.env.VERCEL_ENV) {
      return process.env.VERCEL_ENV;
    }
    return process.env.NODE_ENV || 'development';
  },
  
  // Get database configuration
  getDatabaseConfig: () => {
    return {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      databaseUrl: process.env.DATABASE_URL
    };
  },
  
  // Get session configuration
  getSessionConfig: () => {
    return {
      secret: process.env.SESSION_SECRET,
      secure: environment.isProduction()
    };
  }
};

export default environment;