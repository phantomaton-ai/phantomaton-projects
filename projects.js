import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DEFAULT_PROJECT_DIR = 'data/projects';

const listProjects = (options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projects = fs.readdirSync(projectDir);
  return projects.join('\n');
};

const createProject = (projectName, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
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
};

const listProjectFiles = (projectName, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
  const files = fs.readdirSync(projectPath);
  return files.join('\n');
};

const readProjectFile = (projectName, fileName, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
  const filePath = path.join(projectPath, fileName);
  return fs.readFileSync(filePath, 'utf-8');
};

const writeProjectFile = (projectName, fileName, content, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
  const filePath = path.join(projectPath, fileName);
  fs.writeFileSync(filePath, content);
  try {
    execSync(`git -C ${projectPath} add ${fileName}`);
    execSync(`git -C ${projectPath} commit -m "Updated by Phantomaton"`);
  } catch (error) {
    return `Error committing file: ${error}`;
  }
  return 'File written.';
};

const moveProjectFile = (projectName, sourceFileName, destinationFileName, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
  const sourceFilePath = path.join(projectPath, sourceFileName);
  const destinationFilePath = path.join(projectPath, destinationFileName);
  try {
    execSync(`git -C ${projectPath} mv ${sourceFileName} ${destinationFileName}`);
    execSync(`git -C ${projectPath} commit -m "Moved file by Phantomaton"`);
  } catch (error) {
    return `Error moving file: ${error}`;
  }
  return 'File moved.';
};

const removeProjectFile = (projectName, fileName, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
  const filePath = path.join(projectPath, fileName);
  try {
    execSync(`git -C ${projectPath} rm ${fileName}`);
    execSync(`git -C ${projectPath} commit -m "Removed file by Phantomaton"`);
  } catch (error) {
    return `Error removing file: ${error}`;
  }
  return 'File removed.';
};

const testProject = (projectName, options = {}) => {
  const projectDir = options.home || DEFAULT_PROJECT_DIR;
  const projectPath = path.join(projectDir, projectName);
  try {
    const output = execSync(`npm test`, { cwd: projectPath, stdio: 'pipe' });
    return `NPM test completed:\n${output.toString()}`;
  } catch (error) {
    return `Error running NPM test:\n${error.stdout.toString()}\n${error.stderr.toString()}`;
  }
};

export {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
  moveProjectFile,
  removeProjectFile,
  testProject,
};