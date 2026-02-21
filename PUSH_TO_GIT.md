# Push to Your Git Repository

Git is initialized and your first commit is ready. Follow these steps to push to your repository:

## 1. Create a repository on GitHub (if you haven't)

- Go to https://github.com/new
- Name it `kodbank-app` (or any name you prefer)
- **Do NOT** initialize with README (we already have one)
- Click Create repository

## 2. Add your remote and push

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repo name:

```bash
cd c:\Users\Sunil\Desktop\kodnest_project\kodbank-app

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**Example:** If your username is `sunil` and repo is `kodbank-app`:
```bash
git remote add origin https://github.com/sunil/kodbank-app.git
git branch -M main
git push -u origin main
```

## 3. If push asks for credentials

- **HTTPS:** Use your GitHub username and a Personal Access Token (not password)
- **SSH:** Use `git@github.com:YOUR_USERNAME/YOUR_REPO.git` as remote URL instead

Create a token at: https://github.com/settings/tokens
