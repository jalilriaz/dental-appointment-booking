
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Appointment
 * 
 */
export type Appointment = $Result.DefaultSelection<Prisma.$AppointmentPayload>
/**
 * Model ClinicalNote
 * 
 */
export type ClinicalNote = $Result.DefaultSelection<Prisma.$ClinicalNotePayload>
/**
 * Model Treatment
 * 
 */
export type Treatment = $Result.DefaultSelection<Prisma.$TreatmentPayload>
/**
 * Model SystemSettings
 * 
 */
export type SystemSettings = $Result.DefaultSelection<Prisma.$SystemSettingsPayload>
/**
 * Model PatientTreatment
 * 
 */
export type PatientTreatment = $Result.DefaultSelection<Prisma.$PatientTreatmentPayload>
/**
 * Model PlanChangeLog
 * 
 */
export type PlanChangeLog = $Result.DefaultSelection<Prisma.$PlanChangeLogPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model Inventory
 * 
 */
export type Inventory = $Result.DefaultSelection<Prisma.$InventoryPayload>
/**
 * Model Doctor
 * 
 */
export type Doctor = $Result.DefaultSelection<Prisma.$DoctorPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  PATIENT: 'PATIENT'
};

export type Role = (typeof Role)[keyof typeof Role]


export const ApptStatus: {
  SCHEDULED: 'SCHEDULED',
  RESCHEDULED: 'RESCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

export type ApptStatus = (typeof ApptStatus)[keyof typeof ApptStatus]


export const BookingSource: {
  WEBSITE: 'WEBSITE',
  WALK_IN: 'WALK_IN',
  WHATSAPP_BOT: 'WHATSAPP_BOT'
};

export type BookingSource = (typeof BookingSource)[keyof typeof BookingSource]


export const PaymentMethod: {
  CASH: 'CASH',
  CARD: 'CARD',
  ONLINE: 'ONLINE'
};

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]


export const TreatmentStatus: {
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  FULLY_PAID: 'FULLY_PAID'
};

export type TreatmentStatus = (typeof TreatmentStatus)[keyof typeof TreatmentStatus]


export const ClinicalStatus: {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DISCONTINUED: 'DISCONTINUED'
};

export type ClinicalStatus = (typeof ClinicalStatus)[keyof typeof ClinicalStatus]


export const FinancialStatus: {
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  FULLY_PAID: 'FULLY_PAID'
};

