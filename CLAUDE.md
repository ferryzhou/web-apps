# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **web-apps** repository - a collection of small, focused web applications and tools. The project is MIT licensed.

Inspired by Simon Willison's approach: each app should be a self-contained HTML+JavaScript tool that can be built quickly via AI-assisted development and reviewed/merged from anywhere (including mobile).

## Development Philosophy

### Async-Friendly Development
This repo is designed to work well with asynchronous coding agents:
- Each app should be small and self-contained
- PRs should be reviewable on mobile (keep changes focused)
- Prefer single-file HTML+JS tools when possible
- Design for "prompt and forget" workflows - fire off a task, review the PR later

### Human Stays in Control
- AI writes the code, but humans review and approve all changes
- The code quality depends on thoughtful review, not blind acceptance
- Always verify the generated code works as intended before merging

### General Principles
- Write clean, maintainable code with clear variable and function names
- Prefer simplicity over complexity
- Follow established patterns already present in the codebase
- Keep each tool focused on solving one specific problem

## Development Guidelines

### Web Development Best Practices
- Use semantic HTML elements
- Ensure accessibility (a11y) compliance
- Follow responsive design principles
- Optimize for performance (minimize bundle sizes, lazy load where appropriate)
- Prefer vanilla JS for simple tools; use frameworks only when complexity warrants it

### Security
- Never commit secrets, API keys, or credentials
- Sanitize user inputs to prevent XSS and injection attacks
- Use HTTPS for all external requests
- Follow OWASP security guidelines

### Code Style
- Use consistent formatting (consider adding Prettier/ESLint for JS/TS projects)
- Write descriptive commit messages
- Keep functions focused and single-purpose

## Common Commands

*Commands will be added here as the project evolves.*

## Project Structure

Each web app lives in its own directory with:
- `index.html` - Main entry point
- `README.md` - Brief description of what the tool does (optional for simple tools)
- Additional assets as needed (CSS, JS, images)

## Updating This File

When you discover something that would help future development sessions:
- Add common commands you find yourself typing repeatedly
- Document any architectural decisions or conventions
- Note any gotchas or warnings specific to this project
- Use the `#` key in Claude Code to quickly add instructions
