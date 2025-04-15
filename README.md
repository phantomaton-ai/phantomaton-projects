# Phantomaton Projects 🛠️

Provides project management commands for the Phantomaton ecosystem, allowing creation, modification, and inspection of Phantomaton project workspaces.

## Overview 📖

This module integrates with the Phantomaton command execution system to offer capabilities for managing project lifecycles directly through the Phantomaton interface. It handles Git initialization, file operations with automatic commits, dependency management via NPM, and running project tests.

## Commands ✨

The following commands are provided by this module:

*   **/projects()**
    *   **Description**: Lists all available projects managed by Phantomaton.
    *   **Example**: `/projects()`

*   **/initialize(project:string)**
    *   **Description**: Creates a new project directory, copies template files, initializes a Git repository, installs base dependencies, and performs an initial commit.
    *   **Example**: `/initialize(project:my-new-haunt)`

*   **/list(project:string, directory:string)**
    *   **Description**: Lists all files and directories within the specified directory of a given project. Use `.` for the project root.
    *   **Example**: `/list(project:my-new-haunt, directory:.)`

*   **/read(project:string, file:string)**
    *   **Description**: Reads and returns the content of a specific file within a project.
    *   **Example**: `/read(project:my-new-haunt, file:package.json)`

*   **/write(project:string, file:string)**
    *   **Description**: Writes the provided text content to a specified file within a project. Automatically stages and commits the change using Git.
    *   **Example**:
        ```smarkup
        /write(project:my-new-haunt, file:NOTES.md) {
        This file contains important spectral observations. 👻
        } write!
        ```

*   **/move(project:string, file:string, to:string)**
    *   **Description**: Renames or moves a file within a project using `git mv`. Automatically commits the change.
    *   **Example**: `/move(project:my-new-haunt, file:NOTES.md, to:research/spectral-notes.md)`

*   **/remove(project:string, file:string)**
    *   **Description**: Removes a file from a project using `git rm`. Automatically commits the change.
    *   **Example**: `/remove(project:my-new-haunt, file:old-data.txt)`

*   **/test(project:string)**
    *   **Description**: Executes the test suite (`npm test`) within the specified project's directory.
    *   **Example**: `/test(project:my-new-haunt)`

*   **/install(project:string, module:string, development:string)**
    *   **Description**: Installs an NPM module within the specified project. Sets the `development` parameter to `"true"` to save as a dev dependency (`--save-dev`), otherwise set to `"false"`. Automatically stages and commits changes to `package.json` and `package-lock.json`.
    *   **Example (Runtime Dependency)**: `/install(project:my-new-haunt, module:lodash, development:false)`
    *   **Example (Dev Dependency)**: `/install(project:my-new-haunt, module:lovecraft, development:true)`

## Usage Example (with phantomaton-execution) ⚙️

```javascript
import projects from 'phantomaton-projects';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';

// Assuming a configured 'aleister' instance exists
// Get commands via aleister integration (as shown in index.js)
const { commands: projectCommands } = projects(); 

// Example of integrating commands into an execution context
export default plugins.create([
  execution.command.provider([], () => projectCommands)
]);

// Commands can then be invoked via Smarkup directives passed to the executor.
```

## Contributing 🤝

Contributions are welcome! Please ensure adherence to the existing code style (single-word variables, short files, ESM) and project structure. Submit pull requests to the [Phantomaton Projects GitHub repository](https://github.com/phantomaton-ai/phantomaton-projects).

## License 📜

Licensed under the [MIT License](LICENSE).