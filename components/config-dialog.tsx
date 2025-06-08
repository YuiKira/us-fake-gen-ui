"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AgeRangeSlider from "./age-range-slider"

const FIELD_CATEGORIES = {
  basic: {
    title: "基本信息",
    fields: ["fullName", "firstName", "lastName", "gender", "birthday", "title", "hairColor"],
  },
  contact: {
    title: "联系信息",
    fields: ["street", "city", "state", "stateFullName", "zipCode", "phone", "email", "fullAddress"],
  },
  work: {
    title: "工作信息",
    fields: ["occupation", "company", "companySize", "industry", "status", "salary"],
  },
  physical: {
    title: "身体信息",
    fields: ["height", "weight", "bloodType"],
  },
  financial: {
    title: "金融信息",
    fields: ["ssn", "cardType", "cardNumber", "cvv", "expiry"],
  },
  account: {
    title: "账户信息",
    fields: ["username", "password", "securityQuestion", "securityAnswer"],
  },
  tech: {
    title: "技术信息",
    fields: ["os", "userAgent", "guid"],
  },
  other: {
    title: "其他信息",
    fields: ["education", "website", "country"],
  },
  school: {
    title: "高中信息",
    fields: [
      "schoolName",
      "schoolId",
      "schoolZip",
      "schoolWebsite",
      "schoolAddress",
      "schoolCity",
      "schoolState",
      "schoolPhone",
      "schoolGrades",
    ],
  },
  university: {
    title: "大学信息",
    fields: [
      "universityName",
      "universityId",
      "universityZip",
      "universityWebsite",
      "universityAddress",
      "universityCity",
      "universityState",
      "universityPhone",
      "universityType",
    ],
  },
}

const FIELD_LABELS: Record<string, string> = {
  fullName: "全名",
  firstName: "名",
  lastName: "姓",
  gender: "性别",
  birthday: "生日",
  title: "称谓",
  hairColor: "发色",
  country: "国家",
  street: "街道",
  city: "城市",
  state: "州",
  stateFullName: "州全名",
  zipCode: "邮编",
  phone: "电话",
  email: "邮箱",
  fullAddress: "完整地址",
  occupation: "职业",
  company: "公司",
  companySize: "公司规模",
  industry: "行业",
  status: "工作状态",
  salary: "薪资",
  ssn: "社会安全号",
  cardType: "信用卡类型",
  cardNumber: "信用卡号",
  cvv: "CVV",
  expiry: "到期日期",
  username: "用户名",
  password: "密码",
  height: "身高",
  weight: "体重",
  bloodType: "血型",
  os: "操作系统",
  guid: "GUID",
  userAgent: "用户代理",
  education: "教育程度",
  website: "个人网站",
  securityQuestion: "安全问题",
  securityAnswer: "安全答案",
  schoolName: "高中名称",
  schoolId: "高中ID",
  schoolZip: "高中邮编",
  schoolWebsite: "高中网站",
  schoolAddress: "高中地址",
  schoolCity: "高中城市",
  schoolState: "高中州",
  schoolPhone: "高中电话",
  schoolGrades: "年级范围",
  universityName: "大学名称",
  universityId: "大学ID",
  universityZip: "大学邮编",
  universityWebsite: "大学网站",
  universityAddress: "大学地址",
  universityCity: "大学城市",
  universityState: "大学州",
  universityPhone: "大学电话",
  universityType: "大学类型",
}

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentConfig: {
    state: string
    city: string
    gender: string
    minAge: number
    maxAge: number
    visibleFields: string[]
    seed: number
    birthYear: number
    highState: string
    highCity: string
    universityState: string
    universityCity: string
  }
}

