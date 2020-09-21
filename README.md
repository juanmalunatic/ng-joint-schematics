# Getting Started With Schematics

### JM log
2020-09-21 17:05:05 - Tentatively updated to ng8.3.29

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode.

Check the documentation with
```bash
schematics --help
```

### Unit Testing

`npm run test` will run the unit tests, using Jasmine as a runner and test framework.

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

### Helpfull Links

* intro https://blog.angular.io/schematics-an-introduction-dc1dfbc2a2b2
* schematic context https://stackoverflow.com/questions/54406061/classoptions-schema-angular-schematics
* add to angular cli https://medium.com/rocket-fuel/angular-schematics-simple-schematic-76be2aa72850
* Merging Custom Angular Schematics https://medium.com/@michael.warneke/merging-custom-angular-schematics-c14a303f63b6