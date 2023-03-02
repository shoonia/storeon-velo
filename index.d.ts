type DataTypes<Map, Key extends keyof Map> = Map extends never
  ? [any?]
  : Map[Key] extends never | undefined
  ? [never?]
  : [Map[Key]]

export type ConnectHandler<T> = (state: Readonly<T>) => void | Promise<void>

/**
 * Store with application state and event listeners.
 */
export interface StoreonStore<State = unknown, Events = any> {
  /**
   * Add event listener.
   *
   * @param event The event name.
   * @param handler The event listener.
   * @returns The function to remove listener.
   */
  on<Event extends keyof (Events & StoreonEvents<State, Events>)>(
    event: Event,
    handler: createStoreon.EventHandler<State, Events, Event>
  ): () => void

  /**
   * Return current state. You can use this method only to read state.
   * Any state changes should be in event listeners.
   *
   * @returns The current state.
   */
  get(): Readonly<State>

  /**
   * Set partial state. Accepts an object that will assign to the state.
   * it can be useful for async event listeners.
   *
   * @param data partial state object.
   */
  set(data: Partial<State>): void

  /**
   * Emit event.
   *
   * @param event The event name.
   * @param data Any additional data for the event.
   */
  dispatch: StoreonDispatch<Events & createStoreon.DispatchableEvents<State>>
}

export interface StoreonVeloApi<State = unknown, Events = any> {
  /**
   * Return current state. You can use this method only to read state.
   * Any state changes should be in event listeners.
   *
   * @returns The current state.
   */
  getState(): Readonly<State>

  /**
   * Set partial state. Accepts an object that will assign to the state.
   *
   * @param data Any additional data for the event.
   */
  setState(data: Partial<State>): void

  /**
   * Emit event.
   *
   * @param event The event name.
   * @param data Any additional data for the event.
   */
  dispatch: StoreonDispatch<Events & createStoreon.DispatchableEvents<State>>

  /**
   * Connects to state by property key.
   * It will return the function disconnect from the store.
   *
   * @param args Connect properties keys and event listener.
   */
  connect(...args: [...keys: (keyof State)[], handler: ConnectHandler<State>]): () => void

  /**
   * Start to observe the state changes and calls of the `connect()` callbacks.
   * It must be used inside `$w.onReady()` when all the page elements have finished loading
   */
  readyStore<T = any[]>(): Promise<T>
}

export type StoreonModule<State, Events = any> = (
  store: StoreonStore<State, Events>
) => void

export interface StoreonEvents<State, Events = any>
  extends createStoreon.DispatchableEvents<State> {
  '@dispatch': createStoreon.DispatchEvent<
    State,
    Events & createStoreon.DispatchableEvents<State>
  >
}

export type StoreonDispatch<Events> = (<Event extends keyof Events>(
  event: Event,
  ...data: DataTypes<Partial<Events>, Event>
) => void) & { ___events: Events }

export namespace createStoreon {
  export type DispatchEvent<
    State,
    Events,
    Event extends keyof Events = keyof Events
  > = [Event, Events[Event], EventHandler<State, Events, Event>[]]

  export type EventHandler<
    State,
    Events,
    Event extends keyof (Events & StoreonEvents<State, Events>)
  > = (
    state: State extends object ? Readonly<State> : State,
    data: (Events & StoreonEvents<State, Events>)[Event],
  ) => Partial<State> | Promise<void> | null | void | false

  export interface DispatchableEvents<State> {
    '@init': never
    '@ready': never
    '@set': Readonly<Partial<State>>
    '@changed': Readonly<State>
  }
}

/**
 * Initialize new store and apply all modules to the store.
 *
 * ```js
 * import { createStoreon } from 'storeon'
 * let increment = store => {
 *   store.on('@init', () => ({ count: 0 }))
 *   store.on('inc', ({ count }) => ({ count: count + 1 }))
 * }
 * ```
 *
 * @param modules Functions which will set initial state define reducer
 *                and subscribe to all system events.
 * @returns The new store.
 */
export function createStoreon<State, Events = any>(
  modules: (StoreonModule<State, Events> | false)[]
): StoreonVeloApi<State, Events>