function ConfigDialog({ open, onOpenChange, currentConfig }: ConfigDialogProps) {
  const [state, setState] = useState(currentConfig.state)
  const [city, setCity] = useState(currentConfig.city)
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [gender, setGender] = useState(currentConfig.gender)
  const [minAge, setMinAge] = useState(currentConfig.minAge || 18)
  const [maxAge, setMaxAge] = useState(currentConfig.maxAge || 65)
  const [visibleFields, setVisibleFields] = useState<string[]>(currentConfig.visibleFields)
  const [seed, setSeed] = useState(currentConfig.seed.toString())

  // 高中配置
  const [highState, setHighState] = useState(currentConfig.highState)
  const [highCity, setHighCity] = useState(currentConfig.highCity)
  const [highCities, setHighCities] = useState<string[]>([])
  const [loadingHighCities, setLoadingHighCities] = useState(false)

  // 大学配置
  const [universityState, setUniversityState] = useState(currentConfig.universityState)
  const [universityCity, setUniversityCity] = useState(currentConfig.universityCity)
  const [universityCities, setUniversityCities] = useState<string[]>([])
  const [loadingUniversityCities, setLoadingUniversityCities] = useState(false)

  const router = useRouter()

  // 获取城市列表
  const fetchCities = async (stateCode: string) => {
    if (!stateCode || stateCode === "random") {
      setCities([])
      return
    }

    setLoadingCities(true)
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?select=city&where=state_code="${stateCode}"&limit=-1`,
      )
      const data = await response.json()

      if (data.results) {
        // 去重并排序城市列表
        const uniqueCities = [...new Set(data.results.map((item: { city: string }) => item.city))].sort()
        setCities(uniqueCities)
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error)
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }

  // 获取高中城市列表
  const fetchHighCities = async (stateCode: string) => {
    if (!stateCode || stateCode === "random") {
      setHighCities([])
      return
    }

    setLoadingHighCities(true)
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?select=city&where=state_code="${stateCode}"&limit=-1`,
      )
      const data = await response.json()

      if (data.results) {
        const uniqueCities = [...new Set(data.results.map((item: { city: string }) => item.city))].sort()
        setHighCities(uniqueCities)
      }
    } catch (error) {
      console.error("Failed to fetch high school cities:", error)
      setHighCities([])
    } finally {
      setLoadingHighCities(false)
    }
  }

  // 获取大学城市列表
  const fetchUniversityCities = async (stateCode: string) => {
    if (!stateCode || stateCode === "random") {
      setUniversityCities([])
      return
    }

    setLoadingUniversityCities(true)
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?select=city&where=state_code="${stateCode}"&limit=-1`,
      )
      const data = await response.json()

      if (data.results) {
        const uniqueCities = [...new Set(data.results.map((item: { city: string }) => item.city))].sort()
        setUniversityCities(uniqueCities)
      }
    } catch (error) {
      console.error("Failed to fetch university cities:", error)
      setUniversityCities([])
    } finally {
      setLoadingUniversityCities(false)
    }
  }

  // 当州改变时获取城市列表
  useEffect(() => {
    if (state && state !== "random") {
      fetchCities(state)
      setCity("") // 清空城市选择
    } else {
      setCities([])
      setCity("")
    }
  }, [state])

  useEffect(() => {
    if (highState && highState !== "random") {
      fetchHighCities(highState)
      setHighCity("") // 清空城市选择
    } else {
      setHighCities([])
      setHighCity("")
    }
  }, [highState])

  useEffect(() => {
    if (universityState && universityState !== "random") {
      fetchUniversityCities(universityState)
      setUniversityCity("") // 清空城市选择
    } else {
      setUniversityCities([])
      setUniversityCity("")
    }
  }, [universityState])

  const handleFieldToggle = (field: string, checked: boolean) => {
    if (checked) {
      setVisibleFields([...visibleFields, field])
    } else {
      setVisibleFields(visibleFields.filter((f) => f !== field))
    }
  }

  const handleCategoryToggle = (categoryFields: string[], checked: boolean) => {
    if (checked) {
      const newFields = [...new Set([...visibleFields, ...categoryFields])]
      setVisibleFields(newFields)
    } else {
      setVisibleFields(visibleFields.filter((f) => !categoryFields.includes(f)))
    }
  }

  const handleAgeRangeChange = (newMinAge: number, newMaxAge: number) => {
    setMinAge(newMinAge)
    setMaxAge(newMaxAge)
  }

  const handleApply = () => {
    const params = new URLSearchParams()

    if (state && state !== "random") params.set("state", state)
    if (city) params.set("city", city)
    if (gender && gender !== "random") params.set("gender", gender)
    if (minAge > 0) params.set("minAge", minAge.toString())
    if (maxAge > 0) params.set("maxAge", maxAge.toString())
    if (seed) params.set("seed", seed)
    // 只有当不是"不限制"时才设置参数
    if (highState && highState !== "random") params.set("highState", highState)
    if (highCity && highCity !== "random") params.set("highCity", highCity)
    if (universityState && universityState !== "random") params.set("universityState", universityState)
    if (universityCity && universityCity !== "random") params.set("universityCity", universityCity)
    params.set("fields", visibleFields.join(","))

    router.push(`/?${params.toString()}`)
    onOpenChange(false)
  }

  const handleSelectAll = () => {
    const allFields = Object.values(FIELD_CATEGORIES).flatMap((cat) => cat.fields)
    setVisibleFields(allFields)
  }

  const handleSelectNone = () => {
    setVisibleFields([])
  }

  const getStateDisplayName = (stateCode: string) => {
    const stateInfo = US_STATES.find((s) => s.code === stateCode)
    return stateInfo ? `${stateInfo.name} (${stateInfo.code})` : stateCode
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>配置生成参数</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基本参数</TabsTrigger>
            <TabsTrigger value="education">教育机构</TabsTrigger>
            <TabsTrigger value="fields">显示字段</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="state">州 (可选)</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择州" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">随机</SelectItem>
                      {US_STATES.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city">城市 (可选)</Label>
                  <Select value={city} onValueChange={setCity} disabled={!state || state === "random"}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !state || state === "random"
                            ? "请先选择州"
                            : loadingCities
                              ? "加载中..."
                              : cities.length > 0
                                ? "选择城市"
                                : "该州暂无城市数据"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">随机</SelectItem>
                      {cities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {state && state !== "random"
                      ? `已选择州: ${getStateDisplayName(state)}`
                      : "注意：只有在选择了州的情况下才能指定城市"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="seed">随机种子</Label>
                  <Input
                    id="seed"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="自动生成"
                  />
                  <p className="text-sm text-gray-500 mt-1">用于确保结果可重现</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="gender">性别过滤 (可选)</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">随机</SelectItem>
                      <SelectItem value="Male">男</SelectItem>
                      <SelectItem value="Female">女</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>年龄范围 (可选)</Label>
                  <AgeRangeSlider
                    minAge={minAge}
                    maxAge={maxAge}
                    onRangeChange={handleAgeRangeChange}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">设置年龄范围后，生日将根据年龄重新计算</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">高中筛选</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="highState">高中州 (可选)</Label>
                    <Select value={highState} onValueChange={setHighState}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择高中州" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">不限制</SelectItem>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name} ({s.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="highCity">高中城市 (可选)</Label>
                    <Select
                      value={highCity}
                      onValueChange={setHighCity}
                      disabled={!highState || highState === "random"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !highState || highState === "random"
                              ? "请先选择高中州"
                              : loadingHighCities
                                ? "加载中..."
                                : highCities.length > 0
                                  ? "选择高中城市"
                                  : "该州暂无城市数据"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">不限制</SelectItem>
                        {highCities.map((cityName) => (
                          <SelectItem key={cityName} value={cityName}>
                            {cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">默认使用个人信息的州和城市，如果找不到则去掉城市限制</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">大学筛选</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="universityState">大学州 (可选)</Label>
                    <Select value={universityState} onValueChange={setUniversityState}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择大学州" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">不限制</SelectItem>
                        {US_STATES.map((s) => (
                          <SelectItem key={s.code} value={s.code}>
                            {s.name} ({s.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="universityCity">大学城市 (可选)</Label>
                    <Select
                      value={universityCity}
                      onValueChange={setUniversityCity}
                      disabled={!universityState || universityState === "random"}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !universityState || universityState === "random"
                              ? "请先选择大学州"
                              : loadingUniversityCities
                                ? "加载中..."
                                : universityCities.length > 0
                                  ? "选择大学城市"
                                  : "该州暂无城市数据"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">不限制</SelectItem>
                        {universityCities.map((cityName) => (
                          <SelectItem key={cityName} value={cityName}>
                            {cityName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">默认使用个人信息的州，不限制城市</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">选择要显示的字段</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  全选
                </Button>
                <Button variant="outline" size="sm" onClick={handleSelectNone}>
                  全不选
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(FIELD_CATEGORIES).map(([categoryKey, category]) => {
                const categoryFields = category.fields
                const selectedCount = categoryFields.filter((field) => visibleFields.includes(field)).length
                const isAllSelected = selectedCount === categoryFields.length
                const isPartialSelected = selectedCount > 0 && selectedCount < categoryFields.length

                return (
                  <Card key={categoryKey}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = isPartialSelected
                          }}
                          onCheckedChange={(checked) => handleCategoryToggle(categoryFields, checked as boolean)}
                        />
                        <CardTitle className="text-base">
                          {category.title} ({selectedCount}/{categoryFields.length})
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {categoryFields.map((field) => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            checked={visibleFields.includes(field)}
                            onCheckedChange={(checked) => handleFieldToggle(field, checked as boolean)}
                          />
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {FIELD_LABELS[field]}
                          </label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleApply}>应用配置</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfigDialog
