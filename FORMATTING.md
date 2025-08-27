# Code Formatting Setup

This project uses **Prettier** and **ESLint** to ensure consistent code formatting across all team members.

## Required VS Code Extensions

Install these extensions in VS Code:
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

## Setup Instructions

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **VS Code will automatically**:
   - Format files on save
   - Show linting errors
   - Apply consistent formatting

## Available Scripts

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check

# Fix ESLint issues
npm run lint:fix

# Run linting
npm run lint
```

## Team Guidelines

- **Enable "Format on Save"** in VS Code (should be automatic with our settings)
- **Don't disable Prettier** - it ensures everyone's code looks the same
- **Run `npm run format`** before committing if you see formatting changes
- **All team members should use the same VS Code extensions**

## Why This Matters

- **Prevents merge conflicts** caused by formatting differences
- **Maintains consistent code style** across the team
- **Saves time** during code reviews
- **Improves code readability**

## Formatting Rules

- **Semicolons**: Always use them
- **Quotes**: Double quotes for strings
- **Tab Width**: 2 spaces
- **Trailing Commas**: ES5 style
- **Print Width**: 80 characters
- **Arrow Parens**: Avoid when possible

If you have questions about the formatting setup, ask a team member! 🚀
