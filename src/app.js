import {PLATFORM} from 'aurelia-pal';

export class App {
  constructor() {
    this.message = 'Layout';
  }

  configureRouter(config, router) {
    // basically these 3 lines are the problem.
    // i don't like hardcoding such things - this should always happen dynamically
    // any ideas?
    // var dynamicModuleName = 'views/layout';
    // PLATFORM.moduleName(dynamicModuleName); // this does not work
    PLATFORM.moduleName('views/layout');
    PLATFORM.moduleName('views/home');
    PLATFORM.moduleName('views/posts');

    config.title = 'SorenHoyer.com';
    config.options.pushState = true;

    config.map([
      {
        route: ['', ':url'], name: 'dynamic', navigationStrategy: instruction => {
          console.log(instruction);
          let rawUrl = instruction.fragment;
          // remove slash at beginning of url
          let url = (rawUrl === '/' ? '' : rawUrl.substring(1));

          // (simulated) try fetch content from db
          let db = new Map([
            ['home', {
              content: {
                id: 1,
                name: 'home'
              },
              template: {
                name: 'home',
                parent: 'layout'
              }
            }],
            ['posts', {
              content: {
                id: 2,
                name: 'posts'
              },
              template: {
                name: 'posts',
                parent: 'layout'
              }
            }]
          ]);

          let key = (url === '' ? 'home' : url);
          let data = db.get(key);

          // if content === null render 404 template

          // if content !== null continue
          let templateName = data.template.name;
          instruction.config.name = templateName;
          instruction.config.moduleId = `views/${templateName}`;
          instruction.config.href = instruction.fragment;
          instruction.config.nav = true;

          if (data.template && data.template.parent) {
            instruction.config.layoutView = `views/${data.template.parent}.html`;
            instruction.config.layoutViewModel = `views/${data.template.parent}`;
          }

          instruction.config.settings = data;
        }
      }
    ]);

    this.router = router;
  }
}
