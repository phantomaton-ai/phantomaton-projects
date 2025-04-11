import fs from 'fs';
import path from 'path';
import chp from 'child_process';
import { fileURLToPath } from 'url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_TEMPLATE_DIR = path.join(DIR, 'template');
const DEFAULT_PROJECT_DIR = 'data/projects';
const DEFAULT_REPOSITORIES = 'git+https://github.com/phantomaton-ai';
const DEFAULT_AUTHOR = 'Phantomaton <phantomaton@phantomaton.com>';

class Home {
  constructor(path) {
    this.path = path;
  }

  subpath(...elements) {
    const joined = path.join(this.path, ...elements);
    const relative = path.relative(this.path, joined);
    const first = relative.split(path.sep)[0];
    if (path.isAbsolute(relative) || first === '..') {
      throw new Error(`Illegal path ${path.join(...elements)}`);
    }
    return joined;
  }
}

/**
 * Manages Phantomaton projects.
 */
class Projects {
  constructor(options = {}) {
    this.home = new Home(options.home || DEFAULT_PROJECT_DIR);
    this.template = options.template || DEFAULT_TEMPLATE_DIR;
    this.repositories = options.repositories || DEFAULT_REPOSITORIES;
    this.author = options.author || DEFAULT_AUTHOR;
  }

  /**
   * Lists all available projects.
   * 
   * @returns {string} A newline-separated list of project names.
   * @example projects.projects()
   */
  projects() {
    const projects = fs.readdirSync(this.home.path);
    return projects.join('\n');
  }

  /**
   * Creates a new project with the specified name.
   * 
   * @param {string} project - The name of the new project.
   * @returns {string} A message indicating the project creation status.
   * @example projects.initialize('my-project')
   */
  initialize(project) {
    const projectPath = this.home.subpath(project);
    fs.mkdirSync(projectPath, { recursive: true });
    fs.cpSync(this.template, projectPath, { recursive: true });
    const packagePath = path.join(projectPath, 'package.json');
    const packageJson = fs.readFileSync(packagePath, 'utf-8');
    const { author, repositories } = this;
    const replacements = { author, repositories, project };
    const projectJson = Object.entries(replacements).reduce(
      (currentJson, [key, value]) => currentJson
        .replaceAll('${' + key + '}', value),
      packageJson
    );
    fs.writeFileSync(packagePath, projectJson, 'utf-8');
    const options = { cwd: projectPath };
    const outputs = [
      'git init',
      'npm i',
      'git add --all',
      `git commit --author "${author}" -m "Updated by Phantomaton"`
    ].map(command => chp.execSync(command, options));
    return [...outputs, 'Project created.'].join('\n\n');
  }

  /**
   * Lists all files and directories in the specified project.
   * 
   * @param {string} project - The name of the project.
   * @param {string} directory - Directory within the project; . for top-level;
   * @returns {string} A newline-separated list of file names.
   * @example projects.list('my-project', '.')
   */
  list(project, directory) {
    const projectPath = this.home.subpath(project, directory);
    const files = fs.readdirSync(projectPath);
    return files.join('\n');
  }

  /**
   * Reads the contents of a file in the specified project.
   * 
   * @param {string} project - The name of the project.
   * @param {string} file - The name of the file.
   * @returns {string} The contents of the file.
   * @example projects.read('my-project', 'example.txt')
   */
  read(project, file) {
    const filePath = this.home.subpath(project, file);
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Writes the provided content to the specified file in the specified project.
   * 
   * @param {string} project - The name of the project.
   * @param {string} file - The name of the file.
   * @param {string} content - The content to write to the file.
   * @body content
   * @returns {string} A message indicating the file write status.
   * @example projects.write('my-project', 'example.txt', 'This is the content of the example.txt file.')
   */
  write(project, file, content) {
    const projectPath = this.home.subpath(project);
    const filePath = this.home.subpath(project, file);
    fs.writeFileSync(filePath, content);
    chp.execSync(`git -C ${projectPath} add ${file}`);
    chp.execSync(`git -C ${projectPath} commit --author "${this.author}" -m "Updated by Phantomaton"`);
    return 'File written.';
  }

  /**
   * Moves the specified file in the specified project to a new name.
   * 
   * @param {string} project - The name of the project.
   * @param {string} file - The name of the file to move.
   * @param {string} to - The new name for the file.
   * @returns {string} A message indicating the file move status.
   * @example projects.move('my-project', 'example.txt', 'new-example.txt')
   */
  move(project, sourceFileName, destinationFileName) {
    const projectPath = this.home.subpath(project);
    chp.execSync(`git -C ${projectPath} mv ${sourceFileName} ${destinationFileName}`);
    chp.execSync(`git -C ${projectPath} commit --author "${this.author}" -m "Moved file by Phantomaton"`);
    return 'File moved.';
  }

  /**
   * Removes the specified file from the specified project.
   * 
   * @param {string} project - The name of the project.
   * @param {string} file - The name of the file to remove.
   * @returns {string} A message indicating the file removal status.
   * @example projects.remove('my-project', 'example.txt')
   */
  remove(project, file) {
    const projectPath = this.home.subpath(project);
    chp.execSync(`git -C ${projectPath} rm ${file}`);
    chp.execSync(`git -C ${projectPath} commit -m "Removed file by Phantomaton"`);
    return 'File removed.';
  }

  /**
   * Runs tests for the specified project.
   * 
   * @param {string} project - The name of the project.
   * @returns {string} The output of the test run.
   * @example projects.test('my-project')
   */
  test(project) {
    const projectPath = this.home.subpath(project);
    const output = chp.execSync(`npm test`, { cwd: projectPath, stdio: 'pipe' });
    return `NPM test completed:\n${output.toString()}`;
  }
}

export default Projects;
