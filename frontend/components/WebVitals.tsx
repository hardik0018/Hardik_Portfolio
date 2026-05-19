'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // For testing and performance check, we log the metric to the console
    console.log(`[Web Vitals] ${metric.name}:`, metric)
  })

  return null
}
