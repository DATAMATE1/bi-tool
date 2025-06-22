"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Mail, TrendingUp, Users, DollarSign } from "lucide-react"

interface ReportsProps {
  data: any
  insights: any[]
}

export default function Reports({ data, insights }: ReportsProps) {
  const [fileData, setFileData] = useState(null)
  const [aiInsights, setAiInsights] = useState(insights)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, {type: 'array'})
      const sheetName = workbook.SheetNames[0]
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
      setFileData({ sales: json })
    }
    reader.readAsArrayBuffer(file)
  }

  const generateAiInsights = async () => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: fileData })
    })
    const result = await response.json()
    setAiInsights([...aiInsights, {
      id: Date.now(),
      title: "AI-Generated Insight",
      description: result.insights,
      recommendation: "Automated action based on trends",
      confidence: 90
    }])
  }

  const totalRevenue = fileData?.sales?.reduce((sum, item) => sum + item.revenue, 0) || 0
  const totalOrders = fileData?.sales?.reduce((sum, item) => sum + item.orders, 0) || 0
  const totalCustomers = fileData?.sales?.reduce((sum, item) => sum + item.customers, 0) || 0

  return (
    <div className="space-y-6">
      <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} />
      <Button onClick={generateAiInsights}>Get AI Insights</Button>

      <Card>
        <CardHeader>
          <CardTitle>Business Intelligence Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Customers</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Orders</div>
            </div>
          </div>

          <Separator />

          <div className="prose max-w-none">
            <p>
              This report provides a comprehensive analysis of business performance based on the uploaded data.
            </p>
          </div>
        </CardContent>
      </Card>

      {aiInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights & Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={insight.id} className="border-l-4 border-primary pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">
                    {index + 1}. {insight.title}
                  </h4>
                  <Badge variant="outline">{insight.confidence}% confidence</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                <div className="bg-muted p-2 rounded text-sm">