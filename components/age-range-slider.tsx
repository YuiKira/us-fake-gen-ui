"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface AgeRangeSliderProps {
  minAge: number
  maxAge: number
  onRangeChange: (minAge: number, maxAge: number) => void
  className?: string
}

function AgeRangeSlider({ minAge, maxAge, onRangeChange, className }: AgeRangeSliderProps) {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null)
  const [showTooltip, setShowTooltip] = useState<"min" | "max" | null>(null)
  const [editingField, setEditingField] = useState<"minAge" | "maxAge" | "minYear" | "maxYear" | null>(null)
  const [inputValue, setInputValue] = useState("")
  const sliderRef = useRef<HTMLDivElement>(null)

  const MIN_VALUE = 18
  const MAX_VALUE = 80

  const currentYear = new Date().getFullYear()

  const getYearFromAge = (age: number) => currentYear - age
  const getAgeFromYear = (year: number) => currentYear - year

  const getPercentage = (value: number) => {
    return ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100
  }

  const getValueFromPercentage = (percentage: number) => {
    return Math.round(MIN_VALUE + (percentage / 100) * (MAX_VALUE - MIN_VALUE))
  }

  const updateValue = useCallback(
    (clientX: number, type: "min" | "max") => {
      if (!sliderRef.current) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const newValue = getValueFromPercentage(percentage)

      if (type === "min") {
        const newMinAge = Math.max(MIN_VALUE, Math.min(newValue, maxAge)) // 允许相等
        onRangeChange(newMinAge, maxAge)
      } else {
        const newMaxAge = Math.min(MAX_VALUE, Math.max(newValue, minAge)) // 允许相等
        onRangeChange(minAge, newMaxAge)
      }
    },
    [minAge, maxAge, onRangeChange],
  )

  const handleMouseDown = (type: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(type)
    setShowTooltip(type)

    const handleMouseMove = (e: MouseEvent) => {
      updateValue(e.clientX, type)
    }

    const handleMouseUp = () => {
      setIsDragging(null)
      setShowTooltip(null)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleSliderClick = (e: React.MouseEvent) => {
    if (isDragging) return

    const rect = sliderRef.current?.getBoundingClientRect()
    if (!rect) return

    const percentage = ((e.clientX - rect.left) / rect.width) * 100
    const clickValue = getValueFromPercentage(percentage)

    // 确定点击的是哪个滑块更近
    const minDistance = Math.abs(clickValue - minAge)
    const maxDistance = Math.abs(clickValue - maxAge)

    if (minDistance <= maxDistance) {
      updateValue(e.clientX, "min")
    } else {
      updateValue(e.clientX, "max")
    }
  }

  const handleFieldClick = (field: "minAge" | "maxAge" | "minYear" | "maxYear") => {
    let value = ""
    switch (field) {
      case "minAge":
        value = minAge.toString()
        break
      case "maxAge":
        value = maxAge.toString()
        break
      case "minYear":
        value = getYearFromAge(minAge).toString()
        break
      case "maxYear":
        value = getYearFromAge(maxAge).toString()
        break
    }
    setInputValue(value)
    setEditingField(field)
  }

  const handleInputSubmit = () => {
    if (!editingField) return

    const numValue = Number.parseInt(inputValue)
    if (isNaN(numValue)) {
      setEditingField(null)
      return
    }

    let newMinAge = minAge
    let newMaxAge = maxAge

    switch (editingField) {
      case "minAge":
        newMinAge = Math.max(MIN_VALUE, Math.min(numValue, MAX_VALUE))
        break
      case "maxAge":
        newMaxAge = Math.max(MIN_VALUE, Math.min(numValue, MAX_VALUE))
        break
      case "minYear":
        const ageFromMinYear = getAgeFromYear(numValue)
        newMinAge = Math.max(MIN_VALUE, Math.min(ageFromMinYear, MAX_VALUE))
        break
      case "maxYear":
        const ageFromMaxYear = getAgeFromYear(numValue)
        newMaxAge = Math.max(MIN_VALUE, Math.min(ageFromMaxYear, MAX_VALUE))
        break
    }

    // 确保最小年龄不大于最大年龄
    if (newMinAge > newMaxAge) {
      if (editingField.includes("min")) {
        newMaxAge = newMinAge
      } else {
        newMinAge = newMaxAge
      }
    }

    onRangeChange(newMinAge, newMaxAge)
    setEditingField(null)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit()
    } else if (e.key === "Escape") {
      setEditingField(null)
    }
  }

  const minPercentage = getPercentage(minAge)
  const maxPercentage = getPercentage(maxAge)

  return (
    <div className={cn("relative w-full", className)}>
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{MIN_VALUE}岁</span>
          <span>{MAX_VALUE}岁</span>
        </div>

        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleSliderClick}
        >
          {/* 选中范围的背景 */}
          <div
            className="absolute h-2 bg-blue-500 rounded-full pointer-events-none"
            style={{
              left: `${minPercentage}%`,
              width: `${Math.max(0, maxPercentage - minPercentage)}%`,
            }}
          />

          {/* 最小值滑块 */}
          <div
            className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform z-10"
            style={{ left: `${minPercentage}%` }}
            onMouseDown={handleMouseDown("min")}
            onMouseEnter={() => !isDragging && setShowTooltip("min")}
            onMouseLeave={() => !isDragging && setShowTooltip(null)}
          />

          {/* 最大值滑块 */}
          <div
            className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 hover:scale-110 transition-transform z-10"
            style={{ left: `${maxPercentage}%` }}
            onMouseDown={handleMouseDown("max")}
            onMouseEnter={() => !isDragging && setShowTooltip("max")}
            onMouseLeave={() => !isDragging && setShowTooltip(null)}
          />

          {/* 最小值气泡提示 */}
          {showTooltip === "min" && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-20"
              style={{ left: `${minPercentage}%`, top: "-8px" }}
            >
              {minAge}岁 ({getYearFromAge(minAge)}年)
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800" />
            </div>
          )}

          {/* 最大值气泡提示 */}
          {showTooltip === "max" && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap pointer-events-none z-20"
              style={{ left: `${maxPercentage}%`, top: "-8px" }}
            >
              {maxAge}岁 ({getYearFromAge(maxAge)}年)
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800" />
            </div>
          )}
        </div>

        <div className="flex justify-between text-sm text-gray-700 mt-3">
          <div className="text-center">
            <div className="font-medium">
              {editingField === "minAge" ? (
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputSubmit}
                  onKeyDown={handleInputKeyDown}
                  className="w-16 h-6 text-center text-sm p-1"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleFieldClick("minAge")}
                  className="hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
                >
                  {minAge}岁
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {editingField === "minYear" ? (
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputSubmit}
                  onKeyDown={handleInputKeyDown}
                  className="w-16 h-5 text-center text-xs p-1"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleFieldClick("minYear")}
                  className="hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
                >
                  {getYearFromAge(minAge)}年出生
                </button>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium">
              {editingField === "maxAge" ? (
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputSubmit}
                  onKeyDown={handleInputKeyDown}
                  className="w-16 h-6 text-center text-sm p-1"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleFieldClick("maxAge")}
                  className="hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
                >
                  {maxAge}岁
                </button>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {editingField === "maxYear" ? (
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleInputSubmit}
                  onKeyDown={handleInputKeyDown}
                  className="w-16 h-5 text-center text-xs p-1"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => handleFieldClick("maxYear")}
                  className="hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
                >
                  {getYearFromAge(maxAge)}年出生
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgeRangeSlider
