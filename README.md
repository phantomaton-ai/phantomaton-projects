# Phantomaton Projects 🛠️

A plugin for the [Phantomaton](https://github.com/phantomaton-ai/phantomaton) framework that empowers AI assistants with commands to manage NPM-based project lifecycles and files.

## Overview 📖

`phantomaton-projects` provides a suite of commands enabling interaction with software projects stored on the local filesystem. It integrates with command execution systems like [phantomaton-execution](https://github.com/phantomaton-ai/phantomaton-execution) to allow assistants to:

*   List and initialize new project workspaces.
*   Read, write, move, and remove files within projects.
*   Automatically manage Git versioning for file operations.
*   Install NPM dependencies (`npm install`).
*   Run project tests (`npm test`).

Commands are invoked using a lightweight markup syntax like [Smarkup](https://github.com/phantomaton-ai/smarkup), allowing seamless integration into conversational AI workflows.

## Commands ✨

The following commands are exposed by this plugin:

*   **/projects()**
    *   **Description**: Lists all available projects managed by Phantomaton.
    *   **Example**: `/projects()`

*   **/initialize(project:string)**
    *   **Description**: Creates a new project directory based on a template, initializes Git, installs base dependencies (`npm i`), and performs an initial commit.
    *   **Example**: `/initialize(project:my-spooky-app)`

*   **/list(project:string, directory:string)**
    *   **Description**: Lists files and directories within a specified path of a project. Use `.` for the root.
    *   **Example**: `/list(project:my-spooky-app, directory:src)`

*   **/read(project:string, file:string)**
    *   **Description**: Reads and returns the UTF-8 content of a specified file.
    *   **Example**: `/read(project:my-spooky-app, file:package.json)`

*   **/write(project:string, file:string)**
    *   **Description**: Writes the provided text content to a file, creating directories if needed. Stages and commits the change via Git automatically.
    *   **Example**:
        ```smarkup
        /write(project:my-spooky-app, file:README.md) {
        # My Spooky App

        This app summons digital ghosts. 👻
        } write!
        ```

*   **/move(project:string, file:string, to:string)**
    *   **Description**: Renames or moves a file using `git mv` and commits the change.
    *   **Example**: `/move(project:my-spooky-app, file:old_notes.txt, to:docs/notes.md)`

*   **/remove(project:string, file:string)**
    *   **Description**: Removes a file using `git rm` and commits the change.
    *   **Example**: `/remove(project:my-spooky-app, file:temp/scratch.js)`

*   **/test(project:string)**
    *   **Description**: Executes `npm test` within the project's directory and returns the output.
    *   **Example**: `/test(project:my-spooky-app)`

*   **/install(project:string, module:string, development:string)**
    *   **Description**: Installs an NPM module using `npm install`. Set `development` to `"true"` for a dev dependency (`--save-dev`), `"false"` otherwise. Commits changes to `package.json` and `package-lock.json`.
    *   **Example (Runtime)**: `/install(project:my-spooky-app, module:express, development:false)`
    *   **Example (Dev)**: `/install(project:my-spooky-app, module:jest, development:true)`

## Usage Example (Integration) ⚙️

This module typically provides its commands via a command provider integrated using [phantomaton-plugins](https://github.com/phantomaton-ai/phantomaton-plugins) and [phantomaton-execution](https://github.com/phantomaton-ai/phantomaton-execution).

```javascript
// Simplified example within a Phantomaton plugin setup
import projects from 'phantomaton-projects';
import execution from 'phantomaton-execution';
import plugins from 'phantomaton-plugins';
import aleister from 'aleister'; // Assumes aleister is used for command generation

export default configuration => {
  // Instantiate the Projects class and generate commands
  const { commands: projectCommands } = aleister(projects)(configuration);

  // Provide the generated commands to the execution system
  return plugins.create([
    execution.command.provider([], () => projectCommands)
  ]);
};

// The Phantomaton instance can now execute this plugin's commands
// when they appear in processed text.
```

See the main [Phantomaton](https://github.com/phantomaton-ai/phantomaton) documentation for details on configuring plugin options like the project `home` directory.

## Contributing 🤝

Contributions are welcome! Please adhere to the project's code style and submit pull requests to the [Phantomaton Projects GitHub repository](https://github.com/phantomaton-ai/phantomaton-projects).

## License 📜

Licensed under the [MIT License](LICENSE).