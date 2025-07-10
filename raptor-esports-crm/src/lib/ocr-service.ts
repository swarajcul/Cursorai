import { createWorker, PSM } from 'tesseract.js'

export interface ParsedPerformanceData {
  player_name: string
  kills: string
  assists: string
  damage: string
  survival_time: string
}

export interface OCRResult {
  text: string
  confidence: number
}

export class OCRService {
  private static worker: any = null

  static async getWorker() {
    if (!this.worker) {
      this.worker = await createWorker()
      
      await this.worker.loadLanguage('eng')
      await this.worker.initialize('eng')
      await this.worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO
      })
    }
    return this.worker
  }

  static async extractTextFromImage(
    imageFile: File, 
    onProgress?: (progress: number) => void
  ): Promise<OCRResult> {
    try {
      const worker = await this.getWorker()
      
      const result = await worker.recognize(imageFile, {
        progress: (p: any) => {
          if (onProgress) {
            onProgress(p.progress * 100)
          }
        }
      })

      return {
        text: result.data.text,
        confidence: result.data.confidence
      }
    } catch (error) {
      console.error('OCR extraction error:', error)
      throw new Error('Failed to extract text from image')
    }
  }

  static parsePerformanceData(text: string): ParsedPerformanceData[] {
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    const results: ParsedPerformanceData[] = []

    // Multiple parsing strategies for different screenshot formats
    const patterns = {
      // Full line: "PlayerName 15 5 2500 8.5"
      fullLinePattern: /([A-Za-z][A-Za-z0-9_]{2,15})\s*[|\s]+(\d+)\s*[|\s]+(\d+)\s*[|\s]+(\d+)\s*[|\s]+(\d+\.?\d*)/g,
      
      // Separate lines: Player name followed by stats
      playerNamePattern: /^[A-Za-z][A-Za-z0-9_]{2,15}$/,
      numbersPattern: /(\d+)\s+(\d+)\s+(\d+)\s+(\d+\.?\d*)/,
      
      // Fallback: Extract all numbers and group by 4
      allNumbers: /\d+\.?\d*/g
    }

    // Strategy 1: Full line pattern
    const fullLineMatches = [...text.matchAll(patterns.fullLinePattern)]
    if (fullLineMatches.length > 0) {
      for (const match of fullLineMatches) {
        results.push({
          player_name: match[1],
          kills: match[2],
          assists: match[3],
          damage: match[4],
          survival_time: match[5]
        })
      }
      return results
    }

    // Strategy 2: Separate player names and stats
    let currentPlayer = ''
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (patterns.playerNamePattern.test(trimmedLine)) {
        currentPlayer = trimmedLine
      } else {
        const numbersMatch = trimmedLine.match(patterns.numbersPattern)
        if (numbersMatch && currentPlayer) {
          results.push({
            player_name: currentPlayer,
            kills: numbersMatch[1],
            assists: numbersMatch[2],
            damage: numbersMatch[3],
            survival_time: numbersMatch[4]
          })
          currentPlayer = ''
        }
      }
    }

    if (results.length > 0) {
      return results
    }

    // Strategy 3: Fallback - extract all numbers and group by 4
    const allNumbers = text.match(patterns.allNumbers)
    if (allNumbers && allNumbers.length >= 4) {
      const chunks = []
      for (let i = 0; i < allNumbers.length; i += 4) {
        chunks.push(allNumbers.slice(i, i + 4))
      }

      chunks.forEach((chunk, index) => {
        if (chunk.length === 4) {
          results.push({
            player_name: `Player${index + 1}`,
            kills: chunk[0],
            assists: chunk[1],
            damage: chunk[2],
            survival_time: chunk[3]
          })
        }
      })
    }

    return results
  }

  static async processScreenshot(
    file: File, 
    onProgress?: (progress: number) => void
  ): Promise<ParsedPerformanceData[]> {
    try {
      const ocrResult = await this.extractTextFromImage(file, onProgress)
      const parsedData = this.parsePerformanceData(ocrResult.text)
      
      console.log('OCR Text:', ocrResult.text)
      console.log('Parsed Data:', parsedData)
      
      return parsedData
    } catch (error) {
      console.error('OCR processing error:', error)
      throw error
    }
  }

  static async terminate() {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}