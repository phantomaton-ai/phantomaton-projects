import commands from './commands.js';

export default (options = {}) => ({ commands: commands(options) });
