import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DEFAULT_PROJECT_DIR = 'data/projects';

class Projects {
  constructor(options = {}) {
    this.home = options.home || DEFAULT_PROJECT_DIR;
  }

  list() {
    const projects = fs.readdirSync(this.home);
    return projects.join('\n');
  }

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

  files(projectName) {
    const projectPath = path.join(this.home, projectName);
    const files = fs.readdirSync(projectPath);
    return files.join('\n');
  }

  read(projectName, fileName) {
    const projectPath = path.join(this.home, projectName);
    const filePath = path.join(projectPath, fileName);
    return fs.readFileSync(filePath, 'utf-8');
  }

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

export default (options) => new Projects(options);