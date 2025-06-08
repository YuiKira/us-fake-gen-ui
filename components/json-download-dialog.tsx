"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PersonData {
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

interface SchoolData {
  name: string
  ncesid: string
  zip: string
  website: string
  address: string
  city: string
  state: string
  telephone: string
  st_grade: string
  end_grade: string
}

interface UniversityData {
  name: string
  ipedsid: string
  zip: string
  website: string
  address: string
  city: string
  state: string
  telephone: string
  type: string
}

interface JsonDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: PersonData | null
  schoolData: SchoolData | null
  universityData: UniversityData | null
  visibleFields: string[]
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

function JsonDownloadDialog({
  open,
  onOpenChange,
  data,
  schoolData,
  universityData,
  visibleFields,
}: JsonDownloadDialogProps) {
  const [jsonMode, setJsonMode] = useState<"complete" | "display">("complete")
  const [jsonContent, setJsonContent] = useState("")
  const [copied, setCopied] = useState(false)

  const generateCompleteJson = () => {
    if (!data) return "{}"

    const completeData: any = { ...data }

    // 添加学校信息
    if (schoolData) {
      completeData.school = {
        name: schoolData.name,
        id: schoolData.ncesid,
        zip: schoolData.zip,
        website: schoolData.website && schoolData.website !== "NOT AVAILABLE" ? schoolData.website : null,
        address: `${schoolData.address}, ${schoolData.city}, ${schoolData.state} ${schoolData.zip}`,
        city: schoolData.city,
        state: schoolData.state,
        phone: schoolData.telephone,
        st_grade: schoolData.st_grade,
        end_grade: schoolData.end_grade,
      }
    }

    // 添加大学信息
    if (universityData) {
      completeData.university = {
        name: universityData.name,
        id: universityData.ipedsid,
        zip: universityData.zip,
        website: universityData.website && universityData.website !== "NOT AVAILABLE" ? universityData.website : null,
        address: `${universityData.address}, ${universityData.city}, ${universityData.state} ${universityData.zip}`,
        city: universityData.city,
        state: universityData.state,
        phone: universityData.telephone,
        type: universityData.type,
      }
    }

    return JSON.stringify(completeData, null, 2)
  }

  const generateDisplayJson = () => {
    if (!data) return "{}"

    const displayData: any = {}

    // 添加基本字段
    visibleFields.forEach((field) => {
      if (field.startsWith("school") && schoolData) {
        if (!displayData.school) displayData.school = {}

        switch (field) {
          case "schoolName":
            displayData.school.name = schoolData.name
            break
          case "schoolId":
            displayData.school.id = schoolData.ncesid
            break
          case "schoolZip":
            displayData.school.zip = schoolData.zip
            break
          case "schoolWebsite":
            if (schoolData.website && schoolData.website !== "NOT AVAILABLE") {
              displayData.school.website = schoolData.website
            }
            break
          case "schoolAddress":
            displayData.school.address = `${schoolData.address}, ${schoolData.city}, ${schoolData.state} ${schoolData.zip}`
            break
          case "schoolCity":
            displayData.school.city = schoolData.city
            break
          case "schoolState":
            displayData.school.state = schoolData.state
            break
          case "schoolPhone":
            displayData.school.phone = schoolData.telephone
            break
          case "schoolGrades":
            displayData.school.st_grade = schoolData.st_grade
            displayData.school.end_grade = schoolData.end_grade
            break
        }
      } else if (field.startsWith("university") && universityData) {
        if (!displayData.university) displayData.university = {}

        const typeMap: Record<string, string> = {
          "1": "公立大学",
          "2": "私立非营利大学",
          "3": "私立营利大学",
        }

        switch (field) {
          case "universityName":
            displayData.university.name = universityData.name
            break
          case "universityId":
            displayData.university.id = universityData.ipedsid
            break
          case "universityZip":
            displayData.university.zip = universityData.zip
            break
          case "universityWebsite":
            if (universityData.website && universityData.website !== "NOT AVAILABLE") {
              displayData.university.website = universityData.website
            }
            break
          case "universityAddress":
            displayData.university.address = `${universityData.address}, ${universityData.city}, ${universityData.state} ${universityData.zip}`
            break
          case "universityCity":
            displayData.university.city = universityData.city
            break
          case "universityState":
            displayData.university.state = universityData.state
            break
          case "universityPhone":
            displayData.university.phone = universityData.telephone
            break
          case "universityType":
            displayData.university.type = universityData.type
            break
        }
      } else if (data[field as keyof PersonData]) {
        displayData[field] = data[field as keyof PersonData]
      }
    })

    return JSON.stringify(displayData, null, 2)
  }

  const handleModeChange = (mode: "complete" | "display") => {
    setJsonMode(mode)
    const newContent = mode === "complete" ? generateCompleteJson() : generateDisplayJson()
    setJsonContent(newContent)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "复制成功",
        description: "JSON内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `user-data-${jsonMode === "complete" ? "complete" : "display"}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "下载成功",
        description: "JSON文件已开始下载",
      })
    } catch (error) {
      toast({
        title: "下载失败",
        description: "无法下载文件",
        variant: "destructive",
      })
    }
  }

  // 当对话框打开时，初始化JSON内容
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && data) {
      const initialContent = jsonMode === "complete" ? generateCompleteJson() : generateDisplayJson()
      setJsonContent(initialContent)
    }
    onOpenChange(isOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>导出JSON数据</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 控制按钮行 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={jsonMode === "complete" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange("complete")}
              >
                完整数据
              </Button>
              <Button
                variant={jsonMode === "display" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange("display")}
              >
                显示数据
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={!jsonContent}>
              <Download className="h-4 w-4 mr-2" />
              下载JSON
            </Button>
          </div>

          {/* JSON内容区域 */}
          <div className="relative">
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-none"
              placeholder="JSON内容将在这里显示..."
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="absolute top-2 right-2"
              disabled={!jsonContent}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* 说明文字 */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              <strong>完整数据：</strong>包含所有获取到的信息，不受显示字段配置限制
            </p>
            <p>
              <strong>显示数据：</strong>仅包含当前配置显示的字段信息
            </p>
            <p>您可以直接编辑上方的JSON内容，然后下载或复制</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default JsonDownloadDialog
