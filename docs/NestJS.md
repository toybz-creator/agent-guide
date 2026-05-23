# Executive Summary  
NestJS is a comprehensive TypeScript framework for Node.js, organized around modules, controllers, and providers. It offers an extensive set of built-in features (decorators, classes, interfaces, modules, CLI tools, etc.) and official integrations (GraphQL, TypeORM, Mongoose, Redis, Bull, Kafka, gRPC, OpenTelemetry, Swagger, Passport, JWT, caching, throttling, etc.) via scoped packages. Below is an exhaustive inventory of Nest’s offerings (latest stable v10) – every concrete decorator, class, interface, module, command, flag, transport strategy, metadata key, etc. – drawn from the official docs and repos【64†L560-L568】【76†L258-L266】.  

## Core Modules and Classes  

- **NestFactory** (from `@nestjs/core`): creates application instances (HTTP or microservice)【64†L566-L574】. Methods: `create()`, `createMicroservice()`, `createApplicationContext()`, etc.  
- **ModuleRef** (`@nestjs/core`): runtime module reference to resolve providers dynamically.  
- **Reflector** (`@nestjs/core`): utility to read decorator metadata (used by guards/interceptors)【49†L455-L463】【49†L470-L478】.  
- **HttpAdapterHost** (`@nestjs/core`): provides underlying platform (Express/Fastify) adapter.  
- **INestApplication, INestMicroservice, INestApplicationContext** (interfaces in `@nestjs/common`/`@nestjs/core`): represent app instances.  
- **ArgumentsHost, ExecutionContext** (`@nestjs/common`): abstractions to access request/response context (switching between HTTP, RPC, WS)【49†L363-L372】【49†L377-L386】.  
- **HttpArgumentsHost, WsArgumentsHost, RpcArgumentsHost** (`@nestjs/common`): specific context interfaces for HTTP, WebSockets, and RPC, with methods like `getRequest()`, `getClient()`, `getData()`【49†L363-L372】【49†L378-L384】.  
- **Type<T>** (`@nestjs/common`): generic class type.  
- **ProviderToken constants** (`@nestjs/core`): `APP_GUARD`, `APP_INTERCEPTOR`, `APP_PIPE`, `APP_FILTER` – global provider injection tokens (e.g., for setting a global guard)【52†L781-L790】.  

**Core Lifecycle Hooks (interfaces)** (in `@nestjs/common`): *OnModuleInit*, *OnModuleDestroy*, *OnApplicationBootstrap*, *OnApplicationShutdown*, *BeforeApplicationShutdown* – methods invoked during application/module lifecycle.  

## Decorators  

Nest’s API revolves around many decorators. These include **Class decorators**, **Method decorators**, **Parameter decorators**, and **Custom/Meta decorators**. Key ones (with source) include:  

