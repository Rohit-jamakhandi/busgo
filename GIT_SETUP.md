# Git Setup Instructions

## Option 1: Install Git and Commit Locally

### Step 1: Install Git
1. Download Git from: https://git-scm.com/download/win
2. Run the installer (use default settings)
3. Restart your terminal/PowerShell

### Step 2: Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize and Commit
```bash
cd C:\Users\rohit\CascadeProjects\bus-ticketing-app

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete bus ticketing system with Stripe payment integration"
```

---

## Option 2: Push to GitHub

### Step 1: Create GitHub Repository
1. Go to: https://github.com/new
2. Repository name: `bus-ticketing-app`
3. Description: "Professional bus ticket booking system with Stripe payments"
4. Keep it **Private** (recommended) or Public
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Push Your Code
```bash
# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/bus-ticketing-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Option 3: Manual Backup (No Git)

### Create a ZIP Archive
1. Open File Explorer
2. Navigate to: `C:\Users\rohit\CascadeProjects`
3. Right-click on `bus-ticketing-app` folder
4. Select "Send to" → "Compressed (zipped) folder"
5. Name it: `bus-ticketing-app-backup-2025-10-01.zip`
6. Store in a safe location (OneDrive, Google Drive, etc.)

---

## Important Files to Commit

✅ **Include:**
- All `.js` files (server, routes, models, config)
- All `.ejs` files (views)
- All `.css` and `.json` files
- `README.md`, `PROJECT_SUMMARY.md`
- `.env.example` (template)
- `.gitignore`
- `package.json`, `package-lock.json`

❌ **Exclude (already in .gitignore):**
- `node_modules/` folder
- `.env` file (contains secrets!)
- Log files
- IDE folders (.vscode, .idea)

---

## Commit Message Examples

For future commits:
```bash
# After adding a feature
git add .
git commit -m "Add: Email notification feature"

# After fixing a bug
git commit -m "Fix: Seat selection validation issue"

# After updating UI
git commit -m "Update: Improve booking page design"

# After refactoring
git commit -m "Refactor: Optimize database queries"
```

---

## Quick Reference

### Check status
```bash
git status
```

### View commit history
```bash
git log --oneline
```

### Create a new branch
```bash
git checkout -b feature/new-feature
```

### Switch branches
```bash
git checkout main
```

---

## Project is Ready to Commit! 🎉

Your complete bus ticketing system is now ready to be version controlled and shared.
