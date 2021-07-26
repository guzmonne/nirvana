import http from "http"
import fetch, { Response } from "node-fetch"
/**
 * Interfaces
 */
/**
   * APIBody represents the response body expected from an API.
   */
export interface APIBody {
  /**
   * deductible is ...
   */
  deductible: number;
  /**
   * stop_loss is ...
   */
  stop_loss: number;
  /**
   * oop_max is ...
   */
  oop_max: number;
}
/**
 * StrategyFunc is any function that can coalesce a list of numbers to one.
 */
export type StrategyFunc = (...numbers: number[]) => number;
/**
 * Strategy is an interface to simplify the process of coalescing a list
 * of numbers into one in different ways.
 */
export interface Strategy {
  coalesce: StrategyFunc
}
/**
 * StrategyDict is a Map that holds all the available Strategies by their name.
 */
export type StrategyMap = Map<string, StrategyFunc>
/**
 * STRATEGIES
 */
/**
 * minStrategy calculates the min from a list of numbers.
 * @param numbers - list of numbers from which to pick the min.
 */
export const minStrategy: StrategyFunc = (...numbers) => numbers.length === 0 ? 0 : Math.min(...numbers)
/**
 * maxStrategy calculate the max from a list of numbers.
 * @param numbers - list of numbers from which to pick the max.
 */
export const maxStrategy: StrategyFunc = (...numbers) => numbers.length === 0 ? 0 : Math.max(...numbers)
/**
 * sumStrategy calculates the sum of a list of numbers.
 * @param numbers - list of numbers to sum.
 */
export const sumStrategy: StrategyFunc = (...numbers) => numbers.reduce((acc, number) => acc + number, 0)
/**
 * averageStrategy calculates the average of a list of numbers
 * @param numbers - list of numbers to average.
 */
export const averageStrategy: StrategyFunc = (...numbers) => numbers.length === 0 ? 0 : sumStrategy(...numbers) / numbers.length
/**
 * STRATEGIES MAP
 */
export const __STRATEGIES_MAP: StrategyMap = new Map<string, StrategyFunc>([
  ["min", minStrategy],
  ["max", maxStrategy],
  ["sum", sumStrategy],
  ["avg", averageStrategy],
])
/**
 * Strategy is the object use to coalesce a list of numbers according
 * to a specified strategy. If no strategy is provided, or doesn't
 * exists, then the `averageStrategy` will be used.
 * @param name - Strategy name.
 */
export class Strategy implements Strategy {
  constructor(name?: string | null) {
    this.coalesce = !!name && __STRATEGIES_MAP.has(name)
      ? __STRATEGIES_MAP.get(name) as StrategyFunc
      : averageStrategy
  }
  /**
   * coalesce reduces a list of numbers into one using the strategy
   * provided at construction time.
   */
  coalesce: StrategyFunc
}
/**
 * API
 */
export function createAPIServer(externalAPIs: string[]) {
  const server = http.createServer(async (req, res) => {
    try {
      const baseURL = 'http://' + req.headers.host + '/';
      const url = new URL(req.url as string, baseURL);

      if (url.pathname !== "/" || req.method !== "GET") {
        res.writeHead(404, "Not Found", { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "route not found" }))
        return
      }

      if (externalAPIs.length === 0) {
        res.writeHead(409, "Conflict", { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "no external API has been configured" }))
        return
      }

      const query = new URLSearchParams(url.search)
      const memberId = query.get("member_id")

      if (!memberId) {
        res.writeHead(400, "Bad Request", { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "member_id is undefined" }))
        return
      }

      const strategyName = query.get("strategy")
      const strategy = new Strategy(strategyName)

      const responses: APIBody[] = await Promise.all(externalAPIs.map(host =>
        fetch(`${host}/?member_id=${memberId}`)
          .catch(err => { throw err })
          .then(checkStatus))
      )

      res.writeHead(200, "Ok", { "Content-Type": "application/json" })
      res.end(JSON.stringify({
        deductible: strategy.coalesce(...responses.map(response => response.deductible)),
        stop_loss: strategy.coalesce(...responses.map(response => response.stop_loss)),
        oop_max: strategy.coalesce(...responses.map(response => response.oop_max)),
      }))

    } catch (err) {
      debug(err)
      res.writeHead(422, "Unprocessable Entity", { "Content-Type": "application/json" })
      const body: { error: string, errorBody?: string } = { error: "couldn't process request" }
      if (err instanceof HTTPResponseError) {
        const errorBody = await err.response.text()
        debug(errorBody)
        body.errorBody = errorBody
      }
      res.end(JSON.stringify(body))
      return
    }
  })

  return server
}
/**
 * Utils
 */
/**
 * HTTPResponseError is a helper Error instance to use when handling
 * fetch request errors.
 *
 * @param response - Fetch Response object.
 */
class HTTPResponseError extends Error {
  response: Response

  constructor(response: Response) {
    super(`Error: ${response.status} ${response.statusText}`);
    this.response = response;
  }
}
/**
 * checkStatus checks the status of the fetch response.
 * @param response - Fetch Response object.
 */
function checkStatus(response: Response) {
  if (response.ok) {
    return response.json()
  }
  throw new HTTPResponseError(response)
}
/**
 * debug is a helper function that will only log errors
 * when the environment variable `DEBUG` is set.
 * @param args - Any `debug` valid argument.
 */
function debug(...args: any[]) {
  if (process.env.DEBUG) console.error(...args)
}