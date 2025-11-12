"use client"

import { faker } from '@faker-js/faker'
import { generateRealisticAddress } from './address-generator'

// Faker已经配置为默认locale

export interface PersonData {
  fullName: string
  firstName: string
  lastName: string
  gender: string
  birthday: string
  title: string
  hairColor: string
  country: string
  street: string
  city: string
  state: string
  stateFullName: string
  zipCode: string
  phone: string
  email: string
  fullAddress: string
  occupation: string
  company: string
  companySize: string
  industry: string
  status: string
  salary: string
  ssn: string
  cardType: string
  cardNumber: string
  cvv: number
  expiry: string
  username: string
  password: string
  height: string
  weight: string
  bloodType: string
  os: string
  guid: string
  userAgent: string
  education: string
  website: string
  securityQuestion: string
  securityAnswer: string
}

// 配置选项
export interface GeneratePersonOptions {
  state?: string
  city?: string
  gender?: 'Male' | 'Female' | string
  minAge?: number
  maxAge?: number
  seed?: number
}

// 生成安全问题和答案
const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What high school did you attend?",
  "What is your favorite color?",
  "What was the name of your elementary school?",
  "What is your father's middle name?",
  "What is your favorite movie?",
  "What is your favorite food?",
  "What street did you grow up on?"
]

const SECURITY_ANSWERS = [
  "Fluffy",
  "New York",
  "Smith",
  "Lincoln High",
  "Blue",
  "Oak Elementary",
  "Robert",
  "Titanic",
  "Pizza",
  "Main Street"
]

// 生成身高（美式单位）
function generateHeight(): string {
  const feet = faker.number.int({ min: 5, max: 6 })
  const inches = faker.number.int({ min: 0, max: 11 })
  return `${feet}'${inches}"`
}

// 生成体重（磅）
function generateWeight(): string {
  const weight = faker.number.int({ min: 110, max: 220 })
  return `${weight} lbs`
}

// 生成血型
function generateBloodType(): string {
  const types = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  return faker.helpers.arrayElement(types)
}

// 生成称谓
function generateTitle(gender?: string): string {
  const maleTitles = ['Mr.', 'Dr.']
  const femaleTitles = ['Ms.', 'Mrs.', 'Dr.', 'Miss']
  const neutralTitles = ['Dr.', 'Prof.']

  if (gender?.toLowerCase() === 'male') {
    return faker.helpers.arrayElement(maleTitles)
  } else if (gender?.toLowerCase() === 'female') {
    return faker.helpers.arrayElement(femaleTitles)
  }
  return faker.helpers.arrayElement(neutralTitles)
}

// 生成标准格式的美国电话号码
function generatePhoneNumber(): string {
  // 生成美国电话号码：XXX-XXX-XXXX
  // 确保区号不以0或1开头（美国电话号码规则）
  const areaCode = faker.number.int({ min: 2, max: 9 }).toString() + faker.string.numeric(2)
  const exchangeCode = faker.number.int({ min: 2, max: 9 }).toString() + faker.string.numeric(2)
  const lineNumber = faker.string.numeric(4)
  return `${areaCode}-${exchangeCode}-${lineNumber}`
}

// 生成发色
function generateHairColor(): string {
  const colors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'Auburn']
  return faker.helpers.arrayElement(colors)
}

// 生成公司规模
function generateCompanySize(): string {
  const sizes = ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '500+ employees']
  return faker.helpers.arrayElement(sizes)
}

// 生成行业
function generateIndustry(): string {
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Real Estate', 'Consulting', 'Media', 'Government',
    'Non-profit', 'Energy', 'Transportation', 'Agriculture', 'Entertainment'
  ]
  return faker.helpers.arrayElement(industries)
}

// 生成薪资
function generateSalary(): string {
  const salary = faker.number.int({ min: 35000, max: 250000 })
  // 格式化为带逗号的数字
  return `$${salary.toLocaleString()}`
}

// 生成SSN（社会保障号）
function generateSSN(): string {
  const area = faker.string.numeric(3)
  const group = faker.string.numeric(2)
  const serial = faker.string.numeric(4)
  return `${area}-${group}-${serial}`
}

// 生成信用卡到期日期
function generateExpiryDate(): string {
  const currentDate = new Date()
  const year = currentDate.getFullYear() + faker.number.int({ min: 1, max: 5 })
  const month = faker.number.int({ min: 1, max: 12 })
  const formattedMonth = month.toString().padStart(2, '0')
  return `${formattedMonth}/${year.toString().slice(-2)}`
}

// 生成教育程度
function generateEducation(): string {
  const levels = ['高中', '副学士', '学士', '硕士', '博士', '专业学位']
  return faker.helpers.arrayElement(levels)
}

