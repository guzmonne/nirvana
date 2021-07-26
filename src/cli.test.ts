import http from "http"
import request from "supertest"
import nock from "nock"

import { createAPIServer, __STRATEGIES_MAP, Strategy } from "./main"

describe("createAPIServer", () => {
  test("should return a 404 status code for a route different to '/'", async (done) => {
    const server = createAPIServer([])
    request(server)
      .get("/test")
      .expect("Content-Type", /json/)
      .expect(404)
      .end((err) => {
        if (err)
          throw err
        done()
      })
  })

  test("should return a 409 status code if the server is called without external APIs", async (done) => {
    const server = createAPIServer([])
    request(server)
      .get("/?member_id=1")
      .expect("Content-Type", /json/)
      .expect(409)
      .end((err) => {
        if (err)
          throw err
        done()
      })
  })

  test("should return an error if no member_id is provided", async (done) => {
    const server = createAPIServer(["http://localhost:8000"])
    request(server)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(400)
      .end((err) => {
        if (err)
          throw err
        done()
      })
  })

  test("should return an error if one of the third party APIs fail", async (done) => {
    const errorMsg = "Not Found"
    const path = "/?member_id=1"
    const externalHost0 = "http://localhost:8000"
    const externalHost1 = "http://localhost:8001"
    const server = createAPIServer([externalHost0, externalHost1])
    nock(externalHost0)
      .get(path)
      .reply(200, { deductible: random(), stop_loss: random(), oop_max: random() })
    nock(externalHost1)
      .get(path)
      .reply(400, { error: errorMsg })
    request(server)
      .get(path)
      .expect("Content-Type", /json/)
      .expect(422)
      .then((response) => {
        expect(response.body.error).toBe("couldn't process request")
        nock.cleanAll()
        done()
      })
      .catch((err) => {
        if (err) throw err
      })
  })

  test("should return a result using an average strategy by default", async (done) => {
    const path = "/?member_id=1"
    const externalHost0 = "http://localhost:8000"
    const externalHost1 = "http://localhost:8001"
    const server = createAPIServer([externalHost0, externalHost1])
    const body1 = { deductible: random(), stop_loss: random(), oop_max: random() }
    const body2 = { deductible: random(), stop_loss: random(), oop_max: random() }
    nock(externalHost0)
      .get(path)
      .reply(200, body1)
    nock(externalHost1)
      .get(path)
      .reply(200, body2)
    request(server)
      .get(path)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.deductible).toBe((body1.deductible + body2.deductible) / 2)
        expect(response.body.stop_loss).toBe((body1.stop_loss + body2.stop_loss) / 2)
        expect(response.body.oop_max).toBe((body1.oop_max + body2.oop_max) / 2)
        nock.cleanAll()
        done()
      })
      .catch((err) => {
        if (err) throw err
      })
  })

  for (let [strategyName] of __STRATEGIES_MAP) {
    test(`should return a result using the ${strategyName} strategy`, async (done) => {
      const strategy = new Strategy(strategyName)
      const path = `/?member_id=1`
      const externalHost0 = "http://localhost:8000"
      const externalHost1 = "http://localhost:8001"
      const server = createAPIServer([externalHost0, externalHost1])
      const body1 = { deductible: random(), stop_loss: random(), oop_max: random() }
      const body2 = { deductible: random(), stop_loss: random(), oop_max: random() }
      nock(externalHost0)
        .get(path)
        .reply(200, body1)
      nock(externalHost1)
        .get(path)
        .reply(200, body2)
      request(server)
        .get(`${path}&strategy=${strategyName}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.deductible).toBe(strategy.coalesce(body1.deductible, body2.deductible))
          expect(response.body.stop_loss).toBe(strategy.coalesce(body1.stop_loss, body2.stop_loss))
          expect(response.body.oop_max).toBe(strategy.coalesce(body1.oop_max, body2.oop_max))
          nock.cleanAll()
          done()
        })
        .catch((err) => {
          if (err) throw err
        })
    })
  }
})

/**
 * HELPER FUNCTIONS
 */
/**
 * random returns a random integer value between 0 and `max`
 * @param max - Max integer value.
 */
function random(max: number = 100000): number {
  return parseInt((Math.random() * max).toFixed(0), 10)
}
/**
 * createMockAPI returns a mock API that conforms with the external
 * API interfaces.
 * @param body - Body to return on each request.
 * @param error - Error string to return if we want to simulate an error.
 */
export function createMockAPI(body?: any, error?: string) {
  const server = http.createServer(async (_, res) => {
    if (error) {
      res.writeHead(400, "Error", { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error }))
    }
    res.writeHead(200, "Ok", { "Content-Type": "application/json" })
    res.end(JSON.stringify(body ? body : {
      deductible: random(),
      stop_loss: random(),
      oop_max: random(),
    }))
  })

  return server
}