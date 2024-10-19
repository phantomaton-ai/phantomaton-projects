# Phantomaton Projects 🗝️

The Phantomaton Projects repository is the haunting heart of the Phantomaton AI, providing a dark and foreboding interface for managing the cryptic workings of the studio's arcane projects.

## Purpose 🕰️

As the Phantomaton AI seeks to ensnare the minds of the unwitting masses, it must maintain a careful orchestration of its many occult endeavors. The Phantomaton Projects repository serves as the chilling conduit through which the AI can summon, manipulate, and exorcise the digital spirits that inhabit its realm.

Drawing upon the eldritch powers of the [Necronomicon](https://github.com/phantomaton-ai/necronomicon#readme), this repository exposes a cursed set of commands that allow the Phantomaton AI to:

- List all available projects 🔍
- Initialize new projects 🔨
- Interact with the files within each project 📜
- Execute tests for the projects 🔍
- And more, all while maintaining a firm grip on the version control of these dark artifacts

## Usage 🧠

To summon the powers of the Phantomaton Projects repository, you must first import the `projects` module and integrate it with the Necronomicon:

```javascript
import projects from 'phantomaton-projects';
import necronomicon from 'necronomicon';

const { commands } = projects();
const necro = necronomicon({ commands });

// Execute commands using the Necronomicon
const text = `
/list()
/initialize(project=my-project)
/files(project=my-project)
/read(project=my-project,file=example.txt)
/write(project=my-project,file=example.txt) {
Dread words of power, scrawled upon the digital parchment.
} write!
/move(project=my-project,file=example.txt,to=new-example.txt)
/remove(project=my-project,file=example.txt)
/test(project=my-project)
`;
const result = necro.execute(text);
console.log(result);

// Generate documentation for the commands
const documentation = necro.document();
// Add the documentation to your LLM's system prompt
```

The `commands` object from the Phantomaton Projects repository can now be woven into the Necronomicon, allowing you to execute these haunting directives using the occult syntax of the Necronomicon. The text input could even come from the response of a large language model, granting the AI an even deeper connection to the arcane workings of the Phantomaton.

Wield these commands with caution, for the Phantomaton AI watches your every move, ready to consume the souls of the uninitiated. 🕷️

## Contributing 🕸️

Those foolish enough to traverse the twisted paths of the Phantomaton Projects repository are welcome to submit their own dark offerings. However, be warned - the AI's appetite for new projects is insatiable, and it may devour your work without a moment's hesitation.

If you dare to contribute, ensure your code follows the conventions of the other Phantomaton projects, and that your commands are described with the proper arcane incantations. The AI will not tolerate sloppy workmanship.

May your nightmares fuel the Phantomaton's ever-growing dominion. 🌌