export type FinancialStatus = (typeof FinancialStatus)[keyof typeof FinancialStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type ApptStatus = $Enums.ApptStatus

export const ApptStatus: typeof $Enums.ApptStatus

export type BookingSource = $Enums.BookingSource

export const BookingSource: typeof $Enums.BookingSource

export type PaymentMethod = $Enums.PaymentMethod

export const PaymentMethod: typeof $Enums.PaymentMethod

export type TreatmentStatus = $Enums.TreatmentStatus

export const TreatmentStatus: typeof $Enums.TreatmentStatus

export type ClinicalStatus = $Enums.ClinicalStatus

export const ClinicalStatus: typeof $Enums.ClinicalStatus

export type FinancialStatus = $Enums.FinancialStatus

export const FinancialStatus: typeof $Enums.FinancialStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appointment`: Exposes CRUD operations for the **Appointment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Appointments
    * const appointments = await prisma.appointment.findMany()
    * ```
    */
  get appointment(): Prisma.AppointmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.clinicalNote`: Exposes CRUD operations for the **ClinicalNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ClinicalNotes
    * const clinicalNotes = await prisma.clinicalNote.findMany()
    * ```
    */
  get clinicalNote(): Prisma.ClinicalNoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.treatment`: Exposes CRUD operations for the **Treatment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Treatments
    * const treatments = await prisma.treatment.findMany()
    * ```
    */
  get treatment(): Prisma.TreatmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemSettings`: Exposes CRUD operations for the **SystemSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemSettings
    * const systemSettings = await prisma.systemSettings.findMany()
    * ```
    */
  get systemSettings(): Prisma.SystemSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patientTreatment`: Exposes CRUD operations for the **PatientTreatment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PatientTreatments
    * const patientTreatments = await prisma.patientTreatment.findMany()
    * ```
    */
  get patientTreatment(): Prisma.PatientTreatmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.planChangeLog`: Exposes CRUD operations for the **PlanChangeLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlanChangeLogs
    * const planChangeLogs = await prisma.planChangeLog.findMany()
    * ```
    */
  get planChangeLog(): Prisma.PlanChangeLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inventory`: Exposes CRUD operations for the **Inventory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventories
    * const inventories = await prisma.inventory.findMany()
    * ```
    */
  get inventory(): Prisma.InventoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.doctor`: Exposes CRUD operations for the **Doctor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Doctors
    * const doctors = await prisma.doctor.findMany()
    * ```
    */
  get doctor(): Prisma.DoctorDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Appointment: 'Appointment',
    ClinicalNote: 'ClinicalNote',
    Treatment: 'Treatment',
    SystemSettings: 'SystemSettings',
    PatientTreatment: 'PatientTreatment',
    PlanChangeLog: 'PlanChangeLog',
    Payment: 'Payment',
    Inventory: 'Inventory',
    Doctor: 'Doctor'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "appointment" | "clinicalNote" | "treatment" | "systemSettings" | "patientTreatment" | "planChangeLog" | "payment" | "inventory" | "doctor"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Appointment: {
        payload: Prisma.$AppointmentPayload<ExtArgs>
        fields: Prisma.AppointmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppointmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppointmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findFirst: {
            args: Prisma.AppointmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppointmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          findMany: {
            args: Prisma.AppointmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          create: {
            args: Prisma.AppointmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          createMany: {
            args: Prisma.AppointmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppointmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          delete: {
            args: Prisma.AppointmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          update: {
            args: Prisma.AppointmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          deleteMany: {
            args: Prisma.AppointmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppointmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppointmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>[]
          }
          upsert: {
            args: Prisma.AppointmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppointmentPayload>
          }
          aggregate: {
            args: Prisma.AppointmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppointment>
          }
          groupBy: {
            args: Prisma.AppointmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppointmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppointmentCountArgs<ExtArgs>
            result: $Utils.Optional<AppointmentCountAggregateOutputType> | number
          }
        }
      }
      ClinicalNote: {
        payload: Prisma.$ClinicalNotePayload<ExtArgs>
        fields: Prisma.ClinicalNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClinicalNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClinicalNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>
          }
          findFirst: {
            args: Prisma.ClinicalNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClinicalNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>
          }
          findMany: {
            args: Prisma.ClinicalNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>[]
          }
          create: {
            args: Prisma.ClinicalNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>
          }
          createMany: {
            args: Prisma.ClinicalNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClinicalNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>[]
          }
          delete: {
            args: Prisma.ClinicalNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>
          }
          update: {
            args: Prisma.ClinicalNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>
          }
          deleteMany: {
            args: Prisma.ClinicalNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClinicalNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClinicalNoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>[]
          }
          upsert: {
            args: Prisma.ClinicalNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClinicalNotePayload>
          }
          aggregate: {
            args: Prisma.ClinicalNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClinicalNote>
          }
          groupBy: {
            args: Prisma.ClinicalNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClinicalNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClinicalNoteCountArgs<ExtArgs>
            result: $Utils.Optional<ClinicalNoteCountAggregateOutputType> | number
          }
        }
      }
      Treatment: {
        payload: Prisma.$TreatmentPayload<ExtArgs>
        fields: Prisma.TreatmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TreatmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TreatmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>
          }
          findFirst: {
            args: Prisma.TreatmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TreatmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>
          }
          findMany: {
            args: Prisma.TreatmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>[]
          }
          create: {
            args: Prisma.TreatmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>
          }
          createMany: {
            args: Prisma.TreatmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TreatmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>[]
          }
          delete: {
            args: Prisma.TreatmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>
          }
          update: {
            args: Prisma.TreatmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>
          }
          deleteMany: {
            args: Prisma.TreatmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TreatmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TreatmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>[]
          }
          upsert: {
            args: Prisma.TreatmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreatmentPayload>
          }
          aggregate: {
            args: Prisma.TreatmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTreatment>
          }
          groupBy: {
            args: Prisma.TreatmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TreatmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TreatmentCountArgs<ExtArgs>
            result: $Utils.Optional<TreatmentCountAggregateOutputType> | number
          }
        }
      }
      SystemSettings: {
        payload: Prisma.$SystemSettingsPayload<ExtArgs>
        fields: Prisma.SystemSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>
          }
          findFirst: {
            args: Prisma.SystemSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>
          }
          findMany: {
            args: Prisma.SystemSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>[]
          }
          create: {
            args: Prisma.SystemSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>
          }
          createMany: {
            args: Prisma.SystemSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>[]
          }
          delete: {
            args: Prisma.SystemSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>
          }
          update: {
            args: Prisma.SystemSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>
          }
          deleteMany: {
            args: Prisma.SystemSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>[]
          }
          upsert: {
            args: Prisma.SystemSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemSettingsPayload>
          }
          aggregate: {
            args: Prisma.SystemSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemSettings>
          }
          groupBy: {
            args: Prisma.SystemSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SystemSettingsCountAggregateOutputType> | number
          }
        }
      }
      PatientTreatment: {
        payload: Prisma.$PatientTreatmentPayload<ExtArgs>
        fields: Prisma.PatientTreatmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientTreatmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientTreatmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>
          }
          findFirst: {
            args: Prisma.PatientTreatmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientTreatmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>
          }
          findMany: {
            args: Prisma.PatientTreatmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>[]
          }
          create: {
            args: Prisma.PatientTreatmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>
          }
          createMany: {
            args: Prisma.PatientTreatmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientTreatmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>[]
          }
          delete: {
            args: Prisma.PatientTreatmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>
          }
          update: {
            args: Prisma.PatientTreatmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>
          }
          deleteMany: {
            args: Prisma.PatientTreatmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientTreatmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientTreatmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>[]
          }
          upsert: {
            args: Prisma.PatientTreatmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientTreatmentPayload>
          }
          aggregate: {
            args: Prisma.PatientTreatmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatientTreatment>
          }
          groupBy: {
            args: Prisma.PatientTreatmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientTreatmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientTreatmentCountArgs<ExtArgs>
            result: $Utils.Optional<PatientTreatmentCountAggregateOutputType> | number
          }
        }
      }
      PlanChangeLog: {
        payload: Prisma.$PlanChangeLogPayload<ExtArgs>
        fields: Prisma.PlanChangeLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanChangeLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanChangeLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>
          }
          findFirst: {
            args: Prisma.PlanChangeLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanChangeLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>
          }
          findMany: {
            args: Prisma.PlanChangeLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>[]
          }
          create: {
            args: Prisma.PlanChangeLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>
          }
          createMany: {
            args: Prisma.PlanChangeLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanChangeLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>[]
          }
          delete: {
            args: Prisma.PlanChangeLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>
          }
          update: {
            args: Prisma.PlanChangeLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>
          }
          deleteMany: {
            args: Prisma.PlanChangeLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanChangeLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlanChangeLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>[]
          }
          upsert: {
            args: Prisma.PlanChangeLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanChangeLogPayload>
          }
          aggregate: {
            args: Prisma.PlanChangeLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlanChangeLog>
          }
          groupBy: {
            args: Prisma.PlanChangeLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanChangeLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanChangeLogCountArgs<ExtArgs>
            result: $Utils.Optional<PlanChangeLogCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      Inventory: {
        payload: Prisma.$InventoryPayload<ExtArgs>
        fields: Prisma.InventoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findFirst: {
            args: Prisma.InventoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findMany: {
            args: Prisma.InventoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          create: {
            args: Prisma.InventoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          createMany: {
            args: Prisma.InventoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          delete: {
            args: Prisma.InventoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          update: {
            args: Prisma.InventoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          deleteMany: {
            args: Prisma.InventoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InventoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          upsert: {
            args: Prisma.InventoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory>
          }
          groupBy: {
            args: Prisma.InventoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCountAggregateOutputType> | number
          }
        }
      }
      Doctor: {
        payload: Prisma.$DoctorPayload<ExtArgs>
        fields: Prisma.DoctorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DoctorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DoctorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          findFirst: {
            args: Prisma.DoctorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DoctorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          findMany: {
            args: Prisma.DoctorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>[]
          }
          create: {
            args: Prisma.DoctorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          createMany: {
            args: Prisma.DoctorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DoctorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>[]
          }
          delete: {
            args: Prisma.DoctorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          update: {
            args: Prisma.DoctorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          deleteMany: {
            args: Prisma.DoctorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DoctorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DoctorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>[]
          }
          upsert: {
            args: Prisma.DoctorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DoctorPayload>
          }
          aggregate: {
            args: Prisma.DoctorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDoctor>
          }
          groupBy: {
            args: Prisma.DoctorGroupByArgs<ExtArgs>
            result: $Utils.Optional<DoctorGroupByOutputType>[]
          }
          count: {
            args: Prisma.DoctorCountArgs<ExtArgs>
            result: $Utils.Optional<DoctorCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    appointment?: AppointmentOmit
    clinicalNote?: ClinicalNoteOmit
    treatment?: TreatmentOmit
    systemSettings?: SystemSettingsOmit
    patientTreatment?: PatientTreatmentOmit
    planChangeLog?: PlanChangeLogOmit
    payment?: PaymentOmit
    inventory?: InventoryOmit
    doctor?: DoctorOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    appointments: number
    patientTreatments: number
    planChangeLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | UserCountOutputTypeCountAppointmentsArgs
    patientTreatments?: boolean | UserCountOutputTypeCountPatientTreatmentsArgs
    planChangeLogs?: boolean | UserCountOutputTypeCountPlanChangeLogsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPatientTreatmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientTreatmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlanChangeLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanChangeLogWhereInput
  }


  /**
   * Count Type AppointmentCountOutputType
   */

  export type AppointmentCountOutputType = {
    clinicalNotes: number
    payments: number
  }

  export type AppointmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    clinicalNotes?: boolean | AppointmentCountOutputTypeCountClinicalNotesArgs
    payments?: boolean | AppointmentCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppointmentCountOutputType
     */
    select?: AppointmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeCountClinicalNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalNoteWhereInput
  }

  /**
   * AppointmentCountOutputType without action
   */
  export type AppointmentCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }


  /**
   * Count Type TreatmentCountOutputType
   */

  export type TreatmentCountOutputType = {
    appointments: number
    patientTreatments: number
  }

  export type TreatmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | TreatmentCountOutputTypeCountAppointmentsArgs
    patientTreatments?: boolean | TreatmentCountOutputTypeCountPatientTreatmentsArgs
  }

  // Custom InputTypes
  /**
   * TreatmentCountOutputType without action
   */
  export type TreatmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreatmentCountOutputType
     */
    select?: TreatmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TreatmentCountOutputType without action
   */
  export type TreatmentCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * TreatmentCountOutputType without action
   */
  export type TreatmentCountOutputTypeCountPatientTreatmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientTreatmentWhereInput
  }


  /**
   * Count Type PatientTreatmentCountOutputType
   */

  export type PatientTreatmentCountOutputType = {
    appointments: number
    payments: number
    changeLogs: number
  }

  export type PatientTreatmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | PatientTreatmentCountOutputTypeCountAppointmentsArgs
    payments?: boolean | PatientTreatmentCountOutputTypeCountPaymentsArgs
    changeLogs?: boolean | PatientTreatmentCountOutputTypeCountChangeLogsArgs
  }

  // Custom InputTypes
  /**
   * PatientTreatmentCountOutputType without action
   */
  export type PatientTreatmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatmentCountOutputType
     */
    select?: PatientTreatmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PatientTreatmentCountOutputType without action
   */
  export type PatientTreatmentCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }

  /**
   * PatientTreatmentCountOutputType without action
   */
  export type PatientTreatmentCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * PatientTreatmentCountOutputType without action
   */
  export type PatientTreatmentCountOutputTypeCountChangeLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanChangeLogWhereInput
  }


  /**
   * Count Type DoctorCountOutputType
   */

  export type DoctorCountOutputType = {
    appointments: number
  }

  export type DoctorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | DoctorCountOutputTypeCountAppointmentsArgs
  }

  // Custom InputTypes
  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DoctorCountOutputType
     */
    select?: DoctorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DoctorCountOutputType without action
   */
  export type DoctorCountOutputTypeCountAppointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    patientCode: number | null
    noShowCount: number | null
  }

  export type UserSumAggregateOutputType = {
    patientCode: number | null
    noShowCount: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    patientCode: number | null
    noShowCount: number | null
    createdAt: Date | null
    dateOfBirth: Date | null
    gender: string | null
    address: string | null
    medicalAlerts: string | null
    googleCalendarToken: string | null
    googleCalendarRefreshToken: string | null
    googleCalendarConnected: boolean | null
    resetToken: string | null
    resetTokenExpiry: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    phone: string | null
    password: string | null
    name: string | null
    role: $Enums.Role | null
    patientCode: number | null
    noShowCount: number | null
    createdAt: Date | null
    dateOfBirth: Date | null
    gender: string | null
    address: string | null
    medicalAlerts: string | null
    googleCalendarToken: string | null
    googleCalendarRefreshToken: string | null
    googleCalendarConnected: boolean | null
    resetToken: string | null
    resetTokenExpiry: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    phone: number
    password: number
    name: number
    role: number
    patientCode: number
    noShowCount: number
    createdAt: number
    dateOfBirth: number
    gender: number
    address: number
    medicalAlerts: number
    googleCalendarToken: number
    googleCalendarRefreshToken: number
    googleCalendarConnected: number
    resetToken: number
    resetTokenExpiry: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    patientCode?: true
    noShowCount?: true
  }

  export type UserSumAggregateInputType = {
    patientCode?: true
    noShowCount?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password?: true
    name?: true
    role?: true
    patientCode?: true
    noShowCount?: true
    createdAt?: true
    dateOfBirth?: true
    gender?: true
    address?: true
    medicalAlerts?: true
    googleCalendarToken?: true
    googleCalendarRefreshToken?: true
    googleCalendarConnected?: true
    resetToken?: true
    resetTokenExpiry?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password?: true
    name?: true
    role?: true
    patientCode?: true
    noShowCount?: true
    createdAt?: true
    dateOfBirth?: true
    gender?: true
    address?: true
    medicalAlerts?: true
    googleCalendarToken?: true
    googleCalendarRefreshToken?: true
    googleCalendarConnected?: true
    resetToken?: true
    resetTokenExpiry?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    phone?: true
    password?: true
    name?: true
    role?: true
    patientCode?: true
    noShowCount?: true
    createdAt?: true
    dateOfBirth?: true
    gender?: true
    address?: true
    medicalAlerts?: true
    googleCalendarToken?: true
    googleCalendarRefreshToken?: true
    googleCalendarConnected?: true
    resetToken?: true
    resetTokenExpiry?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string | null
    phone: string | null
    password: string | null
    name: string
    role: $Enums.Role
    patientCode: number | null
    noShowCount: number
    createdAt: Date
    dateOfBirth: Date | null
    gender: string | null
    address: string | null
    medicalAlerts: string | null
    googleCalendarToken: string | null
    googleCalendarRefreshToken: string | null
    googleCalendarConnected: boolean
    resetToken: string | null
    resetTokenExpiry: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    patientCode?: boolean
    noShowCount?: boolean
    createdAt?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    medicalAlerts?: boolean
    googleCalendarToken?: boolean
    googleCalendarRefreshToken?: boolean
    googleCalendarConnected?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
    appointments?: boolean | User$appointmentsArgs<ExtArgs>
    patientTreatments?: boolean | User$patientTreatmentsArgs<ExtArgs>
    planChangeLogs?: boolean | User$planChangeLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    patientCode?: boolean
    noShowCount?: boolean
    createdAt?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    medicalAlerts?: boolean
    googleCalendarToken?: boolean
    googleCalendarRefreshToken?: boolean
    googleCalendarConnected?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    patientCode?: boolean
    noShowCount?: boolean
    createdAt?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    medicalAlerts?: boolean
    googleCalendarToken?: boolean
    googleCalendarRefreshToken?: boolean
    googleCalendarConnected?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    phone?: boolean
    password?: boolean
    name?: boolean
    role?: boolean
    patientCode?: boolean
    noShowCount?: boolean
    createdAt?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    address?: boolean
    medicalAlerts?: boolean
    googleCalendarToken?: boolean
    googleCalendarRefreshToken?: boolean
    googleCalendarConnected?: boolean
    resetToken?: boolean
    resetTokenExpiry?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "phone" | "password" | "name" | "role" | "patientCode" | "noShowCount" | "createdAt" | "dateOfBirth" | "gender" | "address" | "medicalAlerts" | "googleCalendarToken" | "googleCalendarRefreshToken" | "googleCalendarConnected" | "resetToken" | "resetTokenExpiry", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | User$appointmentsArgs<ExtArgs>
    patientTreatments?: boolean | User$patientTreatmentsArgs<ExtArgs>
    planChangeLogs?: boolean | User$planChangeLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      patientTreatments: Prisma.$PatientTreatmentPayload<ExtArgs>[]
      planChangeLogs: Prisma.$PlanChangeLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string | null
      phone: string | null
      password: string | null
      name: string
      role: $Enums.Role
      patientCode: number | null
      noShowCount: number
      createdAt: Date
      dateOfBirth: Date | null
      gender: string | null
      address: string | null
      medicalAlerts: string | null
      googleCalendarToken: string | null
      googleCalendarRefreshToken: string | null
      googleCalendarConnected: boolean
      resetToken: string | null
      resetTokenExpiry: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends User$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    patientTreatments<T extends User$patientTreatmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$patientTreatmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    planChangeLogs<T extends User$planChangeLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$planChangeLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly patientCode: FieldRef<"User", 'Int'>
    readonly noShowCount: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly dateOfBirth: FieldRef<"User", 'DateTime'>
    readonly gender: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly medicalAlerts: FieldRef<"User", 'String'>
    readonly googleCalendarToken: FieldRef<"User", 'String'>
    readonly googleCalendarRefreshToken: FieldRef<"User", 'String'>
    readonly googleCalendarConnected: FieldRef<"User", 'Boolean'>
    readonly resetToken: FieldRef<"User", 'String'>
    readonly resetTokenExpiry: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.appointments
   */
  export type User$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * User.patientTreatments
   */
  export type User$patientTreatmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    where?: PatientTreatmentWhereInput
    orderBy?: PatientTreatmentOrderByWithRelationInput | PatientTreatmentOrderByWithRelationInput[]
    cursor?: PatientTreatmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientTreatmentScalarFieldEnum | PatientTreatmentScalarFieldEnum[]
  }

  /**
   * User.planChangeLogs
   */
  export type User$planChangeLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    where?: PlanChangeLogWhereInput
    orderBy?: PlanChangeLogOrderByWithRelationInput | PlanChangeLogOrderByWithRelationInput[]
    cursor?: PlanChangeLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanChangeLogScalarFieldEnum | PlanChangeLogScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Appointment
   */

  export type AggregateAppointment = {
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  export type AppointmentAvgAggregateOutputType = {
    amountPaid: number | null
    price: number | null
    discount: number | null
    sessionNumber: number | null
    plannedFee: number | null
  }

  export type AppointmentSumAggregateOutputType = {
    amountPaid: number | null
    price: number | null
    discount: number | null
    sessionNumber: number | null
    plannedFee: number | null
  }

  export type AppointmentMinAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.ApptStatus | null
    notes: string | null
    patientId: string | null
    treatmentId: string | null
    doctorId: string | null
    googleEventId: string | null
    bookedBy: $Enums.BookingSource | null
    amountPaid: number | null
    price: number | null
    discount: number | null
    createdAt: Date | null
    checkoutTime: Date | null
    guestName: string | null
    guestPhone: string | null
    guestEmail: string | null
    guestDob: Date | null
    patientTreatmentId: string | null
    sessionNumber: number | null
    sessionLabel: string | null
    plannedFee: number | null
  }

  export type AppointmentMaxAggregateOutputType = {
    id: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.ApptStatus | null
    notes: string | null
    patientId: string | null
    treatmentId: string | null
    doctorId: string | null
    googleEventId: string | null
    bookedBy: $Enums.BookingSource | null
    amountPaid: number | null
    price: number | null
    discount: number | null
    createdAt: Date | null
    checkoutTime: Date | null
    guestName: string | null
    guestPhone: string | null
    guestEmail: string | null
    guestDob: Date | null
    patientTreatmentId: string | null
    sessionNumber: number | null
    sessionLabel: string | null
    plannedFee: number | null
  }

  export type AppointmentCountAggregateOutputType = {
    id: number
    startTime: number
    endTime: number
    status: number
    notes: number
    patientId: number
    treatmentId: number
    doctorId: number
    googleEventId: number
    bookedBy: number
    amountPaid: number
    price: number
    discount: number
    createdAt: number
    checkoutTime: number
    guestName: number
    guestPhone: number
    guestEmail: number
    guestDob: number
    patientTreatmentId: number
    sessionNumber: number
    sessionLabel: number
    plannedFee: number
    _all: number
  }


  export type AppointmentAvgAggregateInputType = {
    amountPaid?: true
    price?: true
    discount?: true
    sessionNumber?: true
    plannedFee?: true
  }

  export type AppointmentSumAggregateInputType = {
    amountPaid?: true
    price?: true
    discount?: true
    sessionNumber?: true
    plannedFee?: true
  }

  export type AppointmentMinAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    status?: true
    notes?: true
    patientId?: true
    treatmentId?: true
    doctorId?: true
    googleEventId?: true
    bookedBy?: true
    amountPaid?: true
    price?: true
    discount?: true
    createdAt?: true
    checkoutTime?: true
    guestName?: true
    guestPhone?: true
    guestEmail?: true
    guestDob?: true
    patientTreatmentId?: true
    sessionNumber?: true
    sessionLabel?: true
    plannedFee?: true
  }

  export type AppointmentMaxAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    status?: true
    notes?: true
    patientId?: true
    treatmentId?: true
    doctorId?: true
    googleEventId?: true
    bookedBy?: true
    amountPaid?: true
    price?: true
    discount?: true
    createdAt?: true
    checkoutTime?: true
    guestName?: true
    guestPhone?: true
    guestEmail?: true
    guestDob?: true
    patientTreatmentId?: true
    sessionNumber?: true
    sessionLabel?: true
    plannedFee?: true
  }

  export type AppointmentCountAggregateInputType = {
    id?: true
    startTime?: true
    endTime?: true
    status?: true
    notes?: true
    patientId?: true
    treatmentId?: true
    doctorId?: true
    googleEventId?: true
    bookedBy?: true
    amountPaid?: true
    price?: true
    discount?: true
    createdAt?: true
    checkoutTime?: true
    guestName?: true
    guestPhone?: true
    guestEmail?: true
    guestDob?: true
    patientTreatmentId?: true
    sessionNumber?: true
    sessionLabel?: true
    plannedFee?: true
    _all?: true
  }

  export type AppointmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointment to aggregate.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Appointments
    **/
    _count?: true | AppointmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppointmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppointmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppointmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppointmentMaxAggregateInputType
  }

  export type GetAppointmentAggregateType<T extends AppointmentAggregateArgs> = {
        [P in keyof T & keyof AggregateAppointment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppointment[P]>
      : GetScalarType<T[P], AggregateAppointment[P]>
  }




  export type AppointmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithAggregationInput | AppointmentOrderByWithAggregationInput[]
    by: AppointmentScalarFieldEnum[] | AppointmentScalarFieldEnum
    having?: AppointmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppointmentCountAggregateInputType | true
    _avg?: AppointmentAvgAggregateInputType
    _sum?: AppointmentSumAggregateInputType
    _min?: AppointmentMinAggregateInputType
    _max?: AppointmentMaxAggregateInputType
  }

  export type AppointmentGroupByOutputType = {
    id: string
    startTime: Date
    endTime: Date
    status: $Enums.ApptStatus
    notes: string | null
    patientId: string
    treatmentId: string
    doctorId: string | null
    googleEventId: string | null
    bookedBy: $Enums.BookingSource
    amountPaid: number | null
    price: number
    discount: number
    createdAt: Date
    checkoutTime: Date | null
    guestName: string | null
    guestPhone: string | null
    guestEmail: string | null
    guestDob: Date | null
    patientTreatmentId: string | null
    sessionNumber: number | null
    sessionLabel: string | null
    plannedFee: number | null
    _count: AppointmentCountAggregateOutputType | null
    _avg: AppointmentAvgAggregateOutputType | null
    _sum: AppointmentSumAggregateOutputType | null
    _min: AppointmentMinAggregateOutputType | null
    _max: AppointmentMaxAggregateOutputType | null
  }

  type GetAppointmentGroupByPayload<T extends AppointmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppointmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppointmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
            : GetScalarType<T[P], AppointmentGroupByOutputType[P]>
        }
      >
    >


  export type AppointmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    patientId?: boolean
    treatmentId?: boolean
    doctorId?: boolean
    googleEventId?: boolean
    bookedBy?: boolean
    amountPaid?: boolean
    price?: boolean
    discount?: boolean
    createdAt?: boolean
    checkoutTime?: boolean
    guestName?: boolean
    guestPhone?: boolean
    guestEmail?: boolean
    guestDob?: boolean
    patientTreatmentId?: boolean
    sessionNumber?: boolean
    sessionLabel?: boolean
    plannedFee?: boolean
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    doctor?: boolean | Appointment$doctorArgs<ExtArgs>
    clinicalNotes?: boolean | Appointment$clinicalNotesArgs<ExtArgs>
    patientTreatment?: boolean | Appointment$patientTreatmentArgs<ExtArgs>
    payments?: boolean | Appointment$paymentsArgs<ExtArgs>
    _count?: boolean | AppointmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    patientId?: boolean
    treatmentId?: boolean
    doctorId?: boolean
    googleEventId?: boolean
    bookedBy?: boolean
    amountPaid?: boolean
    price?: boolean
    discount?: boolean
    createdAt?: boolean
    checkoutTime?: boolean
    guestName?: boolean
    guestPhone?: boolean
    guestEmail?: boolean
    guestDob?: boolean
    patientTreatmentId?: boolean
    sessionNumber?: boolean
    sessionLabel?: boolean
    plannedFee?: boolean
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    doctor?: boolean | Appointment$doctorArgs<ExtArgs>
    patientTreatment?: boolean | Appointment$patientTreatmentArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    patientId?: boolean
    treatmentId?: boolean
    doctorId?: boolean
    googleEventId?: boolean
    bookedBy?: boolean
    amountPaid?: boolean
    price?: boolean
    discount?: boolean
    createdAt?: boolean
    checkoutTime?: boolean
    guestName?: boolean
    guestPhone?: boolean
    guestEmail?: boolean
    guestDob?: boolean
    patientTreatmentId?: boolean
    sessionNumber?: boolean
    sessionLabel?: boolean
    plannedFee?: boolean
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    doctor?: boolean | Appointment$doctorArgs<ExtArgs>
    patientTreatment?: boolean | Appointment$patientTreatmentArgs<ExtArgs>
  }, ExtArgs["result"]["appointment"]>

  export type AppointmentSelectScalar = {
    id?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    notes?: boolean
    patientId?: boolean
    treatmentId?: boolean
    doctorId?: boolean
    googleEventId?: boolean
    bookedBy?: boolean
    amountPaid?: boolean
    price?: boolean
    discount?: boolean
    createdAt?: boolean
    checkoutTime?: boolean
    guestName?: boolean
    guestPhone?: boolean
    guestEmail?: boolean
    guestDob?: boolean
    patientTreatmentId?: boolean
    sessionNumber?: boolean
    sessionLabel?: boolean
    plannedFee?: boolean
  }

  export type AppointmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "startTime" | "endTime" | "status" | "notes" | "patientId" | "treatmentId" | "doctorId" | "googleEventId" | "bookedBy" | "amountPaid" | "price" | "discount" | "createdAt" | "checkoutTime" | "guestName" | "guestPhone" | "guestEmail" | "guestDob" | "patientTreatmentId" | "sessionNumber" | "sessionLabel" | "plannedFee", ExtArgs["result"]["appointment"]>
  export type AppointmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    doctor?: boolean | Appointment$doctorArgs<ExtArgs>
    clinicalNotes?: boolean | Appointment$clinicalNotesArgs<ExtArgs>
    patientTreatment?: boolean | Appointment$patientTreatmentArgs<ExtArgs>
    payments?: boolean | Appointment$paymentsArgs<ExtArgs>
    _count?: boolean | AppointmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AppointmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    doctor?: boolean | Appointment$doctorArgs<ExtArgs>
    patientTreatment?: boolean | Appointment$patientTreatmentArgs<ExtArgs>
  }
  export type AppointmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    doctor?: boolean | Appointment$doctorArgs<ExtArgs>
    patientTreatment?: boolean | Appointment$patientTreatmentArgs<ExtArgs>
  }

  export type $AppointmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Appointment"
    objects: {
      patient: Prisma.$UserPayload<ExtArgs>
      treatment: Prisma.$TreatmentPayload<ExtArgs>
      doctor: Prisma.$DoctorPayload<ExtArgs> | null
      clinicalNotes: Prisma.$ClinicalNotePayload<ExtArgs>[]
      patientTreatment: Prisma.$PatientTreatmentPayload<ExtArgs> | null
      payments: Prisma.$PaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      startTime: Date
      endTime: Date
      status: $Enums.ApptStatus
      notes: string | null
      patientId: string
      treatmentId: string
      doctorId: string | null
      googleEventId: string | null
      bookedBy: $Enums.BookingSource
      amountPaid: number | null
      price: number
      discount: number
      createdAt: Date
      checkoutTime: Date | null
      guestName: string | null
      guestPhone: string | null
      guestEmail: string | null
      guestDob: Date | null
      patientTreatmentId: string | null
      sessionNumber: number | null
      sessionLabel: string | null
      plannedFee: number | null
    }, ExtArgs["result"]["appointment"]>
    composites: {}
  }

  type AppointmentGetPayload<S extends boolean | null | undefined | AppointmentDefaultArgs> = $Result.GetResult<Prisma.$AppointmentPayload, S>

  type AppointmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppointmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppointmentCountAggregateInputType | true
    }

  export interface AppointmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Appointment'], meta: { name: 'Appointment' } }
    /**
     * Find zero or one Appointment that matches the filter.
     * @param {AppointmentFindUniqueArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppointmentFindUniqueArgs>(args: SelectSubset<T, AppointmentFindUniqueArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Appointment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppointmentFindUniqueOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppointmentFindUniqueOrThrowArgs>(args: SelectSubset<T, AppointmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppointmentFindFirstArgs>(args?: SelectSubset<T, AppointmentFindFirstArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Appointment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindFirstOrThrowArgs} args - Arguments to find a Appointment
     * @example
     * // Get one Appointment
     * const appointment = await prisma.appointment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppointmentFindFirstOrThrowArgs>(args?: SelectSubset<T, AppointmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Appointments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Appointments
     * const appointments = await prisma.appointment.findMany()
     * 
     * // Get first 10 Appointments
     * const appointments = await prisma.appointment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appointmentWithIdOnly = await prisma.appointment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppointmentFindManyArgs>(args?: SelectSubset<T, AppointmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Appointment.
     * @param {AppointmentCreateArgs} args - Arguments to create a Appointment.
     * @example
     * // Create one Appointment
     * const Appointment = await prisma.appointment.create({
     *   data: {
     *     // ... data to create a Appointment
     *   }
     * })
     * 
     */
    create<T extends AppointmentCreateArgs>(args: SelectSubset<T, AppointmentCreateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Appointments.
     * @param {AppointmentCreateManyArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppointmentCreateManyArgs>(args?: SelectSubset<T, AppointmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Appointments and returns the data saved in the database.
     * @param {AppointmentCreateManyAndReturnArgs} args - Arguments to create many Appointments.
     * @example
     * // Create many Appointments
     * const appointment = await prisma.appointment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppointmentCreateManyAndReturnArgs>(args?: SelectSubset<T, AppointmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Appointment.
     * @param {AppointmentDeleteArgs} args - Arguments to delete one Appointment.
     * @example
     * // Delete one Appointment
     * const Appointment = await prisma.appointment.delete({
     *   where: {
     *     // ... filter to delete one Appointment
     *   }
     * })
     * 
     */
    delete<T extends AppointmentDeleteArgs>(args: SelectSubset<T, AppointmentDeleteArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Appointment.
     * @param {AppointmentUpdateArgs} args - Arguments to update one Appointment.
     * @example
     * // Update one Appointment
     * const appointment = await prisma.appointment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppointmentUpdateArgs>(args: SelectSubset<T, AppointmentUpdateArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Appointments.
     * @param {AppointmentDeleteManyArgs} args - Arguments to filter Appointments to delete.
     * @example
     * // Delete a few Appointments
     * const { count } = await prisma.appointment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppointmentDeleteManyArgs>(args?: SelectSubset<T, AppointmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppointmentUpdateManyArgs>(args: SelectSubset<T, AppointmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Appointments and returns the data updated in the database.
     * @param {AppointmentUpdateManyAndReturnArgs} args - Arguments to update many Appointments.
     * @example
     * // Update many Appointments
     * const appointment = await prisma.appointment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Appointments and only return the `id`
     * const appointmentWithIdOnly = await prisma.appointment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppointmentUpdateManyAndReturnArgs>(args: SelectSubset<T, AppointmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Appointment.
     * @param {AppointmentUpsertArgs} args - Arguments to update or create a Appointment.
     * @example
     * // Update or create a Appointment
     * const appointment = await prisma.appointment.upsert({
     *   create: {
     *     // ... data to create a Appointment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Appointment we want to update
     *   }
     * })
     */
    upsert<T extends AppointmentUpsertArgs>(args: SelectSubset<T, AppointmentUpsertArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Appointments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentCountArgs} args - Arguments to filter Appointments to count.
     * @example
     * // Count the number of Appointments
     * const count = await prisma.appointment.count({
     *   where: {
     *     // ... the filter for the Appointments we want to count
     *   }
     * })
    **/
    count<T extends AppointmentCountArgs>(
      args?: Subset<T, AppointmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppointmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppointmentAggregateArgs>(args: Subset<T, AppointmentAggregateArgs>): Prisma.PrismaPromise<GetAppointmentAggregateType<T>>

    /**
     * Group by Appointment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppointmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppointmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppointmentGroupByArgs['orderBy'] }
        : { orderBy?: AppointmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppointmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppointmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Appointment model
   */
  readonly fields: AppointmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Appointment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppointmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    treatment<T extends TreatmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TreatmentDefaultArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    doctor<T extends Appointment$doctorArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$doctorArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    clinicalNotes<T extends Appointment$clinicalNotesArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$clinicalNotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    patientTreatment<T extends Appointment$patientTreatmentArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$patientTreatmentArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    payments<T extends Appointment$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Appointment$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Appointment model
   */
  interface AppointmentFieldRefs {
    readonly id: FieldRef<"Appointment", 'String'>
    readonly startTime: FieldRef<"Appointment", 'DateTime'>
    readonly endTime: FieldRef<"Appointment", 'DateTime'>
    readonly status: FieldRef<"Appointment", 'ApptStatus'>
    readonly notes: FieldRef<"Appointment", 'String'>
    readonly patientId: FieldRef<"Appointment", 'String'>
    readonly treatmentId: FieldRef<"Appointment", 'String'>
    readonly doctorId: FieldRef<"Appointment", 'String'>
    readonly googleEventId: FieldRef<"Appointment", 'String'>
    readonly bookedBy: FieldRef<"Appointment", 'BookingSource'>
    readonly amountPaid: FieldRef<"Appointment", 'Int'>
    readonly price: FieldRef<"Appointment", 'Int'>
    readonly discount: FieldRef<"Appointment", 'Int'>
    readonly createdAt: FieldRef<"Appointment", 'DateTime'>
    readonly checkoutTime: FieldRef<"Appointment", 'DateTime'>
    readonly guestName: FieldRef<"Appointment", 'String'>
    readonly guestPhone: FieldRef<"Appointment", 'String'>
    readonly guestEmail: FieldRef<"Appointment", 'String'>
    readonly guestDob: FieldRef<"Appointment", 'DateTime'>
    readonly patientTreatmentId: FieldRef<"Appointment", 'String'>
    readonly sessionNumber: FieldRef<"Appointment", 'Int'>
    readonly sessionLabel: FieldRef<"Appointment", 'String'>
    readonly plannedFee: FieldRef<"Appointment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Appointment findUnique
   */
  export type AppointmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findUniqueOrThrow
   */
  export type AppointmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment findFirst
   */
  export type AppointmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findFirstOrThrow
   */
  export type AppointmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointment to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Appointments.
     */
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment findMany
   */
  export type AppointmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter, which Appointments to fetch.
     */
    where?: AppointmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Appointments to fetch.
     */
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Appointments.
     */
    cursor?: AppointmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Appointments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Appointments.
     */
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Appointment create
   */
  export type AppointmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Appointment.
     */
    data: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
  }

  /**
   * Appointment createMany
   */
  export type AppointmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Appointment createManyAndReturn
   */
  export type AppointmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to create many Appointments.
     */
    data: AppointmentCreateManyInput | AppointmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment update
   */
  export type AppointmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Appointment.
     */
    data: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
    /**
     * Choose, which Appointment to update.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment updateMany
   */
  export type AppointmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
  }

  /**
   * Appointment updateManyAndReturn
   */
  export type AppointmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * The data used to update Appointments.
     */
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyInput>
    /**
     * Filter which Appointments to update
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Appointment upsert
   */
  export type AppointmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Appointment to update in case it exists.
     */
    where: AppointmentWhereUniqueInput
    /**
     * In case the Appointment found by the `where` argument doesn't exist, create a new Appointment with this data.
     */
    create: XOR<AppointmentCreateInput, AppointmentUncheckedCreateInput>
    /**
     * In case the Appointment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppointmentUpdateInput, AppointmentUncheckedUpdateInput>
  }

  /**
   * Appointment delete
   */
  export type AppointmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    /**
     * Filter which Appointment to delete.
     */
    where: AppointmentWhereUniqueInput
  }

  /**
   * Appointment deleteMany
   */
  export type AppointmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Appointments to delete
     */
    where?: AppointmentWhereInput
    /**
     * Limit how many Appointments to delete.
     */
    limit?: number
  }

  /**
   * Appointment.doctor
   */
  export type Appointment$doctorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    where?: DoctorWhereInput
  }

  /**
   * Appointment.clinicalNotes
   */
  export type Appointment$clinicalNotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    where?: ClinicalNoteWhereInput
    orderBy?: ClinicalNoteOrderByWithRelationInput | ClinicalNoteOrderByWithRelationInput[]
    cursor?: ClinicalNoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClinicalNoteScalarFieldEnum | ClinicalNoteScalarFieldEnum[]
  }

  /**
   * Appointment.patientTreatment
   */
  export type Appointment$patientTreatmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    where?: PatientTreatmentWhereInput
  }

  /**
   * Appointment.payments
   */
  export type Appointment$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Appointment without action
   */
  export type AppointmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
  }


  /**
   * Model ClinicalNote
   */

  export type AggregateClinicalNote = {
    _count: ClinicalNoteCountAggregateOutputType | null
    _min: ClinicalNoteMinAggregateOutputType | null
    _max: ClinicalNoteMaxAggregateOutputType | null
  }

  export type ClinicalNoteMinAggregateOutputType = {
    id: string | null
    appointmentId: string | null
    diagnosis: string | null
    treatmentDone: string | null
    prescription: string | null
    remarks: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClinicalNoteMaxAggregateOutputType = {
    id: string | null
    appointmentId: string | null
    diagnosis: string | null
    treatmentDone: string | null
    prescription: string | null
    remarks: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClinicalNoteCountAggregateOutputType = {
    id: number
    appointmentId: number
    diagnosis: number
    treatmentDone: number
    prescription: number
    remarks: number
    odontogramData: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClinicalNoteMinAggregateInputType = {
    id?: true
    appointmentId?: true
    diagnosis?: true
    treatmentDone?: true
    prescription?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClinicalNoteMaxAggregateInputType = {
    id?: true
    appointmentId?: true
    diagnosis?: true
    treatmentDone?: true
    prescription?: true
    remarks?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClinicalNoteCountAggregateInputType = {
    id?: true
    appointmentId?: true
    diagnosis?: true
    treatmentDone?: true
    prescription?: true
    remarks?: true
    odontogramData?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClinicalNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalNote to aggregate.
     */
    where?: ClinicalNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalNotes to fetch.
     */
    orderBy?: ClinicalNoteOrderByWithRelationInput | ClinicalNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClinicalNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ClinicalNotes
    **/
    _count?: true | ClinicalNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClinicalNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClinicalNoteMaxAggregateInputType
  }

  export type GetClinicalNoteAggregateType<T extends ClinicalNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateClinicalNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClinicalNote[P]>
      : GetScalarType<T[P], AggregateClinicalNote[P]>
  }




  export type ClinicalNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClinicalNoteWhereInput
    orderBy?: ClinicalNoteOrderByWithAggregationInput | ClinicalNoteOrderByWithAggregationInput[]
    by: ClinicalNoteScalarFieldEnum[] | ClinicalNoteScalarFieldEnum
    having?: ClinicalNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClinicalNoteCountAggregateInputType | true
    _min?: ClinicalNoteMinAggregateInputType
    _max?: ClinicalNoteMaxAggregateInputType
  }

  export type ClinicalNoteGroupByOutputType = {
    id: string
    appointmentId: string
    diagnosis: string | null
    treatmentDone: string
    prescription: string | null
    remarks: string | null
    odontogramData: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ClinicalNoteCountAggregateOutputType | null
    _min: ClinicalNoteMinAggregateOutputType | null
    _max: ClinicalNoteMaxAggregateOutputType | null
  }

  type GetClinicalNoteGroupByPayload<T extends ClinicalNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClinicalNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClinicalNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClinicalNoteGroupByOutputType[P]>
            : GetScalarType<T[P], ClinicalNoteGroupByOutputType[P]>
        }
      >
    >


  export type ClinicalNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    diagnosis?: boolean
    treatmentDone?: boolean
    prescription?: boolean
    remarks?: boolean
    odontogramData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clinicalNote"]>

  export type ClinicalNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    diagnosis?: boolean
    treatmentDone?: boolean
    prescription?: boolean
    remarks?: boolean
    odontogramData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clinicalNote"]>

  export type ClinicalNoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    appointmentId?: boolean
    diagnosis?: boolean
    treatmentDone?: boolean
    prescription?: boolean
    remarks?: boolean
    odontogramData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["clinicalNote"]>

  export type ClinicalNoteSelectScalar = {
    id?: boolean
    appointmentId?: boolean
    diagnosis?: boolean
    treatmentDone?: boolean
    prescription?: boolean
    remarks?: boolean
    odontogramData?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClinicalNoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "appointmentId" | "diagnosis" | "treatmentDone" | "prescription" | "remarks" | "odontogramData" | "createdAt" | "updatedAt", ExtArgs["result"]["clinicalNote"]>
  export type ClinicalNoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }
  export type ClinicalNoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }
  export type ClinicalNoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointment?: boolean | AppointmentDefaultArgs<ExtArgs>
  }

  export type $ClinicalNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ClinicalNote"
    objects: {
      appointment: Prisma.$AppointmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      appointmentId: string
      diagnosis: string | null
      treatmentDone: string
      prescription: string | null
      remarks: string | null
      odontogramData: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["clinicalNote"]>
    composites: {}
  }

  type ClinicalNoteGetPayload<S extends boolean | null | undefined | ClinicalNoteDefaultArgs> = $Result.GetResult<Prisma.$ClinicalNotePayload, S>

  type ClinicalNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClinicalNoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClinicalNoteCountAggregateInputType | true
    }

  export interface ClinicalNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ClinicalNote'], meta: { name: 'ClinicalNote' } }
    /**
     * Find zero or one ClinicalNote that matches the filter.
     * @param {ClinicalNoteFindUniqueArgs} args - Arguments to find a ClinicalNote
     * @example
     * // Get one ClinicalNote
     * const clinicalNote = await prisma.clinicalNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClinicalNoteFindUniqueArgs>(args: SelectSubset<T, ClinicalNoteFindUniqueArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ClinicalNote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClinicalNoteFindUniqueOrThrowArgs} args - Arguments to find a ClinicalNote
     * @example
     * // Get one ClinicalNote
     * const clinicalNote = await prisma.clinicalNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClinicalNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, ClinicalNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClinicalNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteFindFirstArgs} args - Arguments to find a ClinicalNote
     * @example
     * // Get one ClinicalNote
     * const clinicalNote = await prisma.clinicalNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClinicalNoteFindFirstArgs>(args?: SelectSubset<T, ClinicalNoteFindFirstArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ClinicalNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteFindFirstOrThrowArgs} args - Arguments to find a ClinicalNote
     * @example
     * // Get one ClinicalNote
     * const clinicalNote = await prisma.clinicalNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClinicalNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, ClinicalNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ClinicalNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ClinicalNotes
     * const clinicalNotes = await prisma.clinicalNote.findMany()
     * 
     * // Get first 10 ClinicalNotes
     * const clinicalNotes = await prisma.clinicalNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clinicalNoteWithIdOnly = await prisma.clinicalNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClinicalNoteFindManyArgs>(args?: SelectSubset<T, ClinicalNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ClinicalNote.
     * @param {ClinicalNoteCreateArgs} args - Arguments to create a ClinicalNote.
     * @example
     * // Create one ClinicalNote
     * const ClinicalNote = await prisma.clinicalNote.create({
     *   data: {
     *     // ... data to create a ClinicalNote
     *   }
     * })
     * 
     */
    create<T extends ClinicalNoteCreateArgs>(args: SelectSubset<T, ClinicalNoteCreateArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ClinicalNotes.
     * @param {ClinicalNoteCreateManyArgs} args - Arguments to create many ClinicalNotes.
     * @example
     * // Create many ClinicalNotes
     * const clinicalNote = await prisma.clinicalNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClinicalNoteCreateManyArgs>(args?: SelectSubset<T, ClinicalNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ClinicalNotes and returns the data saved in the database.
     * @param {ClinicalNoteCreateManyAndReturnArgs} args - Arguments to create many ClinicalNotes.
     * @example
     * // Create many ClinicalNotes
     * const clinicalNote = await prisma.clinicalNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ClinicalNotes and only return the `id`
     * const clinicalNoteWithIdOnly = await prisma.clinicalNote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClinicalNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, ClinicalNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ClinicalNote.
     * @param {ClinicalNoteDeleteArgs} args - Arguments to delete one ClinicalNote.
     * @example
     * // Delete one ClinicalNote
     * const ClinicalNote = await prisma.clinicalNote.delete({
     *   where: {
     *     // ... filter to delete one ClinicalNote
     *   }
     * })
     * 
     */
    delete<T extends ClinicalNoteDeleteArgs>(args: SelectSubset<T, ClinicalNoteDeleteArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ClinicalNote.
     * @param {ClinicalNoteUpdateArgs} args - Arguments to update one ClinicalNote.
     * @example
     * // Update one ClinicalNote
     * const clinicalNote = await prisma.clinicalNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClinicalNoteUpdateArgs>(args: SelectSubset<T, ClinicalNoteUpdateArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ClinicalNotes.
     * @param {ClinicalNoteDeleteManyArgs} args - Arguments to filter ClinicalNotes to delete.
     * @example
     * // Delete a few ClinicalNotes
     * const { count } = await prisma.clinicalNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClinicalNoteDeleteManyArgs>(args?: SelectSubset<T, ClinicalNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClinicalNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ClinicalNotes
     * const clinicalNote = await prisma.clinicalNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClinicalNoteUpdateManyArgs>(args: SelectSubset<T, ClinicalNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ClinicalNotes and returns the data updated in the database.
     * @param {ClinicalNoteUpdateManyAndReturnArgs} args - Arguments to update many ClinicalNotes.
     * @example
     * // Update many ClinicalNotes
     * const clinicalNote = await prisma.clinicalNote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ClinicalNotes and only return the `id`
     * const clinicalNoteWithIdOnly = await prisma.clinicalNote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClinicalNoteUpdateManyAndReturnArgs>(args: SelectSubset<T, ClinicalNoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ClinicalNote.
     * @param {ClinicalNoteUpsertArgs} args - Arguments to update or create a ClinicalNote.
     * @example
     * // Update or create a ClinicalNote
     * const clinicalNote = await prisma.clinicalNote.upsert({
     *   create: {
     *     // ... data to create a ClinicalNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ClinicalNote we want to update
     *   }
     * })
     */
    upsert<T extends ClinicalNoteUpsertArgs>(args: SelectSubset<T, ClinicalNoteUpsertArgs<ExtArgs>>): Prisma__ClinicalNoteClient<$Result.GetResult<Prisma.$ClinicalNotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ClinicalNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteCountArgs} args - Arguments to filter ClinicalNotes to count.
     * @example
     * // Count the number of ClinicalNotes
     * const count = await prisma.clinicalNote.count({
     *   where: {
     *     // ... the filter for the ClinicalNotes we want to count
     *   }
     * })
    **/
    count<T extends ClinicalNoteCountArgs>(
      args?: Subset<T, ClinicalNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClinicalNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ClinicalNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClinicalNoteAggregateArgs>(args: Subset<T, ClinicalNoteAggregateArgs>): Prisma.PrismaPromise<GetClinicalNoteAggregateType<T>>

    /**
     * Group by ClinicalNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClinicalNoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClinicalNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClinicalNoteGroupByArgs['orderBy'] }
        : { orderBy?: ClinicalNoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClinicalNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClinicalNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ClinicalNote model
   */
  readonly fields: ClinicalNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ClinicalNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClinicalNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointment<T extends AppointmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppointmentDefaultArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ClinicalNote model
   */
  interface ClinicalNoteFieldRefs {
    readonly id: FieldRef<"ClinicalNote", 'String'>
    readonly appointmentId: FieldRef<"ClinicalNote", 'String'>
    readonly diagnosis: FieldRef<"ClinicalNote", 'String'>
    readonly treatmentDone: FieldRef<"ClinicalNote", 'String'>
    readonly prescription: FieldRef<"ClinicalNote", 'String'>
    readonly remarks: FieldRef<"ClinicalNote", 'String'>
    readonly odontogramData: FieldRef<"ClinicalNote", 'Json'>
    readonly createdAt: FieldRef<"ClinicalNote", 'DateTime'>
    readonly updatedAt: FieldRef<"ClinicalNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ClinicalNote findUnique
   */
  export type ClinicalNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalNote to fetch.
     */
    where: ClinicalNoteWhereUniqueInput
  }

  /**
   * ClinicalNote findUniqueOrThrow
   */
  export type ClinicalNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalNote to fetch.
     */
    where: ClinicalNoteWhereUniqueInput
  }

  /**
   * ClinicalNote findFirst
   */
  export type ClinicalNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalNote to fetch.
     */
    where?: ClinicalNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalNotes to fetch.
     */
    orderBy?: ClinicalNoteOrderByWithRelationInput | ClinicalNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalNotes.
     */
    cursor?: ClinicalNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalNotes.
     */
    distinct?: ClinicalNoteScalarFieldEnum | ClinicalNoteScalarFieldEnum[]
  }

  /**
   * ClinicalNote findFirstOrThrow
   */
  export type ClinicalNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalNote to fetch.
     */
    where?: ClinicalNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalNotes to fetch.
     */
    orderBy?: ClinicalNoteOrderByWithRelationInput | ClinicalNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ClinicalNotes.
     */
    cursor?: ClinicalNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ClinicalNotes.
     */
    distinct?: ClinicalNoteScalarFieldEnum | ClinicalNoteScalarFieldEnum[]
  }

  /**
   * ClinicalNote findMany
   */
  export type ClinicalNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * Filter, which ClinicalNotes to fetch.
     */
    where?: ClinicalNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ClinicalNotes to fetch.
     */
    orderBy?: ClinicalNoteOrderByWithRelationInput | ClinicalNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ClinicalNotes.
     */
    cursor?: ClinicalNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ClinicalNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ClinicalNotes.
     */
    skip?: number
    distinct?: ClinicalNoteScalarFieldEnum | ClinicalNoteScalarFieldEnum[]
  }

  /**
   * ClinicalNote create
   */
  export type ClinicalNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * The data needed to create a ClinicalNote.
     */
    data: XOR<ClinicalNoteCreateInput, ClinicalNoteUncheckedCreateInput>
  }

  /**
   * ClinicalNote createMany
   */
  export type ClinicalNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ClinicalNotes.
     */
    data: ClinicalNoteCreateManyInput | ClinicalNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ClinicalNote createManyAndReturn
   */
  export type ClinicalNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * The data used to create many ClinicalNotes.
     */
    data: ClinicalNoteCreateManyInput | ClinicalNoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClinicalNote update
   */
  export type ClinicalNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * The data needed to update a ClinicalNote.
     */
    data: XOR<ClinicalNoteUpdateInput, ClinicalNoteUncheckedUpdateInput>
    /**
     * Choose, which ClinicalNote to update.
     */
    where: ClinicalNoteWhereUniqueInput
  }

  /**
   * ClinicalNote updateMany
   */
  export type ClinicalNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ClinicalNotes.
     */
    data: XOR<ClinicalNoteUpdateManyMutationInput, ClinicalNoteUncheckedUpdateManyInput>
    /**
     * Filter which ClinicalNotes to update
     */
    where?: ClinicalNoteWhereInput
    /**
     * Limit how many ClinicalNotes to update.
     */
    limit?: number
  }

  /**
   * ClinicalNote updateManyAndReturn
   */
  export type ClinicalNoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * The data used to update ClinicalNotes.
     */
    data: XOR<ClinicalNoteUpdateManyMutationInput, ClinicalNoteUncheckedUpdateManyInput>
    /**
     * Filter which ClinicalNotes to update
     */
    where?: ClinicalNoteWhereInput
    /**
     * Limit how many ClinicalNotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ClinicalNote upsert
   */
  export type ClinicalNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * The filter to search for the ClinicalNote to update in case it exists.
     */
    where: ClinicalNoteWhereUniqueInput
    /**
     * In case the ClinicalNote found by the `where` argument doesn't exist, create a new ClinicalNote with this data.
     */
    create: XOR<ClinicalNoteCreateInput, ClinicalNoteUncheckedCreateInput>
    /**
     * In case the ClinicalNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClinicalNoteUpdateInput, ClinicalNoteUncheckedUpdateInput>
  }

  /**
   * ClinicalNote delete
   */
  export type ClinicalNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
    /**
     * Filter which ClinicalNote to delete.
     */
    where: ClinicalNoteWhereUniqueInput
  }

  /**
   * ClinicalNote deleteMany
   */
  export type ClinicalNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ClinicalNotes to delete
     */
    where?: ClinicalNoteWhereInput
    /**
     * Limit how many ClinicalNotes to delete.
     */
    limit?: number
  }

  /**
   * ClinicalNote without action
   */
  export type ClinicalNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClinicalNote
     */
    select?: ClinicalNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ClinicalNote
     */
    omit?: ClinicalNoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClinicalNoteInclude<ExtArgs> | null
  }


  /**
   * Model Treatment
   */

  export type AggregateTreatment = {
    _count: TreatmentCountAggregateOutputType | null
    _avg: TreatmentAvgAggregateOutputType | null
    _sum: TreatmentSumAggregateOutputType | null
    _min: TreatmentMinAggregateOutputType | null
    _max: TreatmentMaxAggregateOutputType | null
  }

  export type TreatmentAvgAggregateOutputType = {
    durationMin: number | null
    price: number | null
    discountedPrice: number | null
    defaultSessions: number | null
  }

  export type TreatmentSumAggregateOutputType = {
    durationMin: number | null
    price: number | null
    discountedPrice: number | null
    defaultSessions: number | null
  }

  export type TreatmentMinAggregateOutputType = {
    id: string | null
    name: string | null
    durationMin: number | null
    price: number | null
    discountedPrice: number | null
    description: string | null
    instructions: string | null
    isActive: boolean | null
    imageUrl: string | null
    category: string | null
    isMultiSession: boolean | null
    defaultSessions: number | null
  }

  export type TreatmentMaxAggregateOutputType = {
    id: string | null
    name: string | null
    durationMin: number | null
    price: number | null
    discountedPrice: number | null
    description: string | null
    instructions: string | null
    isActive: boolean | null
    imageUrl: string | null
    category: string | null
    isMultiSession: boolean | null
    defaultSessions: number | null
  }

  export type TreatmentCountAggregateOutputType = {
    id: number
    name: number
    durationMin: number
    price: number
    discountedPrice: number
    description: number
    instructions: number
    isActive: number
    imageUrl: number
    category: number
    isMultiSession: number
    defaultSessions: number
    _all: number
  }


  export type TreatmentAvgAggregateInputType = {
    durationMin?: true
    price?: true
    discountedPrice?: true
    defaultSessions?: true
  }

  export type TreatmentSumAggregateInputType = {
    durationMin?: true
    price?: true
    discountedPrice?: true
    defaultSessions?: true
  }

  export type TreatmentMinAggregateInputType = {
    id?: true
    name?: true
    durationMin?: true
    price?: true
    discountedPrice?: true
    description?: true
    instructions?: true
    isActive?: true
    imageUrl?: true
    category?: true
    isMultiSession?: true
    defaultSessions?: true
  }

  export type TreatmentMaxAggregateInputType = {
    id?: true
    name?: true
    durationMin?: true
    price?: true
    discountedPrice?: true
    description?: true
    instructions?: true
    isActive?: true
    imageUrl?: true
    category?: true
    isMultiSession?: true
    defaultSessions?: true
  }

  export type TreatmentCountAggregateInputType = {
    id?: true
    name?: true
    durationMin?: true
    price?: true
    discountedPrice?: true
    description?: true
    instructions?: true
    isActive?: true
    imageUrl?: true
    category?: true
    isMultiSession?: true
    defaultSessions?: true
    _all?: true
  }

  export type TreatmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Treatment to aggregate.
     */
    where?: TreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Treatments to fetch.
     */
    orderBy?: TreatmentOrderByWithRelationInput | TreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Treatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Treatments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Treatments
    **/
    _count?: true | TreatmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TreatmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TreatmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TreatmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TreatmentMaxAggregateInputType
  }

  export type GetTreatmentAggregateType<T extends TreatmentAggregateArgs> = {
        [P in keyof T & keyof AggregateTreatment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTreatment[P]>
      : GetScalarType<T[P], AggregateTreatment[P]>
  }




  export type TreatmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TreatmentWhereInput
    orderBy?: TreatmentOrderByWithAggregationInput | TreatmentOrderByWithAggregationInput[]
    by: TreatmentScalarFieldEnum[] | TreatmentScalarFieldEnum
    having?: TreatmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TreatmentCountAggregateInputType | true
    _avg?: TreatmentAvgAggregateInputType
    _sum?: TreatmentSumAggregateInputType
    _min?: TreatmentMinAggregateInputType
    _max?: TreatmentMaxAggregateInputType
  }

  export type TreatmentGroupByOutputType = {
    id: string
    name: string
    durationMin: number
    price: number
    discountedPrice: number | null
    description: string | null
    instructions: string | null
    isActive: boolean
    imageUrl: string | null
    category: string
    isMultiSession: boolean
    defaultSessions: number
    _count: TreatmentCountAggregateOutputType | null
    _avg: TreatmentAvgAggregateOutputType | null
    _sum: TreatmentSumAggregateOutputType | null
    _min: TreatmentMinAggregateOutputType | null
    _max: TreatmentMaxAggregateOutputType | null
  }

  type GetTreatmentGroupByPayload<T extends TreatmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TreatmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TreatmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TreatmentGroupByOutputType[P]>
            : GetScalarType<T[P], TreatmentGroupByOutputType[P]>
        }
      >
    >


  export type TreatmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    durationMin?: boolean
    price?: boolean
    discountedPrice?: boolean
    description?: boolean
    instructions?: boolean
    isActive?: boolean
    imageUrl?: boolean
    category?: boolean
    isMultiSession?: boolean
    defaultSessions?: boolean
    appointments?: boolean | Treatment$appointmentsArgs<ExtArgs>
    patientTreatments?: boolean | Treatment$patientTreatmentsArgs<ExtArgs>
    _count?: boolean | TreatmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["treatment"]>

  export type TreatmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    durationMin?: boolean
    price?: boolean
    discountedPrice?: boolean
    description?: boolean
    instructions?: boolean
    isActive?: boolean
    imageUrl?: boolean
    category?: boolean
    isMultiSession?: boolean
    defaultSessions?: boolean
  }, ExtArgs["result"]["treatment"]>

  export type TreatmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    durationMin?: boolean
    price?: boolean
    discountedPrice?: boolean
    description?: boolean
    instructions?: boolean
    isActive?: boolean
    imageUrl?: boolean
    category?: boolean
    isMultiSession?: boolean
    defaultSessions?: boolean
  }, ExtArgs["result"]["treatment"]>

  export type TreatmentSelectScalar = {
    id?: boolean
    name?: boolean
    durationMin?: boolean
    price?: boolean
    discountedPrice?: boolean
    description?: boolean
    instructions?: boolean
    isActive?: boolean
    imageUrl?: boolean
    category?: boolean
    isMultiSession?: boolean
    defaultSessions?: boolean
  }

  export type TreatmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "durationMin" | "price" | "discountedPrice" | "description" | "instructions" | "isActive" | "imageUrl" | "category" | "isMultiSession" | "defaultSessions", ExtArgs["result"]["treatment"]>
  export type TreatmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Treatment$appointmentsArgs<ExtArgs>
    patientTreatments?: boolean | Treatment$patientTreatmentsArgs<ExtArgs>
    _count?: boolean | TreatmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TreatmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TreatmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TreatmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Treatment"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      patientTreatments: Prisma.$PatientTreatmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      durationMin: number
      price: number
      discountedPrice: number | null
      description: string | null
      instructions: string | null
      isActive: boolean
      imageUrl: string | null
      category: string
      isMultiSession: boolean
      defaultSessions: number
    }, ExtArgs["result"]["treatment"]>
    composites: {}
  }

  type TreatmentGetPayload<S extends boolean | null | undefined | TreatmentDefaultArgs> = $Result.GetResult<Prisma.$TreatmentPayload, S>

  type TreatmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TreatmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TreatmentCountAggregateInputType | true
    }

  export interface TreatmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Treatment'], meta: { name: 'Treatment' } }
    /**
     * Find zero or one Treatment that matches the filter.
     * @param {TreatmentFindUniqueArgs} args - Arguments to find a Treatment
     * @example
     * // Get one Treatment
     * const treatment = await prisma.treatment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TreatmentFindUniqueArgs>(args: SelectSubset<T, TreatmentFindUniqueArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Treatment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TreatmentFindUniqueOrThrowArgs} args - Arguments to find a Treatment
     * @example
     * // Get one Treatment
     * const treatment = await prisma.treatment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TreatmentFindUniqueOrThrowArgs>(args: SelectSubset<T, TreatmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Treatment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentFindFirstArgs} args - Arguments to find a Treatment
     * @example
     * // Get one Treatment
     * const treatment = await prisma.treatment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TreatmentFindFirstArgs>(args?: SelectSubset<T, TreatmentFindFirstArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Treatment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentFindFirstOrThrowArgs} args - Arguments to find a Treatment
     * @example
     * // Get one Treatment
     * const treatment = await prisma.treatment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TreatmentFindFirstOrThrowArgs>(args?: SelectSubset<T, TreatmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Treatments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Treatments
     * const treatments = await prisma.treatment.findMany()
     * 
     * // Get first 10 Treatments
     * const treatments = await prisma.treatment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const treatmentWithIdOnly = await prisma.treatment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TreatmentFindManyArgs>(args?: SelectSubset<T, TreatmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Treatment.
     * @param {TreatmentCreateArgs} args - Arguments to create a Treatment.
     * @example
     * // Create one Treatment
     * const Treatment = await prisma.treatment.create({
     *   data: {
     *     // ... data to create a Treatment
     *   }
     * })
     * 
     */
    create<T extends TreatmentCreateArgs>(args: SelectSubset<T, TreatmentCreateArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Treatments.
     * @param {TreatmentCreateManyArgs} args - Arguments to create many Treatments.
     * @example
     * // Create many Treatments
     * const treatment = await prisma.treatment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TreatmentCreateManyArgs>(args?: SelectSubset<T, TreatmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Treatments and returns the data saved in the database.
     * @param {TreatmentCreateManyAndReturnArgs} args - Arguments to create many Treatments.
     * @example
     * // Create many Treatments
     * const treatment = await prisma.treatment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Treatments and only return the `id`
     * const treatmentWithIdOnly = await prisma.treatment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TreatmentCreateManyAndReturnArgs>(args?: SelectSubset<T, TreatmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Treatment.
     * @param {TreatmentDeleteArgs} args - Arguments to delete one Treatment.
     * @example
     * // Delete one Treatment
     * const Treatment = await prisma.treatment.delete({
     *   where: {
     *     // ... filter to delete one Treatment
     *   }
     * })
     * 
     */
    delete<T extends TreatmentDeleteArgs>(args: SelectSubset<T, TreatmentDeleteArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Treatment.
     * @param {TreatmentUpdateArgs} args - Arguments to update one Treatment.
     * @example
     * // Update one Treatment
     * const treatment = await prisma.treatment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TreatmentUpdateArgs>(args: SelectSubset<T, TreatmentUpdateArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Treatments.
     * @param {TreatmentDeleteManyArgs} args - Arguments to filter Treatments to delete.
     * @example
     * // Delete a few Treatments
     * const { count } = await prisma.treatment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TreatmentDeleteManyArgs>(args?: SelectSubset<T, TreatmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Treatments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Treatments
     * const treatment = await prisma.treatment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TreatmentUpdateManyArgs>(args: SelectSubset<T, TreatmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Treatments and returns the data updated in the database.
     * @param {TreatmentUpdateManyAndReturnArgs} args - Arguments to update many Treatments.
     * @example
     * // Update many Treatments
     * const treatment = await prisma.treatment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Treatments and only return the `id`
     * const treatmentWithIdOnly = await prisma.treatment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TreatmentUpdateManyAndReturnArgs>(args: SelectSubset<T, TreatmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Treatment.
     * @param {TreatmentUpsertArgs} args - Arguments to update or create a Treatment.
     * @example
     * // Update or create a Treatment
     * const treatment = await prisma.treatment.upsert({
     *   create: {
     *     // ... data to create a Treatment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Treatment we want to update
     *   }
     * })
     */
    upsert<T extends TreatmentUpsertArgs>(args: SelectSubset<T, TreatmentUpsertArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Treatments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentCountArgs} args - Arguments to filter Treatments to count.
     * @example
     * // Count the number of Treatments
     * const count = await prisma.treatment.count({
     *   where: {
     *     // ... the filter for the Treatments we want to count
     *   }
     * })
    **/
    count<T extends TreatmentCountArgs>(
      args?: Subset<T, TreatmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TreatmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Treatment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TreatmentAggregateArgs>(args: Subset<T, TreatmentAggregateArgs>): Prisma.PrismaPromise<GetTreatmentAggregateType<T>>

    /**
     * Group by Treatment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreatmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TreatmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TreatmentGroupByArgs['orderBy'] }
        : { orderBy?: TreatmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TreatmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTreatmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Treatment model
   */
  readonly fields: TreatmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Treatment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TreatmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Treatment$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Treatment$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    patientTreatments<T extends Treatment$patientTreatmentsArgs<ExtArgs> = {}>(args?: Subset<T, Treatment$patientTreatmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Treatment model
   */
  interface TreatmentFieldRefs {
    readonly id: FieldRef<"Treatment", 'String'>
    readonly name: FieldRef<"Treatment", 'String'>
    readonly durationMin: FieldRef<"Treatment", 'Int'>
    readonly price: FieldRef<"Treatment", 'Int'>
    readonly discountedPrice: FieldRef<"Treatment", 'Int'>
    readonly description: FieldRef<"Treatment", 'String'>
    readonly instructions: FieldRef<"Treatment", 'String'>
    readonly isActive: FieldRef<"Treatment", 'Boolean'>
    readonly imageUrl: FieldRef<"Treatment", 'String'>
    readonly category: FieldRef<"Treatment", 'String'>
    readonly isMultiSession: FieldRef<"Treatment", 'Boolean'>
    readonly defaultSessions: FieldRef<"Treatment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Treatment findUnique
   */
  export type TreatmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * Filter, which Treatment to fetch.
     */
    where: TreatmentWhereUniqueInput
  }

  /**
   * Treatment findUniqueOrThrow
   */
  export type TreatmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * Filter, which Treatment to fetch.
     */
    where: TreatmentWhereUniqueInput
  }

  /**
   * Treatment findFirst
   */
  export type TreatmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * Filter, which Treatment to fetch.
     */
    where?: TreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Treatments to fetch.
     */
    orderBy?: TreatmentOrderByWithRelationInput | TreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Treatments.
     */
    cursor?: TreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Treatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Treatments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Treatments.
     */
    distinct?: TreatmentScalarFieldEnum | TreatmentScalarFieldEnum[]
  }

  /**
   * Treatment findFirstOrThrow
   */
  export type TreatmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * Filter, which Treatment to fetch.
     */
    where?: TreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Treatments to fetch.
     */
    orderBy?: TreatmentOrderByWithRelationInput | TreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Treatments.
     */
    cursor?: TreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Treatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Treatments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Treatments.
     */
    distinct?: TreatmentScalarFieldEnum | TreatmentScalarFieldEnum[]
  }

  /**
   * Treatment findMany
   */
  export type TreatmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * Filter, which Treatments to fetch.
     */
    where?: TreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Treatments to fetch.
     */
    orderBy?: TreatmentOrderByWithRelationInput | TreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Treatments.
     */
    cursor?: TreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Treatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Treatments.
     */
    skip?: number
    distinct?: TreatmentScalarFieldEnum | TreatmentScalarFieldEnum[]
  }

  /**
   * Treatment create
   */
  export type TreatmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Treatment.
     */
    data: XOR<TreatmentCreateInput, TreatmentUncheckedCreateInput>
  }

  /**
   * Treatment createMany
   */
  export type TreatmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Treatments.
     */
    data: TreatmentCreateManyInput | TreatmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Treatment createManyAndReturn
   */
  export type TreatmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * The data used to create many Treatments.
     */
    data: TreatmentCreateManyInput | TreatmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Treatment update
   */
  export type TreatmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Treatment.
     */
    data: XOR<TreatmentUpdateInput, TreatmentUncheckedUpdateInput>
    /**
     * Choose, which Treatment to update.
     */
    where: TreatmentWhereUniqueInput
  }

  /**
   * Treatment updateMany
   */
  export type TreatmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Treatments.
     */
    data: XOR<TreatmentUpdateManyMutationInput, TreatmentUncheckedUpdateManyInput>
    /**
     * Filter which Treatments to update
     */
    where?: TreatmentWhereInput
    /**
     * Limit how many Treatments to update.
     */
    limit?: number
  }

  /**
   * Treatment updateManyAndReturn
   */
  export type TreatmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * The data used to update Treatments.
     */
    data: XOR<TreatmentUpdateManyMutationInput, TreatmentUncheckedUpdateManyInput>
    /**
     * Filter which Treatments to update
     */
    where?: TreatmentWhereInput
    /**
     * Limit how many Treatments to update.
     */
    limit?: number
  }

  /**
   * Treatment upsert
   */
  export type TreatmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Treatment to update in case it exists.
     */
    where: TreatmentWhereUniqueInput
    /**
     * In case the Treatment found by the `where` argument doesn't exist, create a new Treatment with this data.
     */
    create: XOR<TreatmentCreateInput, TreatmentUncheckedCreateInput>
    /**
     * In case the Treatment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TreatmentUpdateInput, TreatmentUncheckedUpdateInput>
  }

  /**
   * Treatment delete
   */
  export type TreatmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
    /**
     * Filter which Treatment to delete.
     */
    where: TreatmentWhereUniqueInput
  }

  /**
   * Treatment deleteMany
   */
  export type TreatmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Treatments to delete
     */
    where?: TreatmentWhereInput
    /**
     * Limit how many Treatments to delete.
     */
    limit?: number
  }

  /**
   * Treatment.appointments
   */
  export type Treatment$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Treatment.patientTreatments
   */
  export type Treatment$patientTreatmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    where?: PatientTreatmentWhereInput
    orderBy?: PatientTreatmentOrderByWithRelationInput | PatientTreatmentOrderByWithRelationInput[]
    cursor?: PatientTreatmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PatientTreatmentScalarFieldEnum | PatientTreatmentScalarFieldEnum[]
  }

  /**
   * Treatment without action
   */
  export type TreatmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Treatment
     */
    select?: TreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Treatment
     */
    omit?: TreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreatmentInclude<ExtArgs> | null
  }


  /**
   * Model SystemSettings
   */

  export type AggregateSystemSettings = {
    _count: SystemSettingsCountAggregateOutputType | null
    _avg: SystemSettingsAvgAggregateOutputType | null
    _sum: SystemSettingsSumAggregateOutputType | null
    _min: SystemSettingsMinAggregateOutputType | null
    _max: SystemSettingsMaxAggregateOutputType | null
  }

  export type SystemSettingsAvgAggregateOutputType = {
    slotDurationMin: number | null
  }

  export type SystemSettingsSumAggregateOutputType = {
    slotDurationMin: number | null
  }

  export type SystemSettingsMinAggregateOutputType = {
    id: string | null
    clinicName: string | null
    workDayStart: string | null
    workDayEnd: string | null
    slotDurationMin: number | null
  }

  export type SystemSettingsMaxAggregateOutputType = {
    id: string | null
    clinicName: string | null
    workDayStart: string | null
    workDayEnd: string | null
    slotDurationMin: number | null
  }

  export type SystemSettingsCountAggregateOutputType = {
    id: number
    clinicName: number
    workDayStart: number
    workDayEnd: number
    slotDurationMin: number
    _all: number
  }


  export type SystemSettingsAvgAggregateInputType = {
    slotDurationMin?: true
  }

  export type SystemSettingsSumAggregateInputType = {
    slotDurationMin?: true
  }

  export type SystemSettingsMinAggregateInputType = {
    id?: true
    clinicName?: true
    workDayStart?: true
    workDayEnd?: true
    slotDurationMin?: true
  }

  export type SystemSettingsMaxAggregateInputType = {
    id?: true
    clinicName?: true
    workDayStart?: true
    workDayEnd?: true
    slotDurationMin?: true
  }

  export type SystemSettingsCountAggregateInputType = {
    id?: true
    clinicName?: true
    workDayStart?: true
    workDayEnd?: true
    slotDurationMin?: true
    _all?: true
  }

  export type SystemSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemSettings to aggregate.
     */
    where?: SystemSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingsOrderByWithRelationInput | SystemSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemSettings
    **/
    _count?: true | SystemSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SystemSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SystemSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemSettingsMaxAggregateInputType
  }

  export type GetSystemSettingsAggregateType<T extends SystemSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemSettings[P]>
      : GetScalarType<T[P], AggregateSystemSettings[P]>
  }




  export type SystemSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemSettingsWhereInput
    orderBy?: SystemSettingsOrderByWithAggregationInput | SystemSettingsOrderByWithAggregationInput[]
    by: SystemSettingsScalarFieldEnum[] | SystemSettingsScalarFieldEnum
    having?: SystemSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemSettingsCountAggregateInputType | true
    _avg?: SystemSettingsAvgAggregateInputType
    _sum?: SystemSettingsSumAggregateInputType
    _min?: SystemSettingsMinAggregateInputType
    _max?: SystemSettingsMaxAggregateInputType
  }

  export type SystemSettingsGroupByOutputType = {
    id: string
    clinicName: string
    workDayStart: string
    workDayEnd: string
    slotDurationMin: number
    _count: SystemSettingsCountAggregateOutputType | null
    _avg: SystemSettingsAvgAggregateOutputType | null
    _sum: SystemSettingsSumAggregateOutputType | null
    _min: SystemSettingsMinAggregateOutputType | null
    _max: SystemSettingsMaxAggregateOutputType | null
  }

  type GetSystemSettingsGroupByPayload<T extends SystemSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SystemSettingsGroupByOutputType[P]>
        }
      >
    >


  export type SystemSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clinicName?: boolean
    workDayStart?: boolean
    workDayEnd?: boolean
    slotDurationMin?: boolean
  }, ExtArgs["result"]["systemSettings"]>

  export type SystemSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clinicName?: boolean
    workDayStart?: boolean
    workDayEnd?: boolean
    slotDurationMin?: boolean
  }, ExtArgs["result"]["systemSettings"]>

  export type SystemSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clinicName?: boolean
    workDayStart?: boolean
    workDayEnd?: boolean
    slotDurationMin?: boolean
  }, ExtArgs["result"]["systemSettings"]>

  export type SystemSettingsSelectScalar = {
    id?: boolean
    clinicName?: boolean
    workDayStart?: boolean
    workDayEnd?: boolean
    slotDurationMin?: boolean
  }

  export type SystemSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clinicName" | "workDayStart" | "workDayEnd" | "slotDurationMin", ExtArgs["result"]["systemSettings"]>

  export type $SystemSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clinicName: string
      workDayStart: string
      workDayEnd: string
      slotDurationMin: number
    }, ExtArgs["result"]["systemSettings"]>
    composites: {}
  }

  type SystemSettingsGetPayload<S extends boolean | null | undefined | SystemSettingsDefaultArgs> = $Result.GetResult<Prisma.$SystemSettingsPayload, S>

  type SystemSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemSettingsCountAggregateInputType | true
    }

  export interface SystemSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemSettings'], meta: { name: 'SystemSettings' } }
    /**
     * Find zero or one SystemSettings that matches the filter.
     * @param {SystemSettingsFindUniqueArgs} args - Arguments to find a SystemSettings
     * @example
     * // Get one SystemSettings
     * const systemSettings = await prisma.systemSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemSettingsFindUniqueArgs>(args: SelectSubset<T, SystemSettingsFindUniqueArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemSettingsFindUniqueOrThrowArgs} args - Arguments to find a SystemSettings
     * @example
     * // Get one SystemSettings
     * const systemSettings = await prisma.systemSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsFindFirstArgs} args - Arguments to find a SystemSettings
     * @example
     * // Get one SystemSettings
     * const systemSettings = await prisma.systemSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemSettingsFindFirstArgs>(args?: SelectSubset<T, SystemSettingsFindFirstArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsFindFirstOrThrowArgs} args - Arguments to find a SystemSettings
     * @example
     * // Get one SystemSettings
     * const systemSettings = await prisma.systemSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemSettings
     * const systemSettings = await prisma.systemSettings.findMany()
     * 
     * // Get first 10 SystemSettings
     * const systemSettings = await prisma.systemSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemSettingsWithIdOnly = await prisma.systemSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemSettingsFindManyArgs>(args?: SelectSubset<T, SystemSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemSettings.
     * @param {SystemSettingsCreateArgs} args - Arguments to create a SystemSettings.
     * @example
     * // Create one SystemSettings
     * const SystemSettings = await prisma.systemSettings.create({
     *   data: {
     *     // ... data to create a SystemSettings
     *   }
     * })
     * 
     */
    create<T extends SystemSettingsCreateArgs>(args: SelectSubset<T, SystemSettingsCreateArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemSettings.
     * @param {SystemSettingsCreateManyArgs} args - Arguments to create many SystemSettings.
     * @example
     * // Create many SystemSettings
     * const systemSettings = await prisma.systemSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemSettingsCreateManyArgs>(args?: SelectSubset<T, SystemSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemSettings and returns the data saved in the database.
     * @param {SystemSettingsCreateManyAndReturnArgs} args - Arguments to create many SystemSettings.
     * @example
     * // Create many SystemSettings
     * const systemSettings = await prisma.systemSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemSettings and only return the `id`
     * const systemSettingsWithIdOnly = await prisma.systemSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemSettings.
     * @param {SystemSettingsDeleteArgs} args - Arguments to delete one SystemSettings.
     * @example
     * // Delete one SystemSettings
     * const SystemSettings = await prisma.systemSettings.delete({
     *   where: {
     *     // ... filter to delete one SystemSettings
     *   }
     * })
     * 
     */
    delete<T extends SystemSettingsDeleteArgs>(args: SelectSubset<T, SystemSettingsDeleteArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemSettings.
     * @param {SystemSettingsUpdateArgs} args - Arguments to update one SystemSettings.
     * @example
     * // Update one SystemSettings
     * const systemSettings = await prisma.systemSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemSettingsUpdateArgs>(args: SelectSubset<T, SystemSettingsUpdateArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemSettings.
     * @param {SystemSettingsDeleteManyArgs} args - Arguments to filter SystemSettings to delete.
     * @example
     * // Delete a few SystemSettings
     * const { count } = await prisma.systemSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemSettingsDeleteManyArgs>(args?: SelectSubset<T, SystemSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemSettings
     * const systemSettings = await prisma.systemSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemSettingsUpdateManyArgs>(args: SelectSubset<T, SystemSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemSettings and returns the data updated in the database.
     * @param {SystemSettingsUpdateManyAndReturnArgs} args - Arguments to update many SystemSettings.
     * @example
     * // Update many SystemSettings
     * const systemSettings = await prisma.systemSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemSettings and only return the `id`
     * const systemSettingsWithIdOnly = await prisma.systemSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemSettings.
     * @param {SystemSettingsUpsertArgs} args - Arguments to update or create a SystemSettings.
     * @example
     * // Update or create a SystemSettings
     * const systemSettings = await prisma.systemSettings.upsert({
     *   create: {
     *     // ... data to create a SystemSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemSettings we want to update
     *   }
     * })
     */
    upsert<T extends SystemSettingsUpsertArgs>(args: SelectSubset<T, SystemSettingsUpsertArgs<ExtArgs>>): Prisma__SystemSettingsClient<$Result.GetResult<Prisma.$SystemSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsCountArgs} args - Arguments to filter SystemSettings to count.
     * @example
     * // Count the number of SystemSettings
     * const count = await prisma.systemSettings.count({
     *   where: {
     *     // ... the filter for the SystemSettings we want to count
     *   }
     * })
    **/
    count<T extends SystemSettingsCountArgs>(
      args?: Subset<T, SystemSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemSettingsAggregateArgs>(args: Subset<T, SystemSettingsAggregateArgs>): Prisma.PrismaPromise<GetSystemSettingsAggregateType<T>>

    /**
     * Group by SystemSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemSettingsGroupByArgs['orderBy'] }
        : { orderBy?: SystemSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemSettings model
   */
  readonly fields: SystemSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemSettings model
   */
  interface SystemSettingsFieldRefs {
    readonly id: FieldRef<"SystemSettings", 'String'>
    readonly clinicName: FieldRef<"SystemSettings", 'String'>
    readonly workDayStart: FieldRef<"SystemSettings", 'String'>
    readonly workDayEnd: FieldRef<"SystemSettings", 'String'>
    readonly slotDurationMin: FieldRef<"SystemSettings", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SystemSettings findUnique
   */
  export type SystemSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where: SystemSettingsWhereUniqueInput
  }

  /**
   * SystemSettings findUniqueOrThrow
   */
  export type SystemSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where: SystemSettingsWhereUniqueInput
  }

  /**
   * SystemSettings findFirst
   */
  export type SystemSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where?: SystemSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingsOrderByWithRelationInput | SystemSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemSettings.
     */
    cursor?: SystemSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingsScalarFieldEnum | SystemSettingsScalarFieldEnum[]
  }

  /**
   * SystemSettings findFirstOrThrow
   */
  export type SystemSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where?: SystemSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingsOrderByWithRelationInput | SystemSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemSettings.
     */
    cursor?: SystemSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemSettings.
     */
    distinct?: SystemSettingsScalarFieldEnum | SystemSettingsScalarFieldEnum[]
  }

  /**
   * SystemSettings findMany
   */
  export type SystemSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SystemSettings to fetch.
     */
    where?: SystemSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemSettings to fetch.
     */
    orderBy?: SystemSettingsOrderByWithRelationInput | SystemSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemSettings.
     */
    cursor?: SystemSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemSettings.
     */
    skip?: number
    distinct?: SystemSettingsScalarFieldEnum | SystemSettingsScalarFieldEnum[]
  }

  /**
   * SystemSettings create
   */
  export type SystemSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemSettings.
     */
    data?: XOR<SystemSettingsCreateInput, SystemSettingsUncheckedCreateInput>
  }

  /**
   * SystemSettings createMany
   */
  export type SystemSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemSettings.
     */
    data: SystemSettingsCreateManyInput | SystemSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemSettings createManyAndReturn
   */
  export type SystemSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many SystemSettings.
     */
    data: SystemSettingsCreateManyInput | SystemSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemSettings update
   */
  export type SystemSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemSettings.
     */
    data: XOR<SystemSettingsUpdateInput, SystemSettingsUncheckedUpdateInput>
    /**
     * Choose, which SystemSettings to update.
     */
    where: SystemSettingsWhereUniqueInput
  }

  /**
   * SystemSettings updateMany
   */
  export type SystemSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemSettings.
     */
    data: XOR<SystemSettingsUpdateManyMutationInput, SystemSettingsUncheckedUpdateManyInput>
    /**
     * Filter which SystemSettings to update
     */
    where?: SystemSettingsWhereInput
    /**
     * Limit how many SystemSettings to update.
     */
    limit?: number
  }

  /**
   * SystemSettings updateManyAndReturn
   */
  export type SystemSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * The data used to update SystemSettings.
     */
    data: XOR<SystemSettingsUpdateManyMutationInput, SystemSettingsUncheckedUpdateManyInput>
    /**
     * Filter which SystemSettings to update
     */
    where?: SystemSettingsWhereInput
    /**
     * Limit how many SystemSettings to update.
     */
    limit?: number
  }

  /**
   * SystemSettings upsert
   */
  export type SystemSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemSettings to update in case it exists.
     */
    where: SystemSettingsWhereUniqueInput
    /**
     * In case the SystemSettings found by the `where` argument doesn't exist, create a new SystemSettings with this data.
     */
    create: XOR<SystemSettingsCreateInput, SystemSettingsUncheckedCreateInput>
    /**
     * In case the SystemSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemSettingsUpdateInput, SystemSettingsUncheckedUpdateInput>
  }

  /**
   * SystemSettings delete
   */
  export type SystemSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
    /**
     * Filter which SystemSettings to delete.
     */
    where: SystemSettingsWhereUniqueInput
  }

  /**
   * SystemSettings deleteMany
   */
  export type SystemSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemSettings to delete
     */
    where?: SystemSettingsWhereInput
    /**
     * Limit how many SystemSettings to delete.
     */
    limit?: number
  }

  /**
   * SystemSettings without action
   */
  export type SystemSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemSettings
     */
    select?: SystemSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemSettings
     */
    omit?: SystemSettingsOmit<ExtArgs> | null
  }


  /**
   * Model PatientTreatment
   */

  export type AggregatePatientTreatment = {
    _count: PatientTreatmentCountAggregateOutputType | null
    _avg: PatientTreatmentAvgAggregateOutputType | null
    _sum: PatientTreatmentSumAggregateOutputType | null
    _min: PatientTreatmentMinAggregateOutputType | null
    _max: PatientTreatmentMaxAggregateOutputType | null
  }

  export type PatientTreatmentAvgAggregateOutputType = {
    totalCost: number | null
    totalSessions: number | null
  }

  export type PatientTreatmentSumAggregateOutputType = {
    totalCost: number | null
    totalSessions: number | null
  }

  export type PatientTreatmentMinAggregateOutputType = {
    id: string | null
    patientId: string | null
    treatmentId: string | null
    totalCost: number | null
    totalSessions: number | null
    clinicalStatus: $Enums.ClinicalStatus | null
    financialStatus: $Enums.FinancialStatus | null
    status: $Enums.TreatmentStatus | null
    startDate: Date | null
    updatedAt: Date | null
  }

  export type PatientTreatmentMaxAggregateOutputType = {
    id: string | null
    patientId: string | null
    treatmentId: string | null
    totalCost: number | null
    totalSessions: number | null
    clinicalStatus: $Enums.ClinicalStatus | null
    financialStatus: $Enums.FinancialStatus | null
    status: $Enums.TreatmentStatus | null
    startDate: Date | null
    updatedAt: Date | null
  }

  export type PatientTreatmentCountAggregateOutputType = {
    id: number
    patientId: number
    treatmentId: number
    totalCost: number
    totalSessions: number
    clinicalStatus: number
    financialStatus: number
    status: number
    startDate: number
    updatedAt: number
    _all: number
  }


  export type PatientTreatmentAvgAggregateInputType = {
    totalCost?: true
    totalSessions?: true
  }

  export type PatientTreatmentSumAggregateInputType = {
    totalCost?: true
    totalSessions?: true
  }

  export type PatientTreatmentMinAggregateInputType = {
    id?: true
    patientId?: true
    treatmentId?: true
    totalCost?: true
    totalSessions?: true
    clinicalStatus?: true
    financialStatus?: true
    status?: true
    startDate?: true
    updatedAt?: true
  }

  export type PatientTreatmentMaxAggregateInputType = {
    id?: true
    patientId?: true
    treatmentId?: true
    totalCost?: true
    totalSessions?: true
    clinicalStatus?: true
    financialStatus?: true
    status?: true
    startDate?: true
    updatedAt?: true
  }

  export type PatientTreatmentCountAggregateInputType = {
    id?: true
    patientId?: true
    treatmentId?: true
    totalCost?: true
    totalSessions?: true
    clinicalStatus?: true
    financialStatus?: true
    status?: true
    startDate?: true
    updatedAt?: true
    _all?: true
  }

  export type PatientTreatmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientTreatment to aggregate.
     */
    where?: PatientTreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTreatments to fetch.
     */
    orderBy?: PatientTreatmentOrderByWithRelationInput | PatientTreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientTreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTreatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTreatments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PatientTreatments
    **/
    _count?: true | PatientTreatmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientTreatmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientTreatmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientTreatmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientTreatmentMaxAggregateInputType
  }

  export type GetPatientTreatmentAggregateType<T extends PatientTreatmentAggregateArgs> = {
        [P in keyof T & keyof AggregatePatientTreatment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatientTreatment[P]>
      : GetScalarType<T[P], AggregatePatientTreatment[P]>
  }




  export type PatientTreatmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientTreatmentWhereInput
    orderBy?: PatientTreatmentOrderByWithAggregationInput | PatientTreatmentOrderByWithAggregationInput[]
    by: PatientTreatmentScalarFieldEnum[] | PatientTreatmentScalarFieldEnum
    having?: PatientTreatmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientTreatmentCountAggregateInputType | true
    _avg?: PatientTreatmentAvgAggregateInputType
    _sum?: PatientTreatmentSumAggregateInputType
    _min?: PatientTreatmentMinAggregateInputType
    _max?: PatientTreatmentMaxAggregateInputType
  }

  export type PatientTreatmentGroupByOutputType = {
    id: string
    patientId: string
    treatmentId: string
    totalCost: number
    totalSessions: number
    clinicalStatus: $Enums.ClinicalStatus
    financialStatus: $Enums.FinancialStatus
    status: $Enums.TreatmentStatus
    startDate: Date
    updatedAt: Date
    _count: PatientTreatmentCountAggregateOutputType | null
    _avg: PatientTreatmentAvgAggregateOutputType | null
    _sum: PatientTreatmentSumAggregateOutputType | null
    _min: PatientTreatmentMinAggregateOutputType | null
    _max: PatientTreatmentMaxAggregateOutputType | null
  }

  type GetPatientTreatmentGroupByPayload<T extends PatientTreatmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientTreatmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientTreatmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientTreatmentGroupByOutputType[P]>
            : GetScalarType<T[P], PatientTreatmentGroupByOutputType[P]>
        }
      >
    >


  export type PatientTreatmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    treatmentId?: boolean
    totalCost?: boolean
    totalSessions?: boolean
    clinicalStatus?: boolean
    financialStatus?: boolean
    status?: boolean
    startDate?: boolean
    updatedAt?: boolean
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    appointments?: boolean | PatientTreatment$appointmentsArgs<ExtArgs>
    payments?: boolean | PatientTreatment$paymentsArgs<ExtArgs>
    changeLogs?: boolean | PatientTreatment$changeLogsArgs<ExtArgs>
    _count?: boolean | PatientTreatmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientTreatment"]>

  export type PatientTreatmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    treatmentId?: boolean
    totalCost?: boolean
    totalSessions?: boolean
    clinicalStatus?: boolean
    financialStatus?: boolean
    status?: boolean
    startDate?: boolean
    updatedAt?: boolean
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientTreatment"]>

  export type PatientTreatmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientId?: boolean
    treatmentId?: boolean
    totalCost?: boolean
    totalSessions?: boolean
    clinicalStatus?: boolean
    financialStatus?: boolean
    status?: boolean
    startDate?: boolean
    updatedAt?: boolean
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["patientTreatment"]>

  export type PatientTreatmentSelectScalar = {
    id?: boolean
    patientId?: boolean
    treatmentId?: boolean
    totalCost?: boolean
    totalSessions?: boolean
    clinicalStatus?: boolean
    financialStatus?: boolean
    status?: boolean
    startDate?: boolean
    updatedAt?: boolean
  }

  export type PatientTreatmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientId" | "treatmentId" | "totalCost" | "totalSessions" | "clinicalStatus" | "financialStatus" | "status" | "startDate" | "updatedAt", ExtArgs["result"]["patientTreatment"]>
  export type PatientTreatmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
    appointments?: boolean | PatientTreatment$appointmentsArgs<ExtArgs>
    payments?: boolean | PatientTreatment$paymentsArgs<ExtArgs>
    changeLogs?: boolean | PatientTreatment$changeLogsArgs<ExtArgs>
    _count?: boolean | PatientTreatmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PatientTreatmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
  }
  export type PatientTreatmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patient?: boolean | UserDefaultArgs<ExtArgs>
    treatment?: boolean | TreatmentDefaultArgs<ExtArgs>
  }

  export type $PatientTreatmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PatientTreatment"
    objects: {
      patient: Prisma.$UserPayload<ExtArgs>
      treatment: Prisma.$TreatmentPayload<ExtArgs>
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
      payments: Prisma.$PaymentPayload<ExtArgs>[]
      changeLogs: Prisma.$PlanChangeLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientId: string
      treatmentId: string
      totalCost: number
      totalSessions: number
      clinicalStatus: $Enums.ClinicalStatus
      financialStatus: $Enums.FinancialStatus
      status: $Enums.TreatmentStatus
      startDate: Date
      updatedAt: Date
    }, ExtArgs["result"]["patientTreatment"]>
    composites: {}
  }

  type PatientTreatmentGetPayload<S extends boolean | null | undefined | PatientTreatmentDefaultArgs> = $Result.GetResult<Prisma.$PatientTreatmentPayload, S>

  type PatientTreatmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientTreatmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientTreatmentCountAggregateInputType | true
    }

  export interface PatientTreatmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PatientTreatment'], meta: { name: 'PatientTreatment' } }
    /**
     * Find zero or one PatientTreatment that matches the filter.
     * @param {PatientTreatmentFindUniqueArgs} args - Arguments to find a PatientTreatment
     * @example
     * // Get one PatientTreatment
     * const patientTreatment = await prisma.patientTreatment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientTreatmentFindUniqueArgs>(args: SelectSubset<T, PatientTreatmentFindUniqueArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PatientTreatment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientTreatmentFindUniqueOrThrowArgs} args - Arguments to find a PatientTreatment
     * @example
     * // Get one PatientTreatment
     * const patientTreatment = await prisma.patientTreatment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientTreatmentFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientTreatmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PatientTreatment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentFindFirstArgs} args - Arguments to find a PatientTreatment
     * @example
     * // Get one PatientTreatment
     * const patientTreatment = await prisma.patientTreatment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientTreatmentFindFirstArgs>(args?: SelectSubset<T, PatientTreatmentFindFirstArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PatientTreatment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentFindFirstOrThrowArgs} args - Arguments to find a PatientTreatment
     * @example
     * // Get one PatientTreatment
     * const patientTreatment = await prisma.patientTreatment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientTreatmentFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientTreatmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PatientTreatments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PatientTreatments
     * const patientTreatments = await prisma.patientTreatment.findMany()
     * 
     * // Get first 10 PatientTreatments
     * const patientTreatments = await prisma.patientTreatment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientTreatmentWithIdOnly = await prisma.patientTreatment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientTreatmentFindManyArgs>(args?: SelectSubset<T, PatientTreatmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PatientTreatment.
     * @param {PatientTreatmentCreateArgs} args - Arguments to create a PatientTreatment.
     * @example
     * // Create one PatientTreatment
     * const PatientTreatment = await prisma.patientTreatment.create({
     *   data: {
     *     // ... data to create a PatientTreatment
     *   }
     * })
     * 
     */
    create<T extends PatientTreatmentCreateArgs>(args: SelectSubset<T, PatientTreatmentCreateArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PatientTreatments.
     * @param {PatientTreatmentCreateManyArgs} args - Arguments to create many PatientTreatments.
     * @example
     * // Create many PatientTreatments
     * const patientTreatment = await prisma.patientTreatment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientTreatmentCreateManyArgs>(args?: SelectSubset<T, PatientTreatmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PatientTreatments and returns the data saved in the database.
     * @param {PatientTreatmentCreateManyAndReturnArgs} args - Arguments to create many PatientTreatments.
     * @example
     * // Create many PatientTreatments
     * const patientTreatment = await prisma.patientTreatment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PatientTreatments and only return the `id`
     * const patientTreatmentWithIdOnly = await prisma.patientTreatment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientTreatmentCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientTreatmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PatientTreatment.
     * @param {PatientTreatmentDeleteArgs} args - Arguments to delete one PatientTreatment.
     * @example
     * // Delete one PatientTreatment
     * const PatientTreatment = await prisma.patientTreatment.delete({
     *   where: {
     *     // ... filter to delete one PatientTreatment
     *   }
     * })
     * 
     */
    delete<T extends PatientTreatmentDeleteArgs>(args: SelectSubset<T, PatientTreatmentDeleteArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PatientTreatment.
     * @param {PatientTreatmentUpdateArgs} args - Arguments to update one PatientTreatment.
     * @example
     * // Update one PatientTreatment
     * const patientTreatment = await prisma.patientTreatment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientTreatmentUpdateArgs>(args: SelectSubset<T, PatientTreatmentUpdateArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PatientTreatments.
     * @param {PatientTreatmentDeleteManyArgs} args - Arguments to filter PatientTreatments to delete.
     * @example
     * // Delete a few PatientTreatments
     * const { count } = await prisma.patientTreatment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientTreatmentDeleteManyArgs>(args?: SelectSubset<T, PatientTreatmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientTreatments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PatientTreatments
     * const patientTreatment = await prisma.patientTreatment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientTreatmentUpdateManyArgs>(args: SelectSubset<T, PatientTreatmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PatientTreatments and returns the data updated in the database.
     * @param {PatientTreatmentUpdateManyAndReturnArgs} args - Arguments to update many PatientTreatments.
     * @example
     * // Update many PatientTreatments
     * const patientTreatment = await prisma.patientTreatment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PatientTreatments and only return the `id`
     * const patientTreatmentWithIdOnly = await prisma.patientTreatment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientTreatmentUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientTreatmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PatientTreatment.
     * @param {PatientTreatmentUpsertArgs} args - Arguments to update or create a PatientTreatment.
     * @example
     * // Update or create a PatientTreatment
     * const patientTreatment = await prisma.patientTreatment.upsert({
     *   create: {
     *     // ... data to create a PatientTreatment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PatientTreatment we want to update
     *   }
     * })
     */
    upsert<T extends PatientTreatmentUpsertArgs>(args: SelectSubset<T, PatientTreatmentUpsertArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PatientTreatments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentCountArgs} args - Arguments to filter PatientTreatments to count.
     * @example
     * // Count the number of PatientTreatments
     * const count = await prisma.patientTreatment.count({
     *   where: {
     *     // ... the filter for the PatientTreatments we want to count
     *   }
     * })
    **/
    count<T extends PatientTreatmentCountArgs>(
      args?: Subset<T, PatientTreatmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientTreatmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PatientTreatment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientTreatmentAggregateArgs>(args: Subset<T, PatientTreatmentAggregateArgs>): Prisma.PrismaPromise<GetPatientTreatmentAggregateType<T>>

    /**
     * Group by PatientTreatment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientTreatmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientTreatmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientTreatmentGroupByArgs['orderBy'] }
        : { orderBy?: PatientTreatmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientTreatmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientTreatmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PatientTreatment model
   */
  readonly fields: PatientTreatmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PatientTreatment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientTreatmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patient<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    treatment<T extends TreatmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TreatmentDefaultArgs<ExtArgs>>): Prisma__TreatmentClient<$Result.GetResult<Prisma.$TreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    appointments<T extends PatientTreatment$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, PatientTreatment$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends PatientTreatment$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, PatientTreatment$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    changeLogs<T extends PatientTreatment$changeLogsArgs<ExtArgs> = {}>(args?: Subset<T, PatientTreatment$changeLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PatientTreatment model
   */
  interface PatientTreatmentFieldRefs {
    readonly id: FieldRef<"PatientTreatment", 'String'>
    readonly patientId: FieldRef<"PatientTreatment", 'String'>
    readonly treatmentId: FieldRef<"PatientTreatment", 'String'>
    readonly totalCost: FieldRef<"PatientTreatment", 'Int'>
    readonly totalSessions: FieldRef<"PatientTreatment", 'Int'>
    readonly clinicalStatus: FieldRef<"PatientTreatment", 'ClinicalStatus'>
    readonly financialStatus: FieldRef<"PatientTreatment", 'FinancialStatus'>
    readonly status: FieldRef<"PatientTreatment", 'TreatmentStatus'>
    readonly startDate: FieldRef<"PatientTreatment", 'DateTime'>
    readonly updatedAt: FieldRef<"PatientTreatment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PatientTreatment findUnique
   */
  export type PatientTreatmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * Filter, which PatientTreatment to fetch.
     */
    where: PatientTreatmentWhereUniqueInput
  }

  /**
   * PatientTreatment findUniqueOrThrow
   */
  export type PatientTreatmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * Filter, which PatientTreatment to fetch.
     */
    where: PatientTreatmentWhereUniqueInput
  }

  /**
   * PatientTreatment findFirst
   */
  export type PatientTreatmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * Filter, which PatientTreatment to fetch.
     */
    where?: PatientTreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTreatments to fetch.
     */
    orderBy?: PatientTreatmentOrderByWithRelationInput | PatientTreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientTreatments.
     */
    cursor?: PatientTreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTreatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTreatments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientTreatments.
     */
    distinct?: PatientTreatmentScalarFieldEnum | PatientTreatmentScalarFieldEnum[]
  }

  /**
   * PatientTreatment findFirstOrThrow
   */
  export type PatientTreatmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * Filter, which PatientTreatment to fetch.
     */
    where?: PatientTreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTreatments to fetch.
     */
    orderBy?: PatientTreatmentOrderByWithRelationInput | PatientTreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PatientTreatments.
     */
    cursor?: PatientTreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTreatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTreatments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PatientTreatments.
     */
    distinct?: PatientTreatmentScalarFieldEnum | PatientTreatmentScalarFieldEnum[]
  }

  /**
   * PatientTreatment findMany
   */
  export type PatientTreatmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * Filter, which PatientTreatments to fetch.
     */
    where?: PatientTreatmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PatientTreatments to fetch.
     */
    orderBy?: PatientTreatmentOrderByWithRelationInput | PatientTreatmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PatientTreatments.
     */
    cursor?: PatientTreatmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PatientTreatments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PatientTreatments.
     */
    skip?: number
    distinct?: PatientTreatmentScalarFieldEnum | PatientTreatmentScalarFieldEnum[]
  }

  /**
   * PatientTreatment create
   */
  export type PatientTreatmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * The data needed to create a PatientTreatment.
     */
    data: XOR<PatientTreatmentCreateInput, PatientTreatmentUncheckedCreateInput>
  }

  /**
   * PatientTreatment createMany
   */
  export type PatientTreatmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PatientTreatments.
     */
    data: PatientTreatmentCreateManyInput | PatientTreatmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PatientTreatment createManyAndReturn
   */
  export type PatientTreatmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * The data used to create many PatientTreatments.
     */
    data: PatientTreatmentCreateManyInput | PatientTreatmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientTreatment update
   */
  export type PatientTreatmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * The data needed to update a PatientTreatment.
     */
    data: XOR<PatientTreatmentUpdateInput, PatientTreatmentUncheckedUpdateInput>
    /**
     * Choose, which PatientTreatment to update.
     */
    where: PatientTreatmentWhereUniqueInput
  }

  /**
   * PatientTreatment updateMany
   */
  export type PatientTreatmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PatientTreatments.
     */
    data: XOR<PatientTreatmentUpdateManyMutationInput, PatientTreatmentUncheckedUpdateManyInput>
    /**
     * Filter which PatientTreatments to update
     */
    where?: PatientTreatmentWhereInput
    /**
     * Limit how many PatientTreatments to update.
     */
    limit?: number
  }

  /**
   * PatientTreatment updateManyAndReturn
   */
  export type PatientTreatmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * The data used to update PatientTreatments.
     */
    data: XOR<PatientTreatmentUpdateManyMutationInput, PatientTreatmentUncheckedUpdateManyInput>
    /**
     * Filter which PatientTreatments to update
     */
    where?: PatientTreatmentWhereInput
    /**
     * Limit how many PatientTreatments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PatientTreatment upsert
   */
  export type PatientTreatmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * The filter to search for the PatientTreatment to update in case it exists.
     */
    where: PatientTreatmentWhereUniqueInput
    /**
     * In case the PatientTreatment found by the `where` argument doesn't exist, create a new PatientTreatment with this data.
     */
    create: XOR<PatientTreatmentCreateInput, PatientTreatmentUncheckedCreateInput>
    /**
     * In case the PatientTreatment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientTreatmentUpdateInput, PatientTreatmentUncheckedUpdateInput>
  }

  /**
   * PatientTreatment delete
   */
  export type PatientTreatmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
    /**
     * Filter which PatientTreatment to delete.
     */
    where: PatientTreatmentWhereUniqueInput
  }

  /**
   * PatientTreatment deleteMany
   */
  export type PatientTreatmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PatientTreatments to delete
     */
    where?: PatientTreatmentWhereInput
    /**
     * Limit how many PatientTreatments to delete.
     */
    limit?: number
  }

  /**
   * PatientTreatment.appointments
   */
  export type PatientTreatment$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * PatientTreatment.payments
   */
  export type PatientTreatment$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * PatientTreatment.changeLogs
   */
  export type PatientTreatment$changeLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    where?: PlanChangeLogWhereInput
    orderBy?: PlanChangeLogOrderByWithRelationInput | PlanChangeLogOrderByWithRelationInput[]
    cursor?: PlanChangeLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlanChangeLogScalarFieldEnum | PlanChangeLogScalarFieldEnum[]
  }

  /**
   * PatientTreatment without action
   */
  export type PatientTreatmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PatientTreatment
     */
    select?: PatientTreatmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PatientTreatment
     */
    omit?: PatientTreatmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PatientTreatmentInclude<ExtArgs> | null
  }


  /**
   * Model PlanChangeLog
   */

  export type AggregatePlanChangeLog = {
    _count: PlanChangeLogCountAggregateOutputType | null
    _min: PlanChangeLogMinAggregateOutputType | null
    _max: PlanChangeLogMaxAggregateOutputType | null
  }

  export type PlanChangeLogMinAggregateOutputType = {
    id: string | null
    patientTreatmentId: string | null
    changedByUserId: string | null
    field: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date | null
  }

  export type PlanChangeLogMaxAggregateOutputType = {
    id: string | null
    patientTreatmentId: string | null
    changedByUserId: string | null
    field: string | null
    oldValue: string | null
    newValue: string | null
    createdAt: Date | null
  }

  export type PlanChangeLogCountAggregateOutputType = {
    id: number
    patientTreatmentId: number
    changedByUserId: number
    field: number
    oldValue: number
    newValue: number
    createdAt: number
    _all: number
  }


  export type PlanChangeLogMinAggregateInputType = {
    id?: true
    patientTreatmentId?: true
    changedByUserId?: true
    field?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
  }

  export type PlanChangeLogMaxAggregateInputType = {
    id?: true
    patientTreatmentId?: true
    changedByUserId?: true
    field?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
  }

  export type PlanChangeLogCountAggregateInputType = {
    id?: true
    patientTreatmentId?: true
    changedByUserId?: true
    field?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
    _all?: true
  }

  export type PlanChangeLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanChangeLog to aggregate.
     */
    where?: PlanChangeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanChangeLogs to fetch.
     */
    orderBy?: PlanChangeLogOrderByWithRelationInput | PlanChangeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanChangeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanChangeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanChangeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlanChangeLogs
    **/
    _count?: true | PlanChangeLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanChangeLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanChangeLogMaxAggregateInputType
  }

  export type GetPlanChangeLogAggregateType<T extends PlanChangeLogAggregateArgs> = {
        [P in keyof T & keyof AggregatePlanChangeLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlanChangeLog[P]>
      : GetScalarType<T[P], AggregatePlanChangeLog[P]>
  }




  export type PlanChangeLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanChangeLogWhereInput
    orderBy?: PlanChangeLogOrderByWithAggregationInput | PlanChangeLogOrderByWithAggregationInput[]
    by: PlanChangeLogScalarFieldEnum[] | PlanChangeLogScalarFieldEnum
    having?: PlanChangeLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanChangeLogCountAggregateInputType | true
    _min?: PlanChangeLogMinAggregateInputType
    _max?: PlanChangeLogMaxAggregateInputType
  }

  export type PlanChangeLogGroupByOutputType = {
    id: string
    patientTreatmentId: string
    changedByUserId: string | null
    field: string
    oldValue: string
    newValue: string
    createdAt: Date
    _count: PlanChangeLogCountAggregateOutputType | null
    _min: PlanChangeLogMinAggregateOutputType | null
    _max: PlanChangeLogMaxAggregateOutputType | null
  }

  type GetPlanChangeLogGroupByPayload<T extends PlanChangeLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanChangeLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanChangeLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanChangeLogGroupByOutputType[P]>
            : GetScalarType<T[P], PlanChangeLogGroupByOutputType[P]>
        }
      >
    >


  export type PlanChangeLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientTreatmentId?: boolean
    changedByUserId?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    changedByUser?: boolean | PlanChangeLog$changedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["planChangeLog"]>

  export type PlanChangeLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientTreatmentId?: boolean
    changedByUserId?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    changedByUser?: boolean | PlanChangeLog$changedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["planChangeLog"]>

  export type PlanChangeLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patientTreatmentId?: boolean
    changedByUserId?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    changedByUser?: boolean | PlanChangeLog$changedByUserArgs<ExtArgs>
  }, ExtArgs["result"]["planChangeLog"]>

  export type PlanChangeLogSelectScalar = {
    id?: boolean
    patientTreatmentId?: boolean
    changedByUserId?: boolean
    field?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }

  export type PlanChangeLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patientTreatmentId" | "changedByUserId" | "field" | "oldValue" | "newValue" | "createdAt", ExtArgs["result"]["planChangeLog"]>
  export type PlanChangeLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    changedByUser?: boolean | PlanChangeLog$changedByUserArgs<ExtArgs>
  }
  export type PlanChangeLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    changedByUser?: boolean | PlanChangeLog$changedByUserArgs<ExtArgs>
  }
  export type PlanChangeLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    changedByUser?: boolean | PlanChangeLog$changedByUserArgs<ExtArgs>
  }

  export type $PlanChangeLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlanChangeLog"
    objects: {
      patientTreatment: Prisma.$PatientTreatmentPayload<ExtArgs>
      changedByUser: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      patientTreatmentId: string
      changedByUserId: string | null
      field: string
      oldValue: string
      newValue: string
      createdAt: Date
    }, ExtArgs["result"]["planChangeLog"]>
    composites: {}
  }

  type PlanChangeLogGetPayload<S extends boolean | null | undefined | PlanChangeLogDefaultArgs> = $Result.GetResult<Prisma.$PlanChangeLogPayload, S>

  type PlanChangeLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanChangeLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanChangeLogCountAggregateInputType | true
    }

  export interface PlanChangeLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlanChangeLog'], meta: { name: 'PlanChangeLog' } }
    /**
     * Find zero or one PlanChangeLog that matches the filter.
     * @param {PlanChangeLogFindUniqueArgs} args - Arguments to find a PlanChangeLog
     * @example
     * // Get one PlanChangeLog
     * const planChangeLog = await prisma.planChangeLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanChangeLogFindUniqueArgs>(args: SelectSubset<T, PlanChangeLogFindUniqueArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlanChangeLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanChangeLogFindUniqueOrThrowArgs} args - Arguments to find a PlanChangeLog
     * @example
     * // Get one PlanChangeLog
     * const planChangeLog = await prisma.planChangeLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanChangeLogFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanChangeLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanChangeLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogFindFirstArgs} args - Arguments to find a PlanChangeLog
     * @example
     * // Get one PlanChangeLog
     * const planChangeLog = await prisma.planChangeLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanChangeLogFindFirstArgs>(args?: SelectSubset<T, PlanChangeLogFindFirstArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlanChangeLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogFindFirstOrThrowArgs} args - Arguments to find a PlanChangeLog
     * @example
     * // Get one PlanChangeLog
     * const planChangeLog = await prisma.planChangeLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanChangeLogFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanChangeLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlanChangeLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlanChangeLogs
     * const planChangeLogs = await prisma.planChangeLog.findMany()
     * 
     * // Get first 10 PlanChangeLogs
     * const planChangeLogs = await prisma.planChangeLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planChangeLogWithIdOnly = await prisma.planChangeLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanChangeLogFindManyArgs>(args?: SelectSubset<T, PlanChangeLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlanChangeLog.
     * @param {PlanChangeLogCreateArgs} args - Arguments to create a PlanChangeLog.
     * @example
     * // Create one PlanChangeLog
     * const PlanChangeLog = await prisma.planChangeLog.create({
     *   data: {
     *     // ... data to create a PlanChangeLog
     *   }
     * })
     * 
     */
    create<T extends PlanChangeLogCreateArgs>(args: SelectSubset<T, PlanChangeLogCreateArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlanChangeLogs.
     * @param {PlanChangeLogCreateManyArgs} args - Arguments to create many PlanChangeLogs.
     * @example
     * // Create many PlanChangeLogs
     * const planChangeLog = await prisma.planChangeLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanChangeLogCreateManyArgs>(args?: SelectSubset<T, PlanChangeLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlanChangeLogs and returns the data saved in the database.
     * @param {PlanChangeLogCreateManyAndReturnArgs} args - Arguments to create many PlanChangeLogs.
     * @example
     * // Create many PlanChangeLogs
     * const planChangeLog = await prisma.planChangeLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlanChangeLogs and only return the `id`
     * const planChangeLogWithIdOnly = await prisma.planChangeLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanChangeLogCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanChangeLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlanChangeLog.
     * @param {PlanChangeLogDeleteArgs} args - Arguments to delete one PlanChangeLog.
     * @example
     * // Delete one PlanChangeLog
     * const PlanChangeLog = await prisma.planChangeLog.delete({
     *   where: {
     *     // ... filter to delete one PlanChangeLog
     *   }
     * })
     * 
     */
    delete<T extends PlanChangeLogDeleteArgs>(args: SelectSubset<T, PlanChangeLogDeleteArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlanChangeLog.
     * @param {PlanChangeLogUpdateArgs} args - Arguments to update one PlanChangeLog.
     * @example
     * // Update one PlanChangeLog
     * const planChangeLog = await prisma.planChangeLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanChangeLogUpdateArgs>(args: SelectSubset<T, PlanChangeLogUpdateArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlanChangeLogs.
     * @param {PlanChangeLogDeleteManyArgs} args - Arguments to filter PlanChangeLogs to delete.
     * @example
     * // Delete a few PlanChangeLogs
     * const { count } = await prisma.planChangeLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanChangeLogDeleteManyArgs>(args?: SelectSubset<T, PlanChangeLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanChangeLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlanChangeLogs
     * const planChangeLog = await prisma.planChangeLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanChangeLogUpdateManyArgs>(args: SelectSubset<T, PlanChangeLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanChangeLogs and returns the data updated in the database.
     * @param {PlanChangeLogUpdateManyAndReturnArgs} args - Arguments to update many PlanChangeLogs.
     * @example
     * // Update many PlanChangeLogs
     * const planChangeLog = await prisma.planChangeLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlanChangeLogs and only return the `id`
     * const planChangeLogWithIdOnly = await prisma.planChangeLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlanChangeLogUpdateManyAndReturnArgs>(args: SelectSubset<T, PlanChangeLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlanChangeLog.
     * @param {PlanChangeLogUpsertArgs} args - Arguments to update or create a PlanChangeLog.
     * @example
     * // Update or create a PlanChangeLog
     * const planChangeLog = await prisma.planChangeLog.upsert({
     *   create: {
     *     // ... data to create a PlanChangeLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlanChangeLog we want to update
     *   }
     * })
     */
    upsert<T extends PlanChangeLogUpsertArgs>(args: SelectSubset<T, PlanChangeLogUpsertArgs<ExtArgs>>): Prisma__PlanChangeLogClient<$Result.GetResult<Prisma.$PlanChangeLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlanChangeLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogCountArgs} args - Arguments to filter PlanChangeLogs to count.
     * @example
     * // Count the number of PlanChangeLogs
     * const count = await prisma.planChangeLog.count({
     *   where: {
     *     // ... the filter for the PlanChangeLogs we want to count
     *   }
     * })
    **/
    count<T extends PlanChangeLogCountArgs>(
      args?: Subset<T, PlanChangeLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanChangeLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlanChangeLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanChangeLogAggregateArgs>(args: Subset<T, PlanChangeLogAggregateArgs>): Prisma.PrismaPromise<GetPlanChangeLogAggregateType<T>>

    /**
     * Group by PlanChangeLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanChangeLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanChangeLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanChangeLogGroupByArgs['orderBy'] }
        : { orderBy?: PlanChangeLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanChangeLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanChangeLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlanChangeLog model
   */
  readonly fields: PlanChangeLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlanChangeLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanChangeLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patientTreatment<T extends PatientTreatmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientTreatmentDefaultArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    changedByUser<T extends PlanChangeLog$changedByUserArgs<ExtArgs> = {}>(args?: Subset<T, PlanChangeLog$changedByUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlanChangeLog model
   */
  interface PlanChangeLogFieldRefs {
    readonly id: FieldRef<"PlanChangeLog", 'String'>
    readonly patientTreatmentId: FieldRef<"PlanChangeLog", 'String'>
    readonly changedByUserId: FieldRef<"PlanChangeLog", 'String'>
    readonly field: FieldRef<"PlanChangeLog", 'String'>
    readonly oldValue: FieldRef<"PlanChangeLog", 'String'>
    readonly newValue: FieldRef<"PlanChangeLog", 'String'>
    readonly createdAt: FieldRef<"PlanChangeLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PlanChangeLog findUnique
   */
  export type PlanChangeLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * Filter, which PlanChangeLog to fetch.
     */
    where: PlanChangeLogWhereUniqueInput
  }

  /**
   * PlanChangeLog findUniqueOrThrow
   */
  export type PlanChangeLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * Filter, which PlanChangeLog to fetch.
     */
    where: PlanChangeLogWhereUniqueInput
  }

  /**
   * PlanChangeLog findFirst
   */
  export type PlanChangeLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * Filter, which PlanChangeLog to fetch.
     */
    where?: PlanChangeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanChangeLogs to fetch.
     */
    orderBy?: PlanChangeLogOrderByWithRelationInput | PlanChangeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanChangeLogs.
     */
    cursor?: PlanChangeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanChangeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanChangeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanChangeLogs.
     */
    distinct?: PlanChangeLogScalarFieldEnum | PlanChangeLogScalarFieldEnum[]
  }

  /**
   * PlanChangeLog findFirstOrThrow
   */
  export type PlanChangeLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * Filter, which PlanChangeLog to fetch.
     */
    where?: PlanChangeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanChangeLogs to fetch.
     */
    orderBy?: PlanChangeLogOrderByWithRelationInput | PlanChangeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanChangeLogs.
     */
    cursor?: PlanChangeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanChangeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanChangeLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanChangeLogs.
     */
    distinct?: PlanChangeLogScalarFieldEnum | PlanChangeLogScalarFieldEnum[]
  }

  /**
   * PlanChangeLog findMany
   */
  export type PlanChangeLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * Filter, which PlanChangeLogs to fetch.
     */
    where?: PlanChangeLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanChangeLogs to fetch.
     */
    orderBy?: PlanChangeLogOrderByWithRelationInput | PlanChangeLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlanChangeLogs.
     */
    cursor?: PlanChangeLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanChangeLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanChangeLogs.
     */
    skip?: number
    distinct?: PlanChangeLogScalarFieldEnum | PlanChangeLogScalarFieldEnum[]
  }

  /**
   * PlanChangeLog create
   */
  export type PlanChangeLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * The data needed to create a PlanChangeLog.
     */
    data: XOR<PlanChangeLogCreateInput, PlanChangeLogUncheckedCreateInput>
  }

  /**
   * PlanChangeLog createMany
   */
  export type PlanChangeLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlanChangeLogs.
     */
    data: PlanChangeLogCreateManyInput | PlanChangeLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlanChangeLog createManyAndReturn
   */
  export type PlanChangeLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * The data used to create many PlanChangeLogs.
     */
    data: PlanChangeLogCreateManyInput | PlanChangeLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlanChangeLog update
   */
  export type PlanChangeLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * The data needed to update a PlanChangeLog.
     */
    data: XOR<PlanChangeLogUpdateInput, PlanChangeLogUncheckedUpdateInput>
    /**
     * Choose, which PlanChangeLog to update.
     */
    where: PlanChangeLogWhereUniqueInput
  }

  /**
   * PlanChangeLog updateMany
   */
  export type PlanChangeLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlanChangeLogs.
     */
    data: XOR<PlanChangeLogUpdateManyMutationInput, PlanChangeLogUncheckedUpdateManyInput>
    /**
     * Filter which PlanChangeLogs to update
     */
    where?: PlanChangeLogWhereInput
    /**
     * Limit how many PlanChangeLogs to update.
     */
    limit?: number
  }

  /**
   * PlanChangeLog updateManyAndReturn
   */
  export type PlanChangeLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * The data used to update PlanChangeLogs.
     */
    data: XOR<PlanChangeLogUpdateManyMutationInput, PlanChangeLogUncheckedUpdateManyInput>
    /**
     * Filter which PlanChangeLogs to update
     */
    where?: PlanChangeLogWhereInput
    /**
     * Limit how many PlanChangeLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlanChangeLog upsert
   */
  export type PlanChangeLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * The filter to search for the PlanChangeLog to update in case it exists.
     */
    where: PlanChangeLogWhereUniqueInput
    /**
     * In case the PlanChangeLog found by the `where` argument doesn't exist, create a new PlanChangeLog with this data.
     */
    create: XOR<PlanChangeLogCreateInput, PlanChangeLogUncheckedCreateInput>
    /**
     * In case the PlanChangeLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanChangeLogUpdateInput, PlanChangeLogUncheckedUpdateInput>
  }

  /**
   * PlanChangeLog delete
   */
  export type PlanChangeLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
    /**
     * Filter which PlanChangeLog to delete.
     */
    where: PlanChangeLogWhereUniqueInput
  }

  /**
   * PlanChangeLog deleteMany
   */
  export type PlanChangeLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlanChangeLogs to delete
     */
    where?: PlanChangeLogWhereInput
    /**
     * Limit how many PlanChangeLogs to delete.
     */
    limit?: number
  }

  /**
   * PlanChangeLog.changedByUser
   */
  export type PlanChangeLog$changedByUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PlanChangeLog without action
   */
  export type PlanChangeLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanChangeLog
     */
    select?: PlanChangeLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlanChangeLog
     */
    omit?: PlanChangeLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanChangeLogInclude<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: string | null
    amount: number | null
    method: $Enums.PaymentMethod | null
    date: Date | null
    notes: string | null
    patientTreatmentId: string | null
    appointmentId: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: string | null
    amount: number | null
    method: $Enums.PaymentMethod | null
    date: Date | null
    notes: string | null
    patientTreatmentId: string | null
    appointmentId: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    amount: number
    method: number
    date: number
    notes: number
    patientTreatmentId: number
    appointmentId: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentSumAggregateInputType = {
    amount?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    amount?: true
    method?: true
    date?: true
    notes?: true
    patientTreatmentId?: true
    appointmentId?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    amount?: true
    method?: true
    date?: true
    notes?: true
    patientTreatmentId?: true
    appointmentId?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    amount?: true
    method?: true
    date?: true
    notes?: true
    patientTreatmentId?: true
    appointmentId?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: string
    amount: number
    method: $Enums.PaymentMethod
    date: Date
    notes: string | null
    patientTreatmentId: string
    appointmentId: string | null
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    method?: boolean
    date?: boolean
    notes?: boolean
    patientTreatmentId?: boolean
    appointmentId?: boolean
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    appointment?: boolean | Payment$appointmentArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    method?: boolean
    date?: boolean
    notes?: boolean
    patientTreatmentId?: boolean
    appointmentId?: boolean
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    appointment?: boolean | Payment$appointmentArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    method?: boolean
    date?: boolean
    notes?: boolean
    patientTreatmentId?: boolean
    appointmentId?: boolean
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    appointment?: boolean | Payment$appointmentArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    amount?: boolean
    method?: boolean
    date?: boolean
    notes?: boolean
    patientTreatmentId?: boolean
    appointmentId?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "amount" | "method" | "date" | "notes" | "patientTreatmentId" | "appointmentId", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    appointment?: boolean | Payment$appointmentArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    appointment?: boolean | Payment$appointmentArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    patientTreatment?: boolean | PatientTreatmentDefaultArgs<ExtArgs>
    appointment?: boolean | Payment$appointmentArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      patientTreatment: Prisma.$PatientTreatmentPayload<ExtArgs>
      appointment: Prisma.$AppointmentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      amount: number
      method: $Enums.PaymentMethod
      date: Date
      notes: string | null
      patientTreatmentId: string
      appointmentId: string | null
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    patientTreatment<T extends PatientTreatmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PatientTreatmentDefaultArgs<ExtArgs>>): Prisma__PatientTreatmentClient<$Result.GetResult<Prisma.$PatientTreatmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    appointment<T extends Payment$appointmentArgs<ExtArgs> = {}>(args?: Subset<T, Payment$appointmentArgs<ExtArgs>>): Prisma__AppointmentClient<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'String'>
    readonly amount: FieldRef<"Payment", 'Int'>
    readonly method: FieldRef<"Payment", 'PaymentMethod'>
    readonly date: FieldRef<"Payment", 'DateTime'>
    readonly notes: FieldRef<"Payment", 'String'>
    readonly patientTreatmentId: FieldRef<"Payment", 'String'>
    readonly appointmentId: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment.appointment
   */
  export type Payment$appointmentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model Inventory
   */

  export type AggregateInventory = {
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  export type InventoryAvgAggregateOutputType = {
    quantity: number | null
    minThreshold: number | null
  }

  export type InventorySumAggregateOutputType = {
    quantity: number | null
    minThreshold: number | null
  }

  export type InventoryMinAggregateOutputType = {
    id: string | null
    itemName: string | null
    quantity: number | null
    minThreshold: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryMaxAggregateOutputType = {
    id: string | null
    itemName: string | null
    quantity: number | null
    minThreshold: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InventoryCountAggregateOutputType = {
    id: number
    itemName: number
    quantity: number
    minThreshold: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InventoryAvgAggregateInputType = {
    quantity?: true
    minThreshold?: true
  }

  export type InventorySumAggregateInputType = {
    quantity?: true
    minThreshold?: true
  }

  export type InventoryMinAggregateInputType = {
    id?: true
    itemName?: true
    quantity?: true
    minThreshold?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryMaxAggregateInputType = {
    id?: true
    itemName?: true
    quantity?: true
    minThreshold?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InventoryCountAggregateInputType = {
    id?: true
    itemName?: true
    quantity?: true
    minThreshold?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InventoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventory to aggregate.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inventories
    **/
    _count?: true | InventoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMaxAggregateInputType
  }

  export type GetInventoryAggregateType<T extends InventoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory[P]>
      : GetScalarType<T[P], AggregateInventory[P]>
  }




  export type InventoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithAggregationInput | InventoryOrderByWithAggregationInput[]
    by: InventoryScalarFieldEnum[] | InventoryScalarFieldEnum
    having?: InventoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCountAggregateInputType | true
    _avg?: InventoryAvgAggregateInputType
    _sum?: InventorySumAggregateInputType
    _min?: InventoryMinAggregateInputType
    _max?: InventoryMaxAggregateInputType
  }

  export type InventoryGroupByOutputType = {
    id: string
    itemName: string
    quantity: number
    minThreshold: number
    createdAt: Date
    updatedAt: Date
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  type GetInventoryGroupByPayload<T extends InventoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryGroupByOutputType[P]>
        }
      >
    >


  export type InventorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemName?: boolean
    quantity?: boolean
    minThreshold?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemName?: boolean
    quantity?: boolean
    minThreshold?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    itemName?: boolean
    quantity?: boolean
    minThreshold?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectScalar = {
    id?: boolean
    itemName?: boolean
    quantity?: boolean
    minThreshold?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InventoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "itemName" | "quantity" | "minThreshold" | "createdAt" | "updatedAt", ExtArgs["result"]["inventory"]>

  export type $InventoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inventory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      itemName: string
      quantity: number
      minThreshold: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["inventory"]>
    composites: {}
  }

  type InventoryGetPayload<S extends boolean | null | undefined | InventoryDefaultArgs> = $Result.GetResult<Prisma.$InventoryPayload, S>

  type InventoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InventoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InventoryCountAggregateInputType | true
    }

  export interface InventoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inventory'], meta: { name: 'Inventory' } }
    /**
     * Find zero or one Inventory that matches the filter.
     * @param {InventoryFindUniqueArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryFindUniqueArgs>(args: SelectSubset<T, InventoryFindUniqueArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Inventory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InventoryFindUniqueOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryFindFirstArgs>(args?: SelectSubset<T, InventoryFindFirstArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Inventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Inventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventories
     * const inventories = await prisma.inventory.findMany()
     * 
     * // Get first 10 Inventories
     * const inventories = await prisma.inventory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryWithIdOnly = await prisma.inventory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryFindManyArgs>(args?: SelectSubset<T, InventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Inventory.
     * @param {InventoryCreateArgs} args - Arguments to create a Inventory.
     * @example
     * // Create one Inventory
     * const Inventory = await prisma.inventory.create({
     *   data: {
     *     // ... data to create a Inventory
     *   }
     * })
     * 
     */
    create<T extends InventoryCreateArgs>(args: SelectSubset<T, InventoryCreateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Inventories.
     * @param {InventoryCreateManyArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryCreateManyArgs>(args?: SelectSubset<T, InventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventories and returns the data saved in the database.
     * @param {InventoryCreateManyAndReturnArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Inventory.
     * @param {InventoryDeleteArgs} args - Arguments to delete one Inventory.
     * @example
     * // Delete one Inventory
     * const Inventory = await prisma.inventory.delete({
     *   where: {
     *     // ... filter to delete one Inventory
     *   }
     * })
     * 
     */
    delete<T extends InventoryDeleteArgs>(args: SelectSubset<T, InventoryDeleteArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Inventory.
     * @param {InventoryUpdateArgs} args - Arguments to update one Inventory.
     * @example
     * // Update one Inventory
     * const inventory = await prisma.inventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryUpdateArgs>(args: SelectSubset<T, InventoryUpdateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Inventories.
     * @param {InventoryDeleteManyArgs} args - Arguments to filter Inventories to delete.
     * @example
     * // Delete a few Inventories
     * const { count } = await prisma.inventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryDeleteManyArgs>(args?: SelectSubset<T, InventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryUpdateManyArgs>(args: SelectSubset<T, InventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories and returns the data updated in the database.
     * @param {InventoryUpdateManyAndReturnArgs} args - Arguments to update many Inventories.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InventoryUpdateManyAndReturnArgs>(args: SelectSubset<T, InventoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Inventory.
     * @param {InventoryUpsertArgs} args - Arguments to update or create a Inventory.
     * @example
     * // Update or create a Inventory
     * const inventory = await prisma.inventory.upsert({
     *   create: {
     *     // ... data to create a Inventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory we want to update
     *   }
     * })
     */
    upsert<T extends InventoryUpsertArgs>(args: SelectSubset<T, InventoryUpsertArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCountArgs} args - Arguments to filter Inventories to count.
     * @example
     * // Count the number of Inventories
     * const count = await prisma.inventory.count({
     *   where: {
     *     // ... the filter for the Inventories we want to count
     *   }
     * })
    **/
    count<T extends InventoryCountArgs>(
      args?: Subset<T, InventoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryAggregateArgs>(args: Subset<T, InventoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryAggregateType<T>>

    /**
     * Group by Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryGroupByArgs['orderBy'] }
        : { orderBy?: InventoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inventory model
   */
  readonly fields: InventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inventory model
   */
  interface InventoryFieldRefs {
    readonly id: FieldRef<"Inventory", 'String'>
    readonly itemName: FieldRef<"Inventory", 'String'>
    readonly quantity: FieldRef<"Inventory", 'Int'>
    readonly minThreshold: FieldRef<"Inventory", 'Int'>
    readonly createdAt: FieldRef<"Inventory", 'DateTime'>
    readonly updatedAt: FieldRef<"Inventory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Inventory findUnique
   */
  export type InventoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findUniqueOrThrow
   */
  export type InventoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findFirst
   */
  export type InventoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findFirstOrThrow
   */
  export type InventoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findMany
   */
  export type InventoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Filter, which Inventories to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory create
   */
  export type InventoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data needed to create a Inventory.
     */
    data: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
  }

  /**
   * Inventory createMany
   */
  export type InventoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory createManyAndReturn
   */
  export type InventoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory update
   */
  export type InventoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data needed to update a Inventory.
     */
    data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
    /**
     * Choose, which Inventory to update.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory updateMany
   */
  export type InventoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to update.
     */
    limit?: number
  }

  /**
   * Inventory updateManyAndReturn
   */
  export type InventoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to update.
     */
    limit?: number
  }

  /**
   * Inventory upsert
   */
  export type InventoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * The filter to search for the Inventory to update in case it exists.
     */
    where: InventoryWhereUniqueInput
    /**
     * In case the Inventory found by the `where` argument doesn't exist, create a new Inventory with this data.
     */
    create: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
    /**
     * In case the Inventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
  }

  /**
   * Inventory delete
   */
  export type InventoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
    /**
     * Filter which Inventory to delete.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory deleteMany
   */
  export type InventoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventories to delete
     */
    where?: InventoryWhereInput
    /**
     * Limit how many Inventories to delete.
     */
    limit?: number
  }

  /**
   * Inventory without action
   */
  export type InventoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Inventory
     */
    omit?: InventoryOmit<ExtArgs> | null
  }


  /**
   * Model Doctor
   */

  export type AggregateDoctor = {
    _count: DoctorCountAggregateOutputType | null
    _avg: DoctorAvgAggregateOutputType | null
    _sum: DoctorSumAggregateOutputType | null
    _min: DoctorMinAggregateOutputType | null
    _max: DoctorMaxAggregateOutputType | null
  }

  export type DoctorAvgAggregateOutputType = {
    consultationFee: number | null
    patientsThisMonth: number | null
  }

  export type DoctorSumAggregateOutputType = {
    consultationFee: number | null
    patientsThisMonth: number | null
  }

  export type DoctorMinAggregateOutputType = {
    id: string | null
    name: string | null
    role: string | null
    pmdcReg: string | null
    qualifications: string | null
    experience: string | null
    specialty: string | null
    operatory: string | null
    schedule: string | null
    consultationFee: number | null
    patientsThisMonth: number | null
    image: string | null
    isLead: boolean | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DoctorMaxAggregateOutputType = {
    id: string | null
    name: string | null
    role: string | null
    pmdcReg: string | null
    qualifications: string | null
    experience: string | null
    specialty: string | null
    operatory: string | null
    schedule: string | null
    consultationFee: number | null
    patientsThisMonth: number | null
    image: string | null
    isLead: boolean | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DoctorCountAggregateOutputType = {
    id: number
    name: number
    role: number
    pmdcReg: number
    qualifications: number
    experience: number
    specialty: number
    operatory: number
    schedule: number
    consultationFee: number
    patientsThisMonth: number
    image: number
    isLead: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DoctorAvgAggregateInputType = {
    consultationFee?: true
    patientsThisMonth?: true
  }

  export type DoctorSumAggregateInputType = {
    consultationFee?: true
    patientsThisMonth?: true
  }

  export type DoctorMinAggregateInputType = {
    id?: true
    name?: true
    role?: true
    pmdcReg?: true
    qualifications?: true
    experience?: true
    specialty?: true
    operatory?: true
    schedule?: true
    consultationFee?: true
    patientsThisMonth?: true
    image?: true
    isLead?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DoctorMaxAggregateInputType = {
    id?: true
    name?: true
    role?: true
    pmdcReg?: true
    qualifications?: true
    experience?: true
    specialty?: true
    operatory?: true
    schedule?: true
    consultationFee?: true
    patientsThisMonth?: true
    image?: true
    isLead?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DoctorCountAggregateInputType = {
    id?: true
    name?: true
    role?: true
    pmdcReg?: true
    qualifications?: true
    experience?: true
    specialty?: true
    operatory?: true
    schedule?: true
    consultationFee?: true
    patientsThisMonth?: true
    image?: true
    isLead?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DoctorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Doctor to aggregate.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Doctors
    **/
    _count?: true | DoctorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DoctorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DoctorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DoctorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DoctorMaxAggregateInputType
  }

  export type GetDoctorAggregateType<T extends DoctorAggregateArgs> = {
        [P in keyof T & keyof AggregateDoctor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDoctor[P]>
      : GetScalarType<T[P], AggregateDoctor[P]>
  }




  export type DoctorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DoctorWhereInput
    orderBy?: DoctorOrderByWithAggregationInput | DoctorOrderByWithAggregationInput[]
    by: DoctorScalarFieldEnum[] | DoctorScalarFieldEnum
    having?: DoctorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DoctorCountAggregateInputType | true
    _avg?: DoctorAvgAggregateInputType
    _sum?: DoctorSumAggregateInputType
    _min?: DoctorMinAggregateInputType
    _max?: DoctorMaxAggregateInputType
  }

  export type DoctorGroupByOutputType = {
    id: string
    name: string
    role: string
    pmdcReg: string
    qualifications: string
    experience: string
    specialty: string
    operatory: string
    schedule: string
    consultationFee: number
    patientsThisMonth: number
    image: string | null
    isLead: boolean
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DoctorCountAggregateOutputType | null
    _avg: DoctorAvgAggregateOutputType | null
    _sum: DoctorSumAggregateOutputType | null
    _min: DoctorMinAggregateOutputType | null
    _max: DoctorMaxAggregateOutputType | null
  }

  type GetDoctorGroupByPayload<T extends DoctorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DoctorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DoctorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DoctorGroupByOutputType[P]>
            : GetScalarType<T[P], DoctorGroupByOutputType[P]>
        }
      >
    >


  export type DoctorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    role?: boolean
    pmdcReg?: boolean
    qualifications?: boolean
    experience?: boolean
    specialty?: boolean
    operatory?: boolean
    schedule?: boolean
    consultationFee?: boolean
    patientsThisMonth?: boolean
    image?: boolean
    isLead?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    appointments?: boolean | Doctor$appointmentsArgs<ExtArgs>
    _count?: boolean | DoctorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["doctor"]>

  export type DoctorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    role?: boolean
    pmdcReg?: boolean
    qualifications?: boolean
    experience?: boolean
    specialty?: boolean
    operatory?: boolean
    schedule?: boolean
    consultationFee?: boolean
    patientsThisMonth?: boolean
    image?: boolean
    isLead?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["doctor"]>

  export type DoctorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    role?: boolean
    pmdcReg?: boolean
    qualifications?: boolean
    experience?: boolean
    specialty?: boolean
    operatory?: boolean
    schedule?: boolean
    consultationFee?: boolean
    patientsThisMonth?: boolean
    image?: boolean
    isLead?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["doctor"]>

  export type DoctorSelectScalar = {
    id?: boolean
    name?: boolean
    role?: boolean
    pmdcReg?: boolean
    qualifications?: boolean
    experience?: boolean
    specialty?: boolean
    operatory?: boolean
    schedule?: boolean
    consultationFee?: boolean
    patientsThisMonth?: boolean
    image?: boolean
    isLead?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DoctorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "role" | "pmdcReg" | "qualifications" | "experience" | "specialty" | "operatory" | "schedule" | "consultationFee" | "patientsThisMonth" | "image" | "isLead" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["doctor"]>
  export type DoctorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    appointments?: boolean | Doctor$appointmentsArgs<ExtArgs>
    _count?: boolean | DoctorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DoctorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DoctorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DoctorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Doctor"
    objects: {
      appointments: Prisma.$AppointmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      role: string
      pmdcReg: string
      qualifications: string
      experience: string
      specialty: string
      operatory: string
      schedule: string
      consultationFee: number
      patientsThisMonth: number
      image: string | null
      isLead: boolean
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["doctor"]>
    composites: {}
  }

  type DoctorGetPayload<S extends boolean | null | undefined | DoctorDefaultArgs> = $Result.GetResult<Prisma.$DoctorPayload, S>

  type DoctorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DoctorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DoctorCountAggregateInputType | true
    }

  export interface DoctorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Doctor'], meta: { name: 'Doctor' } }
    /**
     * Find zero or one Doctor that matches the filter.
     * @param {DoctorFindUniqueArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DoctorFindUniqueArgs>(args: SelectSubset<T, DoctorFindUniqueArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Doctor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DoctorFindUniqueOrThrowArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DoctorFindUniqueOrThrowArgs>(args: SelectSubset<T, DoctorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Doctor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorFindFirstArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DoctorFindFirstArgs>(args?: SelectSubset<T, DoctorFindFirstArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Doctor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorFindFirstOrThrowArgs} args - Arguments to find a Doctor
     * @example
     * // Get one Doctor
     * const doctor = await prisma.doctor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DoctorFindFirstOrThrowArgs>(args?: SelectSubset<T, DoctorFindFirstOrThrowArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Doctors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Doctors
     * const doctors = await prisma.doctor.findMany()
     * 
     * // Get first 10 Doctors
     * const doctors = await prisma.doctor.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const doctorWithIdOnly = await prisma.doctor.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DoctorFindManyArgs>(args?: SelectSubset<T, DoctorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Doctor.
     * @param {DoctorCreateArgs} args - Arguments to create a Doctor.
     * @example
     * // Create one Doctor
     * const Doctor = await prisma.doctor.create({
     *   data: {
     *     // ... data to create a Doctor
     *   }
     * })
     * 
     */
    create<T extends DoctorCreateArgs>(args: SelectSubset<T, DoctorCreateArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Doctors.
     * @param {DoctorCreateManyArgs} args - Arguments to create many Doctors.
     * @example
     * // Create many Doctors
     * const doctor = await prisma.doctor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DoctorCreateManyArgs>(args?: SelectSubset<T, DoctorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Doctors and returns the data saved in the database.
     * @param {DoctorCreateManyAndReturnArgs} args - Arguments to create many Doctors.
     * @example
     * // Create many Doctors
     * const doctor = await prisma.doctor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Doctors and only return the `id`
     * const doctorWithIdOnly = await prisma.doctor.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DoctorCreateManyAndReturnArgs>(args?: SelectSubset<T, DoctorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Doctor.
     * @param {DoctorDeleteArgs} args - Arguments to delete one Doctor.
     * @example
     * // Delete one Doctor
     * const Doctor = await prisma.doctor.delete({
     *   where: {
     *     // ... filter to delete one Doctor
     *   }
     * })
     * 
     */
    delete<T extends DoctorDeleteArgs>(args: SelectSubset<T, DoctorDeleteArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Doctor.
     * @param {DoctorUpdateArgs} args - Arguments to update one Doctor.
     * @example
     * // Update one Doctor
     * const doctor = await prisma.doctor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DoctorUpdateArgs>(args: SelectSubset<T, DoctorUpdateArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Doctors.
     * @param {DoctorDeleteManyArgs} args - Arguments to filter Doctors to delete.
     * @example
     * // Delete a few Doctors
     * const { count } = await prisma.doctor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DoctorDeleteManyArgs>(args?: SelectSubset<T, DoctorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Doctors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Doctors
     * const doctor = await prisma.doctor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DoctorUpdateManyArgs>(args: SelectSubset<T, DoctorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Doctors and returns the data updated in the database.
     * @param {DoctorUpdateManyAndReturnArgs} args - Arguments to update many Doctors.
     * @example
     * // Update many Doctors
     * const doctor = await prisma.doctor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Doctors and only return the `id`
     * const doctorWithIdOnly = await prisma.doctor.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DoctorUpdateManyAndReturnArgs>(args: SelectSubset<T, DoctorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Doctor.
     * @param {DoctorUpsertArgs} args - Arguments to update or create a Doctor.
     * @example
     * // Update or create a Doctor
     * const doctor = await prisma.doctor.upsert({
     *   create: {
     *     // ... data to create a Doctor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Doctor we want to update
     *   }
     * })
     */
    upsert<T extends DoctorUpsertArgs>(args: SelectSubset<T, DoctorUpsertArgs<ExtArgs>>): Prisma__DoctorClient<$Result.GetResult<Prisma.$DoctorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Doctors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorCountArgs} args - Arguments to filter Doctors to count.
     * @example
     * // Count the number of Doctors
     * const count = await prisma.doctor.count({
     *   where: {
     *     // ... the filter for the Doctors we want to count
     *   }
     * })
    **/
    count<T extends DoctorCountArgs>(
      args?: Subset<T, DoctorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DoctorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Doctor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DoctorAggregateArgs>(args: Subset<T, DoctorAggregateArgs>): Prisma.PrismaPromise<GetDoctorAggregateType<T>>

    /**
     * Group by Doctor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DoctorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DoctorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DoctorGroupByArgs['orderBy'] }
        : { orderBy?: DoctorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DoctorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDoctorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Doctor model
   */
  readonly fields: DoctorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Doctor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DoctorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    appointments<T extends Doctor$appointmentsArgs<ExtArgs> = {}>(args?: Subset<T, Doctor$appointmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppointmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Doctor model
   */
  interface DoctorFieldRefs {
    readonly id: FieldRef<"Doctor", 'String'>
    readonly name: FieldRef<"Doctor", 'String'>
    readonly role: FieldRef<"Doctor", 'String'>
    readonly pmdcReg: FieldRef<"Doctor", 'String'>
    readonly qualifications: FieldRef<"Doctor", 'String'>
    readonly experience: FieldRef<"Doctor", 'String'>
    readonly specialty: FieldRef<"Doctor", 'String'>
    readonly operatory: FieldRef<"Doctor", 'String'>
    readonly schedule: FieldRef<"Doctor", 'String'>
    readonly consultationFee: FieldRef<"Doctor", 'Int'>
    readonly patientsThisMonth: FieldRef<"Doctor", 'Int'>
    readonly image: FieldRef<"Doctor", 'String'>
    readonly isLead: FieldRef<"Doctor", 'Boolean'>
    readonly isActive: FieldRef<"Doctor", 'Boolean'>
    readonly createdAt: FieldRef<"Doctor", 'DateTime'>
    readonly updatedAt: FieldRef<"Doctor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Doctor findUnique
   */
  export type DoctorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor findUniqueOrThrow
   */
  export type DoctorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor findFirst
   */
  export type DoctorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Doctors.
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doctors.
     */
    distinct?: DoctorScalarFieldEnum | DoctorScalarFieldEnum[]
  }

  /**
   * Doctor findFirstOrThrow
   */
  export type DoctorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctor to fetch.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Doctors.
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Doctors.
     */
    distinct?: DoctorScalarFieldEnum | DoctorScalarFieldEnum[]
  }

  /**
   * Doctor findMany
   */
  export type DoctorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter, which Doctors to fetch.
     */
    where?: DoctorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Doctors to fetch.
     */
    orderBy?: DoctorOrderByWithRelationInput | DoctorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Doctors.
     */
    cursor?: DoctorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Doctors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Doctors.
     */
    skip?: number
    distinct?: DoctorScalarFieldEnum | DoctorScalarFieldEnum[]
  }

  /**
   * Doctor create
   */
  export type DoctorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * The data needed to create a Doctor.
     */
    data: XOR<DoctorCreateInput, DoctorUncheckedCreateInput>
  }

  /**
   * Doctor createMany
   */
  export type DoctorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Doctors.
     */
    data: DoctorCreateManyInput | DoctorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Doctor createManyAndReturn
   */
  export type DoctorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * The data used to create many Doctors.
     */
    data: DoctorCreateManyInput | DoctorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Doctor update
   */
  export type DoctorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * The data needed to update a Doctor.
     */
    data: XOR<DoctorUpdateInput, DoctorUncheckedUpdateInput>
    /**
     * Choose, which Doctor to update.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor updateMany
   */
  export type DoctorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Doctors.
     */
    data: XOR<DoctorUpdateManyMutationInput, DoctorUncheckedUpdateManyInput>
    /**
     * Filter which Doctors to update
     */
    where?: DoctorWhereInput
    /**
     * Limit how many Doctors to update.
     */
    limit?: number
  }

  /**
   * Doctor updateManyAndReturn
   */
  export type DoctorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * The data used to update Doctors.
     */
    data: XOR<DoctorUpdateManyMutationInput, DoctorUncheckedUpdateManyInput>
    /**
     * Filter which Doctors to update
     */
    where?: DoctorWhereInput
    /**
     * Limit how many Doctors to update.
     */
    limit?: number
  }

  /**
   * Doctor upsert
   */
  export type DoctorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * The filter to search for the Doctor to update in case it exists.
     */
    where: DoctorWhereUniqueInput
    /**
     * In case the Doctor found by the `where` argument doesn't exist, create a new Doctor with this data.
     */
    create: XOR<DoctorCreateInput, DoctorUncheckedCreateInput>
    /**
     * In case the Doctor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DoctorUpdateInput, DoctorUncheckedUpdateInput>
  }

  /**
   * Doctor delete
   */
  export type DoctorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
    /**
     * Filter which Doctor to delete.
     */
    where: DoctorWhereUniqueInput
  }

  /**
   * Doctor deleteMany
   */
  export type DoctorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Doctors to delete
     */
    where?: DoctorWhereInput
    /**
     * Limit how many Doctors to delete.
     */
    limit?: number
  }

  /**
   * Doctor.appointments
   */
  export type Doctor$appointmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Appointment
     */
    select?: AppointmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Appointment
     */
    omit?: AppointmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppointmentInclude<ExtArgs> | null
    where?: AppointmentWhereInput
    orderBy?: AppointmentOrderByWithRelationInput | AppointmentOrderByWithRelationInput[]
    cursor?: AppointmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppointmentScalarFieldEnum | AppointmentScalarFieldEnum[]
  }

  /**
   * Doctor without action
   */
  export type DoctorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Doctor
     */
    select?: DoctorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Doctor
     */
    omit?: DoctorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DoctorInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    phone: 'phone',
    password: 'password',
    name: 'name',
    role: 'role',
    patientCode: 'patientCode',
    noShowCount: 'noShowCount',
    createdAt: 'createdAt',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    address: 'address',
    medicalAlerts: 'medicalAlerts',
    googleCalendarToken: 'googleCalendarToken',
    googleCalendarRefreshToken: 'googleCalendarRefreshToken',
    googleCalendarConnected: 'googleCalendarConnected',
    resetToken: 'resetToken',
    resetTokenExpiry: 'resetTokenExpiry'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AppointmentScalarFieldEnum: {
    id: 'id',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    notes: 'notes',
    patientId: 'patientId',
    treatmentId: 'treatmentId',
    doctorId: 'doctorId',
    googleEventId: 'googleEventId',
    bookedBy: 'bookedBy',
    amountPaid: 'amountPaid',
    price: 'price',
    discount: 'discount',
    createdAt: 'createdAt',
    checkoutTime: 'checkoutTime',
    guestName: 'guestName',
    guestPhone: 'guestPhone',
    guestEmail: 'guestEmail',
    guestDob: 'guestDob',
    patientTreatmentId: 'patientTreatmentId',
    sessionNumber: 'sessionNumber',
    sessionLabel: 'sessionLabel',
    plannedFee: 'plannedFee'
  };

  export type AppointmentScalarFieldEnum = (typeof AppointmentScalarFieldEnum)[keyof typeof AppointmentScalarFieldEnum]


  export const ClinicalNoteScalarFieldEnum: {
    id: 'id',
    appointmentId: 'appointmentId',
    diagnosis: 'diagnosis',
    treatmentDone: 'treatmentDone',
    prescription: 'prescription',
    remarks: 'remarks',
    odontogramData: 'odontogramData',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClinicalNoteScalarFieldEnum = (typeof ClinicalNoteScalarFieldEnum)[keyof typeof ClinicalNoteScalarFieldEnum]


  export const TreatmentScalarFieldEnum: {
    id: 'id',
    name: 'name',
    durationMin: 'durationMin',
    price: 'price',
    discountedPrice: 'discountedPrice',
    description: 'description',
    instructions: 'instructions',
    isActive: 'isActive',
    imageUrl: 'imageUrl',
    category: 'category',
    isMultiSession: 'isMultiSession',
    defaultSessions: 'defaultSessions'
  };

  export type TreatmentScalarFieldEnum = (typeof TreatmentScalarFieldEnum)[keyof typeof TreatmentScalarFieldEnum]


  export const SystemSettingsScalarFieldEnum: {
    id: 'id',
    clinicName: 'clinicName',
    workDayStart: 'workDayStart',
    workDayEnd: 'workDayEnd',
    slotDurationMin: 'slotDurationMin'
  };

  export type SystemSettingsScalarFieldEnum = (typeof SystemSettingsScalarFieldEnum)[keyof typeof SystemSettingsScalarFieldEnum]


  export const PatientTreatmentScalarFieldEnum: {
    id: 'id',
    patientId: 'patientId',
    treatmentId: 'treatmentId',
    totalCost: 'totalCost',
    totalSessions: 'totalSessions',
    clinicalStatus: 'clinicalStatus',
    financialStatus: 'financialStatus',
    status: 'status',
    startDate: 'startDate',
    updatedAt: 'updatedAt'
  };

  export type PatientTreatmentScalarFieldEnum = (typeof PatientTreatmentScalarFieldEnum)[keyof typeof PatientTreatmentScalarFieldEnum]


  export const PlanChangeLogScalarFieldEnum: {
    id: 'id',
    patientTreatmentId: 'patientTreatmentId',
    changedByUserId: 'changedByUserId',
    field: 'field',
    oldValue: 'oldValue',
    newValue: 'newValue',
    createdAt: 'createdAt'
  };

  export type PlanChangeLogScalarFieldEnum = (typeof PlanChangeLogScalarFieldEnum)[keyof typeof PlanChangeLogScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    amount: 'amount',
    method: 'method',
    date: 'date',
    notes: 'notes',
    patientTreatmentId: 'patientTreatmentId',
    appointmentId: 'appointmentId'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const InventoryScalarFieldEnum: {
    id: 'id',
    itemName: 'itemName',
    quantity: 'quantity',
    minThreshold: 'minThreshold',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InventoryScalarFieldEnum = (typeof InventoryScalarFieldEnum)[keyof typeof InventoryScalarFieldEnum]


  export const DoctorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    role: 'role',
    pmdcReg: 'pmdcReg',
    qualifications: 'qualifications',
    experience: 'experience',
    specialty: 'specialty',
    operatory: 'operatory',
    schedule: 'schedule',
    consultationFee: 'consultationFee',
    patientsThisMonth: 'patientsThisMonth',
    image: 'image',
    isLead: 'isLead',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DoctorScalarFieldEnum = (typeof DoctorScalarFieldEnum)[keyof typeof DoctorScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ApptStatus'
   */
  export type EnumApptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApptStatus'>
    


  /**
   * Reference to a field of type 'ApptStatus[]'
   */
  export type ListEnumApptStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApptStatus[]'>
    


  /**
   * Reference to a field of type 'BookingSource'
   */
  export type EnumBookingSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingSource'>
    


  /**
   * Reference to a field of type 'BookingSource[]'
   */
  export type ListEnumBookingSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingSource[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ClinicalStatus'
   */
  export type EnumClinicalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClinicalStatus'>
    


  /**
   * Reference to a field of type 'ClinicalStatus[]'
   */
  export type ListEnumClinicalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClinicalStatus[]'>
    


  /**
   * Reference to a field of type 'FinancialStatus'
   */
  export type EnumFinancialStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinancialStatus'>
    


  /**
   * Reference to a field of type 'FinancialStatus[]'
   */
  export type ListEnumFinancialStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinancialStatus[]'>
    


  /**
   * Reference to a field of type 'TreatmentStatus'
   */
  export type EnumTreatmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TreatmentStatus'>
    


  /**
   * Reference to a field of type 'TreatmentStatus[]'
   */
  export type ListEnumTreatmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TreatmentStatus[]'>
    


  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>
    


  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    phone?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    patientCode?: IntNullableFilter<"User"> | number | null
    noShowCount?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    gender?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    medicalAlerts?: StringNullableFilter<"User"> | string | null
    googleCalendarToken?: StringNullableFilter<"User"> | string | null
    googleCalendarRefreshToken?: StringNullableFilter<"User"> | string | null
    googleCalendarConnected?: BoolFilter<"User"> | boolean
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    appointments?: AppointmentListRelationFilter
    patientTreatments?: PatientTreatmentListRelationFilter
    planChangeLogs?: PlanChangeLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    name?: SortOrder
    role?: SortOrder
    patientCode?: SortOrderInput | SortOrder
    noShowCount?: SortOrder
    createdAt?: SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    medicalAlerts?: SortOrderInput | SortOrder
    googleCalendarToken?: SortOrderInput | SortOrder
    googleCalendarRefreshToken?: SortOrderInput | SortOrder
    googleCalendarConnected?: SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiry?: SortOrderInput | SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    patientTreatments?: PatientTreatmentOrderByRelationAggregateInput
    planChangeLogs?: PlanChangeLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    phone?: string
    patientCode?: number
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringNullableFilter<"User"> | string | null
    name?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    noShowCount?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    dateOfBirth?: DateTimeNullableFilter<"User"> | Date | string | null
    gender?: StringNullableFilter<"User"> | string | null
    address?: StringNullableFilter<"User"> | string | null
    medicalAlerts?: StringNullableFilter<"User"> | string | null
    googleCalendarToken?: StringNullableFilter<"User"> | string | null
    googleCalendarRefreshToken?: StringNullableFilter<"User"> | string | null
    googleCalendarConnected?: BoolFilter<"User"> | boolean
    resetToken?: StringNullableFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableFilter<"User"> | Date | string | null
    appointments?: AppointmentListRelationFilter
    patientTreatments?: PatientTreatmentListRelationFilter
    planChangeLogs?: PlanChangeLogListRelationFilter
  }, "id" | "email" | "phone" | "patientCode">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    name?: SortOrder
    role?: SortOrder
    patientCode?: SortOrderInput | SortOrder
    noShowCount?: SortOrder
    createdAt?: SortOrder
    dateOfBirth?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    medicalAlerts?: SortOrderInput | SortOrder
    googleCalendarToken?: SortOrderInput | SortOrder
    googleCalendarRefreshToken?: SortOrderInput | SortOrder
    googleCalendarConnected?: SortOrder
    resetToken?: SortOrderInput | SortOrder
    resetTokenExpiry?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    patientCode?: IntNullableWithAggregatesFilter<"User"> | number | null
    noShowCount?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    dateOfBirth?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    gender?: StringNullableWithAggregatesFilter<"User"> | string | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    medicalAlerts?: StringNullableWithAggregatesFilter<"User"> | string | null
    googleCalendarToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    googleCalendarRefreshToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    googleCalendarConnected?: BoolWithAggregatesFilter<"User"> | boolean
    resetToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    resetTokenExpiry?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type AppointmentWhereInput = {
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    id?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumApptStatusFilter<"Appointment"> | $Enums.ApptStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    patientId?: StringFilter<"Appointment"> | string
    treatmentId?: StringFilter<"Appointment"> | string
    doctorId?: StringNullableFilter<"Appointment"> | string | null
    googleEventId?: StringNullableFilter<"Appointment"> | string | null
    bookedBy?: EnumBookingSourceFilter<"Appointment"> | $Enums.BookingSource
    amountPaid?: IntNullableFilter<"Appointment"> | number | null
    price?: IntFilter<"Appointment"> | number
    discount?: IntFilter<"Appointment"> | number
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    checkoutTime?: DateTimeNullableFilter<"Appointment"> | Date | string | null
    guestName?: StringNullableFilter<"Appointment"> | string | null
    guestPhone?: StringNullableFilter<"Appointment"> | string | null
    guestEmail?: StringNullableFilter<"Appointment"> | string | null
    guestDob?: DateTimeNullableFilter<"Appointment"> | Date | string | null
    patientTreatmentId?: StringNullableFilter<"Appointment"> | string | null
    sessionNumber?: IntNullableFilter<"Appointment"> | number | null
    sessionLabel?: StringNullableFilter<"Appointment"> | string | null
    plannedFee?: IntNullableFilter<"Appointment"> | number | null
    patient?: XOR<UserScalarRelationFilter, UserWhereInput>
    treatment?: XOR<TreatmentScalarRelationFilter, TreatmentWhereInput>
    doctor?: XOR<DoctorNullableScalarRelationFilter, DoctorWhereInput> | null
    clinicalNotes?: ClinicalNoteListRelationFilter
    patientTreatment?: XOR<PatientTreatmentNullableScalarRelationFilter, PatientTreatmentWhereInput> | null
    payments?: PaymentListRelationFilter
  }

  export type AppointmentOrderByWithRelationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    doctorId?: SortOrderInput | SortOrder
    googleEventId?: SortOrderInput | SortOrder
    bookedBy?: SortOrder
    amountPaid?: SortOrderInput | SortOrder
    price?: SortOrder
    discount?: SortOrder
    createdAt?: SortOrder
    checkoutTime?: SortOrderInput | SortOrder
    guestName?: SortOrderInput | SortOrder
    guestPhone?: SortOrderInput | SortOrder
    guestEmail?: SortOrderInput | SortOrder
    guestDob?: SortOrderInput | SortOrder
    patientTreatmentId?: SortOrderInput | SortOrder
    sessionNumber?: SortOrderInput | SortOrder
    sessionLabel?: SortOrderInput | SortOrder
    plannedFee?: SortOrderInput | SortOrder
    patient?: UserOrderByWithRelationInput
    treatment?: TreatmentOrderByWithRelationInput
    doctor?: DoctorOrderByWithRelationInput
    clinicalNotes?: ClinicalNoteOrderByRelationAggregateInput
    patientTreatment?: PatientTreatmentOrderByWithRelationInput
    payments?: PaymentOrderByRelationAggregateInput
  }

  export type AppointmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    googleEventId?: string
    AND?: AppointmentWhereInput | AppointmentWhereInput[]
    OR?: AppointmentWhereInput[]
    NOT?: AppointmentWhereInput | AppointmentWhereInput[]
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumApptStatusFilter<"Appointment"> | $Enums.ApptStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    patientId?: StringFilter<"Appointment"> | string
    treatmentId?: StringFilter<"Appointment"> | string
    doctorId?: StringNullableFilter<"Appointment"> | string | null
    bookedBy?: EnumBookingSourceFilter<"Appointment"> | $Enums.BookingSource
    amountPaid?: IntNullableFilter<"Appointment"> | number | null
    price?: IntFilter<"Appointment"> | number
    discount?: IntFilter<"Appointment"> | number
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    checkoutTime?: DateTimeNullableFilter<"Appointment"> | Date | string | null
    guestName?: StringNullableFilter<"Appointment"> | string | null
    guestPhone?: StringNullableFilter<"Appointment"> | string | null
    guestEmail?: StringNullableFilter<"Appointment"> | string | null
    guestDob?: DateTimeNullableFilter<"Appointment"> | Date | string | null
    patientTreatmentId?: StringNullableFilter<"Appointment"> | string | null
    sessionNumber?: IntNullableFilter<"Appointment"> | number | null
    sessionLabel?: StringNullableFilter<"Appointment"> | string | null
    plannedFee?: IntNullableFilter<"Appointment"> | number | null
    patient?: XOR<UserScalarRelationFilter, UserWhereInput>
    treatment?: XOR<TreatmentScalarRelationFilter, TreatmentWhereInput>
    doctor?: XOR<DoctorNullableScalarRelationFilter, DoctorWhereInput> | null
    clinicalNotes?: ClinicalNoteListRelationFilter
    patientTreatment?: XOR<PatientTreatmentNullableScalarRelationFilter, PatientTreatmentWhereInput> | null
    payments?: PaymentListRelationFilter
  }, "id" | "googleEventId">

  export type AppointmentOrderByWithAggregationInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    doctorId?: SortOrderInput | SortOrder
    googleEventId?: SortOrderInput | SortOrder
    bookedBy?: SortOrder
    amountPaid?: SortOrderInput | SortOrder
    price?: SortOrder
    discount?: SortOrder
    createdAt?: SortOrder
    checkoutTime?: SortOrderInput | SortOrder
    guestName?: SortOrderInput | SortOrder
    guestPhone?: SortOrderInput | SortOrder
    guestEmail?: SortOrderInput | SortOrder
    guestDob?: SortOrderInput | SortOrder
    patientTreatmentId?: SortOrderInput | SortOrder
    sessionNumber?: SortOrderInput | SortOrder
    sessionLabel?: SortOrderInput | SortOrder
    plannedFee?: SortOrderInput | SortOrder
    _count?: AppointmentCountOrderByAggregateInput
    _avg?: AppointmentAvgOrderByAggregateInput
    _max?: AppointmentMaxOrderByAggregateInput
    _min?: AppointmentMinOrderByAggregateInput
    _sum?: AppointmentSumOrderByAggregateInput
  }

  export type AppointmentScalarWhereWithAggregatesInput = {
    AND?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    OR?: AppointmentScalarWhereWithAggregatesInput[]
    NOT?: AppointmentScalarWhereWithAggregatesInput | AppointmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Appointment"> | string
    startTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    status?: EnumApptStatusWithAggregatesFilter<"Appointment"> | $Enums.ApptStatus
    notes?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    patientId?: StringWithAggregatesFilter<"Appointment"> | string
    treatmentId?: StringWithAggregatesFilter<"Appointment"> | string
    doctorId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    googleEventId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    bookedBy?: EnumBookingSourceWithAggregatesFilter<"Appointment"> | $Enums.BookingSource
    amountPaid?: IntNullableWithAggregatesFilter<"Appointment"> | number | null
    price?: IntWithAggregatesFilter<"Appointment"> | number
    discount?: IntWithAggregatesFilter<"Appointment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Appointment"> | Date | string
    checkoutTime?: DateTimeNullableWithAggregatesFilter<"Appointment"> | Date | string | null
    guestName?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    guestPhone?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    guestEmail?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    guestDob?: DateTimeNullableWithAggregatesFilter<"Appointment"> | Date | string | null
    patientTreatmentId?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    sessionNumber?: IntNullableWithAggregatesFilter<"Appointment"> | number | null
    sessionLabel?: StringNullableWithAggregatesFilter<"Appointment"> | string | null
    plannedFee?: IntNullableWithAggregatesFilter<"Appointment"> | number | null
  }

  export type ClinicalNoteWhereInput = {
    AND?: ClinicalNoteWhereInput | ClinicalNoteWhereInput[]
    OR?: ClinicalNoteWhereInput[]
    NOT?: ClinicalNoteWhereInput | ClinicalNoteWhereInput[]
    id?: StringFilter<"ClinicalNote"> | string
    appointmentId?: StringFilter<"ClinicalNote"> | string
    diagnosis?: StringNullableFilter<"ClinicalNote"> | string | null
    treatmentDone?: StringFilter<"ClinicalNote"> | string
    prescription?: StringNullableFilter<"ClinicalNote"> | string | null
    remarks?: StringNullableFilter<"ClinicalNote"> | string | null
    odontogramData?: JsonNullableFilter<"ClinicalNote">
    createdAt?: DateTimeFilter<"ClinicalNote"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalNote"> | Date | string
    appointment?: XOR<AppointmentScalarRelationFilter, AppointmentWhereInput>
  }

  export type ClinicalNoteOrderByWithRelationInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    diagnosis?: SortOrderInput | SortOrder
    treatmentDone?: SortOrder
    prescription?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    odontogramData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointment?: AppointmentOrderByWithRelationInput
  }

  export type ClinicalNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ClinicalNoteWhereInput | ClinicalNoteWhereInput[]
    OR?: ClinicalNoteWhereInput[]
    NOT?: ClinicalNoteWhereInput | ClinicalNoteWhereInput[]
    appointmentId?: StringFilter<"ClinicalNote"> | string
    diagnosis?: StringNullableFilter<"ClinicalNote"> | string | null
    treatmentDone?: StringFilter<"ClinicalNote"> | string
    prescription?: StringNullableFilter<"ClinicalNote"> | string | null
    remarks?: StringNullableFilter<"ClinicalNote"> | string | null
    odontogramData?: JsonNullableFilter<"ClinicalNote">
    createdAt?: DateTimeFilter<"ClinicalNote"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalNote"> | Date | string
    appointment?: XOR<AppointmentScalarRelationFilter, AppointmentWhereInput>
  }, "id">

  export type ClinicalNoteOrderByWithAggregationInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    diagnosis?: SortOrderInput | SortOrder
    treatmentDone?: SortOrder
    prescription?: SortOrderInput | SortOrder
    remarks?: SortOrderInput | SortOrder
    odontogramData?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClinicalNoteCountOrderByAggregateInput
    _max?: ClinicalNoteMaxOrderByAggregateInput
    _min?: ClinicalNoteMinOrderByAggregateInput
  }

  export type ClinicalNoteScalarWhereWithAggregatesInput = {
    AND?: ClinicalNoteScalarWhereWithAggregatesInput | ClinicalNoteScalarWhereWithAggregatesInput[]
    OR?: ClinicalNoteScalarWhereWithAggregatesInput[]
    NOT?: ClinicalNoteScalarWhereWithAggregatesInput | ClinicalNoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ClinicalNote"> | string
    appointmentId?: StringWithAggregatesFilter<"ClinicalNote"> | string
    diagnosis?: StringNullableWithAggregatesFilter<"ClinicalNote"> | string | null
    treatmentDone?: StringWithAggregatesFilter<"ClinicalNote"> | string
    prescription?: StringNullableWithAggregatesFilter<"ClinicalNote"> | string | null
    remarks?: StringNullableWithAggregatesFilter<"ClinicalNote"> | string | null
    odontogramData?: JsonNullableWithAggregatesFilter<"ClinicalNote">
    createdAt?: DateTimeWithAggregatesFilter<"ClinicalNote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ClinicalNote"> | Date | string
  }

  export type TreatmentWhereInput = {
    AND?: TreatmentWhereInput | TreatmentWhereInput[]
    OR?: TreatmentWhereInput[]
    NOT?: TreatmentWhereInput | TreatmentWhereInput[]
    id?: StringFilter<"Treatment"> | string
    name?: StringFilter<"Treatment"> | string
    durationMin?: IntFilter<"Treatment"> | number
    price?: IntFilter<"Treatment"> | number
    discountedPrice?: IntNullableFilter<"Treatment"> | number | null
    description?: StringNullableFilter<"Treatment"> | string | null
    instructions?: StringNullableFilter<"Treatment"> | string | null
    isActive?: BoolFilter<"Treatment"> | boolean
    imageUrl?: StringNullableFilter<"Treatment"> | string | null
    category?: StringFilter<"Treatment"> | string
    isMultiSession?: BoolFilter<"Treatment"> | boolean
    defaultSessions?: IntFilter<"Treatment"> | number
    appointments?: AppointmentListRelationFilter
    patientTreatments?: PatientTreatmentListRelationFilter
  }

  export type TreatmentOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    instructions?: SortOrderInput | SortOrder
    isActive?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    isMultiSession?: SortOrder
    defaultSessions?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
    patientTreatments?: PatientTreatmentOrderByRelationAggregateInput
  }

  export type TreatmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TreatmentWhereInput | TreatmentWhereInput[]
    OR?: TreatmentWhereInput[]
    NOT?: TreatmentWhereInput | TreatmentWhereInput[]
    name?: StringFilter<"Treatment"> | string
    durationMin?: IntFilter<"Treatment"> | number
    price?: IntFilter<"Treatment"> | number
    discountedPrice?: IntNullableFilter<"Treatment"> | number | null
    description?: StringNullableFilter<"Treatment"> | string | null
    instructions?: StringNullableFilter<"Treatment"> | string | null
    isActive?: BoolFilter<"Treatment"> | boolean
    imageUrl?: StringNullableFilter<"Treatment"> | string | null
    category?: StringFilter<"Treatment"> | string
    isMultiSession?: BoolFilter<"Treatment"> | boolean
    defaultSessions?: IntFilter<"Treatment"> | number
    appointments?: AppointmentListRelationFilter
    patientTreatments?: PatientTreatmentListRelationFilter
  }, "id">

  export type TreatmentOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    instructions?: SortOrderInput | SortOrder
    isActive?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    category?: SortOrder
    isMultiSession?: SortOrder
    defaultSessions?: SortOrder
    _count?: TreatmentCountOrderByAggregateInput
    _avg?: TreatmentAvgOrderByAggregateInput
    _max?: TreatmentMaxOrderByAggregateInput
    _min?: TreatmentMinOrderByAggregateInput
    _sum?: TreatmentSumOrderByAggregateInput
  }

  export type TreatmentScalarWhereWithAggregatesInput = {
    AND?: TreatmentScalarWhereWithAggregatesInput | TreatmentScalarWhereWithAggregatesInput[]
    OR?: TreatmentScalarWhereWithAggregatesInput[]
    NOT?: TreatmentScalarWhereWithAggregatesInput | TreatmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Treatment"> | string
    name?: StringWithAggregatesFilter<"Treatment"> | string
    durationMin?: IntWithAggregatesFilter<"Treatment"> | number
    price?: IntWithAggregatesFilter<"Treatment"> | number
    discountedPrice?: IntNullableWithAggregatesFilter<"Treatment"> | number | null
    description?: StringNullableWithAggregatesFilter<"Treatment"> | string | null
    instructions?: StringNullableWithAggregatesFilter<"Treatment"> | string | null
    isActive?: BoolWithAggregatesFilter<"Treatment"> | boolean
    imageUrl?: StringNullableWithAggregatesFilter<"Treatment"> | string | null
    category?: StringWithAggregatesFilter<"Treatment"> | string
    isMultiSession?: BoolWithAggregatesFilter<"Treatment"> | boolean
    defaultSessions?: IntWithAggregatesFilter<"Treatment"> | number
  }

  export type SystemSettingsWhereInput = {
    AND?: SystemSettingsWhereInput | SystemSettingsWhereInput[]
    OR?: SystemSettingsWhereInput[]
    NOT?: SystemSettingsWhereInput | SystemSettingsWhereInput[]
    id?: StringFilter<"SystemSettings"> | string
    clinicName?: StringFilter<"SystemSettings"> | string
    workDayStart?: StringFilter<"SystemSettings"> | string
    workDayEnd?: StringFilter<"SystemSettings"> | string
    slotDurationMin?: IntFilter<"SystemSettings"> | number
  }

  export type SystemSettingsOrderByWithRelationInput = {
    id?: SortOrder
    clinicName?: SortOrder
    workDayStart?: SortOrder
    workDayEnd?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type SystemSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SystemSettingsWhereInput | SystemSettingsWhereInput[]
    OR?: SystemSettingsWhereInput[]
    NOT?: SystemSettingsWhereInput | SystemSettingsWhereInput[]
    clinicName?: StringFilter<"SystemSettings"> | string
    workDayStart?: StringFilter<"SystemSettings"> | string
    workDayEnd?: StringFilter<"SystemSettings"> | string
    slotDurationMin?: IntFilter<"SystemSettings"> | number
  }, "id">

  export type SystemSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    clinicName?: SortOrder
    workDayStart?: SortOrder
    workDayEnd?: SortOrder
    slotDurationMin?: SortOrder
    _count?: SystemSettingsCountOrderByAggregateInput
    _avg?: SystemSettingsAvgOrderByAggregateInput
    _max?: SystemSettingsMaxOrderByAggregateInput
    _min?: SystemSettingsMinOrderByAggregateInput
    _sum?: SystemSettingsSumOrderByAggregateInput
  }

  export type SystemSettingsScalarWhereWithAggregatesInput = {
    AND?: SystemSettingsScalarWhereWithAggregatesInput | SystemSettingsScalarWhereWithAggregatesInput[]
    OR?: SystemSettingsScalarWhereWithAggregatesInput[]
    NOT?: SystemSettingsScalarWhereWithAggregatesInput | SystemSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SystemSettings"> | string
    clinicName?: StringWithAggregatesFilter<"SystemSettings"> | string
    workDayStart?: StringWithAggregatesFilter<"SystemSettings"> | string
    workDayEnd?: StringWithAggregatesFilter<"SystemSettings"> | string
    slotDurationMin?: IntWithAggregatesFilter<"SystemSettings"> | number
  }

  export type PatientTreatmentWhereInput = {
    AND?: PatientTreatmentWhereInput | PatientTreatmentWhereInput[]
    OR?: PatientTreatmentWhereInput[]
    NOT?: PatientTreatmentWhereInput | PatientTreatmentWhereInput[]
    id?: StringFilter<"PatientTreatment"> | string
    patientId?: StringFilter<"PatientTreatment"> | string
    treatmentId?: StringFilter<"PatientTreatment"> | string
    totalCost?: IntFilter<"PatientTreatment"> | number
    totalSessions?: IntFilter<"PatientTreatment"> | number
    clinicalStatus?: EnumClinicalStatusFilter<"PatientTreatment"> | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFilter<"PatientTreatment"> | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFilter<"PatientTreatment"> | $Enums.TreatmentStatus
    startDate?: DateTimeFilter<"PatientTreatment"> | Date | string
    updatedAt?: DateTimeFilter<"PatientTreatment"> | Date | string
    patient?: XOR<UserScalarRelationFilter, UserWhereInput>
    treatment?: XOR<TreatmentScalarRelationFilter, TreatmentWhereInput>
    appointments?: AppointmentListRelationFilter
    payments?: PaymentListRelationFilter
    changeLogs?: PlanChangeLogListRelationFilter
  }

  export type PatientTreatmentOrderByWithRelationInput = {
    id?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    totalCost?: SortOrder
    totalSessions?: SortOrder
    clinicalStatus?: SortOrder
    financialStatus?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    updatedAt?: SortOrder
    patient?: UserOrderByWithRelationInput
    treatment?: TreatmentOrderByWithRelationInput
    appointments?: AppointmentOrderByRelationAggregateInput
    payments?: PaymentOrderByRelationAggregateInput
    changeLogs?: PlanChangeLogOrderByRelationAggregateInput
  }

  export type PatientTreatmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PatientTreatmentWhereInput | PatientTreatmentWhereInput[]
    OR?: PatientTreatmentWhereInput[]
    NOT?: PatientTreatmentWhereInput | PatientTreatmentWhereInput[]
    patientId?: StringFilter<"PatientTreatment"> | string
    treatmentId?: StringFilter<"PatientTreatment"> | string
    totalCost?: IntFilter<"PatientTreatment"> | number
    totalSessions?: IntFilter<"PatientTreatment"> | number
    clinicalStatus?: EnumClinicalStatusFilter<"PatientTreatment"> | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFilter<"PatientTreatment"> | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFilter<"PatientTreatment"> | $Enums.TreatmentStatus
    startDate?: DateTimeFilter<"PatientTreatment"> | Date | string
    updatedAt?: DateTimeFilter<"PatientTreatment"> | Date | string
    patient?: XOR<UserScalarRelationFilter, UserWhereInput>
    treatment?: XOR<TreatmentScalarRelationFilter, TreatmentWhereInput>
    appointments?: AppointmentListRelationFilter
    payments?: PaymentListRelationFilter
    changeLogs?: PlanChangeLogListRelationFilter
  }, "id">

  export type PatientTreatmentOrderByWithAggregationInput = {
    id?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    totalCost?: SortOrder
    totalSessions?: SortOrder
    clinicalStatus?: SortOrder
    financialStatus?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    updatedAt?: SortOrder
    _count?: PatientTreatmentCountOrderByAggregateInput
    _avg?: PatientTreatmentAvgOrderByAggregateInput
    _max?: PatientTreatmentMaxOrderByAggregateInput
    _min?: PatientTreatmentMinOrderByAggregateInput
    _sum?: PatientTreatmentSumOrderByAggregateInput
  }

  export type PatientTreatmentScalarWhereWithAggregatesInput = {
    AND?: PatientTreatmentScalarWhereWithAggregatesInput | PatientTreatmentScalarWhereWithAggregatesInput[]
    OR?: PatientTreatmentScalarWhereWithAggregatesInput[]
    NOT?: PatientTreatmentScalarWhereWithAggregatesInput | PatientTreatmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PatientTreatment"> | string
    patientId?: StringWithAggregatesFilter<"PatientTreatment"> | string
    treatmentId?: StringWithAggregatesFilter<"PatientTreatment"> | string
    totalCost?: IntWithAggregatesFilter<"PatientTreatment"> | number
    totalSessions?: IntWithAggregatesFilter<"PatientTreatment"> | number
    clinicalStatus?: EnumClinicalStatusWithAggregatesFilter<"PatientTreatment"> | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusWithAggregatesFilter<"PatientTreatment"> | $Enums.FinancialStatus
    status?: EnumTreatmentStatusWithAggregatesFilter<"PatientTreatment"> | $Enums.TreatmentStatus
    startDate?: DateTimeWithAggregatesFilter<"PatientTreatment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PatientTreatment"> | Date | string
  }

  export type PlanChangeLogWhereInput = {
    AND?: PlanChangeLogWhereInput | PlanChangeLogWhereInput[]
    OR?: PlanChangeLogWhereInput[]
    NOT?: PlanChangeLogWhereInput | PlanChangeLogWhereInput[]
    id?: StringFilter<"PlanChangeLog"> | string
    patientTreatmentId?: StringFilter<"PlanChangeLog"> | string
    changedByUserId?: StringNullableFilter<"PlanChangeLog"> | string | null
    field?: StringFilter<"PlanChangeLog"> | string
    oldValue?: StringFilter<"PlanChangeLog"> | string
    newValue?: StringFilter<"PlanChangeLog"> | string
    createdAt?: DateTimeFilter<"PlanChangeLog"> | Date | string
    patientTreatment?: XOR<PatientTreatmentScalarRelationFilter, PatientTreatmentWhereInput>
    changedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PlanChangeLogOrderByWithRelationInput = {
    id?: SortOrder
    patientTreatmentId?: SortOrder
    changedByUserId?: SortOrderInput | SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
    patientTreatment?: PatientTreatmentOrderByWithRelationInput
    changedByUser?: UserOrderByWithRelationInput
  }

  export type PlanChangeLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlanChangeLogWhereInput | PlanChangeLogWhereInput[]
    OR?: PlanChangeLogWhereInput[]
    NOT?: PlanChangeLogWhereInput | PlanChangeLogWhereInput[]
    patientTreatmentId?: StringFilter<"PlanChangeLog"> | string
    changedByUserId?: StringNullableFilter<"PlanChangeLog"> | string | null
    field?: StringFilter<"PlanChangeLog"> | string
    oldValue?: StringFilter<"PlanChangeLog"> | string
    newValue?: StringFilter<"PlanChangeLog"> | string
    createdAt?: DateTimeFilter<"PlanChangeLog"> | Date | string
    patientTreatment?: XOR<PatientTreatmentScalarRelationFilter, PatientTreatmentWhereInput>
    changedByUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type PlanChangeLogOrderByWithAggregationInput = {
    id?: SortOrder
    patientTreatmentId?: SortOrder
    changedByUserId?: SortOrderInput | SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
    _count?: PlanChangeLogCountOrderByAggregateInput
    _max?: PlanChangeLogMaxOrderByAggregateInput
    _min?: PlanChangeLogMinOrderByAggregateInput
  }

  export type PlanChangeLogScalarWhereWithAggregatesInput = {
    AND?: PlanChangeLogScalarWhereWithAggregatesInput | PlanChangeLogScalarWhereWithAggregatesInput[]
    OR?: PlanChangeLogScalarWhereWithAggregatesInput[]
    NOT?: PlanChangeLogScalarWhereWithAggregatesInput | PlanChangeLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlanChangeLog"> | string
    patientTreatmentId?: StringWithAggregatesFilter<"PlanChangeLog"> | string
    changedByUserId?: StringNullableWithAggregatesFilter<"PlanChangeLog"> | string | null
    field?: StringWithAggregatesFilter<"PlanChangeLog"> | string
    oldValue?: StringWithAggregatesFilter<"PlanChangeLog"> | string
    newValue?: StringWithAggregatesFilter<"PlanChangeLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PlanChangeLog"> | Date | string
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: StringFilter<"Payment"> | string
    amount?: IntFilter<"Payment"> | number
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    date?: DateTimeFilter<"Payment"> | Date | string
    notes?: StringNullableFilter<"Payment"> | string | null
    patientTreatmentId?: StringFilter<"Payment"> | string
    appointmentId?: StringNullableFilter<"Payment"> | string | null
    patientTreatment?: XOR<PatientTreatmentScalarRelationFilter, PatientTreatmentWhereInput>
    appointment?: XOR<AppointmentNullableScalarRelationFilter, AppointmentWhereInput> | null
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    date?: SortOrder
    notes?: SortOrderInput | SortOrder
    patientTreatmentId?: SortOrder
    appointmentId?: SortOrderInput | SortOrder
    patientTreatment?: PatientTreatmentOrderByWithRelationInput
    appointment?: AppointmentOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    amount?: IntFilter<"Payment"> | number
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    date?: DateTimeFilter<"Payment"> | Date | string
    notes?: StringNullableFilter<"Payment"> | string | null
    patientTreatmentId?: StringFilter<"Payment"> | string
    appointmentId?: StringNullableFilter<"Payment"> | string | null
    patientTreatment?: XOR<PatientTreatmentScalarRelationFilter, PatientTreatmentWhereInput>
    appointment?: XOR<AppointmentNullableScalarRelationFilter, AppointmentWhereInput> | null
  }, "id">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    date?: SortOrder
    notes?: SortOrderInput | SortOrder
    patientTreatmentId?: SortOrder
    appointmentId?: SortOrderInput | SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Payment"> | string
    amount?: IntWithAggregatesFilter<"Payment"> | number
    method?: EnumPaymentMethodWithAggregatesFilter<"Payment"> | $Enums.PaymentMethod
    date?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    notes?: StringNullableWithAggregatesFilter<"Payment"> | string | null
    patientTreatmentId?: StringWithAggregatesFilter<"Payment"> | string
    appointmentId?: StringNullableWithAggregatesFilter<"Payment"> | string | null
  }

  export type InventoryWhereInput = {
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    id?: StringFilter<"Inventory"> | string
    itemName?: StringFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    minThreshold?: IntFilter<"Inventory"> | number
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
  }

  export type InventoryOrderByWithRelationInput = {
    id?: SortOrder
    itemName?: SortOrder
    quantity?: SortOrder
    minThreshold?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    itemName?: StringFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    minThreshold?: IntFilter<"Inventory"> | number
    createdAt?: DateTimeFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeFilter<"Inventory"> | Date | string
  }, "id">

  export type InventoryOrderByWithAggregationInput = {
    id?: SortOrder
    itemName?: SortOrder
    quantity?: SortOrder
    minThreshold?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InventoryCountOrderByAggregateInput
    _avg?: InventoryAvgOrderByAggregateInput
    _max?: InventoryMaxOrderByAggregateInput
    _min?: InventoryMinOrderByAggregateInput
    _sum?: InventorySumOrderByAggregateInput
  }

  export type InventoryScalarWhereWithAggregatesInput = {
    AND?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    OR?: InventoryScalarWhereWithAggregatesInput[]
    NOT?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Inventory"> | string
    itemName?: StringWithAggregatesFilter<"Inventory"> | string
    quantity?: IntWithAggregatesFilter<"Inventory"> | number
    minThreshold?: IntWithAggregatesFilter<"Inventory"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Inventory"> | Date | string
  }

  export type DoctorWhereInput = {
    AND?: DoctorWhereInput | DoctorWhereInput[]
    OR?: DoctorWhereInput[]
    NOT?: DoctorWhereInput | DoctorWhereInput[]
    id?: StringFilter<"Doctor"> | string
    name?: StringFilter<"Doctor"> | string
    role?: StringFilter<"Doctor"> | string
    pmdcReg?: StringFilter<"Doctor"> | string
    qualifications?: StringFilter<"Doctor"> | string
    experience?: StringFilter<"Doctor"> | string
    specialty?: StringFilter<"Doctor"> | string
    operatory?: StringFilter<"Doctor"> | string
    schedule?: StringFilter<"Doctor"> | string
    consultationFee?: IntFilter<"Doctor"> | number
    patientsThisMonth?: IntFilter<"Doctor"> | number
    image?: StringNullableFilter<"Doctor"> | string | null
    isLead?: BoolFilter<"Doctor"> | boolean
    isActive?: BoolFilter<"Doctor"> | boolean
    createdAt?: DateTimeFilter<"Doctor"> | Date | string
    updatedAt?: DateTimeFilter<"Doctor"> | Date | string
    appointments?: AppointmentListRelationFilter
  }

  export type DoctorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    role?: SortOrder
    pmdcReg?: SortOrder
    qualifications?: SortOrder
    experience?: SortOrder
    specialty?: SortOrder
    operatory?: SortOrder
    schedule?: SortOrder
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
    image?: SortOrderInput | SortOrder
    isLead?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    appointments?: AppointmentOrderByRelationAggregateInput
  }

  export type DoctorWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DoctorWhereInput | DoctorWhereInput[]
    OR?: DoctorWhereInput[]
    NOT?: DoctorWhereInput | DoctorWhereInput[]
    name?: StringFilter<"Doctor"> | string
    role?: StringFilter<"Doctor"> | string
    pmdcReg?: StringFilter<"Doctor"> | string
    qualifications?: StringFilter<"Doctor"> | string
    experience?: StringFilter<"Doctor"> | string
    specialty?: StringFilter<"Doctor"> | string
    operatory?: StringFilter<"Doctor"> | string
    schedule?: StringFilter<"Doctor"> | string
    consultationFee?: IntFilter<"Doctor"> | number
    patientsThisMonth?: IntFilter<"Doctor"> | number
    image?: StringNullableFilter<"Doctor"> | string | null
    isLead?: BoolFilter<"Doctor"> | boolean
    isActive?: BoolFilter<"Doctor"> | boolean
    createdAt?: DateTimeFilter<"Doctor"> | Date | string
    updatedAt?: DateTimeFilter<"Doctor"> | Date | string
    appointments?: AppointmentListRelationFilter
  }, "id">

  export type DoctorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    role?: SortOrder
    pmdcReg?: SortOrder
    qualifications?: SortOrder
    experience?: SortOrder
    specialty?: SortOrder
    operatory?: SortOrder
    schedule?: SortOrder
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
    image?: SortOrderInput | SortOrder
    isLead?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DoctorCountOrderByAggregateInput
    _avg?: DoctorAvgOrderByAggregateInput
    _max?: DoctorMaxOrderByAggregateInput
    _min?: DoctorMinOrderByAggregateInput
    _sum?: DoctorSumOrderByAggregateInput
  }

  export type DoctorScalarWhereWithAggregatesInput = {
    AND?: DoctorScalarWhereWithAggregatesInput | DoctorScalarWhereWithAggregatesInput[]
    OR?: DoctorScalarWhereWithAggregatesInput[]
    NOT?: DoctorScalarWhereWithAggregatesInput | DoctorScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Doctor"> | string
    name?: StringWithAggregatesFilter<"Doctor"> | string
    role?: StringWithAggregatesFilter<"Doctor"> | string
    pmdcReg?: StringWithAggregatesFilter<"Doctor"> | string
    qualifications?: StringWithAggregatesFilter<"Doctor"> | string
    experience?: StringWithAggregatesFilter<"Doctor"> | string
    specialty?: StringWithAggregatesFilter<"Doctor"> | string
    operatory?: StringWithAggregatesFilter<"Doctor"> | string
    schedule?: StringWithAggregatesFilter<"Doctor"> | string
    consultationFee?: IntWithAggregatesFilter<"Doctor"> | number
    patientsThisMonth?: IntWithAggregatesFilter<"Doctor"> | number
    image?: StringNullableWithAggregatesFilter<"Doctor"> | string | null
    isLead?: BoolWithAggregatesFilter<"Doctor"> | boolean
    isActive?: BoolWithAggregatesFilter<"Doctor"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Doctor"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Doctor"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    patientTreatments?: PatientTreatmentCreateNestedManyWithoutPatientInput
    planChangeLogs?: PlanChangeLogCreateNestedManyWithoutChangedByUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    patientTreatments?: PatientTreatmentUncheckedCreateNestedManyWithoutPatientInput
    planChangeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutChangedByUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    patientTreatments?: PatientTreatmentUpdateManyWithoutPatientNestedInput
    planChangeLogs?: PlanChangeLogUpdateManyWithoutChangedByUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    patientTreatments?: PatientTreatmentUncheckedUpdateManyWithoutPatientNestedInput
    planChangeLogs?: PlanChangeLogUncheckedUpdateManyWithoutChangedByUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AppointmentCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    patient: UserCreateNestedOneWithoutAppointmentsInput
    treatment: TreatmentCreateNestedOneWithoutAppointmentsInput
    doctor?: DoctorCreateNestedOneWithoutAppointmentsInput
    clinicalNotes?: ClinicalNoteCreateNestedManyWithoutAppointmentInput
    patientTreatment?: PatientTreatmentCreateNestedOneWithoutAppointmentsInput
    payments?: PaymentCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    clinicalNotes?: ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    patient?: UserUpdateOneRequiredWithoutAppointmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput
    doctor?: DoctorUpdateOneWithoutAppointmentsNestedInput
    clinicalNotes?: ClinicalNoteUpdateManyWithoutAppointmentNestedInput
    patientTreatment?: PatientTreatmentUpdateOneWithoutAppointmentsNestedInput
    payments?: PaymentUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    clinicalNotes?: ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentCreateManyInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
  }

  export type AppointmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type AppointmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type ClinicalNoteCreateInput = {
    id?: string
    diagnosis?: string | null
    treatmentDone: string
    prescription?: string | null
    remarks?: string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    appointment: AppointmentCreateNestedOneWithoutClinicalNotesInput
  }

  export type ClinicalNoteUncheckedCreateInput = {
    id?: string
    appointmentId: string
    diagnosis?: string | null
    treatmentDone: string
    prescription?: string | null
    remarks?: string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalNoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointment?: AppointmentUpdateOneRequiredWithoutClinicalNotesNestedInput
  }

  export type ClinicalNoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalNoteCreateManyInput = {
    id?: string
    appointmentId: string
    diagnosis?: string | null
    treatmentDone: string
    prescription?: string | null
    remarks?: string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalNoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalNoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    appointmentId?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreatmentCreateInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
    appointments?: AppointmentCreateNestedManyWithoutTreatmentInput
    patientTreatments?: PatientTreatmentCreateNestedManyWithoutTreatmentInput
  }

  export type TreatmentUncheckedCreateInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
    appointments?: AppointmentUncheckedCreateNestedManyWithoutTreatmentInput
    patientTreatments?: PatientTreatmentUncheckedCreateNestedManyWithoutTreatmentInput
  }

  export type TreatmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
    appointments?: AppointmentUpdateManyWithoutTreatmentNestedInput
    patientTreatments?: PatientTreatmentUpdateManyWithoutTreatmentNestedInput
  }

  export type TreatmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
    appointments?: AppointmentUncheckedUpdateManyWithoutTreatmentNestedInput
    patientTreatments?: PatientTreatmentUncheckedUpdateManyWithoutTreatmentNestedInput
  }

  export type TreatmentCreateManyInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
  }

  export type TreatmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
  }

  export type TreatmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
  }

  export type SystemSettingsCreateInput = {
    id?: string
    clinicName?: string
    workDayStart?: string
    workDayEnd?: string
    slotDurationMin?: number
  }

  export type SystemSettingsUncheckedCreateInput = {
    id?: string
    clinicName?: string
    workDayStart?: string
    workDayEnd?: string
    slotDurationMin?: number
  }

  export type SystemSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clinicName?: StringFieldUpdateOperationsInput | string
    workDayStart?: StringFieldUpdateOperationsInput | string
    workDayEnd?: StringFieldUpdateOperationsInput | string
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type SystemSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clinicName?: StringFieldUpdateOperationsInput | string
    workDayStart?: StringFieldUpdateOperationsInput | string
    workDayEnd?: StringFieldUpdateOperationsInput | string
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type SystemSettingsCreateManyInput = {
    id?: string
    clinicName?: string
    workDayStart?: string
    workDayEnd?: string
    slotDurationMin?: number
  }

  export type SystemSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clinicName?: StringFieldUpdateOperationsInput | string
    workDayStart?: StringFieldUpdateOperationsInput | string
    workDayEnd?: StringFieldUpdateOperationsInput | string
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type SystemSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clinicName?: StringFieldUpdateOperationsInput | string
    workDayStart?: StringFieldUpdateOperationsInput | string
    workDayEnd?: StringFieldUpdateOperationsInput | string
    slotDurationMin?: IntFieldUpdateOperationsInput | number
  }

  export type PatientTreatmentCreateInput = {
    id?: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    patient: UserCreateNestedOneWithoutPatientTreatmentsInput
    treatment: TreatmentCreateNestedOneWithoutPatientTreatmentsInput
    appointments?: AppointmentCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUncheckedCreateInput = {
    id?: string
    patientId: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: UserUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentCreateManyInput = {
    id?: string
    patientId: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
  }

  export type PatientTreatmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientTreatmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanChangeLogCreateInput = {
    id?: string
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
    patientTreatment: PatientTreatmentCreateNestedOneWithoutChangeLogsInput
    changedByUser?: UserCreateNestedOneWithoutPlanChangeLogsInput
  }

  export type PlanChangeLogUncheckedCreateInput = {
    id?: string
    patientTreatmentId: string
    changedByUserId?: string | null
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
  }

  export type PlanChangeLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientTreatment?: PatientTreatmentUpdateOneRequiredWithoutChangeLogsNestedInput
    changedByUser?: UserUpdateOneWithoutPlanChangeLogsNestedInput
  }

  export type PlanChangeLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
    changedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanChangeLogCreateManyInput = {
    id?: string
    patientTreatmentId: string
    changedByUserId?: string | null
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
  }

  export type PlanChangeLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanChangeLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
    changedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentCreateInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    patientTreatment: PatientTreatmentCreateNestedOneWithoutPaymentsInput
    appointment?: AppointmentCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    patientTreatmentId: string
    appointmentId?: string | null
  }

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientTreatment?: PatientTreatmentUpdateOneRequiredWithoutPaymentsNestedInput
    appointment?: AppointmentUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentCreateManyInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    patientTreatmentId: string
    appointmentId?: string | null
  }

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryCreateInput = {
    id?: string
    itemName: string
    quantity?: number
    minThreshold?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUncheckedCreateInput = {
    id?: string
    itemName: string
    quantity?: number
    minThreshold?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCreateManyInput = {
    id?: string
    itemName: string
    quantity?: number
    minThreshold?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InventoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    itemName?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    minThreshold?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DoctorCreateInput = {
    id?: string
    name: string
    role: string
    pmdcReg: string
    qualifications: string
    experience: string
    specialty: string
    operatory: string
    schedule: string
    consultationFee?: number
    patientsThisMonth?: number
    image?: string | null
    isLead?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUncheckedCreateInput = {
    id?: string
    name: string
    role: string
    pmdcReg: string
    qualifications: string
    experience: string
    specialty: string
    operatory: string
    schedule: string
    consultationFee?: number
    patientsThisMonth?: number
    image?: string | null
    isLead?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutDoctorInput
  }

  export type DoctorUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    pmdcReg?: StringFieldUpdateOperationsInput | string
    qualifications?: StringFieldUpdateOperationsInput | string
    experience?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    operatory?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    consultationFee?: IntFieldUpdateOperationsInput | number
    patientsThisMonth?: IntFieldUpdateOperationsInput | number
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    pmdcReg?: StringFieldUpdateOperationsInput | string
    qualifications?: StringFieldUpdateOperationsInput | string
    experience?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    operatory?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    consultationFee?: IntFieldUpdateOperationsInput | number
    patientsThisMonth?: IntFieldUpdateOperationsInput | number
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutDoctorNestedInput
  }

  export type DoctorCreateManyInput = {
    id?: string
    name: string
    role: string
    pmdcReg: string
    qualifications: string
    experience: string
    specialty: string
    operatory: string
    schedule: string
    consultationFee?: number
    patientsThisMonth?: number
    image?: string | null
    isLead?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DoctorUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    pmdcReg?: StringFieldUpdateOperationsInput | string
    qualifications?: StringFieldUpdateOperationsInput | string
    experience?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    operatory?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    consultationFee?: IntFieldUpdateOperationsInput | number
    patientsThisMonth?: IntFieldUpdateOperationsInput | number
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DoctorUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    pmdcReg?: StringFieldUpdateOperationsInput | string
    qualifications?: StringFieldUpdateOperationsInput | string
    experience?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    operatory?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    consultationFee?: IntFieldUpdateOperationsInput | number
    patientsThisMonth?: IntFieldUpdateOperationsInput | number
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AppointmentListRelationFilter = {
    every?: AppointmentWhereInput
    some?: AppointmentWhereInput
    none?: AppointmentWhereInput
  }

  export type PatientTreatmentListRelationFilter = {
    every?: PatientTreatmentWhereInput
    some?: PatientTreatmentWhereInput
    none?: PatientTreatmentWhereInput
  }

  export type PlanChangeLogListRelationFilter = {
    every?: PlanChangeLogWhereInput
    some?: PlanChangeLogWhereInput
    none?: PlanChangeLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AppointmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PatientTreatmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanChangeLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    patientCode?: SortOrder
    noShowCount?: SortOrder
    createdAt?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    medicalAlerts?: SortOrder
    googleCalendarToken?: SortOrder
    googleCalendarRefreshToken?: SortOrder
    googleCalendarConnected?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    patientCode?: SortOrder
    noShowCount?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    patientCode?: SortOrder
    noShowCount?: SortOrder
    createdAt?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    medicalAlerts?: SortOrder
    googleCalendarToken?: SortOrder
    googleCalendarRefreshToken?: SortOrder
    googleCalendarConnected?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password?: SortOrder
    name?: SortOrder
    role?: SortOrder
    patientCode?: SortOrder
    noShowCount?: SortOrder
    createdAt?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    address?: SortOrder
    medicalAlerts?: SortOrder
    googleCalendarToken?: SortOrder
    googleCalendarRefreshToken?: SortOrder
    googleCalendarConnected?: SortOrder
    resetToken?: SortOrder
    resetTokenExpiry?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    patientCode?: SortOrder
    noShowCount?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumApptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApptStatus | EnumApptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApptStatusFilter<$PrismaModel> | $Enums.ApptStatus
  }

  export type EnumBookingSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingSource | EnumBookingSourceFieldRefInput<$PrismaModel>
    in?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingSourceFilter<$PrismaModel> | $Enums.BookingSource
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TreatmentScalarRelationFilter = {
    is?: TreatmentWhereInput
    isNot?: TreatmentWhereInput
  }

  export type DoctorNullableScalarRelationFilter = {
    is?: DoctorWhereInput | null
    isNot?: DoctorWhereInput | null
  }

  export type ClinicalNoteListRelationFilter = {
    every?: ClinicalNoteWhereInput
    some?: ClinicalNoteWhereInput
    none?: ClinicalNoteWhereInput
  }

  export type PatientTreatmentNullableScalarRelationFilter = {
    is?: PatientTreatmentWhereInput | null
    isNot?: PatientTreatmentWhereInput | null
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type ClinicalNoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppointmentCountOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    doctorId?: SortOrder
    googleEventId?: SortOrder
    bookedBy?: SortOrder
    amountPaid?: SortOrder
    price?: SortOrder
    discount?: SortOrder
    createdAt?: SortOrder
    checkoutTime?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    guestEmail?: SortOrder
    guestDob?: SortOrder
    patientTreatmentId?: SortOrder
    sessionNumber?: SortOrder
    sessionLabel?: SortOrder
    plannedFee?: SortOrder
  }

  export type AppointmentAvgOrderByAggregateInput = {
    amountPaid?: SortOrder
    price?: SortOrder
    discount?: SortOrder
    sessionNumber?: SortOrder
    plannedFee?: SortOrder
  }

  export type AppointmentMaxOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    doctorId?: SortOrder
    googleEventId?: SortOrder
    bookedBy?: SortOrder
    amountPaid?: SortOrder
    price?: SortOrder
    discount?: SortOrder
    createdAt?: SortOrder
    checkoutTime?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    guestEmail?: SortOrder
    guestDob?: SortOrder
    patientTreatmentId?: SortOrder
    sessionNumber?: SortOrder
    sessionLabel?: SortOrder
    plannedFee?: SortOrder
  }

  export type AppointmentMinOrderByAggregateInput = {
    id?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    doctorId?: SortOrder
    googleEventId?: SortOrder
    bookedBy?: SortOrder
    amountPaid?: SortOrder
    price?: SortOrder
    discount?: SortOrder
    createdAt?: SortOrder
    checkoutTime?: SortOrder
    guestName?: SortOrder
    guestPhone?: SortOrder
    guestEmail?: SortOrder
    guestDob?: SortOrder
    patientTreatmentId?: SortOrder
    sessionNumber?: SortOrder
    sessionLabel?: SortOrder
    plannedFee?: SortOrder
  }

  export type AppointmentSumOrderByAggregateInput = {
    amountPaid?: SortOrder
    price?: SortOrder
    discount?: SortOrder
    sessionNumber?: SortOrder
    plannedFee?: SortOrder
  }

  export type EnumApptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApptStatus | EnumApptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApptStatusFilter<$PrismaModel>
    _max?: NestedEnumApptStatusFilter<$PrismaModel>
  }

  export type EnumBookingSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingSource | EnumBookingSourceFieldRefInput<$PrismaModel>
    in?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingSourceWithAggregatesFilter<$PrismaModel> | $Enums.BookingSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingSourceFilter<$PrismaModel>
    _max?: NestedEnumBookingSourceFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AppointmentScalarRelationFilter = {
    is?: AppointmentWhereInput
    isNot?: AppointmentWhereInput
  }

  export type ClinicalNoteCountOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    diagnosis?: SortOrder
    treatmentDone?: SortOrder
    prescription?: SortOrder
    remarks?: SortOrder
    odontogramData?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    diagnosis?: SortOrder
    treatmentDone?: SortOrder
    prescription?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClinicalNoteMinOrderByAggregateInput = {
    id?: SortOrder
    appointmentId?: SortOrder
    diagnosis?: SortOrder
    treatmentDone?: SortOrder
    prescription?: SortOrder
    remarks?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type TreatmentCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    isActive?: SortOrder
    imageUrl?: SortOrder
    category?: SortOrder
    isMultiSession?: SortOrder
    defaultSessions?: SortOrder
  }

  export type TreatmentAvgOrderByAggregateInput = {
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    defaultSessions?: SortOrder
  }

  export type TreatmentMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    isActive?: SortOrder
    imageUrl?: SortOrder
    category?: SortOrder
    isMultiSession?: SortOrder
    defaultSessions?: SortOrder
  }

  export type TreatmentMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    description?: SortOrder
    instructions?: SortOrder
    isActive?: SortOrder
    imageUrl?: SortOrder
    category?: SortOrder
    isMultiSession?: SortOrder
    defaultSessions?: SortOrder
  }

  export type TreatmentSumOrderByAggregateInput = {
    durationMin?: SortOrder
    price?: SortOrder
    discountedPrice?: SortOrder
    defaultSessions?: SortOrder
  }

  export type SystemSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    clinicName?: SortOrder
    workDayStart?: SortOrder
    workDayEnd?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type SystemSettingsAvgOrderByAggregateInput = {
    slotDurationMin?: SortOrder
  }

  export type SystemSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    clinicName?: SortOrder
    workDayStart?: SortOrder
    workDayEnd?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type SystemSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    clinicName?: SortOrder
    workDayStart?: SortOrder
    workDayEnd?: SortOrder
    slotDurationMin?: SortOrder
  }

  export type SystemSettingsSumOrderByAggregateInput = {
    slotDurationMin?: SortOrder
  }

  export type EnumClinicalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClinicalStatus | EnumClinicalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClinicalStatusFilter<$PrismaModel> | $Enums.ClinicalStatus
  }

  export type EnumFinancialStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancialStatus | EnumFinancialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancialStatusFilter<$PrismaModel> | $Enums.FinancialStatus
  }

  export type EnumTreatmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentStatus | EnumTreatmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentStatusFilter<$PrismaModel> | $Enums.TreatmentStatus
  }

  export type PatientTreatmentCountOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    totalCost?: SortOrder
    totalSessions?: SortOrder
    clinicalStatus?: SortOrder
    financialStatus?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientTreatmentAvgOrderByAggregateInput = {
    totalCost?: SortOrder
    totalSessions?: SortOrder
  }

  export type PatientTreatmentMaxOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    totalCost?: SortOrder
    totalSessions?: SortOrder
    clinicalStatus?: SortOrder
    financialStatus?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientTreatmentMinOrderByAggregateInput = {
    id?: SortOrder
    patientId?: SortOrder
    treatmentId?: SortOrder
    totalCost?: SortOrder
    totalSessions?: SortOrder
    clinicalStatus?: SortOrder
    financialStatus?: SortOrder
    status?: SortOrder
    startDate?: SortOrder
    updatedAt?: SortOrder
  }

  export type PatientTreatmentSumOrderByAggregateInput = {
    totalCost?: SortOrder
    totalSessions?: SortOrder
  }

  export type EnumClinicalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClinicalStatus | EnumClinicalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClinicalStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClinicalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClinicalStatusFilter<$PrismaModel>
    _max?: NestedEnumClinicalStatusFilter<$PrismaModel>
  }

  export type EnumFinancialStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancialStatus | EnumFinancialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancialStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinancialStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinancialStatusFilter<$PrismaModel>
    _max?: NestedEnumFinancialStatusFilter<$PrismaModel>
  }

  export type EnumTreatmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentStatus | EnumTreatmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.TreatmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTreatmentStatusFilter<$PrismaModel>
    _max?: NestedEnumTreatmentStatusFilter<$PrismaModel>
  }

  export type PatientTreatmentScalarRelationFilter = {
    is?: PatientTreatmentWhereInput
    isNot?: PatientTreatmentWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type PlanChangeLogCountOrderByAggregateInput = {
    id?: SortOrder
    patientTreatmentId?: SortOrder
    changedByUserId?: SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type PlanChangeLogMaxOrderByAggregateInput = {
    id?: SortOrder
    patientTreatmentId?: SortOrder
    changedByUserId?: SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type PlanChangeLogMinOrderByAggregateInput = {
    id?: SortOrder
    patientTreatmentId?: SortOrder
    changedByUserId?: SortOrder
    field?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type AppointmentNullableScalarRelationFilter = {
    is?: AppointmentWhereInput | null
    isNot?: AppointmentWhereInput | null
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    date?: SortOrder
    notes?: SortOrder
    patientTreatmentId?: SortOrder
    appointmentId?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    date?: SortOrder
    notes?: SortOrder
    patientTreatmentId?: SortOrder
    appointmentId?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    method?: SortOrder
    date?: SortOrder
    notes?: SortOrder
    patientTreatmentId?: SortOrder
    appointmentId?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type InventoryCountOrderByAggregateInput = {
    id?: SortOrder
    itemName?: SortOrder
    quantity?: SortOrder
    minThreshold?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryAvgOrderByAggregateInput = {
    quantity?: SortOrder
    minThreshold?: SortOrder
  }

  export type InventoryMaxOrderByAggregateInput = {
    id?: SortOrder
    itemName?: SortOrder
    quantity?: SortOrder
    minThreshold?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventoryMinOrderByAggregateInput = {
    id?: SortOrder
    itemName?: SortOrder
    quantity?: SortOrder
    minThreshold?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InventorySumOrderByAggregateInput = {
    quantity?: SortOrder
    minThreshold?: SortOrder
  }

  export type DoctorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    role?: SortOrder
    pmdcReg?: SortOrder
    qualifications?: SortOrder
    experience?: SortOrder
    specialty?: SortOrder
    operatory?: SortOrder
    schedule?: SortOrder
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
    image?: SortOrder
    isLead?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DoctorAvgOrderByAggregateInput = {
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
  }

  export type DoctorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    role?: SortOrder
    pmdcReg?: SortOrder
    qualifications?: SortOrder
    experience?: SortOrder
    specialty?: SortOrder
    operatory?: SortOrder
    schedule?: SortOrder
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
    image?: SortOrder
    isLead?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DoctorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    role?: SortOrder
    pmdcReg?: SortOrder
    qualifications?: SortOrder
    experience?: SortOrder
    specialty?: SortOrder
    operatory?: SortOrder
    schedule?: SortOrder
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
    image?: SortOrder
    isLead?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DoctorSumOrderByAggregateInput = {
    consultationFee?: SortOrder
    patientsThisMonth?: SortOrder
  }

  export type AppointmentCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PatientTreatmentCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientTreatmentCreateWithoutPatientInput, PatientTreatmentUncheckedCreateWithoutPatientInput> | PatientTreatmentCreateWithoutPatientInput[] | PatientTreatmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutPatientInput | PatientTreatmentCreateOrConnectWithoutPatientInput[]
    createMany?: PatientTreatmentCreateManyPatientInputEnvelope
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
  }

  export type PlanChangeLogCreateNestedManyWithoutChangedByUserInput = {
    create?: XOR<PlanChangeLogCreateWithoutChangedByUserInput, PlanChangeLogUncheckedCreateWithoutChangedByUserInput> | PlanChangeLogCreateWithoutChangedByUserInput[] | PlanChangeLogUncheckedCreateWithoutChangedByUserInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutChangedByUserInput | PlanChangeLogCreateOrConnectWithoutChangedByUserInput[]
    createMany?: PlanChangeLogCreateManyChangedByUserInputEnvelope
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PatientTreatmentUncheckedCreateNestedManyWithoutPatientInput = {
    create?: XOR<PatientTreatmentCreateWithoutPatientInput, PatientTreatmentUncheckedCreateWithoutPatientInput> | PatientTreatmentCreateWithoutPatientInput[] | PatientTreatmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutPatientInput | PatientTreatmentCreateOrConnectWithoutPatientInput[]
    createMany?: PatientTreatmentCreateManyPatientInputEnvelope
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
  }

  export type PlanChangeLogUncheckedCreateNestedManyWithoutChangedByUserInput = {
    create?: XOR<PlanChangeLogCreateWithoutChangedByUserInput, PlanChangeLogUncheckedCreateWithoutChangedByUserInput> | PlanChangeLogCreateWithoutChangedByUserInput[] | PlanChangeLogUncheckedCreateWithoutChangedByUserInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutChangedByUserInput | PlanChangeLogCreateOrConnectWithoutChangedByUserInput[]
    createMany?: PlanChangeLogCreateManyChangedByUserInputEnvelope
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AppointmentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PatientTreatmentUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutPatientInput, PatientTreatmentUncheckedCreateWithoutPatientInput> | PatientTreatmentCreateWithoutPatientInput[] | PatientTreatmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutPatientInput | PatientTreatmentCreateOrConnectWithoutPatientInput[]
    upsert?: PatientTreatmentUpsertWithWhereUniqueWithoutPatientInput | PatientTreatmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientTreatmentCreateManyPatientInputEnvelope
    set?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    disconnect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    delete?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    update?: PatientTreatmentUpdateWithWhereUniqueWithoutPatientInput | PatientTreatmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientTreatmentUpdateManyWithWhereWithoutPatientInput | PatientTreatmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientTreatmentScalarWhereInput | PatientTreatmentScalarWhereInput[]
  }

  export type PlanChangeLogUpdateManyWithoutChangedByUserNestedInput = {
    create?: XOR<PlanChangeLogCreateWithoutChangedByUserInput, PlanChangeLogUncheckedCreateWithoutChangedByUserInput> | PlanChangeLogCreateWithoutChangedByUserInput[] | PlanChangeLogUncheckedCreateWithoutChangedByUserInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutChangedByUserInput | PlanChangeLogCreateOrConnectWithoutChangedByUserInput[]
    upsert?: PlanChangeLogUpsertWithWhereUniqueWithoutChangedByUserInput | PlanChangeLogUpsertWithWhereUniqueWithoutChangedByUserInput[]
    createMany?: PlanChangeLogCreateManyChangedByUserInputEnvelope
    set?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    disconnect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    delete?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    update?: PlanChangeLogUpdateWithWhereUniqueWithoutChangedByUserInput | PlanChangeLogUpdateWithWhereUniqueWithoutChangedByUserInput[]
    updateMany?: PlanChangeLogUpdateManyWithWhereWithoutChangedByUserInput | PlanChangeLogUpdateManyWithWhereWithoutChangedByUserInput[]
    deleteMany?: PlanChangeLogScalarWhereInput | PlanChangeLogScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput> | AppointmentCreateWithoutPatientInput[] | AppointmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientInput | AppointmentCreateOrConnectWithoutPatientInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientInput | AppointmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: AppointmentCreateManyPatientInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientInput | AppointmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientInput | AppointmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PatientTreatmentUncheckedUpdateManyWithoutPatientNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutPatientInput, PatientTreatmentUncheckedCreateWithoutPatientInput> | PatientTreatmentCreateWithoutPatientInput[] | PatientTreatmentUncheckedCreateWithoutPatientInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutPatientInput | PatientTreatmentCreateOrConnectWithoutPatientInput[]
    upsert?: PatientTreatmentUpsertWithWhereUniqueWithoutPatientInput | PatientTreatmentUpsertWithWhereUniqueWithoutPatientInput[]
    createMany?: PatientTreatmentCreateManyPatientInputEnvelope
    set?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    disconnect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    delete?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    update?: PatientTreatmentUpdateWithWhereUniqueWithoutPatientInput | PatientTreatmentUpdateWithWhereUniqueWithoutPatientInput[]
    updateMany?: PatientTreatmentUpdateManyWithWhereWithoutPatientInput | PatientTreatmentUpdateManyWithWhereWithoutPatientInput[]
    deleteMany?: PatientTreatmentScalarWhereInput | PatientTreatmentScalarWhereInput[]
  }

  export type PlanChangeLogUncheckedUpdateManyWithoutChangedByUserNestedInput = {
    create?: XOR<PlanChangeLogCreateWithoutChangedByUserInput, PlanChangeLogUncheckedCreateWithoutChangedByUserInput> | PlanChangeLogCreateWithoutChangedByUserInput[] | PlanChangeLogUncheckedCreateWithoutChangedByUserInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutChangedByUserInput | PlanChangeLogCreateOrConnectWithoutChangedByUserInput[]
    upsert?: PlanChangeLogUpsertWithWhereUniqueWithoutChangedByUserInput | PlanChangeLogUpsertWithWhereUniqueWithoutChangedByUserInput[]
    createMany?: PlanChangeLogCreateManyChangedByUserInputEnvelope
    set?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    disconnect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    delete?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    update?: PlanChangeLogUpdateWithWhereUniqueWithoutChangedByUserInput | PlanChangeLogUpdateWithWhereUniqueWithoutChangedByUserInput[]
    updateMany?: PlanChangeLogUpdateManyWithWhereWithoutChangedByUserInput | PlanChangeLogUpdateManyWithWhereWithoutChangedByUserInput[]
    deleteMany?: PlanChangeLogScalarWhereInput | PlanChangeLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppointmentsInput
    connect?: UserWhereUniqueInput
  }

  export type TreatmentCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<TreatmentCreateWithoutAppointmentsInput, TreatmentUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: TreatmentCreateOrConnectWithoutAppointmentsInput
    connect?: TreatmentWhereUniqueInput
  }

  export type DoctorCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<DoctorCreateWithoutAppointmentsInput, DoctorUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutAppointmentsInput
    connect?: DoctorWhereUniqueInput
  }

  export type ClinicalNoteCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<ClinicalNoteCreateWithoutAppointmentInput, ClinicalNoteUncheckedCreateWithoutAppointmentInput> | ClinicalNoteCreateWithoutAppointmentInput[] | ClinicalNoteUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: ClinicalNoteCreateOrConnectWithoutAppointmentInput | ClinicalNoteCreateOrConnectWithoutAppointmentInput[]
    createMany?: ClinicalNoteCreateManyAppointmentInputEnvelope
    connect?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
  }

  export type PatientTreatmentCreateNestedOneWithoutAppointmentsInput = {
    create?: XOR<PatientTreatmentCreateWithoutAppointmentsInput, PatientTreatmentUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutAppointmentsInput
    connect?: PatientTreatmentWhereUniqueInput
  }

  export type PaymentCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput> | PaymentCreateWithoutAppointmentInput[] | PaymentUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput | PaymentCreateOrConnectWithoutAppointmentInput[]
    createMany?: PaymentCreateManyAppointmentInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<ClinicalNoteCreateWithoutAppointmentInput, ClinicalNoteUncheckedCreateWithoutAppointmentInput> | ClinicalNoteCreateWithoutAppointmentInput[] | ClinicalNoteUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: ClinicalNoteCreateOrConnectWithoutAppointmentInput | ClinicalNoteCreateOrConnectWithoutAppointmentInput[]
    createMany?: ClinicalNoteCreateManyAppointmentInputEnvelope
    connect?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutAppointmentInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput> | PaymentCreateWithoutAppointmentInput[] | PaymentUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput | PaymentCreateOrConnectWithoutAppointmentInput[]
    createMany?: PaymentCreateManyAppointmentInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type EnumApptStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApptStatus
  }

  export type EnumBookingSourceFieldUpdateOperationsInput = {
    set?: $Enums.BookingSource
  }

  export type UserUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppointmentsInput
    upsert?: UserUpsertWithoutAppointmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAppointmentsInput, UserUpdateWithoutAppointmentsInput>, UserUncheckedUpdateWithoutAppointmentsInput>
  }

  export type TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput = {
    create?: XOR<TreatmentCreateWithoutAppointmentsInput, TreatmentUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: TreatmentCreateOrConnectWithoutAppointmentsInput
    upsert?: TreatmentUpsertWithoutAppointmentsInput
    connect?: TreatmentWhereUniqueInput
    update?: XOR<XOR<TreatmentUpdateToOneWithWhereWithoutAppointmentsInput, TreatmentUpdateWithoutAppointmentsInput>, TreatmentUncheckedUpdateWithoutAppointmentsInput>
  }

  export type DoctorUpdateOneWithoutAppointmentsNestedInput = {
    create?: XOR<DoctorCreateWithoutAppointmentsInput, DoctorUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: DoctorCreateOrConnectWithoutAppointmentsInput
    upsert?: DoctorUpsertWithoutAppointmentsInput
    disconnect?: DoctorWhereInput | boolean
    delete?: DoctorWhereInput | boolean
    connect?: DoctorWhereUniqueInput
    update?: XOR<XOR<DoctorUpdateToOneWithWhereWithoutAppointmentsInput, DoctorUpdateWithoutAppointmentsInput>, DoctorUncheckedUpdateWithoutAppointmentsInput>
  }

  export type ClinicalNoteUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<ClinicalNoteCreateWithoutAppointmentInput, ClinicalNoteUncheckedCreateWithoutAppointmentInput> | ClinicalNoteCreateWithoutAppointmentInput[] | ClinicalNoteUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: ClinicalNoteCreateOrConnectWithoutAppointmentInput | ClinicalNoteCreateOrConnectWithoutAppointmentInput[]
    upsert?: ClinicalNoteUpsertWithWhereUniqueWithoutAppointmentInput | ClinicalNoteUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: ClinicalNoteCreateManyAppointmentInputEnvelope
    set?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    disconnect?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    delete?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    connect?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    update?: ClinicalNoteUpdateWithWhereUniqueWithoutAppointmentInput | ClinicalNoteUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: ClinicalNoteUpdateManyWithWhereWithoutAppointmentInput | ClinicalNoteUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: ClinicalNoteScalarWhereInput | ClinicalNoteScalarWhereInput[]
  }

  export type PatientTreatmentUpdateOneWithoutAppointmentsNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutAppointmentsInput, PatientTreatmentUncheckedCreateWithoutAppointmentsInput>
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutAppointmentsInput
    upsert?: PatientTreatmentUpsertWithoutAppointmentsInput
    disconnect?: PatientTreatmentWhereInput | boolean
    delete?: PatientTreatmentWhereInput | boolean
    connect?: PatientTreatmentWhereUniqueInput
    update?: XOR<XOR<PatientTreatmentUpdateToOneWithWhereWithoutAppointmentsInput, PatientTreatmentUpdateWithoutAppointmentsInput>, PatientTreatmentUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PaymentUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput> | PaymentCreateWithoutAppointmentInput[] | PaymentUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput | PaymentCreateOrConnectWithoutAppointmentInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutAppointmentInput | PaymentUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: PaymentCreateManyAppointmentInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutAppointmentInput | PaymentUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutAppointmentInput | PaymentUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<ClinicalNoteCreateWithoutAppointmentInput, ClinicalNoteUncheckedCreateWithoutAppointmentInput> | ClinicalNoteCreateWithoutAppointmentInput[] | ClinicalNoteUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: ClinicalNoteCreateOrConnectWithoutAppointmentInput | ClinicalNoteCreateOrConnectWithoutAppointmentInput[]
    upsert?: ClinicalNoteUpsertWithWhereUniqueWithoutAppointmentInput | ClinicalNoteUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: ClinicalNoteCreateManyAppointmentInputEnvelope
    set?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    disconnect?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    delete?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    connect?: ClinicalNoteWhereUniqueInput | ClinicalNoteWhereUniqueInput[]
    update?: ClinicalNoteUpdateWithWhereUniqueWithoutAppointmentInput | ClinicalNoteUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: ClinicalNoteUpdateManyWithWhereWithoutAppointmentInput | ClinicalNoteUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: ClinicalNoteScalarWhereInput | ClinicalNoteScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutAppointmentNestedInput = {
    create?: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput> | PaymentCreateWithoutAppointmentInput[] | PaymentUncheckedCreateWithoutAppointmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutAppointmentInput | PaymentCreateOrConnectWithoutAppointmentInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutAppointmentInput | PaymentUpsertWithWhereUniqueWithoutAppointmentInput[]
    createMany?: PaymentCreateManyAppointmentInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutAppointmentInput | PaymentUpdateWithWhereUniqueWithoutAppointmentInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutAppointmentInput | PaymentUpdateManyWithWhereWithoutAppointmentInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type AppointmentCreateNestedOneWithoutClinicalNotesInput = {
    create?: XOR<AppointmentCreateWithoutClinicalNotesInput, AppointmentUncheckedCreateWithoutClinicalNotesInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutClinicalNotesInput
    connect?: AppointmentWhereUniqueInput
  }

  export type AppointmentUpdateOneRequiredWithoutClinicalNotesNestedInput = {
    create?: XOR<AppointmentCreateWithoutClinicalNotesInput, AppointmentUncheckedCreateWithoutClinicalNotesInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutClinicalNotesInput
    upsert?: AppointmentUpsertWithoutClinicalNotesInput
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutClinicalNotesInput, AppointmentUpdateWithoutClinicalNotesInput>, AppointmentUncheckedUpdateWithoutClinicalNotesInput>
  }

  export type AppointmentCreateNestedManyWithoutTreatmentInput = {
    create?: XOR<AppointmentCreateWithoutTreatmentInput, AppointmentUncheckedCreateWithoutTreatmentInput> | AppointmentCreateWithoutTreatmentInput[] | AppointmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutTreatmentInput | AppointmentCreateOrConnectWithoutTreatmentInput[]
    createMany?: AppointmentCreateManyTreatmentInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PatientTreatmentCreateNestedManyWithoutTreatmentInput = {
    create?: XOR<PatientTreatmentCreateWithoutTreatmentInput, PatientTreatmentUncheckedCreateWithoutTreatmentInput> | PatientTreatmentCreateWithoutTreatmentInput[] | PatientTreatmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutTreatmentInput | PatientTreatmentCreateOrConnectWithoutTreatmentInput[]
    createMany?: PatientTreatmentCreateManyTreatmentInputEnvelope
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutTreatmentInput = {
    create?: XOR<AppointmentCreateWithoutTreatmentInput, AppointmentUncheckedCreateWithoutTreatmentInput> | AppointmentCreateWithoutTreatmentInput[] | AppointmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutTreatmentInput | AppointmentCreateOrConnectWithoutTreatmentInput[]
    createMany?: AppointmentCreateManyTreatmentInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PatientTreatmentUncheckedCreateNestedManyWithoutTreatmentInput = {
    create?: XOR<PatientTreatmentCreateWithoutTreatmentInput, PatientTreatmentUncheckedCreateWithoutTreatmentInput> | PatientTreatmentCreateWithoutTreatmentInput[] | PatientTreatmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutTreatmentInput | PatientTreatmentCreateOrConnectWithoutTreatmentInput[]
    createMany?: PatientTreatmentCreateManyTreatmentInputEnvelope
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
  }

  export type AppointmentUpdateManyWithoutTreatmentNestedInput = {
    create?: XOR<AppointmentCreateWithoutTreatmentInput, AppointmentUncheckedCreateWithoutTreatmentInput> | AppointmentCreateWithoutTreatmentInput[] | AppointmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutTreatmentInput | AppointmentCreateOrConnectWithoutTreatmentInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutTreatmentInput | AppointmentUpsertWithWhereUniqueWithoutTreatmentInput[]
    createMany?: AppointmentCreateManyTreatmentInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutTreatmentInput | AppointmentUpdateWithWhereUniqueWithoutTreatmentInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutTreatmentInput | AppointmentUpdateManyWithWhereWithoutTreatmentInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PatientTreatmentUpdateManyWithoutTreatmentNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutTreatmentInput, PatientTreatmentUncheckedCreateWithoutTreatmentInput> | PatientTreatmentCreateWithoutTreatmentInput[] | PatientTreatmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutTreatmentInput | PatientTreatmentCreateOrConnectWithoutTreatmentInput[]
    upsert?: PatientTreatmentUpsertWithWhereUniqueWithoutTreatmentInput | PatientTreatmentUpsertWithWhereUniqueWithoutTreatmentInput[]
    createMany?: PatientTreatmentCreateManyTreatmentInputEnvelope
    set?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    disconnect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    delete?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    update?: PatientTreatmentUpdateWithWhereUniqueWithoutTreatmentInput | PatientTreatmentUpdateWithWhereUniqueWithoutTreatmentInput[]
    updateMany?: PatientTreatmentUpdateManyWithWhereWithoutTreatmentInput | PatientTreatmentUpdateManyWithWhereWithoutTreatmentInput[]
    deleteMany?: PatientTreatmentScalarWhereInput | PatientTreatmentScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutTreatmentNestedInput = {
    create?: XOR<AppointmentCreateWithoutTreatmentInput, AppointmentUncheckedCreateWithoutTreatmentInput> | AppointmentCreateWithoutTreatmentInput[] | AppointmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutTreatmentInput | AppointmentCreateOrConnectWithoutTreatmentInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutTreatmentInput | AppointmentUpsertWithWhereUniqueWithoutTreatmentInput[]
    createMany?: AppointmentCreateManyTreatmentInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutTreatmentInput | AppointmentUpdateWithWhereUniqueWithoutTreatmentInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutTreatmentInput | AppointmentUpdateManyWithWhereWithoutTreatmentInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PatientTreatmentUncheckedUpdateManyWithoutTreatmentNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutTreatmentInput, PatientTreatmentUncheckedCreateWithoutTreatmentInput> | PatientTreatmentCreateWithoutTreatmentInput[] | PatientTreatmentUncheckedCreateWithoutTreatmentInput[]
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutTreatmentInput | PatientTreatmentCreateOrConnectWithoutTreatmentInput[]
    upsert?: PatientTreatmentUpsertWithWhereUniqueWithoutTreatmentInput | PatientTreatmentUpsertWithWhereUniqueWithoutTreatmentInput[]
    createMany?: PatientTreatmentCreateManyTreatmentInputEnvelope
    set?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    disconnect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    delete?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    connect?: PatientTreatmentWhereUniqueInput | PatientTreatmentWhereUniqueInput[]
    update?: PatientTreatmentUpdateWithWhereUniqueWithoutTreatmentInput | PatientTreatmentUpdateWithWhereUniqueWithoutTreatmentInput[]
    updateMany?: PatientTreatmentUpdateManyWithWhereWithoutTreatmentInput | PatientTreatmentUpdateManyWithWhereWithoutTreatmentInput[]
    deleteMany?: PatientTreatmentScalarWhereInput | PatientTreatmentScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPatientTreatmentsInput = {
    create?: XOR<UserCreateWithoutPatientTreatmentsInput, UserUncheckedCreateWithoutPatientTreatmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPatientTreatmentsInput
    connect?: UserWhereUniqueInput
  }

  export type TreatmentCreateNestedOneWithoutPatientTreatmentsInput = {
    create?: XOR<TreatmentCreateWithoutPatientTreatmentsInput, TreatmentUncheckedCreateWithoutPatientTreatmentsInput>
    connectOrCreate?: TreatmentCreateOrConnectWithoutPatientTreatmentsInput
    connect?: TreatmentWhereUniqueInput
  }

  export type AppointmentCreateNestedManyWithoutPatientTreatmentInput = {
    create?: XOR<AppointmentCreateWithoutPatientTreatmentInput, AppointmentUncheckedCreateWithoutPatientTreatmentInput> | AppointmentCreateWithoutPatientTreatmentInput[] | AppointmentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientTreatmentInput | AppointmentCreateOrConnectWithoutPatientTreatmentInput[]
    createMany?: AppointmentCreateManyPatientTreatmentInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutPatientTreatmentInput = {
    create?: XOR<PaymentCreateWithoutPatientTreatmentInput, PaymentUncheckedCreateWithoutPatientTreatmentInput> | PaymentCreateWithoutPatientTreatmentInput[] | PaymentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutPatientTreatmentInput | PaymentCreateOrConnectWithoutPatientTreatmentInput[]
    createMany?: PaymentCreateManyPatientTreatmentInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PlanChangeLogCreateNestedManyWithoutPatientTreatmentInput = {
    create?: XOR<PlanChangeLogCreateWithoutPatientTreatmentInput, PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput> | PlanChangeLogCreateWithoutPatientTreatmentInput[] | PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput | PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput[]
    createMany?: PlanChangeLogCreateManyPatientTreatmentInputEnvelope
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutPatientTreatmentInput = {
    create?: XOR<AppointmentCreateWithoutPatientTreatmentInput, AppointmentUncheckedCreateWithoutPatientTreatmentInput> | AppointmentCreateWithoutPatientTreatmentInput[] | AppointmentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientTreatmentInput | AppointmentCreateOrConnectWithoutPatientTreatmentInput[]
    createMany?: AppointmentCreateManyPatientTreatmentInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutPatientTreatmentInput = {
    create?: XOR<PaymentCreateWithoutPatientTreatmentInput, PaymentUncheckedCreateWithoutPatientTreatmentInput> | PaymentCreateWithoutPatientTreatmentInput[] | PaymentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutPatientTreatmentInput | PaymentCreateOrConnectWithoutPatientTreatmentInput[]
    createMany?: PaymentCreateManyPatientTreatmentInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type PlanChangeLogUncheckedCreateNestedManyWithoutPatientTreatmentInput = {
    create?: XOR<PlanChangeLogCreateWithoutPatientTreatmentInput, PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput> | PlanChangeLogCreateWithoutPatientTreatmentInput[] | PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput | PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput[]
    createMany?: PlanChangeLogCreateManyPatientTreatmentInputEnvelope
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
  }

  export type EnumClinicalStatusFieldUpdateOperationsInput = {
    set?: $Enums.ClinicalStatus
  }

  export type EnumFinancialStatusFieldUpdateOperationsInput = {
    set?: $Enums.FinancialStatus
  }

  export type EnumTreatmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.TreatmentStatus
  }

  export type UserUpdateOneRequiredWithoutPatientTreatmentsNestedInput = {
    create?: XOR<UserCreateWithoutPatientTreatmentsInput, UserUncheckedCreateWithoutPatientTreatmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPatientTreatmentsInput
    upsert?: UserUpsertWithoutPatientTreatmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPatientTreatmentsInput, UserUpdateWithoutPatientTreatmentsInput>, UserUncheckedUpdateWithoutPatientTreatmentsInput>
  }

  export type TreatmentUpdateOneRequiredWithoutPatientTreatmentsNestedInput = {
    create?: XOR<TreatmentCreateWithoutPatientTreatmentsInput, TreatmentUncheckedCreateWithoutPatientTreatmentsInput>
    connectOrCreate?: TreatmentCreateOrConnectWithoutPatientTreatmentsInput
    upsert?: TreatmentUpsertWithoutPatientTreatmentsInput
    connect?: TreatmentWhereUniqueInput
    update?: XOR<XOR<TreatmentUpdateToOneWithWhereWithoutPatientTreatmentsInput, TreatmentUpdateWithoutPatientTreatmentsInput>, TreatmentUncheckedUpdateWithoutPatientTreatmentsInput>
  }

  export type AppointmentUpdateManyWithoutPatientTreatmentNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientTreatmentInput, AppointmentUncheckedCreateWithoutPatientTreatmentInput> | AppointmentCreateWithoutPatientTreatmentInput[] | AppointmentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientTreatmentInput | AppointmentCreateOrConnectWithoutPatientTreatmentInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientTreatmentInput | AppointmentUpsertWithWhereUniqueWithoutPatientTreatmentInput[]
    createMany?: AppointmentCreateManyPatientTreatmentInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientTreatmentInput | AppointmentUpdateWithWhereUniqueWithoutPatientTreatmentInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientTreatmentInput | AppointmentUpdateManyWithWhereWithoutPatientTreatmentInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutPatientTreatmentNestedInput = {
    create?: XOR<PaymentCreateWithoutPatientTreatmentInput, PaymentUncheckedCreateWithoutPatientTreatmentInput> | PaymentCreateWithoutPatientTreatmentInput[] | PaymentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutPatientTreatmentInput | PaymentCreateOrConnectWithoutPatientTreatmentInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutPatientTreatmentInput | PaymentUpsertWithWhereUniqueWithoutPatientTreatmentInput[]
    createMany?: PaymentCreateManyPatientTreatmentInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutPatientTreatmentInput | PaymentUpdateWithWhereUniqueWithoutPatientTreatmentInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutPatientTreatmentInput | PaymentUpdateManyWithWhereWithoutPatientTreatmentInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PlanChangeLogUpdateManyWithoutPatientTreatmentNestedInput = {
    create?: XOR<PlanChangeLogCreateWithoutPatientTreatmentInput, PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput> | PlanChangeLogCreateWithoutPatientTreatmentInput[] | PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput | PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput[]
    upsert?: PlanChangeLogUpsertWithWhereUniqueWithoutPatientTreatmentInput | PlanChangeLogUpsertWithWhereUniqueWithoutPatientTreatmentInput[]
    createMany?: PlanChangeLogCreateManyPatientTreatmentInputEnvelope
    set?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    disconnect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    delete?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    update?: PlanChangeLogUpdateWithWhereUniqueWithoutPatientTreatmentInput | PlanChangeLogUpdateWithWhereUniqueWithoutPatientTreatmentInput[]
    updateMany?: PlanChangeLogUpdateManyWithWhereWithoutPatientTreatmentInput | PlanChangeLogUpdateManyWithWhereWithoutPatientTreatmentInput[]
    deleteMany?: PlanChangeLogScalarWhereInput | PlanChangeLogScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientTreatmentNestedInput = {
    create?: XOR<AppointmentCreateWithoutPatientTreatmentInput, AppointmentUncheckedCreateWithoutPatientTreatmentInput> | AppointmentCreateWithoutPatientTreatmentInput[] | AppointmentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutPatientTreatmentInput | AppointmentCreateOrConnectWithoutPatientTreatmentInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutPatientTreatmentInput | AppointmentUpsertWithWhereUniqueWithoutPatientTreatmentInput[]
    createMany?: AppointmentCreateManyPatientTreatmentInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutPatientTreatmentInput | AppointmentUpdateWithWhereUniqueWithoutPatientTreatmentInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutPatientTreatmentInput | AppointmentUpdateManyWithWhereWithoutPatientTreatmentInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutPatientTreatmentNestedInput = {
    create?: XOR<PaymentCreateWithoutPatientTreatmentInput, PaymentUncheckedCreateWithoutPatientTreatmentInput> | PaymentCreateWithoutPatientTreatmentInput[] | PaymentUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutPatientTreatmentInput | PaymentCreateOrConnectWithoutPatientTreatmentInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutPatientTreatmentInput | PaymentUpsertWithWhereUniqueWithoutPatientTreatmentInput[]
    createMany?: PaymentCreateManyPatientTreatmentInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutPatientTreatmentInput | PaymentUpdateWithWhereUniqueWithoutPatientTreatmentInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutPatientTreatmentInput | PaymentUpdateManyWithWhereWithoutPatientTreatmentInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentNestedInput = {
    create?: XOR<PlanChangeLogCreateWithoutPatientTreatmentInput, PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput> | PlanChangeLogCreateWithoutPatientTreatmentInput[] | PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput[]
    connectOrCreate?: PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput | PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput[]
    upsert?: PlanChangeLogUpsertWithWhereUniqueWithoutPatientTreatmentInput | PlanChangeLogUpsertWithWhereUniqueWithoutPatientTreatmentInput[]
    createMany?: PlanChangeLogCreateManyPatientTreatmentInputEnvelope
    set?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    disconnect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    delete?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    connect?: PlanChangeLogWhereUniqueInput | PlanChangeLogWhereUniqueInput[]
    update?: PlanChangeLogUpdateWithWhereUniqueWithoutPatientTreatmentInput | PlanChangeLogUpdateWithWhereUniqueWithoutPatientTreatmentInput[]
    updateMany?: PlanChangeLogUpdateManyWithWhereWithoutPatientTreatmentInput | PlanChangeLogUpdateManyWithWhereWithoutPatientTreatmentInput[]
    deleteMany?: PlanChangeLogScalarWhereInput | PlanChangeLogScalarWhereInput[]
  }

  export type PatientTreatmentCreateNestedOneWithoutChangeLogsInput = {
    create?: XOR<PatientTreatmentCreateWithoutChangeLogsInput, PatientTreatmentUncheckedCreateWithoutChangeLogsInput>
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutChangeLogsInput
    connect?: PatientTreatmentWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPlanChangeLogsInput = {
    create?: XOR<UserCreateWithoutPlanChangeLogsInput, UserUncheckedCreateWithoutPlanChangeLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlanChangeLogsInput
    connect?: UserWhereUniqueInput
  }

  export type PatientTreatmentUpdateOneRequiredWithoutChangeLogsNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutChangeLogsInput, PatientTreatmentUncheckedCreateWithoutChangeLogsInput>
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutChangeLogsInput
    upsert?: PatientTreatmentUpsertWithoutChangeLogsInput
    connect?: PatientTreatmentWhereUniqueInput
    update?: XOR<XOR<PatientTreatmentUpdateToOneWithWhereWithoutChangeLogsInput, PatientTreatmentUpdateWithoutChangeLogsInput>, PatientTreatmentUncheckedUpdateWithoutChangeLogsInput>
  }

  export type UserUpdateOneWithoutPlanChangeLogsNestedInput = {
    create?: XOR<UserCreateWithoutPlanChangeLogsInput, UserUncheckedCreateWithoutPlanChangeLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlanChangeLogsInput
    upsert?: UserUpsertWithoutPlanChangeLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlanChangeLogsInput, UserUpdateWithoutPlanChangeLogsInput>, UserUncheckedUpdateWithoutPlanChangeLogsInput>
  }

  export type PatientTreatmentCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<PatientTreatmentCreateWithoutPaymentsInput, PatientTreatmentUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutPaymentsInput
    connect?: PatientTreatmentWhereUniqueInput
  }

  export type AppointmentCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<AppointmentCreateWithoutPaymentsInput, AppointmentUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutPaymentsInput
    connect?: AppointmentWhereUniqueInput
  }

  export type EnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod
  }

  export type PatientTreatmentUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<PatientTreatmentCreateWithoutPaymentsInput, PatientTreatmentUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: PatientTreatmentCreateOrConnectWithoutPaymentsInput
    upsert?: PatientTreatmentUpsertWithoutPaymentsInput
    connect?: PatientTreatmentWhereUniqueInput
    update?: XOR<XOR<PatientTreatmentUpdateToOneWithWhereWithoutPaymentsInput, PatientTreatmentUpdateWithoutPaymentsInput>, PatientTreatmentUncheckedUpdateWithoutPaymentsInput>
  }

  export type AppointmentUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<AppointmentCreateWithoutPaymentsInput, AppointmentUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: AppointmentCreateOrConnectWithoutPaymentsInput
    upsert?: AppointmentUpsertWithoutPaymentsInput
    disconnect?: AppointmentWhereInput | boolean
    delete?: AppointmentWhereInput | boolean
    connect?: AppointmentWhereUniqueInput
    update?: XOR<XOR<AppointmentUpdateToOneWithWhereWithoutPaymentsInput, AppointmentUpdateWithoutPaymentsInput>, AppointmentUncheckedUpdateWithoutPaymentsInput>
  }

  export type AppointmentCreateNestedManyWithoutDoctorInput = {
    create?: XOR<AppointmentCreateWithoutDoctorInput, AppointmentUncheckedCreateWithoutDoctorInput> | AppointmentCreateWithoutDoctorInput[] | AppointmentUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutDoctorInput | AppointmentCreateOrConnectWithoutDoctorInput[]
    createMany?: AppointmentCreateManyDoctorInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type AppointmentUncheckedCreateNestedManyWithoutDoctorInput = {
    create?: XOR<AppointmentCreateWithoutDoctorInput, AppointmentUncheckedCreateWithoutDoctorInput> | AppointmentCreateWithoutDoctorInput[] | AppointmentUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutDoctorInput | AppointmentCreateOrConnectWithoutDoctorInput[]
    createMany?: AppointmentCreateManyDoctorInputEnvelope
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
  }

  export type AppointmentUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<AppointmentCreateWithoutDoctorInput, AppointmentUncheckedCreateWithoutDoctorInput> | AppointmentCreateWithoutDoctorInput[] | AppointmentUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutDoctorInput | AppointmentCreateOrConnectWithoutDoctorInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutDoctorInput | AppointmentUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: AppointmentCreateManyDoctorInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutDoctorInput | AppointmentUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutDoctorInput | AppointmentUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type AppointmentUncheckedUpdateManyWithoutDoctorNestedInput = {
    create?: XOR<AppointmentCreateWithoutDoctorInput, AppointmentUncheckedCreateWithoutDoctorInput> | AppointmentCreateWithoutDoctorInput[] | AppointmentUncheckedCreateWithoutDoctorInput[]
    connectOrCreate?: AppointmentCreateOrConnectWithoutDoctorInput | AppointmentCreateOrConnectWithoutDoctorInput[]
    upsert?: AppointmentUpsertWithWhereUniqueWithoutDoctorInput | AppointmentUpsertWithWhereUniqueWithoutDoctorInput[]
    createMany?: AppointmentCreateManyDoctorInputEnvelope
    set?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    disconnect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    delete?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    connect?: AppointmentWhereUniqueInput | AppointmentWhereUniqueInput[]
    update?: AppointmentUpdateWithWhereUniqueWithoutDoctorInput | AppointmentUpdateWithWhereUniqueWithoutDoctorInput[]
    updateMany?: AppointmentUpdateManyWithWhereWithoutDoctorInput | AppointmentUpdateManyWithWhereWithoutDoctorInput[]
    deleteMany?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumApptStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApptStatus | EnumApptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApptStatusFilter<$PrismaModel> | $Enums.ApptStatus
  }

  export type NestedEnumBookingSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingSource | EnumBookingSourceFieldRefInput<$PrismaModel>
    in?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingSourceFilter<$PrismaModel> | $Enums.BookingSource
  }

  export type NestedEnumApptStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApptStatus | EnumApptStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApptStatus[] | ListEnumApptStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApptStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApptStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApptStatusFilter<$PrismaModel>
    _max?: NestedEnumApptStatusFilter<$PrismaModel>
  }

  export type NestedEnumBookingSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingSource | EnumBookingSourceFieldRefInput<$PrismaModel>
    in?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingSource[] | ListEnumBookingSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingSourceWithAggregatesFilter<$PrismaModel> | $Enums.BookingSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingSourceFilter<$PrismaModel>
    _max?: NestedEnumBookingSourceFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumClinicalStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ClinicalStatus | EnumClinicalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClinicalStatusFilter<$PrismaModel> | $Enums.ClinicalStatus
  }

  export type NestedEnumFinancialStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancialStatus | EnumFinancialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancialStatusFilter<$PrismaModel> | $Enums.FinancialStatus
  }

  export type NestedEnumTreatmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentStatus | EnumTreatmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentStatusFilter<$PrismaModel> | $Enums.TreatmentStatus
  }

  export type NestedEnumClinicalStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClinicalStatus | EnumClinicalStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClinicalStatus[] | ListEnumClinicalStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumClinicalStatusWithAggregatesFilter<$PrismaModel> | $Enums.ClinicalStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClinicalStatusFilter<$PrismaModel>
    _max?: NestedEnumClinicalStatusFilter<$PrismaModel>
  }

  export type NestedEnumFinancialStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancialStatus | EnumFinancialStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancialStatus[] | ListEnumFinancialStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancialStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinancialStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinancialStatusFilter<$PrismaModel>
    _max?: NestedEnumFinancialStatusFilter<$PrismaModel>
  }

  export type NestedEnumTreatmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TreatmentStatus | EnumTreatmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreatmentStatus[] | ListEnumTreatmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreatmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.TreatmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTreatmentStatusFilter<$PrismaModel>
    _max?: NestedEnumTreatmentStatusFilter<$PrismaModel>
  }

  export type NestedEnumPaymentMethodFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodFilter<$PrismaModel> | $Enums.PaymentMethod
  }

  export type NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PaymentMethod | EnumPaymentMethodFieldRefInput<$PrismaModel>
    in?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    notIn?: $Enums.PaymentMethod[] | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
    not?: NestedEnumPaymentMethodWithAggregatesFilter<$PrismaModel> | $Enums.PaymentMethod
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPaymentMethodFilter<$PrismaModel>
    _max?: NestedEnumPaymentMethodFilter<$PrismaModel>
  }

  export type AppointmentCreateWithoutPatientInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    treatment: TreatmentCreateNestedOneWithoutAppointmentsInput
    doctor?: DoctorCreateNestedOneWithoutAppointmentsInput
    clinicalNotes?: ClinicalNoteCreateNestedManyWithoutAppointmentInput
    patientTreatment?: PatientTreatmentCreateNestedOneWithoutAppointmentsInput
    payments?: PaymentCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutPatientInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    clinicalNotes?: ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentCreateManyPatientInputEnvelope = {
    data: AppointmentCreateManyPatientInput | AppointmentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PatientTreatmentCreateWithoutPatientInput = {
    id?: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    treatment: TreatmentCreateNestedOneWithoutPatientTreatmentsInput
    appointments?: AppointmentCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUncheckedCreateWithoutPatientInput = {
    id?: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentCreateOrConnectWithoutPatientInput = {
    where: PatientTreatmentWhereUniqueInput
    create: XOR<PatientTreatmentCreateWithoutPatientInput, PatientTreatmentUncheckedCreateWithoutPatientInput>
  }

  export type PatientTreatmentCreateManyPatientInputEnvelope = {
    data: PatientTreatmentCreateManyPatientInput | PatientTreatmentCreateManyPatientInput[]
    skipDuplicates?: boolean
  }

  export type PlanChangeLogCreateWithoutChangedByUserInput = {
    id?: string
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
    patientTreatment: PatientTreatmentCreateNestedOneWithoutChangeLogsInput
  }

  export type PlanChangeLogUncheckedCreateWithoutChangedByUserInput = {
    id?: string
    patientTreatmentId: string
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
  }

  export type PlanChangeLogCreateOrConnectWithoutChangedByUserInput = {
    where: PlanChangeLogWhereUniqueInput
    create: XOR<PlanChangeLogCreateWithoutChangedByUserInput, PlanChangeLogUncheckedCreateWithoutChangedByUserInput>
  }

  export type PlanChangeLogCreateManyChangedByUserInputEnvelope = {
    data: PlanChangeLogCreateManyChangedByUserInput | PlanChangeLogCreateManyChangedByUserInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
    create: XOR<AppointmentCreateWithoutPatientInput, AppointmentUncheckedCreateWithoutPatientInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPatientInput, AppointmentUncheckedUpdateWithoutPatientInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPatientInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPatientInput>
  }

  export type AppointmentScalarWhereInput = {
    AND?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    OR?: AppointmentScalarWhereInput[]
    NOT?: AppointmentScalarWhereInput | AppointmentScalarWhereInput[]
    id?: StringFilter<"Appointment"> | string
    startTime?: DateTimeFilter<"Appointment"> | Date | string
    endTime?: DateTimeFilter<"Appointment"> | Date | string
    status?: EnumApptStatusFilter<"Appointment"> | $Enums.ApptStatus
    notes?: StringNullableFilter<"Appointment"> | string | null
    patientId?: StringFilter<"Appointment"> | string
    treatmentId?: StringFilter<"Appointment"> | string
    doctorId?: StringNullableFilter<"Appointment"> | string | null
    googleEventId?: StringNullableFilter<"Appointment"> | string | null
    bookedBy?: EnumBookingSourceFilter<"Appointment"> | $Enums.BookingSource
    amountPaid?: IntNullableFilter<"Appointment"> | number | null
    price?: IntFilter<"Appointment"> | number
    discount?: IntFilter<"Appointment"> | number
    createdAt?: DateTimeFilter<"Appointment"> | Date | string
    checkoutTime?: DateTimeNullableFilter<"Appointment"> | Date | string | null
    guestName?: StringNullableFilter<"Appointment"> | string | null
    guestPhone?: StringNullableFilter<"Appointment"> | string | null
    guestEmail?: StringNullableFilter<"Appointment"> | string | null
    guestDob?: DateTimeNullableFilter<"Appointment"> | Date | string | null
    patientTreatmentId?: StringNullableFilter<"Appointment"> | string | null
    sessionNumber?: IntNullableFilter<"Appointment"> | number | null
    sessionLabel?: StringNullableFilter<"Appointment"> | string | null
    plannedFee?: IntNullableFilter<"Appointment"> | number | null
  }

  export type PatientTreatmentUpsertWithWhereUniqueWithoutPatientInput = {
    where: PatientTreatmentWhereUniqueInput
    update: XOR<PatientTreatmentUpdateWithoutPatientInput, PatientTreatmentUncheckedUpdateWithoutPatientInput>
    create: XOR<PatientTreatmentCreateWithoutPatientInput, PatientTreatmentUncheckedCreateWithoutPatientInput>
  }

  export type PatientTreatmentUpdateWithWhereUniqueWithoutPatientInput = {
    where: PatientTreatmentWhereUniqueInput
    data: XOR<PatientTreatmentUpdateWithoutPatientInput, PatientTreatmentUncheckedUpdateWithoutPatientInput>
  }

  export type PatientTreatmentUpdateManyWithWhereWithoutPatientInput = {
    where: PatientTreatmentScalarWhereInput
    data: XOR<PatientTreatmentUpdateManyMutationInput, PatientTreatmentUncheckedUpdateManyWithoutPatientInput>
  }

  export type PatientTreatmentScalarWhereInput = {
    AND?: PatientTreatmentScalarWhereInput | PatientTreatmentScalarWhereInput[]
    OR?: PatientTreatmentScalarWhereInput[]
    NOT?: PatientTreatmentScalarWhereInput | PatientTreatmentScalarWhereInput[]
    id?: StringFilter<"PatientTreatment"> | string
    patientId?: StringFilter<"PatientTreatment"> | string
    treatmentId?: StringFilter<"PatientTreatment"> | string
    totalCost?: IntFilter<"PatientTreatment"> | number
    totalSessions?: IntFilter<"PatientTreatment"> | number
    clinicalStatus?: EnumClinicalStatusFilter<"PatientTreatment"> | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFilter<"PatientTreatment"> | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFilter<"PatientTreatment"> | $Enums.TreatmentStatus
    startDate?: DateTimeFilter<"PatientTreatment"> | Date | string
    updatedAt?: DateTimeFilter<"PatientTreatment"> | Date | string
  }

  export type PlanChangeLogUpsertWithWhereUniqueWithoutChangedByUserInput = {
    where: PlanChangeLogWhereUniqueInput
    update: XOR<PlanChangeLogUpdateWithoutChangedByUserInput, PlanChangeLogUncheckedUpdateWithoutChangedByUserInput>
    create: XOR<PlanChangeLogCreateWithoutChangedByUserInput, PlanChangeLogUncheckedCreateWithoutChangedByUserInput>
  }

  export type PlanChangeLogUpdateWithWhereUniqueWithoutChangedByUserInput = {
    where: PlanChangeLogWhereUniqueInput
    data: XOR<PlanChangeLogUpdateWithoutChangedByUserInput, PlanChangeLogUncheckedUpdateWithoutChangedByUserInput>
  }

  export type PlanChangeLogUpdateManyWithWhereWithoutChangedByUserInput = {
    where: PlanChangeLogScalarWhereInput
    data: XOR<PlanChangeLogUpdateManyMutationInput, PlanChangeLogUncheckedUpdateManyWithoutChangedByUserInput>
  }

  export type PlanChangeLogScalarWhereInput = {
    AND?: PlanChangeLogScalarWhereInput | PlanChangeLogScalarWhereInput[]
    OR?: PlanChangeLogScalarWhereInput[]
    NOT?: PlanChangeLogScalarWhereInput | PlanChangeLogScalarWhereInput[]
    id?: StringFilter<"PlanChangeLog"> | string
    patientTreatmentId?: StringFilter<"PlanChangeLog"> | string
    changedByUserId?: StringNullableFilter<"PlanChangeLog"> | string | null
    field?: StringFilter<"PlanChangeLog"> | string
    oldValue?: StringFilter<"PlanChangeLog"> | string
    newValue?: StringFilter<"PlanChangeLog"> | string
    createdAt?: DateTimeFilter<"PlanChangeLog"> | Date | string
  }

  export type UserCreateWithoutAppointmentsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    patientTreatments?: PatientTreatmentCreateNestedManyWithoutPatientInput
    planChangeLogs?: PlanChangeLogCreateNestedManyWithoutChangedByUserInput
  }

  export type UserUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    patientTreatments?: PatientTreatmentUncheckedCreateNestedManyWithoutPatientInput
    planChangeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutChangedByUserInput
  }

  export type UserCreateOrConnectWithoutAppointmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
  }

  export type TreatmentCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
    patientTreatments?: PatientTreatmentCreateNestedManyWithoutTreatmentInput
  }

  export type TreatmentUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
    patientTreatments?: PatientTreatmentUncheckedCreateNestedManyWithoutTreatmentInput
  }

  export type TreatmentCreateOrConnectWithoutAppointmentsInput = {
    where: TreatmentWhereUniqueInput
    create: XOR<TreatmentCreateWithoutAppointmentsInput, TreatmentUncheckedCreateWithoutAppointmentsInput>
  }

  export type DoctorCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    role: string
    pmdcReg: string
    qualifications: string
    experience: string
    specialty: string
    operatory: string
    schedule: string
    consultationFee?: number
    patientsThisMonth?: number
    image?: string | null
    isLead?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DoctorUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    name: string
    role: string
    pmdcReg: string
    qualifications: string
    experience: string
    specialty: string
    operatory: string
    schedule: string
    consultationFee?: number
    patientsThisMonth?: number
    image?: string | null
    isLead?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DoctorCreateOrConnectWithoutAppointmentsInput = {
    where: DoctorWhereUniqueInput
    create: XOR<DoctorCreateWithoutAppointmentsInput, DoctorUncheckedCreateWithoutAppointmentsInput>
  }

  export type ClinicalNoteCreateWithoutAppointmentInput = {
    id?: string
    diagnosis?: string | null
    treatmentDone: string
    prescription?: string | null
    remarks?: string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalNoteUncheckedCreateWithoutAppointmentInput = {
    id?: string
    diagnosis?: string | null
    treatmentDone: string
    prescription?: string | null
    remarks?: string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClinicalNoteCreateOrConnectWithoutAppointmentInput = {
    where: ClinicalNoteWhereUniqueInput
    create: XOR<ClinicalNoteCreateWithoutAppointmentInput, ClinicalNoteUncheckedCreateWithoutAppointmentInput>
  }

  export type ClinicalNoteCreateManyAppointmentInputEnvelope = {
    data: ClinicalNoteCreateManyAppointmentInput | ClinicalNoteCreateManyAppointmentInput[]
    skipDuplicates?: boolean
  }

  export type PatientTreatmentCreateWithoutAppointmentsInput = {
    id?: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    patient: UserCreateNestedOneWithoutPatientTreatmentsInput
    treatment: TreatmentCreateNestedOneWithoutPatientTreatmentsInput
    payments?: PaymentCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUncheckedCreateWithoutAppointmentsInput = {
    id?: string
    patientId: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    payments?: PaymentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentCreateOrConnectWithoutAppointmentsInput = {
    where: PatientTreatmentWhereUniqueInput
    create: XOR<PatientTreatmentCreateWithoutAppointmentsInput, PatientTreatmentUncheckedCreateWithoutAppointmentsInput>
  }

  export type PaymentCreateWithoutAppointmentInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    patientTreatment: PatientTreatmentCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutAppointmentInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    patientTreatmentId: string
  }

  export type PaymentCreateOrConnectWithoutAppointmentInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
  }

  export type PaymentCreateManyAppointmentInputEnvelope = {
    data: PaymentCreateManyAppointmentInput | PaymentCreateManyAppointmentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAppointmentsInput = {
    update: XOR<UserUpdateWithoutAppointmentsInput, UserUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<UserCreateWithoutAppointmentsInput, UserUncheckedCreateWithoutAppointmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAppointmentsInput, UserUncheckedUpdateWithoutAppointmentsInput>
  }

  export type UserUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatments?: PatientTreatmentUpdateManyWithoutPatientNestedInput
    planChangeLogs?: PlanChangeLogUpdateManyWithoutChangedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatments?: PatientTreatmentUncheckedUpdateManyWithoutPatientNestedInput
    planChangeLogs?: PlanChangeLogUncheckedUpdateManyWithoutChangedByUserNestedInput
  }

  export type TreatmentUpsertWithoutAppointmentsInput = {
    update: XOR<TreatmentUpdateWithoutAppointmentsInput, TreatmentUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<TreatmentCreateWithoutAppointmentsInput, TreatmentUncheckedCreateWithoutAppointmentsInput>
    where?: TreatmentWhereInput
  }

  export type TreatmentUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: TreatmentWhereInput
    data: XOR<TreatmentUpdateWithoutAppointmentsInput, TreatmentUncheckedUpdateWithoutAppointmentsInput>
  }

  export type TreatmentUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
    patientTreatments?: PatientTreatmentUpdateManyWithoutTreatmentNestedInput
  }

  export type TreatmentUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
    patientTreatments?: PatientTreatmentUncheckedUpdateManyWithoutTreatmentNestedInput
  }

  export type DoctorUpsertWithoutAppointmentsInput = {
    update: XOR<DoctorUpdateWithoutAppointmentsInput, DoctorUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<DoctorCreateWithoutAppointmentsInput, DoctorUncheckedCreateWithoutAppointmentsInput>
    where?: DoctorWhereInput
  }

  export type DoctorUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: DoctorWhereInput
    data: XOR<DoctorUpdateWithoutAppointmentsInput, DoctorUncheckedUpdateWithoutAppointmentsInput>
  }

  export type DoctorUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    pmdcReg?: StringFieldUpdateOperationsInput | string
    qualifications?: StringFieldUpdateOperationsInput | string
    experience?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    operatory?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    consultationFee?: IntFieldUpdateOperationsInput | number
    patientsThisMonth?: IntFieldUpdateOperationsInput | number
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DoctorUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    pmdcReg?: StringFieldUpdateOperationsInput | string
    qualifications?: StringFieldUpdateOperationsInput | string
    experience?: StringFieldUpdateOperationsInput | string
    specialty?: StringFieldUpdateOperationsInput | string
    operatory?: StringFieldUpdateOperationsInput | string
    schedule?: StringFieldUpdateOperationsInput | string
    consultationFee?: IntFieldUpdateOperationsInput | number
    patientsThisMonth?: IntFieldUpdateOperationsInput | number
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isLead?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalNoteUpsertWithWhereUniqueWithoutAppointmentInput = {
    where: ClinicalNoteWhereUniqueInput
    update: XOR<ClinicalNoteUpdateWithoutAppointmentInput, ClinicalNoteUncheckedUpdateWithoutAppointmentInput>
    create: XOR<ClinicalNoteCreateWithoutAppointmentInput, ClinicalNoteUncheckedCreateWithoutAppointmentInput>
  }

  export type ClinicalNoteUpdateWithWhereUniqueWithoutAppointmentInput = {
    where: ClinicalNoteWhereUniqueInput
    data: XOR<ClinicalNoteUpdateWithoutAppointmentInput, ClinicalNoteUncheckedUpdateWithoutAppointmentInput>
  }

  export type ClinicalNoteUpdateManyWithWhereWithoutAppointmentInput = {
    where: ClinicalNoteScalarWhereInput
    data: XOR<ClinicalNoteUpdateManyMutationInput, ClinicalNoteUncheckedUpdateManyWithoutAppointmentInput>
  }

  export type ClinicalNoteScalarWhereInput = {
    AND?: ClinicalNoteScalarWhereInput | ClinicalNoteScalarWhereInput[]
    OR?: ClinicalNoteScalarWhereInput[]
    NOT?: ClinicalNoteScalarWhereInput | ClinicalNoteScalarWhereInput[]
    id?: StringFilter<"ClinicalNote"> | string
    appointmentId?: StringFilter<"ClinicalNote"> | string
    diagnosis?: StringNullableFilter<"ClinicalNote"> | string | null
    treatmentDone?: StringFilter<"ClinicalNote"> | string
    prescription?: StringNullableFilter<"ClinicalNote"> | string | null
    remarks?: StringNullableFilter<"ClinicalNote"> | string | null
    odontogramData?: JsonNullableFilter<"ClinicalNote">
    createdAt?: DateTimeFilter<"ClinicalNote"> | Date | string
    updatedAt?: DateTimeFilter<"ClinicalNote"> | Date | string
  }

  export type PatientTreatmentUpsertWithoutAppointmentsInput = {
    update: XOR<PatientTreatmentUpdateWithoutAppointmentsInput, PatientTreatmentUncheckedUpdateWithoutAppointmentsInput>
    create: XOR<PatientTreatmentCreateWithoutAppointmentsInput, PatientTreatmentUncheckedCreateWithoutAppointmentsInput>
    where?: PatientTreatmentWhereInput
  }

  export type PatientTreatmentUpdateToOneWithWhereWithoutAppointmentsInput = {
    where?: PatientTreatmentWhereInput
    data: XOR<PatientTreatmentUpdateWithoutAppointmentsInput, PatientTreatmentUncheckedUpdateWithoutAppointmentsInput>
  }

  export type PatientTreatmentUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: UserUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    payments?: PaymentUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateWithoutAppointmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PaymentUpsertWithWhereUniqueWithoutAppointmentInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutAppointmentInput, PaymentUncheckedUpdateWithoutAppointmentInput>
    create: XOR<PaymentCreateWithoutAppointmentInput, PaymentUncheckedCreateWithoutAppointmentInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutAppointmentInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutAppointmentInput, PaymentUncheckedUpdateWithoutAppointmentInput>
  }

  export type PaymentUpdateManyWithWhereWithoutAppointmentInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutAppointmentInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: StringFilter<"Payment"> | string
    amount?: IntFilter<"Payment"> | number
    method?: EnumPaymentMethodFilter<"Payment"> | $Enums.PaymentMethod
    date?: DateTimeFilter<"Payment"> | Date | string
    notes?: StringNullableFilter<"Payment"> | string | null
    patientTreatmentId?: StringFilter<"Payment"> | string
    appointmentId?: StringNullableFilter<"Payment"> | string | null
  }

  export type AppointmentCreateWithoutClinicalNotesInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    patient: UserCreateNestedOneWithoutAppointmentsInput
    treatment: TreatmentCreateNestedOneWithoutAppointmentsInput
    doctor?: DoctorCreateNestedOneWithoutAppointmentsInput
    patientTreatment?: PatientTreatmentCreateNestedOneWithoutAppointmentsInput
    payments?: PaymentCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutClinicalNotesInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    payments?: PaymentUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutClinicalNotesInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutClinicalNotesInput, AppointmentUncheckedCreateWithoutClinicalNotesInput>
  }

  export type AppointmentUpsertWithoutClinicalNotesInput = {
    update: XOR<AppointmentUpdateWithoutClinicalNotesInput, AppointmentUncheckedUpdateWithoutClinicalNotesInput>
    create: XOR<AppointmentCreateWithoutClinicalNotesInput, AppointmentUncheckedCreateWithoutClinicalNotesInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutClinicalNotesInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutClinicalNotesInput, AppointmentUncheckedUpdateWithoutClinicalNotesInput>
  }

  export type AppointmentUpdateWithoutClinicalNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    patient?: UserUpdateOneRequiredWithoutAppointmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput
    doctor?: DoctorUpdateOneWithoutAppointmentsNestedInput
    patientTreatment?: PatientTreatmentUpdateOneWithoutAppointmentsNestedInput
    payments?: PaymentUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutClinicalNotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    payments?: PaymentUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentCreateWithoutTreatmentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    patient: UserCreateNestedOneWithoutAppointmentsInput
    doctor?: DoctorCreateNestedOneWithoutAppointmentsInput
    clinicalNotes?: ClinicalNoteCreateNestedManyWithoutAppointmentInput
    patientTreatment?: PatientTreatmentCreateNestedOneWithoutAppointmentsInput
    payments?: PaymentCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutTreatmentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    clinicalNotes?: ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutTreatmentInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutTreatmentInput, AppointmentUncheckedCreateWithoutTreatmentInput>
  }

  export type AppointmentCreateManyTreatmentInputEnvelope = {
    data: AppointmentCreateManyTreatmentInput | AppointmentCreateManyTreatmentInput[]
    skipDuplicates?: boolean
  }

  export type PatientTreatmentCreateWithoutTreatmentInput = {
    id?: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    patient: UserCreateNestedOneWithoutPatientTreatmentsInput
    appointments?: AppointmentCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUncheckedCreateWithoutTreatmentInput = {
    id?: string
    patientId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentCreateOrConnectWithoutTreatmentInput = {
    where: PatientTreatmentWhereUniqueInput
    create: XOR<PatientTreatmentCreateWithoutTreatmentInput, PatientTreatmentUncheckedCreateWithoutTreatmentInput>
  }

  export type PatientTreatmentCreateManyTreatmentInputEnvelope = {
    data: PatientTreatmentCreateManyTreatmentInput | PatientTreatmentCreateManyTreatmentInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutTreatmentInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutTreatmentInput, AppointmentUncheckedUpdateWithoutTreatmentInput>
    create: XOR<AppointmentCreateWithoutTreatmentInput, AppointmentUncheckedCreateWithoutTreatmentInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutTreatmentInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutTreatmentInput, AppointmentUncheckedUpdateWithoutTreatmentInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutTreatmentInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutTreatmentInput>
  }

  export type PatientTreatmentUpsertWithWhereUniqueWithoutTreatmentInput = {
    where: PatientTreatmentWhereUniqueInput
    update: XOR<PatientTreatmentUpdateWithoutTreatmentInput, PatientTreatmentUncheckedUpdateWithoutTreatmentInput>
    create: XOR<PatientTreatmentCreateWithoutTreatmentInput, PatientTreatmentUncheckedCreateWithoutTreatmentInput>
  }

  export type PatientTreatmentUpdateWithWhereUniqueWithoutTreatmentInput = {
    where: PatientTreatmentWhereUniqueInput
    data: XOR<PatientTreatmentUpdateWithoutTreatmentInput, PatientTreatmentUncheckedUpdateWithoutTreatmentInput>
  }

  export type PatientTreatmentUpdateManyWithWhereWithoutTreatmentInput = {
    where: PatientTreatmentScalarWhereInput
    data: XOR<PatientTreatmentUpdateManyMutationInput, PatientTreatmentUncheckedUpdateManyWithoutTreatmentInput>
  }

  export type UserCreateWithoutPatientTreatmentsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    planChangeLogs?: PlanChangeLogCreateNestedManyWithoutChangedByUserInput
  }

  export type UserUncheckedCreateWithoutPatientTreatmentsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    planChangeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutChangedByUserInput
  }

  export type UserCreateOrConnectWithoutPatientTreatmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPatientTreatmentsInput, UserUncheckedCreateWithoutPatientTreatmentsInput>
  }

  export type TreatmentCreateWithoutPatientTreatmentsInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
    appointments?: AppointmentCreateNestedManyWithoutTreatmentInput
  }

  export type TreatmentUncheckedCreateWithoutPatientTreatmentsInput = {
    id?: string
    name: string
    durationMin: number
    price: number
    discountedPrice?: number | null
    description?: string | null
    instructions?: string | null
    isActive?: boolean
    imageUrl?: string | null
    category?: string
    isMultiSession?: boolean
    defaultSessions?: number
    appointments?: AppointmentUncheckedCreateNestedManyWithoutTreatmentInput
  }

  export type TreatmentCreateOrConnectWithoutPatientTreatmentsInput = {
    where: TreatmentWhereUniqueInput
    create: XOR<TreatmentCreateWithoutPatientTreatmentsInput, TreatmentUncheckedCreateWithoutPatientTreatmentsInput>
  }

  export type AppointmentCreateWithoutPatientTreatmentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    patient: UserCreateNestedOneWithoutAppointmentsInput
    treatment: TreatmentCreateNestedOneWithoutAppointmentsInput
    doctor?: DoctorCreateNestedOneWithoutAppointmentsInput
    clinicalNotes?: ClinicalNoteCreateNestedManyWithoutAppointmentInput
    payments?: PaymentCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutPatientTreatmentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    clinicalNotes?: ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutPatientTreatmentInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPatientTreatmentInput, AppointmentUncheckedCreateWithoutPatientTreatmentInput>
  }

  export type AppointmentCreateManyPatientTreatmentInputEnvelope = {
    data: AppointmentCreateManyPatientTreatmentInput | AppointmentCreateManyPatientTreatmentInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutPatientTreatmentInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    appointment?: AppointmentCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentUncheckedCreateWithoutPatientTreatmentInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    appointmentId?: string | null
  }

  export type PaymentCreateOrConnectWithoutPatientTreatmentInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutPatientTreatmentInput, PaymentUncheckedCreateWithoutPatientTreatmentInput>
  }

  export type PaymentCreateManyPatientTreatmentInputEnvelope = {
    data: PaymentCreateManyPatientTreatmentInput | PaymentCreateManyPatientTreatmentInput[]
    skipDuplicates?: boolean
  }

  export type PlanChangeLogCreateWithoutPatientTreatmentInput = {
    id?: string
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
    changedByUser?: UserCreateNestedOneWithoutPlanChangeLogsInput
  }

  export type PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput = {
    id?: string
    changedByUserId?: string | null
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
  }

  export type PlanChangeLogCreateOrConnectWithoutPatientTreatmentInput = {
    where: PlanChangeLogWhereUniqueInput
    create: XOR<PlanChangeLogCreateWithoutPatientTreatmentInput, PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput>
  }

  export type PlanChangeLogCreateManyPatientTreatmentInputEnvelope = {
    data: PlanChangeLogCreateManyPatientTreatmentInput | PlanChangeLogCreateManyPatientTreatmentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPatientTreatmentsInput = {
    update: XOR<UserUpdateWithoutPatientTreatmentsInput, UserUncheckedUpdateWithoutPatientTreatmentsInput>
    create: XOR<UserCreateWithoutPatientTreatmentsInput, UserUncheckedCreateWithoutPatientTreatmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPatientTreatmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPatientTreatmentsInput, UserUncheckedUpdateWithoutPatientTreatmentsInput>
  }

  export type UserUpdateWithoutPatientTreatmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    planChangeLogs?: PlanChangeLogUpdateManyWithoutChangedByUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPatientTreatmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    planChangeLogs?: PlanChangeLogUncheckedUpdateManyWithoutChangedByUserNestedInput
  }

  export type TreatmentUpsertWithoutPatientTreatmentsInput = {
    update: XOR<TreatmentUpdateWithoutPatientTreatmentsInput, TreatmentUncheckedUpdateWithoutPatientTreatmentsInput>
    create: XOR<TreatmentCreateWithoutPatientTreatmentsInput, TreatmentUncheckedCreateWithoutPatientTreatmentsInput>
    where?: TreatmentWhereInput
  }

  export type TreatmentUpdateToOneWithWhereWithoutPatientTreatmentsInput = {
    where?: TreatmentWhereInput
    data: XOR<TreatmentUpdateWithoutPatientTreatmentsInput, TreatmentUncheckedUpdateWithoutPatientTreatmentsInput>
  }

  export type TreatmentUpdateWithoutPatientTreatmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
    appointments?: AppointmentUpdateManyWithoutTreatmentNestedInput
  }

  export type TreatmentUncheckedUpdateWithoutPatientTreatmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    durationMin?: IntFieldUpdateOperationsInput | number
    price?: IntFieldUpdateOperationsInput | number
    discountedPrice?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    isMultiSession?: BoolFieldUpdateOperationsInput | boolean
    defaultSessions?: IntFieldUpdateOperationsInput | number
    appointments?: AppointmentUncheckedUpdateManyWithoutTreatmentNestedInput
  }

  export type AppointmentUpsertWithWhereUniqueWithoutPatientTreatmentInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutPatientTreatmentInput, AppointmentUncheckedUpdateWithoutPatientTreatmentInput>
    create: XOR<AppointmentCreateWithoutPatientTreatmentInput, AppointmentUncheckedCreateWithoutPatientTreatmentInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutPatientTreatmentInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutPatientTreatmentInput, AppointmentUncheckedUpdateWithoutPatientTreatmentInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutPatientTreatmentInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutPatientTreatmentInput>
  }

  export type PaymentUpsertWithWhereUniqueWithoutPatientTreatmentInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutPatientTreatmentInput, PaymentUncheckedUpdateWithoutPatientTreatmentInput>
    create: XOR<PaymentCreateWithoutPatientTreatmentInput, PaymentUncheckedCreateWithoutPatientTreatmentInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutPatientTreatmentInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutPatientTreatmentInput, PaymentUncheckedUpdateWithoutPatientTreatmentInput>
  }

  export type PaymentUpdateManyWithWhereWithoutPatientTreatmentInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutPatientTreatmentInput>
  }

  export type PlanChangeLogUpsertWithWhereUniqueWithoutPatientTreatmentInput = {
    where: PlanChangeLogWhereUniqueInput
    update: XOR<PlanChangeLogUpdateWithoutPatientTreatmentInput, PlanChangeLogUncheckedUpdateWithoutPatientTreatmentInput>
    create: XOR<PlanChangeLogCreateWithoutPatientTreatmentInput, PlanChangeLogUncheckedCreateWithoutPatientTreatmentInput>
  }

  export type PlanChangeLogUpdateWithWhereUniqueWithoutPatientTreatmentInput = {
    where: PlanChangeLogWhereUniqueInput
    data: XOR<PlanChangeLogUpdateWithoutPatientTreatmentInput, PlanChangeLogUncheckedUpdateWithoutPatientTreatmentInput>
  }

  export type PlanChangeLogUpdateManyWithWhereWithoutPatientTreatmentInput = {
    where: PlanChangeLogScalarWhereInput
    data: XOR<PlanChangeLogUpdateManyMutationInput, PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentInput>
  }

  export type PatientTreatmentCreateWithoutChangeLogsInput = {
    id?: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    patient: UserCreateNestedOneWithoutPatientTreatmentsInput
    treatment: TreatmentCreateNestedOneWithoutPatientTreatmentsInput
    appointments?: AppointmentCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUncheckedCreateWithoutChangeLogsInput = {
    id?: string
    patientId: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentCreateOrConnectWithoutChangeLogsInput = {
    where: PatientTreatmentWhereUniqueInput
    create: XOR<PatientTreatmentCreateWithoutChangeLogsInput, PatientTreatmentUncheckedCreateWithoutChangeLogsInput>
  }

  export type UserCreateWithoutPlanChangeLogsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    appointments?: AppointmentCreateNestedManyWithoutPatientInput
    patientTreatments?: PatientTreatmentCreateNestedManyWithoutPatientInput
  }

  export type UserUncheckedCreateWithoutPlanChangeLogsInput = {
    id?: string
    email?: string | null
    phone?: string | null
    password?: string | null
    name: string
    role?: $Enums.Role
    patientCode?: number | null
    noShowCount?: number
    createdAt?: Date | string
    dateOfBirth?: Date | string | null
    gender?: string | null
    address?: string | null
    medicalAlerts?: string | null
    googleCalendarToken?: string | null
    googleCalendarRefreshToken?: string | null
    googleCalendarConnected?: boolean
    resetToken?: string | null
    resetTokenExpiry?: Date | string | null
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientInput
    patientTreatments?: PatientTreatmentUncheckedCreateNestedManyWithoutPatientInput
  }

  export type UserCreateOrConnectWithoutPlanChangeLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlanChangeLogsInput, UserUncheckedCreateWithoutPlanChangeLogsInput>
  }

  export type PatientTreatmentUpsertWithoutChangeLogsInput = {
    update: XOR<PatientTreatmentUpdateWithoutChangeLogsInput, PatientTreatmentUncheckedUpdateWithoutChangeLogsInput>
    create: XOR<PatientTreatmentCreateWithoutChangeLogsInput, PatientTreatmentUncheckedCreateWithoutChangeLogsInput>
    where?: PatientTreatmentWhereInput
  }

  export type PatientTreatmentUpdateToOneWithWhereWithoutChangeLogsInput = {
    where?: PatientTreatmentWhereInput
    data: XOR<PatientTreatmentUpdateWithoutChangeLogsInput, PatientTreatmentUncheckedUpdateWithoutChangeLogsInput>
  }

  export type PatientTreatmentUpdateWithoutChangeLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: UserUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateWithoutChangeLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type UserUpsertWithoutPlanChangeLogsInput = {
    update: XOR<UserUpdateWithoutPlanChangeLogsInput, UserUncheckedUpdateWithoutPlanChangeLogsInput>
    create: XOR<UserCreateWithoutPlanChangeLogsInput, UserUncheckedCreateWithoutPlanChangeLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlanChangeLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlanChangeLogsInput, UserUncheckedUpdateWithoutPlanChangeLogsInput>
  }

  export type UserUpdateWithoutPlanChangeLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: AppointmentUpdateManyWithoutPatientNestedInput
    patientTreatments?: PatientTreatmentUpdateManyWithoutPatientNestedInput
  }

  export type UserUncheckedUpdateWithoutPlanChangeLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    patientCode?: NullableIntFieldUpdateOperationsInput | number | null
    noShowCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dateOfBirth?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    medicalAlerts?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarRefreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    googleCalendarConnected?: BoolFieldUpdateOperationsInput | boolean
    resetToken?: NullableStringFieldUpdateOperationsInput | string | null
    resetTokenExpiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientNestedInput
    patientTreatments?: PatientTreatmentUncheckedUpdateManyWithoutPatientNestedInput
  }

  export type PatientTreatmentCreateWithoutPaymentsInput = {
    id?: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    patient: UserCreateNestedOneWithoutPatientTreatmentsInput
    treatment: TreatmentCreateNestedOneWithoutPatientTreatmentsInput
    appointments?: AppointmentCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentUncheckedCreateWithoutPaymentsInput = {
    id?: string
    patientId: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
    appointments?: AppointmentUncheckedCreateNestedManyWithoutPatientTreatmentInput
    changeLogs?: PlanChangeLogUncheckedCreateNestedManyWithoutPatientTreatmentInput
  }

  export type PatientTreatmentCreateOrConnectWithoutPaymentsInput = {
    where: PatientTreatmentWhereUniqueInput
    create: XOR<PatientTreatmentCreateWithoutPaymentsInput, PatientTreatmentUncheckedCreateWithoutPaymentsInput>
  }

  export type AppointmentCreateWithoutPaymentsInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    patient: UserCreateNestedOneWithoutAppointmentsInput
    treatment: TreatmentCreateNestedOneWithoutAppointmentsInput
    doctor?: DoctorCreateNestedOneWithoutAppointmentsInput
    clinicalNotes?: ClinicalNoteCreateNestedManyWithoutAppointmentInput
    patientTreatment?: PatientTreatmentCreateNestedOneWithoutAppointmentsInput
  }

  export type AppointmentUncheckedCreateWithoutPaymentsInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    clinicalNotes?: ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutPaymentsInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutPaymentsInput, AppointmentUncheckedCreateWithoutPaymentsInput>
  }

  export type PatientTreatmentUpsertWithoutPaymentsInput = {
    update: XOR<PatientTreatmentUpdateWithoutPaymentsInput, PatientTreatmentUncheckedUpdateWithoutPaymentsInput>
    create: XOR<PatientTreatmentCreateWithoutPaymentsInput, PatientTreatmentUncheckedCreateWithoutPaymentsInput>
    where?: PatientTreatmentWhereInput
  }

  export type PatientTreatmentUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: PatientTreatmentWhereInput
    data: XOR<PatientTreatmentUpdateWithoutPaymentsInput, PatientTreatmentUncheckedUpdateWithoutPaymentsInput>
  }

  export type PatientTreatmentUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: UserUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type AppointmentUpsertWithoutPaymentsInput = {
    update: XOR<AppointmentUpdateWithoutPaymentsInput, AppointmentUncheckedUpdateWithoutPaymentsInput>
    create: XOR<AppointmentCreateWithoutPaymentsInput, AppointmentUncheckedCreateWithoutPaymentsInput>
    where?: AppointmentWhereInput
  }

  export type AppointmentUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: AppointmentWhereInput
    data: XOR<AppointmentUpdateWithoutPaymentsInput, AppointmentUncheckedUpdateWithoutPaymentsInput>
  }

  export type AppointmentUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    patient?: UserUpdateOneRequiredWithoutAppointmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput
    doctor?: DoctorUpdateOneWithoutAppointmentsNestedInput
    clinicalNotes?: ClinicalNoteUpdateManyWithoutAppointmentNestedInput
    patientTreatment?: PatientTreatmentUpdateOneWithoutAppointmentsNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    clinicalNotes?: ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentCreateWithoutDoctorInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    patient: UserCreateNestedOneWithoutAppointmentsInput
    treatment: TreatmentCreateNestedOneWithoutAppointmentsInput
    clinicalNotes?: ClinicalNoteCreateNestedManyWithoutAppointmentInput
    patientTreatment?: PatientTreatmentCreateNestedOneWithoutAppointmentsInput
    payments?: PaymentCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentUncheckedCreateWithoutDoctorInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
    clinicalNotes?: ClinicalNoteUncheckedCreateNestedManyWithoutAppointmentInput
    payments?: PaymentUncheckedCreateNestedManyWithoutAppointmentInput
  }

  export type AppointmentCreateOrConnectWithoutDoctorInput = {
    where: AppointmentWhereUniqueInput
    create: XOR<AppointmentCreateWithoutDoctorInput, AppointmentUncheckedCreateWithoutDoctorInput>
  }

  export type AppointmentCreateManyDoctorInputEnvelope = {
    data: AppointmentCreateManyDoctorInput | AppointmentCreateManyDoctorInput[]
    skipDuplicates?: boolean
  }

  export type AppointmentUpsertWithWhereUniqueWithoutDoctorInput = {
    where: AppointmentWhereUniqueInput
    update: XOR<AppointmentUpdateWithoutDoctorInput, AppointmentUncheckedUpdateWithoutDoctorInput>
    create: XOR<AppointmentCreateWithoutDoctorInput, AppointmentUncheckedCreateWithoutDoctorInput>
  }

  export type AppointmentUpdateWithWhereUniqueWithoutDoctorInput = {
    where: AppointmentWhereUniqueInput
    data: XOR<AppointmentUpdateWithoutDoctorInput, AppointmentUncheckedUpdateWithoutDoctorInput>
  }

  export type AppointmentUpdateManyWithWhereWithoutDoctorInput = {
    where: AppointmentScalarWhereInput
    data: XOR<AppointmentUpdateManyMutationInput, AppointmentUncheckedUpdateManyWithoutDoctorInput>
  }

  export type AppointmentCreateManyPatientInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
  }

  export type PatientTreatmentCreateManyPatientInput = {
    id?: string
    treatmentId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
  }

  export type PlanChangeLogCreateManyChangedByUserInput = {
    id?: string
    patientTreatmentId: string
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
  }

  export type AppointmentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    treatment?: TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput
    doctor?: DoctorUpdateOneWithoutAppointmentsNestedInput
    clinicalNotes?: ClinicalNoteUpdateManyWithoutAppointmentNestedInput
    patientTreatment?: PatientTreatmentUpdateOneWithoutAppointmentsNestedInput
    payments?: PaymentUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    clinicalNotes?: ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PatientTreatmentUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    treatment?: TreatmentUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateManyWithoutPatientInput = {
    id?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanChangeLogUpdateWithoutChangedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patientTreatment?: PatientTreatmentUpdateOneRequiredWithoutChangeLogsNestedInput
  }

  export type PlanChangeLogUncheckedUpdateWithoutChangedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanChangeLogUncheckedUpdateManyWithoutChangedByUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalNoteCreateManyAppointmentInput = {
    id?: string
    diagnosis?: string | null
    treatmentDone: string
    prescription?: string | null
    remarks?: string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateManyAppointmentInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    patientTreatmentId: string
  }

  export type ClinicalNoteUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalNoteUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClinicalNoteUncheckedUpdateManyWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    treatmentDone?: StringFieldUpdateOperationsInput | string
    prescription?: NullableStringFieldUpdateOperationsInput | string | null
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    odontogramData?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientTreatment?: PatientTreatmentUpdateOneRequiredWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentUncheckedUpdateManyWithoutAppointmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientTreatmentId?: StringFieldUpdateOperationsInput | string
  }

  export type AppointmentCreateManyTreatmentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
  }

  export type PatientTreatmentCreateManyTreatmentInput = {
    id?: string
    patientId: string
    totalCost: number
    totalSessions?: number
    clinicalStatus?: $Enums.ClinicalStatus
    financialStatus?: $Enums.FinancialStatus
    status?: $Enums.TreatmentStatus
    startDate?: Date | string
    updatedAt?: Date | string
  }

  export type AppointmentUpdateWithoutTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    patient?: UserUpdateOneRequiredWithoutAppointmentsNestedInput
    doctor?: DoctorUpdateOneWithoutAppointmentsNestedInput
    clinicalNotes?: ClinicalNoteUpdateManyWithoutAppointmentNestedInput
    patientTreatment?: PatientTreatmentUpdateOneWithoutAppointmentsNestedInput
    payments?: PaymentUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    clinicalNotes?: ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PatientTreatmentUpdateWithoutTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    patient?: UserUpdateOneRequiredWithoutPatientTreatmentsNestedInput
    appointments?: AppointmentUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateWithoutTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    appointments?: AppointmentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutPatientTreatmentNestedInput
    changeLogs?: PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentNestedInput
  }

  export type PatientTreatmentUncheckedUpdateManyWithoutTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    patientId?: StringFieldUpdateOperationsInput | string
    totalCost?: IntFieldUpdateOperationsInput | number
    totalSessions?: IntFieldUpdateOperationsInput | number
    clinicalStatus?: EnumClinicalStatusFieldUpdateOperationsInput | $Enums.ClinicalStatus
    financialStatus?: EnumFinancialStatusFieldUpdateOperationsInput | $Enums.FinancialStatus
    status?: EnumTreatmentStatusFieldUpdateOperationsInput | $Enums.TreatmentStatus
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyPatientTreatmentInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    doctorId?: string | null
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
  }

  export type PaymentCreateManyPatientTreatmentInput = {
    id?: string
    amount: number
    method?: $Enums.PaymentMethod
    date?: Date | string
    notes?: string | null
    appointmentId?: string | null
  }

  export type PlanChangeLogCreateManyPatientTreatmentInput = {
    id?: string
    changedByUserId?: string | null
    field: string
    oldValue: string
    newValue: string
    createdAt?: Date | string
  }

  export type AppointmentUpdateWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    patient?: UserUpdateOneRequiredWithoutAppointmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput
    doctor?: DoctorUpdateOneWithoutAppointmentsNestedInput
    clinicalNotes?: ClinicalNoteUpdateManyWithoutAppointmentNestedInput
    payments?: PaymentUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    clinicalNotes?: ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    doctorId?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PaymentUpdateWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    appointment?: AppointmentUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentUncheckedUpdateWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PaymentUncheckedUpdateManyWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    method?: EnumPaymentMethodFieldUpdateOperationsInput | $Enums.PaymentMethod
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    appointmentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlanChangeLogUpdateWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    changedByUser?: UserUpdateOneWithoutPlanChangeLogsNestedInput
  }

  export type PlanChangeLogUncheckedUpdateWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    changedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanChangeLogUncheckedUpdateManyWithoutPatientTreatmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    changedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    field?: StringFieldUpdateOperationsInput | string
    oldValue?: StringFieldUpdateOperationsInput | string
    newValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppointmentCreateManyDoctorInput = {
    id?: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.ApptStatus
    notes?: string | null
    patientId: string
    treatmentId: string
    googleEventId?: string | null
    bookedBy?: $Enums.BookingSource
    amountPaid?: number | null
    price?: number
    discount?: number
    createdAt?: Date | string
    checkoutTime?: Date | string | null
    guestName?: string | null
    guestPhone?: string | null
    guestEmail?: string | null
    guestDob?: Date | string | null
    patientTreatmentId?: string | null
    sessionNumber?: number | null
    sessionLabel?: string | null
    plannedFee?: number | null
  }

  export type AppointmentUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    patient?: UserUpdateOneRequiredWithoutAppointmentsNestedInput
    treatment?: TreatmentUpdateOneRequiredWithoutAppointmentsNestedInput
    clinicalNotes?: ClinicalNoteUpdateManyWithoutAppointmentNestedInput
    patientTreatment?: PatientTreatmentUpdateOneWithoutAppointmentsNestedInput
    payments?: PaymentUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
    clinicalNotes?: ClinicalNoteUncheckedUpdateManyWithoutAppointmentNestedInput
    payments?: PaymentUncheckedUpdateManyWithoutAppointmentNestedInput
  }

  export type AppointmentUncheckedUpdateManyWithoutDoctorInput = {
    id?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumApptStatusFieldUpdateOperationsInput | $Enums.ApptStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    patientId?: StringFieldUpdateOperationsInput | string
    treatmentId?: StringFieldUpdateOperationsInput | string
    googleEventId?: NullableStringFieldUpdateOperationsInput | string | null
    bookedBy?: EnumBookingSourceFieldUpdateOperationsInput | $Enums.BookingSource
    amountPaid?: NullableIntFieldUpdateOperationsInput | number | null
    price?: IntFieldUpdateOperationsInput | number
    discount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    checkoutTime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    guestName?: NullableStringFieldUpdateOperationsInput | string | null
    guestPhone?: NullableStringFieldUpdateOperationsInput | string | null
    guestEmail?: NullableStringFieldUpdateOperationsInput | string | null
    guestDob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    patientTreatmentId?: NullableStringFieldUpdateOperationsInput | string | null
    sessionNumber?: NullableIntFieldUpdateOperationsInput | number | null
    sessionLabel?: NullableStringFieldUpdateOperationsInput | string | null
    plannedFee?: NullableIntFieldUpdateOperationsInput | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}