import { maxStrategy, minStrategy, sumStrategy, averageStrategy, Strategy, __STRATEGIES_MAP } from "./main"
/**
 * STRATEGIES
 */
describe("maxStrategy()", () => {
  test("should return 0 if no number is given", () => {
    expect(maxStrategy()).toBe(0)
  })

  test("should return the highest value", () => {
    const max = 100000
    const x = random(max)
    const y = random(max)
    const z = random(max)
    expect(maxStrategy(x, y, z, max)).toBe(max)
  })
})

describe("minStrategy()", () => {
  test("should return 0 if no number is given", () => {
    expect(maxStrategy()).toBe(0)
  })

  test("should return the lowest value", () => {
    const x = random()
    const y = random()
    const z = random()
    const min = 0
    expect(minStrategy(x, y, z, min)).toBe(min)
  })
})

describe("sumStrategy()", () => {
  test("should return 0 if no number is passed", () => {
    expect(sumStrategy()).toBe(0)
  })

  test("should sum all the numbers together", () => {
    const x = random()
    const y = random()
    const z = random()
    expect(sumStrategy(x, y, z)).toBe(x + y + z)
  })
})

describe("averageStrategy()", () => {
  test("should return 0 if no number is passed", () => {
    expect(averageStrategy()).toBe(0)
  })

  test("should return the average of the numbers", () => {
    const x = random()
    const y = random()
    const z = random()
    expect(averageStrategy(x, y, z)).toBe((x + y + z) / 3)
  })
})
/**
 * Strategy
 */
describe("Strategy()", () => {
  const x = random()
  const y = random()
  const z = random()

  describe(".coalesce()", () => {
    test("should use the averageStrategy if none is defined", () => {
      const strategy = new Strategy()
      expect(strategy.coalesce(x, y, z)).toBe((x + y + z) / 3)
    })

    test("should use the provided strategy if its defined", () => {
      __STRATEGIES_MAP.forEach((strategyFunc, key) => {
        const strategy = new Strategy(key)
        expect(strategy.coalesce(x, y, z)).toBe(strategyFunc(x, y, z))
      })
    })
  })

})
/**
 * HELPER FUNCTIONS
 */
function random(max = 100000): number {
  return parseInt((Math.random() * max).toFixed(0), 10)
}