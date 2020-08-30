import {Configuration, InjectorService, OnDestroy, registerProvider} from "@tsed/common";
import {ConnectionOptions, ContainedType, getCustomRepository, useContainer} from "typeorm";
import {TypeORMService} from "./services/TypeORMService";

export class TypeORMModule implements OnDestroy {
  private settings: {[key: string]: ConnectionOptions};

  constructor(configuration: Configuration, private typeORMService: TypeORMService) {
    this.settings = configuration.get<{[key: string]: ConnectionOptions}>("typeorm") || {};
  }

  async init(): Promise<any> {
    const promises = Object.keys(this.settings).map((key) => this.typeORMService.createConnection(key, this.settings[key]));

    return Promise.all(promises);
  }

  $onDestroy(): Promise<any> | void {
    return this.typeORMService.closeConnections();
  }
}

registerProvider({
  provide: TypeORMModule,
  deps: [Configuration, TypeORMService, InjectorService],
  resolvers: [
    {
      deps: [TypeORMModule],
      get(type, options: any) {
        try {
          return getCustomRepository(type, options.connection || "default");
        } catch (er) {}
      },
    },
  ],
  injectable: false,
  async useAsyncFactory(configuration: Configuration, typeORMService: TypeORMService, injector: InjectorService) {
    useContainer(
      {
        get<T>(type: ContainedType<T>): T {
          return injector.hasProvider(type) ? injector.get<T>(type as any)! : undefined!;
        },
      },
      {fallback: true}
    );

    const typeORMModule = new TypeORMModule(configuration, typeORMService);
    await typeORMModule.init();

    return typeORMModule;
  },
});
