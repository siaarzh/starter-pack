# Why current structure?

starter-pack repo consists of 2 parts:

* cli tool to generate simple sets of files (scaffolding) (`starter-pack-cli`)
* template for a new project (`template`)
  * several packages in this template are planned to be distributed via npm
  * to start a new project it should be enough to copy/paste template folder

Public packages from template have their own deps, so I created a script to collect their deps and return a comand that will install those deps into `template/node_modules`. This also helps with wallaby.js configuration file.

Though I think it might be problematic to keep those deps versions in sync and updated.