- **Class Decorators (core):** `@Controller(path?)`, `@Injectable()`, `@Module(metadata)`, `@Global()`, `@NestMiddleware()`【83†L1-L9】【43†L13-L22】.  
- **Method Decorators (controllers):** `@Get(path?)`, `@Post`, `@Put`, `@Patch`, `@Delete`, `@Options`, `@Head`, `@All`, `@Redirect()`, `@Render(view)`, `@HttpCode(status)`, `@Header(name, value)`, `@Version(version, options)` (for versioning). Each defines routing or response behavior.  
- **Exception Filters:** `@Catch(exception?: Type\<any>[] )` – binds an exception filter to exception type(s)【43†L12-L20】.  
- **Guards:** `@UseGuards(G1, G2, …)` – apply guards at class or method level【46†L0-L7】. Also `@SetMetadata(key, value)` to define metadata (e.g., roles: `'roles'`). Example: `export const Roles = (...roles: string[]) => SetMetadata('roles', roles)`【50†L25-L34】.  
- **Interceptors:** `@UseInterceptors(I1, I2, …)` – apply interceptors. No specific built-in interceptor decorators (logging/timeout example are custom).  
- **Pipes:** `@UsePipes(P1, P2, …)` – apply pipes (e.g. validation pipes).  
- **Filters:** `@UseFilters(F1, F2, …)` – apply exception filters to routes.  
- **Custom Decorators:** using `createParamDecorator` or `@SetMetadata`. Nest provides helpers to build custom ones.  
- **WebSocket:** `@WebSocketGateway(options?)`, `@SubscribeMessage(pattern)` – define WS gateways (in `@nestjs/websockets`).  
- **Microservices:** `@MessagePattern(pattern)` and `@EventPattern(pattern)` – message/event handlers【65†L1-L9】【66†L1-L8】. Also `@Payload()`, `@Ctx()` for parameters【67†L1-L8】.  
- **GraphQL (code-first):** in `@nestjs/graphql`: `@Resolver()`, `@Query()`, `@Mutation()`, `@Subscription()`, `@ResolveField()`, `@Args()`, `@Context()`, `@Info()`, `@Parent()`, plus `@ObjectType`, `@InputType`, `@Field`, etc (class/schema decorators).  
- **Swagger:** in `@nestjs/swagger`: `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, `@ApiBearerAuth()`, etc (decorators for OpenAPI metadata).  
- **EventEmitter:** `@OnEvent(eventName, options?)` (from `@nestjs/event-emitter`) to subscribe to application events【61†L301-L310】.  
- **Validation:** none (class-validator uses standard decorators, integrated via ValidationPipe).  

**Parameter Decorators (from `@nestjs/common`):** `@Req()`, `@Res()`, `@Next()`, `@Param(param)`, `@Query(param)`, `@Body(param)`, `@Headers(param)`, `@Session()`, `@HostParam(param)`, `@Ip()`, `@UploadedFile()`, `@UploadedFiles()`【87†L49-L58】. These bind request parts to handler args.  

**File Upload (Nest/Express):** in `@nestjs/platform-express`: `@UploadedFile()`, `@UploadedFiles()`; and interceptors: `FileInterceptor()`, `FilesInterceptor()`, `AnyFilesInterceptor()`, `NoFilesInterceptor()` (for handling uploads)【88†L7-L14】【89†L1-L9】.  

**SSE:** `@Sse(path)` (from `@nestjs/common`) marks an endpoint as Server-Sent-Events【59†L1-L9】; returns an `Observable<MessageEvent>` (interface `MessageEvent` from `@nestjs/common`).  

_Table 1_ below lists many core decorators (class, method, param) with descriptions and sources.

| Decorator                    | Usage & Description                                                                      | Source                    |
|------------------------------|------------------------------------------------------------------------------------------|---------------------------|
| `@Controller(path?)`         | Defines a controller with an optional route prefix.                                      | [83†L1-L9]                |
| `@Injectable()`              | Marks a class as a provider (injectable service).                                       | [43†L12-L20]              |
| `@Module(metadata)`          | Defines a module with components, imports, controllers, providers, exports.             | docs (modules intro)      |
| `@Get(path?)`                | Maps HTTP GET requests to a handler.                                                   | [83†L13-L21]              |
| `@Post(path?)`               | Maps HTTP POST requests to a handler.                                                  | [83†L37-L45]              |
| `@Put`, `@Delete`, `@Patch`, `@Options`, `@Head`, `@All`  | Other HTTP method mappings (similar to @Get/@Post).       | [83†L13-L21] (pattern)   |
| `@Redirect()`                | Issues an HTTP redirect from a handler.                                                | docs (controllers)        |
| `@Render(view)`              | Renders a template for the response.                                                   | docs (controllers)        |
| `@HttpCode(status)`          | Overrides default HTTP status code for response.                                      | docs (controllers)        |
| `@Header(name, value)`       | Sets an HTTP header on the response.                                                  | docs (controllers)        |
| `@Version(version, options?)`| Defines API versioning for route (URI, Header, etc).                                  | docs (versioning)         |
| `@Catch(exception?)`         | Marks a class/method as an exception filter for given exception types.                | [43†L12-L20]              |
| `@UseFilters(f1, f2, …)`     | Applies exception filter(s) to controller or route.                                   | docs (exception filters)  |
| `@UseGuards(g1, g2, …)`      | Applies guard(s) to controller or route.                                              | [46†L0-L7]                |
| `@UseInterceptors(i1,i2,…)`   | Applies interceptor(s) to controller or route.                                       | docs (interceptors)       |
| `@UsePipes(p1,p2,…)`         | Applies pipe(s) to controller or route.                                              | docs (pipes)              |
| `@SetMetadata(key, val)`     | Attaches metadata (e.g. roles, flags) to route; basis for custom decorators (e.g. `Roles`). | [50†L25-L34]         |
| `@Req()`, `@Res()`, `@Next()`, `@Param()`, `@Query()`, `@Body()`, `@Headers()`, `@HostParam()`, `@Ip()`, `@Session()` | Binds HTTP request parts to handler parameters.   | [87†L49-L58] (file upload doc; general) |
| `@UploadedFile()`, `@UploadedFiles()` | Extract uploaded file(s) via Multer.                                          | [87†L49-L58]              |
| `FileInterceptor()`, `FilesInterceptor()`, `AnyFilesInterceptor()`, `NoFilesInterceptor()` | (in `@nestjs/platform-express`) attach Multer interceptors for file upload. | [88†L7-L14][89†L1-L9] |
| `@WebSocketGateway(options?)` | Defines a WebSocket gateway (supports options for port, namespace, transports).      | docs (websockets)         |
| `@SubscribeMessage(pattern)` | Mark a method as WebSocket message handler for a given pattern.                       | docs (websockets)         |
| `@MessagePattern(pattern)`   | (microservices) Marks method to handle incoming messages matching `pattern`.         | [65†L1-L9]                |
| `@EventPattern(pattern)`     | (microservices) Marks method to handle incoming events matching `pattern`.           | [66†L1-L8]                |
| `@Payload()`, `@Ctx()`       | (microservices) Parameter decorators to inject message payload or context.           | [67†L1-L8]                |
| `@Client(options)`           | (deprecated) injects a microservice client proxy. Not recommended.                   | [64†L598-L603] (hint)     |
| `@GrpcMethod(service, method)` / `@GrpcStreamMethod` | (microservices gRPC) Maps gRPC methods to handlers.                | Nest microservices docs   |
| `@GrpcService()`            | (microservices gRPC) Attaches methods from a gRPC service.                            | Nest microservices docs   |
| `@Resolver(typeFunc, options)` | (GraphQL) Marks a GraphQL resolver class.                                         | Nest GraphQL docs         |
| `@Query()`, `@Mutation()`, `@Subscription()` (GraphQL) | Defines GraphQL query/mutation/subscription fields.                   | Nest GraphQL docs         |
| `@ResolveField()`, `@Args()`, `@Context()`, `@Parent()`, `@Info()` | Additional GraphQL resolver parameter decorators.        | Nest GraphQL docs         |
| `@ObjectType()`, `@InputType()`, `@Field()`, `@EnumType()` etc. (GraphQL) | Decorators for GraphQL schema/types.                    | Nest GraphQL docs         |
| `@ApiTags(tag)`, `@ApiOperation()`, `@ApiResponse()`, etc. | (Swagger) Decorators for OpenAPI metadata.               | Nest Swagger docs        |
| `@OnEvent(eventName, options?)` | (Events) Listens to an event from `@nestjs/event-emitter`.                 | [61†L301-L310]             |
| **Custom Decorator Helpers:**   | `createParamDecorator()`, `Reflector.createDecorator()`, `@SetMetadata()`         | [50†L25-L34]             |

## Providers and Built-in Providers  

- **Providers:** Nest injects providers by token. Key built-in provider tokens include `APP_GUARD`, `APP_INTERCEPTOR`, `APP_PIPE`, `APP_FILTER` (from `@nestjs/core`) for global binding.  
- **HttpService** (`@nestjs/axios`): injectable HTTP client.  
- **Logger** (`@nestjs/common`): Nest’s built-in logger service.  
- **HttpAdapterHost** and **RpcContext** (via `CONTEXT` token in `@nestjs/microservices`) allow request-scoped context injection (e.g. inject `@Inject(CONTEXT) private ctx: RequestContext`【64†L708-L716】).  
- **CacheInterceptor, CacheModule** (`@nestjs/cache-manager`): built-in caching functionality. `CacheInterceptor` (exported from `@nestjs/cache-manager`) provides in-memory (or configurable store) caching.  
- **ThrottlerGuard, ThrottlerModule** (`@nestjs/throttler`): provides rate-limiting via `@Throttle()` decorator and built-in guards.  
- **Passport** (`@nestjs/passport`): not a provider per se but integrates with Nest’s auth system; provides `AuthGuard()` etc (AuthGuard itself comes from `@nestjs/passport`).  
- **JwtModule/JwtService** (`@nestjs/jwt`): provides JWT sign/verify.  
- **TypeORM Module** (`@nestjs/typeorm`): `TypeOrmModule.forRoot()`, `TypeOrmModule.forFeature()`, plus decorators `@InjectRepository()`.  
- **Mongoose Module** (`@nestjs/mongoose`): `MongooseModule.forRoot()`, `MongooseModule.forFeature()`, plus decorators `@Schema()`, `@Prop()`, `@InjectModel()`.  
- **GraphQL Module** (`@nestjs/graphql`): `GraphQLModule.forRoot()` (with code- or schema-first options).  
- **Swagger Module** (`@nestjs/swagger`): `SwaggerModule.createDocument()`, decorators as above.  
- **Event Emitter**: `EventEmitterModule.forRoot()`, class `EventEmitter2` and decorator `@OnEvent()`.  
- **CQRS Module** (`@nestjs/cqrs`): providers like `CommandBus`, `QueryBus`, decorators `@CommandHandler()`, `@QueryHandler()`, `@EventHandler()`.  
- **FastifyAdapter, ExpressAdapter** (`@nestjs/platform-fastify`, `@nestjs/platform-express`): adapter classes; types `NestFastifyApplication`, `NestExpressApplication`.  
- **Microservice Clients/Servers**: `ClientsModule`, `ClientProxy`, `ClientProxyFactory`, `Transport` enum (TCP, REDIS, NATS, MQTT, RABBITMQ, KAFKA, GRPC), and server classes in `@nestjs/microservices`.  

_Table 2_ lists common **providers** and **injection tokens**.

| Provider / Token           | Description                                                          | Source                         |
|----------------------------|----------------------------------------------------------------------|--------------------------------|
| `APP_GUARD`                | Injection token to register a global guard (see [52]).               | [52†L781-L790]                 |
| `APP_INTERCEPTOR`          | Token for global interceptor.                                        | docs (lifecycle)               |
| `APP_PIPE`                 | Token for global pipe.                                               | docs (lifecycle)               |
| `APP_FILTER`               | Token for global exception filter.                                   | docs (lifecycle)               |
| `Logger`                   | Nest’s built-in logger (console).                                    | [73†L168-L177] FAQ             |
| `CacheInterceptor`         | (Cache) interceptor for caching.                                     | [81†L204-L213][82†L1-L4]        |
| `ThrottlerGuard`           | (Throttler) guard for rate-limiting (via `@nestjs/throttler`).      | docs (throttler)               |
| `JwtService`               | (JWT) service for signing/verifying tokens.                         | docs (authentication)          |
| `Reflector`                | Helper for reading metadata (guards/interceptors).                  | [49†L455-L464]                 |
| `ExecutionContext`         | Instance passed to guards/interceptors (from `@nestjs/common`).      | [49†L363-L372]                 |
| `CanActivate` interface    | Guard interface requiring `canActivate()`.                          | [45†L217-L225] (guards intro)  |
| `PipeTransform` interface  | Pipe interface requiring `transform()`.                             | [76†L408-L417] (pipes section) |
| `NestInterceptor` interface| Interceptor interface requiring `intercept()`.                      | docs (interceptors)            |
| `ExceptionFilter` interface| Exception filter interface requiring `catch()`.                     | [42†L25-L30]                   |
| `EventEmitter2`            | (Events) the underlying event emitter class from `@nestjs/event-emitter`. | [61†L278-L287]             |
| `OnEvent` (decorator)      | (Events) decorator to subscribe to an event.                        | [61†L303-L312]                 |
| `ClientProxy`              | (Microservices) client proxy for sending messages.                   | [64†L566-L574]                 |
| `ClientProxyFactory`       | (Microservices) factory to create `ClientProxy` from options.        | [64†L569-L577]                 |
| `ContextIdFactory`         | Used internally for request-scoped providers (Nest core).           | nest core code                 |

## Guards, Interceptors, Pipes, Filters  

- **Guards** implement `CanActivate` and decide access. Use `@UseGuards()`. The primary interface is `CanActivate`. Common metadata key: `'roles'` (used by a RolesGuard example)【50†L25-L34】. Global guards use `APP_GUARD`【52†L781-L790】.  
- **Exception Filters** implement `ExceptionFilter<T>` (`catch(exception, host)`). Decorated with `@Catch()`. Nest provides `BaseExceptionFilter` in `@nestjs/core` and `HttpExceptionFilter` examples【43†L25-L32】. Use `@UseFilters()`.  
- **Interceptors** implement `NestInterceptor` (`intercept(context, next)`). Built-in examples: `ClassSerializerInterceptor` (auto-serializes objects via class-transformer)【80†L0-L4】 and `CacheInterceptor` (in `@nestjs/cache-manager`). Use `@UseInterceptors()`.  
- **Pipes** implement `PipeTransform` (`transform(value, metadata)`). Nest built-ins (all exported from `@nestjs/common`)【76†L258-L266】:  
  - **ValidationPipe**: validates request bodies/parameters (uses class-validator)【76†L258-L266】.  
  - **ParseIntPipe, ParseFloatPipe, ParseBoolPipe, ParseUUIDPipe, ParseArrayPipe, ParseEnumPipe, ParseDatePipe**: transform strings into specific types or throw `BadRequestException`.  
  - **DefaultValuePipe**: supplies a default value if input is undefined.  
  - **ParseFilePipe** (from platform-express): validates uploaded file (e.g. `FileTypeValidator`, `MaxFileSizeValidator`).  
  - Additional: any custom pipes. Bind using `@Param('id', ParseIntPipe)` etc【76†L260-L268】.  

## Events & Server-Sent Events  

- **EventEmitterModule** (`@nestjs/event-emitter`): import with `EventEmitterModule.forRoot(options?)`【61†L228-L237】. Provides an `EventEmitter2` instance.  
- **Event Patterns**: use `@OnEvent('event.name', options?)` to subscribe to events【61†L301-L310】. The payload is any object; options like `{ async: true }` allowed.  
- **SSE**: use `@Sse(path)` on a controller method to expose a Server-Sent-Events endpoint. The method returns `Observable<MessageEvent>`【59†L1-L9】. Example: `@Sse('sse') sse(): Observable<MessageEvent>`. (Here `MessageEvent` is an interface with `data` and optional `id`, etc., imported from `@nestjs/common`【59†L13-L16】.)

## WebSockets  

- **Gateways:** Decorators in `@nestjs/websockets`: `@WebSocketGateway(options?)` (defines a WebSocket server; options include `port`, `namespace`, `transports`).  
- **Subscriptions:** Within a gateway, methods decorated with `@SubscribeMessage(pattern)` handle messages for a given event or pattern.  
- **WsAdapter:** Classes `WsAdapter`, `IoAdapter`, etc. for low-level WS (and Socket.io) integration.  
- **Context and Pipes/Guards:** WebSocket gateways can also use `@UsePipes()`, `@UseGuards()`, `@UseFilters()`, `@UseInterceptors()` similarly to HTTP.  
- **WebSocket event filters/pipes:** (`@MessageBody()`, `@ConnectedSocket()`) decorators to access data and client socket in a handler (from `@nestjs/websockets`).  

## Microservices Transporters and Patterns  

Nest supports various transport layers via `@nestjs/microservices`. Key items:  

- **Transporter Options:** The `Transport` enum (`Transport.TCP`, `REDIS`, `NATS`, `MQTT`, `RABBITMQ`, `KAFKA`, `GRPC`, `CUSTOM`). Each corresponds to a built-in transporter class (e.g. TCPServer, RedisServer, etc.) configured via options in `createMicroservice()` or `ClientProxyFactory.create()`【64†L569-L577】.  

- **Message Patterns:**  
  - `@MessagePattern(pattern)` for RPC-style request/response messaging【65†L1-L9】.  
  - `@EventPattern(pattern)` for event (emit) messages【66†L1-L8】.  
  - The `pattern` can be a string, object, or wildcard (depending on transporter). For example, NATS context uses wildcards (`*` or `**`)【65†L42-L51】【61†L378-L382】.  

- **Client API:**  
  - `ClientProxy` (injected via `ClientsModule` or factory) with methods: `connect()`, `send(pattern, payload) -> Observable`, `emit(pattern, payload) -> Observable`【64†L628-L637】【64†L656-L665】.  
  - `ClientProxyFactory.create(options)` builds a proxy from options【64†L569-L577】.  
  - Decorator `@Client({ transport: ..., options })` can inject a proxy (less recommended)【64†L595-L603】.  

- **Server API:**  
  - Use `app.connectMicroservice(options)` or `NestFactory.createMicroservice(...)` to create a microservice server.  
  - Handle with controllers: methods with `@MessagePattern()`/`@EventPattern()` process incoming messages.  
  - Built-in context classes (import from `@nestjs/microservices`): e.g. `TcpContext`, `KafkaContext`, `NatsContext`, `MqttContext`, `RmqContext`, etc., to access low-level transport details. Example: `@Ctx() context: NatsContext`【67†L1-L8】.  

- **Options:** Each transporter accepts specific options. E.g.:  
  - TCP: `{ port, host }`. Default port 8877? (Nest does not impose a default; user sets it).  
  - Redis: `{ url }` or `{ host, port, password, retryAttempts, retryDelay }`.  
  - NATS: `{ url }` (with subjects/patterns).  
  - MQTT: `{ url }`.  
  - RabbitMQ: `{ url, queue, queueOptions, noAck, prefetchCount }`.  
  - Kafka: `{ client: { brokers: [...] }, consumer: { groupId: '...' }}`.  
  - gRPC: `{ protoPath, package, url, loader }` for grpc server/client.  
  - Each also has an abstract `options` interface (e.g. `TcpOptions`, `RedisOptions`, etc.).  

- **Context Injection:** For request-scoped microservices, inject `@Inject(CONTEXT) private ctx: RequestContext`【64†L708-L716】 to get `ctx.pattern` and `ctx.data`.  

- **Status Streams:** `ClientProxy.status` and server `status` Observables emit connection statuses (e.g. `TcpStatus`【64†L739-L747】).  

_Table 3_ summarizes core microservices classes and decorators.

| Transport / Feature         | Symbols (package `@nestjs/microservices`)                      | Description                                                         |
|-----------------------------|----------------------------------------------------------------|---------------------------------------------------------------------|
| `Transport` (enum)          | `Transport.TCP`, `REDIS`, `NATS`, `MQTT`, `RABBITMQ`, `KAFKA`, `GRPC`, `CUSTOM` | Supported transporter types.                                  |
| `ClientsModule`             | Module to configure and inject microservice clients.           | [64†L569-L577]                                                      |
| `ClientProxy`               | Abstract class for client; methods `connect()`, `send()`, `emit()`. | [64†L628-L637][64†L656-L665]                                        |
| `ClientProxyFactory`        | Static `create(options)` to make `ClientProxy`.               | [64†L569-L577]                                                      |
| `MessagePattern()`          | Method decorator for message handlers (RPC).                  | [65†L1-L9]                                                          |
| `EventPattern()`            | Method decorator for event handlers (pub/sub).                | [66†L1-L8]                                                          |
| `@Payload()`                | Parameter decorator for message payload.                      | [67†L1-L8]                                                          |
| `@Ctx()`                    | Parameter decorator for transport-specific context.           | [67†L1-L8]                                                          |
| `TcpOptions`, `RedisOptions`, `NatsOptions`, etc. | Interfaces for transporter options.                 | Nest microservices docs (Transporters) |
| `ClientKafka`               | Built-in Kafka client class (extends ClientProxy).            | [64†L673-L677]                                                      |
| `KafkaContext`, `MqttContext`, `NatsContext`, `RmqContext`, `GrpcContext`, etc. | Context classes for respective transports.        | Microservices docs                                            |
| `GrpcOptions` / `GrpcMethod`/`GrpcStreamMethod`/`GrpcService` | gRPC-specific options and decorators.       | Nest microservices docs (gRPC section)              |

## CLI Commands and Flags  

Nest’s CLI (`@nestjs/cli`) provides commands to scaffold and manage projects【32†L219-L227】. The primary commands are:  

- **`nest new <name>`**: scaffold a new project. Options【32†L237-L245】: `--dry-run` (`-d`), `--skip-git` (`-g`), `--skip-install` (`-s`), `--package-manager` (`-p`), `--language` (`-l`), `--collection` (`-c`), `--strict`.  
- **`nest generate|g <schematic> <name>`**: generate components. Schematics include `app`, `library/lib`, `class/cl`, `controller/co`, `decorator/d`, `filter/f`, `gateway/ga`, `guard/gu`, `interface/itf`, `interceptor/itc`, `middleware/mi`, `module/mo`, `pipe/pi`, `provider/pr`, `resolver/r`, `resource/res`, `service/s`【32†L278-L287】. Options: `--dry-run`, `--project`, `--flat`, `--spec`, etc.  
- **`nest build <project>`**: compile the app. Options【34†L339-L348】【34†L354-L358】: `--path/-p`, `--config/-c` (cli config), `--watch/-w`, `--builder/-b` (`tsc|swc|webpack`), `--webpack/--webpackPath`, `--tsc`, `--all`, etc.  
- **`nest start <project>`**: compile and run (live). Options【34†L372-L380】【34†L384-L393】: similar to build plus `--debug/-d` (`--inspect`), `--exec` to specify runtime, `--env-file` to load environment variables, `--` to pass raw args.  
- **`nest add <library>`**: installs an external Nest library via its schematic.  
- **`nest info`**: displays environment and version info.  

In addition, CLI **flags** of note include: `-d/--dry-run`, `-p/--path`, `-c/--config`, `-w/--watch`, `-b/--builder`, `-l/--language`, `-s/--skip-install`, `-g/--skip-git`【32†L243-L251】【34†L373-L381】.  

## CLI Schematics (Generators)  

The official schematics (`@nestjs/schematics`) support generating:  
- **Applications** (`nest g app ...`) and **Libraries** (`nest g lib ...`) for monorepos.  
- **Class**, **Controller**, **Decorator**, **Filter**, **Gateway**, **Guard**, **Interface**, **Interceptor**, **Middleware**, **Module**, **Pipe**, **Provider**, **Resolver**, **Resource**, **Service** (with aliases as per [32†L276-L285]).  

Each schematic creates boilerplate files (TS with optional spec/test files). Configuration in `nest-cli.json` can customize default behaviors (e.g. creating spec files).  

## Configuration and Environment  

Nest itself uses no proprietary config keys by default, but by convention:  
- **Default HTTP Port:** 3000 (if not overridden by code or `$PORT`). The common bootstrap example does `app.listen(3000)` by default.  
- **Process.env.PORT:** Commonly used to override HTTP port.  
- **Environment Variables:** Nest does not enforce specific env names except for optional CLI tooling. However, environment can be loaded via `ConfigModule` (not built-in by Nest core). The CLI’s `nest start` supports `--env-file`.  
- **Metadata Keys:** By default, Nest doesn’t use fixed metadata keys except for context (`'roles'`, `'isPublic'` as examples). In guards, often `'roles'` (in `@SetMetadata('roles', ...)`【50†L25-L34】) or `'isPublic'` (in auth tutorial【52†L799-L804】). Users define their own keys via `@SetMetadata()`. The system metadata keys include `PATH_METADATA` etc., but those are internal.  
- **Configuration Module:** The official `@nestjs/config` module uses a `ConfigService` and can pull from `process.env`. Its default file is `.env`.  

## Platform Adapters  

- **Express (default):** `NestExpressApplication` (extends `INestApplication`), via `NestFactory.create(AppModule)` by default. Controller methods get Express `Request`/`Response`. Decorators `@Req()`/`@Res()` yield Express objects. Available in `@nestjs/platform-express`.  
- **Fastify:** `NestFastifyApplication` via `NestFactory.create(AppModule, new FastifyAdapter())`. Available in `@nestjs/platform-fastify`.  
- **HTTP Abstraction:** `HttpServer` interface, `INestApplicationContext` for generic context.  
- **Also:** `socket.io` support in websockets via `IoAdapter`.  

## Integrations (Official Packages)  

Nest provides official integration modules (all are `@nestjs/<name>` packages):  

- **GraphQL (`@nestjs/graphql`):** GraphQLModule (schema/code-first), decorators listed under “Decorators”. Exports: `GraphQLModule`, helpers like `Resolver`, `Query`, etc., and classes for Apollo integration.  
- **TypeORM (`@nestjs/typeorm`):** `TypeOrmModule`. Exports: `TypeOrmModule`, `InjectRepository`, `getRepositoryToken`, etc【34†L333-L338】 (via library docs).  
- **Mongoose (`@nestjs/mongoose`):** `MongooseModule`. Exports: `MongooseModule`, `@Schema()`, `@Prop()`, `@InjectModel()`, `PropType`, etc.  
- **Bull (`@nestjs/bull`):** `BullModule` for Redis-backed queues. Exports: `BullModule`, `getQueueToken()`, decorators like `@Processor()`, `@Process()`.  
- **Kafka/Microservices:** Already in core (`@nestjs/microservices`). Kafka specifics through that; no separate package.  
- **gRPC:** Also via `@nestjs/microservices`. Decorators `@GrpcMethod`, `@GrpcStreamMethod`.  
- **OpenTelemetry:** Official package `@nestjs/otel` (from Nest Foundation) or third-party. Exports `NestjsOtelModule`, `TracerService`, etc.  
- **Swagger (`@nestjs/swagger`):** `SwaggerModule` plus decorators (`@ApiTags()`, `@ApiOperation()`, etc.) to auto-generate OpenAPI specs.  
- **Passport (`@nestjs/passport`):** Glue for Passport strategies. Exports `PassportModule`, and decorator `@AuthGuard()`.  
- **JWT (`@nestjs/jwt`):** Provides `JwtModule`, `JwtService` for signing tokens.  
- **Cache (`@nestjs/cache-manager`):** `CacheModule` to enable caching; `CacheInterceptor`, `CACHE_MANAGER` token.  
- **Throttler (`@nestjs/throttler`):** `ThrottlerModule`; provides `ThrottlerGuard` and decorator `@Throttle(ttl, limit)`.  
- **OpenTelemetry (`@nestjs/otel`):** Module and decorators/services for instrumentation.  
- **Other Official Packages:** `@nestjs/testing` (Test utilities), `@nestjs/schematics` (CLI schematics), `@nestjs/cli` (CLI), `@nestjs/event-emitter`, `@nestjs/axios`, `@nestjs/terminus` (health checks).  

**Ecosystem (3rd-party):** Not scoped `@nestjs`, e.g. `@liaoliaots/nestjs-redis` or `nest-cache-manager-redis-store` (for Redis), `nestjs-cqrs` (though officially scoped), `nestjs-pino` (logging), etc. These are noted separately and beyond core scope.  

## Testing Utilities  

- **`@nestjs/testing`:** Exports `Test` utility with methods like `createTestingModule()`, returning a `TestingModule`. Classes/interfaces: `TestingModule`, `ModuleMetadata`. E.g. `const module: TestingModule = await Test.createTestingModule({imports:[...]})`.  
- **In-Memory Modules:** Can compile modules with `Test.createTestingModule()`.  
- **Jest Preset:** Nest provides a Jest config preset.  

## Miscellaneous  

- **Lifecycle Hooks:** Interfaces `OnModuleInit`, `OnModuleDestroy`, `OnApplicationBootstrap`, `OnApplicationShutdown`, `BeforeApplicationShutdown` (in `@nestjs/common`).  
- **Metadata Keys (common):** `'roles'`, `'isPublic'` (user-defined keys in examples【50†L25-L34】【52†L799-L804】). Possibly `'access'`, `'permission'`, etc.  
- **Default Ports:** No fixed defaults in Nest except developer convention (HTTP 3000, gRPC 50051 by example, etc.).  
- **HTTP Adapter Settings:** `NestFactory` options, e.g. `app.setGlobalPrefix()`, enabling CORS (`app.enableCors()`), etc.  

## Tables of Core Items  

### Core Modules Comparison  

| Module/Class               | Exports & Purpose                                    | Source                        |
|----------------------------|------------------------------------------------------|-------------------------------|
| `@nestjs/core`             | `NestFactory`, `ModuleRef`, `Reflector`, lifecycle hooks, and core decorators (`Injectable`, `Param`, etc). | [64†L560-L568][49†L363-L372]    |
| `@nestjs/common`           | HTTP decorators (`Controller`, `Get`, `Post`, etc), pipes, filters, guards, `ArgumentsHost`, exceptions (`HttpException`, `HttpStatus`). | [76†L258-L266][83†L1-L9]      |
| `@nestjs/platform-express` | `NestExpressApplication`, `ExpressAdapter`, interceptors for file upload (`FileInterceptor`, etc). | [88†L7-L14][89†L25-L33]        |
| `@nestjs/platform-fastify` | `NestFastifyApplication`, `FastifyAdapter`.          | (docs: Fastify adapter section) |
| `@nestjs/microservices`    | `Transport` enum, `ClientProxy`, `ClientProxyFactory`, `ClientsModule`, patterns decorators, context interfaces, GRPC decorators, `TcpContext`, etc. | [64†L560-L568][65†L1-L9]      |
| `@nestjs/websockets`       | `WebSocketGateway`, `SubscribeMessage`, `WsAdapter`, etc (implements ws or socket.io gateways). | Nest WS docs                 |
| `@nestjs/graphql`          | `GraphQLModule`, `Query`, `Mutation`, `Resolver`, `ObjectType`, etc (code- and schema-first GraphQL). | Nest GraphQL docs            |
| `@nestjs/swagger`          | `SwaggerModule`, `DocumentBuilder`, `@Api*` decorators. | Nest Swagger docs            |
| `@nestjs/typeorm`          | `TypeOrmModule`, `getRepositoryToken`, `@InjectRepository`. | TypeORM docs                |
| `@nestjs/mongoose`         | `MongooseModule`, `@Schema`, `@Prop`, `@InjectModel`.   | Mongoose docs                 |
| `@nestjs/terminus`         | `TerminusModule` (health checks), `TypeOrmHealthIndicator`, etc. | Nest Terminus docs         |
| `@nestjs/throttler`        | `ThrottlerModule`, `ThrottlerGuard`, `@Throttle`.      | Nest Throttler docs           |
| `@nestjs/axios`            | `HttpModule`, `HttpService` (wrapper around axios).     | Nest Axios docs               |
| `@nestjs/event-emitter`    | `EventEmitterModule`, `EventEmitter2`, `OnEvent`.      | [61†L228-L237][61†L301-L310]  |
| `@nestjs/passport`         | `PassportModule`, `@AuthGuard` wrappers.                | Nest Auth docs (`@nestjs/passport`) |
| `@nestjs/jwt`              | `JwtModule`, `JwtService`.                             | Nest Auth docs               |
| `@nestjs/cli`              | CLI tool; `nest` commands.                              | [34†L359-L368][34†L372-L381]  |
| `@nestjs/schematics`       | Collection of `generate` schematics for Nest.          | CLI docs [32†L278-L285]      |
| `@nestjs/testing`          | Testing tools: `Test`, `TestingModule`.                | Nest Testing docs            |
| `@nestjs/cache-manager`    | `CacheModule`, `CACHE_MANAGER` token, `CacheInterceptor`. | [81†L204-L213][82†L1-L4]   |

### Lifecycle and Metadata Interfaces  

| Interface/Class             | Role                                                           | Source         |
|-----------------------------|----------------------------------------------------------------|----------------|
| `CanActivate` (interface)   | For Guards: has `canActivate(context)` returning bool/obs.      | [45†L217-L225]  |
| `PipeTransform` (interface) | For Pipes: has `transform(value, metadata)`.                    | [76†L408-L417] |
| `NestInterceptor`           | For Interceptors: has `intercept(context, next)`.              | docs (interceptors) |
| `ExceptionFilter<T>`        | For Exception Filters: has `catch(exception, host)`.           | [43†L25-L32]   |
| `ArgumentsHost` / `ExecutionContext` | Access request/response arguments in filters/guards.  | [49†L363-L372][49†L377-L384] |
| `OnModuleInit`, `OnModuleDestroy`, `OnApplicationBootstrap`, `OnApplicationShutdown`, `BeforeApplicationShutdown` | Lifecycle hook interfaces. | Nest docs (lifecycle events) |

### Global and Common Metadata Keys  

Common metadata keys used by Nest or examples:  
- **`'roles'`**: custom key for role-based guards (used by `@SetMetadata('roles', …)` and read by guards via Reflector)【50†L25-L34】.  
- **`'isPublic'`**: example key to skip auth guard (with a `Public` decorator)【52†L799-L804】.  
- **`'path'`**, `'method'` (internal), etc. (used by routing).  

## References  

This inventory is drawn from the official NestJS documentation and source code. Key sources: Nest docs pages (Controllers【83†L1-L9】, Pipes【76†L258-L266】, CLI【32†L219-L227】【34†L359-L368】, Microservices【64†L560-L568】【65†L1-L9】, Events【61†L228-L237】【61†L301-L310】, etc.) and GitHub packages (e.g. `@nestjs/cache-manager`【81†L204-L213】). All items are current as of NestJS v10 (latest stable). 

