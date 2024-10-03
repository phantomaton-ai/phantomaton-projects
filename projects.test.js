import { expect } from 'chai';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import createProjects from './projects.js';

describe('Projects', () => {
  const tmpDir = path.join('tmp', uuidv4(), 'projects');
  const projects = createProjects({ home: tmpDir });

  beforeEach(() => {
    const cwd = path.join(tmpDir, 'my-project');
    fs.mkdirSync(cwd, { recursive: true });
    execSync('git init', { cwd });
  });

  it('lists projects', () => {
    fs.mkdirSync(path.join(tmpDir, 'project1'));
    fs.mkdirSync(path.join(tmpDir, 'project2'));
    expect(projects.list()).to.equal('my-project\nproject1\nproject2');
  });

  it('initializes new project', () => {
    expect(projects.initialize('new-project')).to.include('Project created');
    expect(fs.existsSync(path.join(tmpDir, 'new-project'))).to.be.true;
  }).timeout(5000);

  it('lists files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file1.txt'), 'content1');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file2.txt'), 'content2');
    expect(projects.files('my-project')).to.equal('.git\nfile1.txt\nfile2.txt');
  });

  it('reads files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'example.txt'), 'Hello, world!');
    expect(projects.read('my-project', 'example.txt')).to.equal('Hello, world!');
  });

  it('writes files in a project', () => {
    projects.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    expect(fs.readFileSync(path.join(tmpDir, 'my-project', 'example.txt'), 'utf8')).to.equal('Hello, Phantomaton!');
  });

  it('moves files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'f1.txt'), 'content1');
    execSync('git add f1.txt', { cwd: path.join(tmpDir, 'my-project') });
    projects.move('my-project', 'f1.txt', 'f2.txt');
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'f1.txt'))).to.be.false;
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'f2.txt'))).to.be.true;
  });

  it('removes files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'f1.txt'), 'content1');
    execSync('git add f1.txt', { cwd: path.join(tmpDir, 'my-project') });
    projects.remove('my-project', 'f1.txt');
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'f1.txt'))).to.be.false;
  });

  it('tests a project', () => {
    const packageJson = JSON.stringify({ scripts: { test: "echo Test passed" } });
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'package.json'), packageJson);
    expect(projects.test('my-project')).to.include('Test passed');
  });
});