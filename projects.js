import fs from 'fs';
import path from 'path';
import chp from 'child_process';

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
   * Creates a new project with the specified name.
   * 
   * @param {string} project - The name of the new project.
   * @returns {string} A message indicating the project creation status.
   * @example projects.initialize('my-project')
   */
  initialize(project) {
    const projectPath = path.join(this.home, project);
    console.log("Creating " + projectPath);
    fs.mkdirSync(projectPath, { recursive: true });
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
    ].map(command => chp.execSync(command, options));
    return [...outputs, 'Project created.'].join('\n\n');
  }

  /**
   * Lists all files in the specified project.
   * 
   * @param {string} project - The name of the project.
   * @returns {string} A newline-separated list of file names.
   * @example projects.files('my-project')
   */
  files(project) {
    const projectPath = path.join(this.home, project);
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
    const projectPath = path.join(this.home, project);
    const filePath = path.join(projectPath, file);
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
    const projectPath = path.join(this.home, project);
    const filePath = path.join(projectPath, file);
    fs.writeFileSync(filePath, content);
    chp.execSync(`git -C ${projectPath} add ${file}`);
    chp.execSync(`git -C ${projectPath} commit -m "Updated by Phantomaton"`);
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
    const projectPath = path.join(this.home, project);
    const sourceFilePath = path.join(projectPath, sourceFileName);
    const destinationFilePath = path.join(projectPath, destinationFileName);
    chp.execSync(`git -C ${projectPath} mv ${sourceFileName} ${destinationFileName}`);
    chp.execSync(`git -C ${projectPath} commit -m "Moved file by Phantomaton"`);
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
    const projectPath = path.join(this.home, project);
    const filePath = path.join(projectPath, file);
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
    const projectPath = path.join(this.home, project);
    const output = chp.execSync(`npm test`, { cwd: projectPath, stdio: 'pipe' });
    return `NPM test completed:\n${output.toString()}`;
  }
}

export default Projects;