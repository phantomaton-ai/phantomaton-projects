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

  // Other methods remain the same
}

export default Projects;