# Phantomaton Projects 🛠️

Provides project management commands for the Phantomaton ecosystem, allowing creation, modification, and inspection of Phantomaton project workspaces.

## Overview 📖

This module integrates with the Phantomaton command execution system to offer capabilities for managing project lifecycles directly through the Phantomaton interface. It handles Git initialization, file operations with automatic commits, dependency management via NPM, and running project tests.

## Commands ✨

The following commands are provided by this module:

*   **`🪄✨ projects()`**
    *   **Description**: Lists all available projects managed by Phantomaton.
    *   **Example**: `🪄✨ projects()`

*   **`🪄✨ initialize(project:string)`**
    *   **Description**: Creates a new project directory, copies template files, initializes a Git repository, installs base dependencies, and performs an initial commit.
    *   **Example**: `🪄✨ initialize(project:my-new-haunt)`

*   **`🪄✨ list(project:string, directory:string)`**
    *   **Description**: Lists all files and directories within the specified directory of a given project. Use `.` for the project root.
    *   **Example**: `🪄✨ list(project:my-new-haunt, directory:.)`

*   **`🪄✨ read(project:string, file:string)`**
    *   **Description**: Reads and returns the content of a specific file within a project.
    *   **Example**: `🪄✨ read(project:my-new-haunt, file:package.json)`

*   **`🪄✨ write(project:string, file:string)`**
    *   **Description**: Writes the provided text content to a specified file within a project. Automatically stages and commits the change using Git.
    *   **Example**:
        ```smarkup
        🪄✨ write(project:my-new-haunt, file:NOTES.md) {
        This file contains important spectral observations. 👻