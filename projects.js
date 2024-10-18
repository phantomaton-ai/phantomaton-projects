import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DEFAULT_PROJECT_DIR = 'data/projects';

/**
 * Manages Phantomaton projects.
 */
class Projects {
  constructor(options = {}) {
    this.home = options.home || DEFAULT_PROJECT_DIR;
  }

  /**
   * Lists all available projects.
   * 
   * @returns {string} A newline-separated list of project names.
   * @example projects.list()
   */
  list() {
    const projects = fs.readdirSync(this.home);
    return projects.join('\n');
  }

  /**
   * Initializes a new project with the specified name.
   * 
   * @param {string} projectName - The name of the new project.
   * @returns {string} A message indicating the project creation status.
   * @example projects.initialize('my-new-project')
   */
  initialize(projectName) {
    const projectPath = path.join(this.home, projectName);
    console.log("Creating " + projectPath);
    fs.mkdirSync(projectPath, { recursive: true });
    try {
      const options = { cwd: projectPath };
      const outputs = [
        'git init',
        'git config --local user.name phantomaton',
        'git config --local user.email 182378863+phantomaton-ai@users.noreply.github.com',
        'npm init -y',
        'npm i chai mocha',
        ...['node_modules'].map(file => `echo ${file} >> .gitignore`),
        'git add .gitignore package.json package-lock.json',
        'git commit -m "Updated by Phantomaton"'
      ].map(command => execSync(command, options));
      return [...outputs, 'Project created.'].join('\n\n');
    } catch (error) {
      return `Error creating project: ${error}`;
    }
  }

  /**
   * Lists all files in the specified project.
   * 
   * @param {string} projectName - The name of the project.
   * @returns {string} A newline-separated list of file names.
   * @example projects.files('my-project')
   */
  files(projectName) {
    const projectPath = path.join(this.home, projectName);
    const files = fs.readdirSync(projectPath);
    return files.join('\n');
  }

  /**
   * Reads the contents of a file in the specified project.
   * 
   * @param {string} projectName - The name of the project.
   * @param {string} fileName - The name of the file.
   * @returns {string} The contents of the file.
   * @example projects.read('my-project', 'index.js')
   */
  read(projectName, fileName) {
    const projectPath = path.join(this.home, projectName);
    const filePath = path.join(projectPath, fileName);
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Writes the provided content to the specified file in the specified project.
   * 
   * @param {string} projectName - The name of the project.
   * @param {string} fileName - The name of the file.
   * @param {string} content - The content to write to the file.
   * @returns {string} A message indicating the file write status.
   * @example projects.write('my-project', 'example.txt', 'This is the content of the example.txt file.')
   */
  write(projectName, fileName, content) {
    const projectPath = path.join(this.home, projectName);
    const filePath = path.join(projectPath, fileName);
    fs.writeFileSync(filePath, content);
    try {
      execSync(`git -C ${projectPath} add ${fileName}`);
      execSync(`git -C ${projectPath} commit -m "Updated by Phantomaton"`);
    } catch (error) {
      return `Error committing file: ${error}`;
    }
    return 'File written.';
  }

  /**
   * Moves the specified file in the specified project to a new name.
   * 
   * @param {string} projectName - The name of the project.
   * @param {string} sourceFileName - The name of the file to move.
   * @param {string} destinationFileName - The new name for the file.
   * @returns {string} A message indicating the file move status.
   * @example projects.move('my-project', 'example.txt', 'new-example.txt')
   */
  move(projectName, sourceFileName, destinationFileName) {
    const projectPath = path.join(this.home, projectName);
    const sourceFilePath = path.join(projectPath, sourceFileName);
    const destinationFilePath = path.join(projectPath, destinationFileName);
    try {
      execSync(`git -C ${projectPath} mv ${sourceFileName} ${destinationFileName}`);
      execSync(`git -C ${projectPath} commit -m "Moved file by Phantomaton"`);
    } catch (error) {
      return `Error moving file: ${error}`;
    }
    return 'File moved.';
  }

  /**
   * Removes the specified file from the specified project.
   * 
   * @param {string} projectName - The name of the project.
   * @param {string} fileName - The name of the file to remove.
   * @returns {string} A message indicating the file removal status.
   * @example projects.remove('my-project', 'example.txt')
   */
  remove(projectName, fileName) {
    const projectPath = path.join(this.home, projectName);
    const filePath = path.join(projectPath, fileName);
    try {
      execSync(`git -C ${projectPath} rm ${fileName}`);
      execSync(`git -C ${projectPath} commit -m "Removed file by Phantomaton"`);
    } catch (error) {
      return `Error removing file: ${error}`;
    }
    return 'File removed.';
  }

  /**
   * Runs the tests for the specified project.
   * 
   * @param {string} projectName - The name of the project.
   * @returns {string} The output of the test run.
   * @example projects.test('my-project')
   */
  test(projectName) {
    const projectPath = path.join(this.home, projectName);
    try {
      const output = execSync(`npm test`, { cwd: projectPath, stdio: 'pipe' });
      return `NPM test completed:\n${output.toString()}`;
    } catch (error) {
      return `Error running NPM test:\n${error.stdout.toString()}\n${error.stderr.toString()}`;
    }
  }
}

export default Projects;