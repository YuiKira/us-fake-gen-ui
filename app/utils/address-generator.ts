"use client"

import { faker } from '@faker-js/faker'
import { US_CITIES_BY_STATE, US_STATES_FULL_NAME } from '../data/us-cities'

// Faker实例已经在 locale/en_US 中配置

// 地址缓存
const addressCache = new Map<string, AddressCache>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24小时

interface AddressCache {
  address: AddressData
  timestamp: number
}

interface AddressData {
  street: string
  city: string
  state: string
  stateFullName: string
  zipCode: string
  fullAddress: string
  country: string
}

// 速率限制器
class RateLimiter {
  private lastRequest = 0
  private minInterval = 1000 // 1秒间隔

  async throttle(): Promise<void> {
    const now = Date.now()
    const elapsed = now - this.lastRequest

    if (elapsed < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - elapsed))
    }

    this.lastRequest = Date.now()
  }
}

const rateLimiter = new RateLimiter()

// 获取缓存的地址
function getCachedAddress(key: string): AddressData | null {
  const cached = addressCache.get(key)
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.address
  }
  return null
}

// 设置缓存
function setCachedAddress(key: string, address: AddressData): void {
  addressCache.set(key, {
    address,
    timestamp: Date.now()
  })
}

/**
 * 从OpenStreetMap获取真实地址
 */
async function fetchFromOpenStreetMap(stateCode: string, city?: string): Promise<AddressData | null> {
  try {
    await rateLimiter.throttle()

    const query = city
      ? `${city}, ${stateCode}, United States`
      : `${stateCode}, United States`

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&country=United States&state=${stateCode}&limit=5&addressdetails=1&dedupe=1`,
      {
        headers: {
          'User-Agent': 'US-Fake-Data-Generator/1.0'
        }
      }
    )

    if (!response.ok) {
      console.warn('OpenStreetMap API request failed:', response.status)
      return null
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return null
    }

    // 随机选择一个结果
    const location = faker.helpers.arrayElement(data.slice(0, Math.min(5, data.length)))
    const addr = location.address

    if (!addr) {
      return null
    }

    const street = addr.road || addr.pedestrian || addr.footway || faker.location.streetAddress()
    const foundCity = addr.city || addr.town || addr.village || addr.county || city || faker.location.city()

    // 确保地址格式始终为英文
    const zipCode = addr.postcode || faker.location.zipCode()
    return {
      street: street,
      city: foundCity,
      state: stateCode,
      stateFullName: US_STATES_FULL_NAME[stateCode] || stateCode,
      zipCode: zipCode,
      fullAddress: `${street}, ${foundCity}, ${stateCode} ${zipCode}`,
      country: 'United States'
    }
  } catch (error) {
    console.warn('Failed to fetch from OpenStreetMap:', error)
    return null
  }
}

/**
 * 从州政府开放数据获取真实地址（示例实现）
 */
async function fetchFromOpenData(stateCode: string): Promise<AddressData | null> {
  // 这是一个示例，展示如何集成政府开放数据
  // 实际实施时需要针对具体州的API进行定制
  try {
    // 示例：某些州可能有地址开放的API
    // const response = await fetch(`https://data.state.gov/api/addresses/${stateCode}`)
    // const data = await response.json()
    // return parseAddressFromOpenData(data)

    return null // 暂时返回null，等待实际数据源
  } catch (error) {
    console.warn('Failed to fetch from open data:', error)
    return null
  }
}

/**
 * 从真实城市列表生成地址（第三优先级，回退方案）
 */
function generateFromCityList(stateCode: string, city?: string): AddressData {
  const stateFullName = US_STATES_FULL_NAME[stateCode] || stateCode
  const cities = US_CITIES_BY_STATE[stateCode]

  const selectedCity = city || (cities ? faker.helpers.arrayElement(cities) : faker.location.city())

  // 生成真实感的街道
  const streetNumber = faker.number.int({ min: 100, max: 9999 })
  const streetTypes = ['St', 'Ave', 'Dr', 'Blvd', 'Rd', 'Ln', 'Ct', 'Pl', 'Terrace', 'Way', 'Circle']
  const streetNames = [
    'Main', 'Oak', 'Park', 'First', 'Second', 'Third', 'Elm', 'Pine', 'Cedar', 'Washington',
    'Jefferson', 'Lincoln', 'Madison', 'Jackson', 'Adams', 'Franklin', 'Monroe', 'Grant',
    'Church', 'School', 'Mill', 'River', 'Hill', 'Lake', 'Sunset', 'Valley', 'Grove'
  ]

  const streetName = `${faker.helpers.arrayElement(streetNames)} ${faker.helpers.arrayElement(streetTypes)}`
  const zipCode = faker.location.zipCode()

  return {
    street: `${streetNumber} ${streetName}`,
    city: selectedCity,
    state: stateCode,
    stateFullName: stateFullName,
    zipCode: zipCode,
    fullAddress: `${streetNumber} ${streetName}, ${selectedCity}, ${stateCode} ${zipCode}`,
    country: 'United States'
  }
}

/**
 * 主函数：生成真实感地址（混合方案）
 * @param stateCode 州代码（如 'CA', 'NY'）
 * @param city 可选的城市名
 * @param seed 可选的随机种子
 * @returns 地址数据
 */
export async function generateRealisticAddress(stateCode?: string, city?: string, seed?: number): Promise<AddressData> {
  // 如果提供了seed，使用它来设置faker
  if (seed !== undefined) {
    faker.seed(seed)
  }

  // 生成缓存键（如果使用seed则不缓存）
  if (seed === undefined) {
    const cacheKey = `${stateCode || 'random'}-${city || 'random'}`
    const cached = getCachedAddress(cacheKey)
    if (cached) {
      return cached
    }
  }

  // 如果没有指定州，随机选择一个
  const state = stateCode || faker.helpers.arrayElement(Object.keys(US_CITIES_BY_STATE))

  // 第一优先级：尝试从开放数据获取
  let address = await fetchFromOpenData(state)
  if (address) {
    if (seed === undefined) {
      setCachedAddress(`${stateCode || 'random'}-${city || 'random'}`, address)
    }
    return address
  }

  // 第二优先级：尝试从OpenStreetMap获取
  address = await fetchFromOpenStreetMap(state, city)
  if (address) {
    if (seed === undefined) {
      setCachedAddress(`${stateCode || 'random'}-${city || 'random'}`, address)
    }
    return address
  }

  // 第三优先级：回退到城市列表+Faker
  address = generateFromCityList(state, city)
  if (seed === undefined) {
    setCachedAddress(`${stateCode || 'random'}-${city || 'random'}`, address)
  }
  return address
}

/**
 * 生成一个随机的美国地址（不指定州）
 */
export async function generateRandomAddress(seed?: number): Promise<AddressData> {
  return generateRealisticAddress(undefined, undefined, seed)
}

/**
 * 生成指定州和城市的地址
 */
export async function generateAddressForStateAndCity(state: string, city: string, seed?: number): Promise<AddressData> {
  return generateRealisticAddress(state, city, seed)
}
