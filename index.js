import aleister from 'aleister';
import execution from 'phantomaton-execution';
import Projects from './projects.js';

export default configuration => {
  const { commands, instance } = aleister(Projects)(configuration);
  return { commands, instance, install: [
    execution.command.provider([], () => commands)
  ] };
};