// 生成操作系统
function generateOS(): string {
  const osList = [
    'Windows 11',
    'Windows 10',
    'macOS Sonoma',
    'macOS Ventura',
    'Ubuntu 22.04',
    'Debian 12',
    'CentOS Stream 9',
    'Fedora 39'
  ]
  return faker.helpers.arrayElement(osList)
}

/**
 * 生成个人数据
 */
export function generatePersonData(options: GeneratePersonOptions = {}): PersonData {
  const {
    state,
    city,
    gender,
    minAge,
    maxAge,
    seed
  } = options

  // 设置种子（如果提供）
  if (seed !== undefined) {
    faker.seed(seed)
  }

  // 生成性别
  const personGender = gender && gender !== 'random'
    ? gender
    : faker.person.sexType().toLowerCase() === 'male'
    ? 'Male'
    : 'Female'

  // 生成姓名
  const firstName = faker.person.firstName(personGender)
  const lastName = faker.person.lastName()
  const fullName = `${firstName} ${lastName}`

  // 生成年龄和生日
  let age = faker.number.int({ min: 18, max: 80 })
  if (minAge && maxAge && minAge > 0 && maxAge > 0) {
    age = faker.number.int({ min: minAge, max: maxAge })
  }
  const birthday = faker.date.birthdate({ min: age, max: age, mode: 'age' })
  const birthdayString = `${birthday.getMonth() + 1}/${birthday.getDate()}/${birthday.getFullYear()}`

  // 生成地址
  const addressPromise = generateRealisticAddress(state, city)

  // 注意：这里返回Promise，需要在调用处await
  // 但为了接口兼容，我们返回一个部分填充的对象
  // 实际地址数据需要通过另一种方式传递

  // 生成其他基本信息
  const title = generateTitle(personGender)
  const hairColor = generateHairColor()
  const country = 'United States'

  // 生成联系信息
  const phone = generatePhoneNumber()
  const email = faker.internet.email({ firstName, lastName })

  // 生成工作信息
  const occupation = faker.person.jobTitle()
  const company = faker.company.name()
  const companySize = generateCompanySize()
  const industry = generateIndustry()
  const status = faker.person.jobType()
  const salary = generateSalary()

  // 生成金融信息
  const ssn = generateSSN()
  const cardType = faker.finance.creditCardIssuer()
  const cardNumber = faker.finance.creditCardNumber()
  const cvv = parseInt(faker.finance.creditCardCVV())
  const expiry = generateExpiryDate()

  // 生成账户信息
  const username = faker.internet.username({ firstName, lastName })
  const password = faker.internet.password({ length: 12, memorable: false })

  // 生成安全问题
  const securityQuestionIndex = faker.number.int({ min: 0, max: SECURITY_QUESTIONS.length - 1 })
  const securityQuestion = SECURITY_QUESTIONS[securityQuestionIndex]
  const securityAnswer = SECURITY_ANSWERS[securityQuestionIndex]

  // 生成物理信息
  const height = generateHeight()
  const weight = generateWeight()
  const bloodType = generateBloodType()

  // 生成技术信息
  const os = generateOS()
  const guid = faker.string.uuid()
  const userAgent = faker.internet.userAgent()

  // 生成其他信息
  const education = generateEducation()
  const website = faker.internet.url()

  // 返回对象（地址字段暂时为空，需要在调用处填充）
  return {
    fullName,
    firstName,
    lastName,
    gender: personGender,
    birthday: birthdayString,
    title,
    hairColor,
    country,
    street: '', // 将在调用处填充
    city: '',   // 将在调用处填充
    state: '',  // 将在调用处填充
    stateFullName: '', // 将在调用处填充
    zipCode: '', // 将在调用处填充
    phone,
    email,
    fullAddress: '', // 将在调用处填充
    occupation,
    company,
    companySize,
    industry,
    status,
    salary,
    ssn,
    cardType,
    cardNumber,
    cvv,
    expiry,
    username,
    password,
    height,
    weight,
    bloodType,
    os,
    guid,
    userAgent,
    education,
    website,
    securityQuestion,
    securityAnswer
  }
}

/**
 * 异步生成完整的个人数据（包括地址）
 */
export async function generatePersonDataWithAddress(options: GeneratePersonOptions = {}): Promise<PersonData> {
  const person = generatePersonData(options)

  // 生成地址（传递seed参数以确保一致性）
  const address = await generateRealisticAddress(options.state, options.city, options.seed)

  // 填充地址字段
  person.street = address.street
  person.city = address.city
  person.state = address.state
  person.stateFullName = address.stateFullName
  person.zipCode = address.zipCode
  person.fullAddress = address.fullAddress

  return person
}
