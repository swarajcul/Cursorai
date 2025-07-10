'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { MAPS } from '@/lib/utils'
import { OCRService, ParsedPerformanceData } from '@/lib/ocr-service'
import { Upload, Plus } from 'lucide-react'

export default function PerformancePage() {
  const [isManualEntry, setIsManualEntry] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)

  const [parsedData, setParsedData] = useState<ParsedPerformanceData[]>([])
  
  const { profile } = useAuth()
  const { toast } = useToast()

  // Manual entry form state
  const [formData, setFormData] = useState({
    matchNumber: '',
    slot: '',
    map: '',
    placement: '',
    kills: '',
    assists: '',
    damage: '',
    survivalTime: ''
  })

  const handleFileUpload = async (file: File) => {
    if (!file) return


    setIsLoading(true)
    setOcrProgress(0)

    try {
      const data = await OCRService.processScreenshot(file, (progress) => {
        setOcrProgress(progress)
      })

      setParsedData(data)
      toast({
        title: "OCR Processing Complete",
        description: `Extracted data for ${data.length} players`,
      })
    } catch (error) {
      console.error('OCR processing error:', error)
      toast({
        title: "OCR Processing Failed",
        description: "Failed to process the screenshot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.team_id) {
      toast({
        title: "Error",
        description: "You must be assigned to a team to add performance data.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('performances')
        .insert({
          team_id: profile.team_id,
          player_id: profile.id,
          match_number: parseInt(formData.matchNumber),
          slot: parseInt(formData.slot),
          map: formData.map,
          placement: formData.placement ? parseInt(formData.placement) : null,
          kills: parseInt(formData.kills) || 0,
          assists: parseInt(formData.assists) || 0,
          damage: parseFloat(formData.damage) || 0,
          survival_time: parseFloat(formData.survivalTime) || 0,
          added_by: profile.id
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Performance data added successfully!",
      })

      // Reset form
      setFormData({
        matchNumber: '',
        slot: '',
        map: '',
        placement: '',
        kills: '',
        assists: '',
        damage: '',
        survivalTime: ''
      })
    } catch (error) {
      console.error('Performance data error:', error)
      toast({
        title: "Error",
        description: "Failed to add performance data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOcrSubmit = async () => {
    if (!profile?.team_id || parsedData.length === 0) {
      toast({
        title: "Error",
        description: "No data to submit or you must be assigned to a team.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const performanceData = parsedData.map((data, index) => ({
        team_id: profile.team_id,
        player_id: profile.id, // This would need to be mapped to actual player IDs
        match_number: 1, // This would need to be set by user
        slot: index + 1,
        map: 'Ascent', // This would need to be set by user
        kills: parseInt(data.kills) || 0,
        assists: parseInt(data.assists) || 0,
        damage: parseFloat(data.damage) || 0,
        survival_time: parseFloat(data.survival_time) || 0,
        added_by: profile.id
      }))

      const { error } = await supabase
        .from('performances')
        .insert(performanceData)

      if (error) throw error

      toast({
        title: "Success",
        description: "OCR data added successfully!",
      })

      setParsedData([])

    } catch (error) {
      console.error('OCR data error:', error)
      toast({
        title: "Error",
        description: "Failed to add OCR data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Tracking</h1>
        <p className="text-muted-foreground">
          Add match performance data manually or using OCR
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          variant={isManualEntry ? "default" : "outline"}
          onClick={() => setIsManualEntry(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Manual Entry
        </Button>
        <Button
          variant={!isManualEntry ? "default" : "outline"}
          onClick={() => setIsManualEntry(false)}
        >
          <Upload className="h-4 w-4 mr-2" />
          OCR Upload
        </Button>
      </div>

      {isManualEntry ? (
        <Card>
          <CardHeader>
            <CardTitle>Manual Performance Entry</CardTitle>
            <CardDescription>
              Enter match performance data manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchNumber">Match Number</Label>
                  <Input
                    id="matchNumber"
                    type="number"
                    value={formData.matchNumber}
                    onChange={(e) => setFormData({ ...formData, matchNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slot">Slot</Label>
                  <Input
                    id="slot"
                    type="number"
                    value={formData.slot}
                    onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="map">Map</Label>
                  <Select value={formData.map} onValueChange={(value) => setFormData({ ...formData, map: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a map" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAPS.map((map) => (
                        <SelectItem key={map} value={map}>
                          {map}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placement">Placement (Optional)</Label>
                  <Input
                    id="placement"
                    type="number"
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kills">Kills</Label>
                  <Input
                    id="kills"
                    type="number"
                    value={formData.kills}
                    onChange={(e) => setFormData({ ...formData, kills: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assists">Assists</Label>
                  <Input
                    id="assists"
                    type="number"
                    value={formData.assists}
                    onChange={(e) => setFormData({ ...formData, assists: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="damage">Damage</Label>
                  <Input
                    id="damage"
                    type="number"
                    step="0.1"
                    value={formData.damage}
                    onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="survivalTime">Survival Time (minutes)</Label>
                  <Input
                    id="survivalTime"
                    type="number"
                    step="0.1"
                    value={formData.survivalTime}
                    onChange={(e) => setFormData({ ...formData, survivalTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Performance Data'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>OCR Performance Upload</CardTitle>
            <CardDescription>
              Upload a screenshot to automatically extract performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium">Upload Screenshot</p>
                  <p className="text-sm text-gray-500">Click to select or drag and drop</p>
                </label>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing OCR...</span>
                    <span>{Math.round(ocrProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {parsedData.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Extracted Data</h3>
                    <Button onClick={handleOcrSubmit} disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add to Database'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {parsedData.map((data, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Player:</span> {data.player_name}
                          </div>
                          <div>
                            <span className="font-medium">Kills:</span> {data.kills}
                          </div>
                          <div>
                            <span className="font-medium">Assists:</span> {data.assists}
                          </div>
                          <div>
                            <span className="font-medium">Damage:</span> {data.damage}
                          </div>
                          <div>
                            <span className="font-medium">Survival:</span> {data.survival_time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}