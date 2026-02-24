# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working on this repository.

---

## Repository Overview

**Repository:** `gus-bms/jibscan`
**Status:** This repository is newly initialized and currently empty. This CLAUDE.md serves as a foundation to be updated as the project grows.

---

## Project Structure

> Update this section once source files are added.

```
jibscan/
├── CLAUDE.md        # This file - AI assistant guidance
└── (project files to be added)
```

---

## Development Setup

> Fill in the actual setup steps once the project stack is determined.

### Prerequisites

- List required tools, runtimes, and their versions here
- Example: Node.js >= 18, Python >= 3.11, Go >= 1.21, etc.

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd jibscan

# Install dependencies (update with actual commands)
# npm install
# pip install -r requirements.txt
# go mod download
```

### Environment Variables

```bash
# Copy the example env file (if applicable)
cp .env.example .env
# Fill in required values
```

---

## Common Commands

> Replace placeholders below with actual commands once the stack is defined.

### Running the Application

```bash
# Development mode
# npm run dev / python main.py / go run . / etc.

# Production build
# npm run build / python -m gunicorn / go build -o bin/jibscan . / etc.
```

### Running Tests

```bash
# Run all tests
# npm test / pytest / go test ./... / etc.

# Run tests with coverage
# npm run test:coverage / pytest --cov / go test -cover ./... / etc.

# Watch mode (if applicable)
# npm run test:watch
```

### Linting and Formatting

```bash
# Lint
# npm run lint / flake8 . / golangci-lint run / etc.

# Format
# npm run format / black . / gofmt -w . / etc.

# Type checking (if applicable)
# npm run typecheck / mypy . / etc.
```

---

## Git Workflow

### Branch Naming

- Feature branches: `feature/<description>`
- Bug fixes: `fix/<description>`
- AI-generated branches: `claude/<task-id>`

### Commit Messages

Use clear, descriptive commit messages following this pattern:

```
<type>: <short summary>

<optional body with more detail>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Example:
```
feat: add user authentication endpoint

Implements JWT-based auth with refresh tokens.
```

### Pull Requests

- Keep PRs focused on a single concern
- Include a description of what changed and why
- Ensure all tests pass before requesting review

---

## Architecture and Conventions

> Update this section with actual architectural decisions once the codebase is established.

### Key Principles

- Document architectural decisions here as they are made
- Note any patterns or conventions the team agrees on
- Record important constraints or non-obvious design choices

### Directory Conventions

- Describe where different types of code live (e.g., handlers, models, utils)
- Describe how tests are organized relative to source files

### Naming Conventions

- Variables, functions, classes: describe the casing convention used
- Files and directories: describe the naming pattern
- Constants: describe the convention

---

## AI Assistant Guidelines

When working on this codebase:

1. **Read before editing** - Always read existing files before modifying them to understand context and conventions.
2. **Minimal changes** - Make only the changes needed for the task. Avoid refactoring unrelated code.
3. **Match style** - Follow the existing code style, naming conventions, and patterns already present.
4. **Test coverage** - Add or update tests for any code you add or modify.
5. **Branch discipline** - All work goes on the designated feature branch; never push directly to `main` without review.
6. **Update this file** - If you discover new conventions, commands, or architectural decisions, update this CLAUDE.md.

---

## Additional Notes

> Add project-specific notes, gotchas, known issues, or useful context here as the project evolves.

- This file should be kept up to date as the project grows
- When adding a new major dependency or tool, document the rationale here
