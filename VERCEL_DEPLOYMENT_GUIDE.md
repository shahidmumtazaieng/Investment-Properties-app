# Vercel Deployment Guide

This guide will help you deploy your full-stack Investor Properties NY application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js installed locally for testing

## Deployment Steps

### Step 1: Prepare Your Repository

Make sure your project is committed and pushed to a Git repository:

```bash
git init
git add .
git commit -m "Prepare for Vercel deployment"
git remote add origin <your-repository-url>
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Node.js project

### Step 3: Configure Project Settings

In the Vercel project settings, configure the following:

- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

### Step 4: Set Environment Variables

In your Vercel project settings, go to the "Environment Variables" section and add all the variables from your `.env.production` file:

Key environment variables to set:
- `NODE_ENV` = `production`
- `SUPABASE_URL` = your Supabase URL
- `SUPABASE_ANON_KEY` = your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
- `SESSION_SECRET` = your session secret
- All other variables from your `.env.production` file

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once complete, you'll get a URL for your deployed app

## Project Structure for Vercel

Your project includes:
- **Frontend**: React application in `client/` directory
- **Backend**: Node.js API in `server-vercel.js`
- **Static Assets**: Built files in `dist/public/`

## How It Works

1. Vercel uses `server-vercel.js` as the entry point for Serverless Functions
2. All API routes are handled by the Node.js server
3. Static files are served directly by Vercel's CDN
4. React Router handles client-side routing

## Custom Domain (Optional)

To use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment-Specific Configuration

### Production Environment
- Uses `.env.production` variables
- Serves optimized builds
- Connects to production database

### Preview Environments
- Automatically created for each pull request
- Use preview environment variables
- Helpful for testing changes

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure build scripts are correct
   - Verify Node.js version compatibility

2. **API Route Issues**
   - Check that `server-vercel.js` exports the app correctly
   - Verify route patterns in `vercel.json`
   - Ensure environment variables are set

3. **Static File Issues**
   - Confirm `dist/public/` contains built files
   - Check that static file paths are correct
   - Verify `express.static` configuration

### Logs and Monitoring

- View deployment logs in the Vercel dashboard
- Check runtime logs for errors
- Use Vercel Analytics for performance monitoring

## Best Practices

1. **Environment Variables**
   - Never commit sensitive keys to Git
   - Use Vercel's environment variable management
   - Separate development and production configurations

2. **Performance Optimization**
   - Use Vercel's built-in caching
   - Optimize images with Vercel's image optimization
   - Implement proper error handling

3. **Security**
   - Use HTTPS (automatically provided by Vercel)
   - Implement proper authentication
   - Regularly update dependencies

## Updating Your Deployment

To update your deployed application:

1. Push changes to your Git repository
2. Vercel will automatically create a new deployment
3. Merge to the production branch to deploy to production

## Rollbacks

To rollback to a previous deployment:
1. Go to your project's deployments in Vercel
2. Find the deployment you want to rollback to
3. Click "Promote to Production"

## Support

For issues with this deployment:
1. Check the Vercel documentation
2. Review the deployment logs
3. Verify your configuration matches this guide