import { expect } from 'chai';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import createProjects from './projects.js';

describe('Projects', () => {
  const tmpDir = path.join('tmp', uuidv4(), 'projects');

  beforeEach(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should list projects', () => {
    const projects = createProjects({ home: tmpDir });
    fs.mkdirSync(path.join(tmpDir, 'project1'));
    fs.mkdirSync(path.join(tmpDir, 'project2'));
    expect(projects.list()).to.equal('project1\nproject2');
  });

  it('should initialize a new project', () => {
    const projects = createProjects({ home: tmpDir });
    const output = projects.initialize('my-project');
    expect(output).to.include('Project created');
    expect(fs.existsSync(path.join(tmpDir, 'my-project'))).to.be.true;
  });

  it('should list files in a project', () => {
    const projects = createProjects({ home: tmpDir });
    projects.initialize('my-project');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file1.txt'), 'content1');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file2.txt'), 'content2');
    expect(projects.files('my-project')).to.equal('file1.txt\nfile2.txt');
  });

  it('should read a file in a project', () => {
    const projects = createProjects({ home: tmpDir });
    projects.initialize('my-project');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'example.txt'), 'Hello, world!');
    expect(projects.read('my-project', 'example.txt')).to.equal('Hello, world!');
  });

  it('should write a file in a project', () => {
    const projects = createProjects({ home: tmpDir });
    projects.initialize('my-project');
    projects.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    expect(fs.readFileSync(path.join(tmpDir, 'my-project', 'example.txt'), 'utf8')).to.equal('Hello, Phantomaton!');
  });

  it('should move a file in a project', () => {
    const projects = createProjects({ home: tmpDir });
    projects.initialize('my-project');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file1.txt'), 'content1');
    projects.move('my-project', 'file1.txt', 'file2.txt');
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'file1.txt'))).to.be.false;
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'file2.txt'))).to.be.true;
  });

  it('should remove a file in a project', () => {
    const projects = createProjects({ home: tmpDir });
    projects.initialize('my-project');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file1.txt'), 'content1');
    projects.remove('my-project', 'file1.txt');
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'file1.txt'))).to.be.false;
  });

  it('should test a project', () => {
    const projects = createProjects({ home: tmpDir });
    projects.initialize('my-project');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'package.json'), '{}');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'test.js'), 'console.log("Test passed");');
    expect(projects.test('my-project')).to.include('Test passed');
  });
});