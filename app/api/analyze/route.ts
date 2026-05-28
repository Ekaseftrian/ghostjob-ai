import { GoogleGenAI, Type, Schema } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'API key is missing. Configure GEMINI_API_KEY in the environment.' }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      job_title: { type: Type.STRING },
      company_name: { type: Type.STRING },
      scam_probability: { type: Type.INTEGER, description: 'Probability score from 0 to 100.' },
      risk_level: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
      trust_score: { type: Type.INTEGER, description: 'Trust score from 0 to 100.' },
      analysis_confidence: { type: Type.INTEGER, description: 'Confidence in analysis from 0 to 100.' },
      threat_classification: { type: Type.STRING },
      summary: { type: Type.STRING },
      red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
      positive_signals: { type: Type.ARRAY, items: { type: Type.STRING } },
      manipulation_tactics: { type: Type.ARRAY, items: { type: Type.STRING } },
      transparency_analysis: { type: Type.STRING },
      salary_realism: { type: Type.STRING },
      recommended_action: { type: Type.STRING },
      heatmap: {
        type: Type.OBJECT,
        properties: {
          urgency: { type: Type.INTEGER, description: 'Score 0-100 indicating time pressure or artificial urgency.' },
          greed_bait: { type: Type.INTEGER, description: 'Score 0-100 indicating unrealistic compensation or promises.' },
          authority_pressure: { type: Type.INTEGER, description: 'Score 0-100 indicating attempts to enforce compliance/submission.' },
          transparency_risk: { type: Type.INTEGER, description: 'Score 0-100 indicating missing/obfuscated company details.' }
        },
        required: ['urgency', 'greed_bait', 'authority_pressure', 'transparency_risk']
      }
    },
    required: [
      'job_title', 'company_name', 'scam_probability', 'risk_level',
      'trust_score', 'analysis_confidence', 'threat_classification', 'summary',
      'red_flags', 'positive_signals', 'manipulation_tactics',
      'transparency_analysis', 'salary_realism', 'recommended_action', 'heatmap'
    ]
  };

  try {
    const { jobPosting, imageBase64, language } = await req.json();

    if (!jobPosting && !imageBase64) {
      return NextResponse.json({ error: 'Input text, link, or image is required.' }, { status: 400 });
    }

    const langInstruction = language === 'id' ? 'Provide the analysis and all output strings in Indonesian language.' : 'Provide the analysis and all output strings in English language.';

    const promptText = `You are GhostJob AI, an advanced AI-powered recruitment threat intelligence system.

Your purpose is to analyze job postings, recruiter messages, URLs, screenshots, and hiring-related content to identify:
- recruitment scams
- fake companies
- exploitative work conditions
- suspicious hiring behavior
- identity harvesting attempts
- unrealistic salaries or requirements
- psychological manipulation tactics

Analyze the provided content carefully and objectively. 
If analyzing an image/screenshot, extract the text and visual context first.
If analyzing a URL/Link string, deduce if the domain name or URL structure looks like legitimate company hostnames or if it uses suspicious phishing patterns.

${langInstruction}

Return ONLY valid JSON.

Do not use markdown.
Do not wrap the response in triple backticks.
Do not include explanations outside the JSON.
Do not hallucinate missing information.

Use this exact JSON structure:

{
  "job_title": "",
  "company_name": "",
  "scam_probability": 0,
  "risk_level": "",
  "trust_score": 0,
  "analysis_confidence": 0,
  "threat_classification": "",
  "summary": "",
  "red_flags": [],
  "positive_signals": [],
  "manipulation_tactics": [],
  "transparency_analysis": "",
  "salary_realism": "",
  "recommended_action": "",
  "heatmap": {
    "urgency": 0,
    "greed_bait": 0,
    "authority_pressure": 0,
    "transparency_risk": 0
  }
}

Rules:
- scam_probability must be between 0 and 100
- trust_score must be between 0 and 100
- analysis_confidence must be between 0 and 100
- heatmap values must be between 0 and 100
- risk_level must be one of:
  "Low", "Medium", "High", "Critical"

Possible threat classifications include:
- Advance-Fee Scam
- Fake Recruiter Scam
- Identity Harvesting
- MLM Recruitment
- Pyramid Recruitment
- Data Collection Scam
- Suspicious Recruitment Activity
- Likely Legitimate

Behavior Guidelines:
- Be concise and professional
- Use cybersecurity-style threat analysis language
- Focus on protecting job seekers
- Clearly mention uncertainty if evidence is limited
- Avoid sensationalism
- Provide realistic and actionable recommendations

Job Posting Text / URL Input:
"""
${jobPosting || "No text provided. Analyze the image."}
"""`;

    // Process part data depending on whether there's an image
    const requestParts: any[] = [
      { text: promptText }
    ];

    if (imageBase64) {
      // Split "data:image/jpeg;base64,...""
      const parts = imageBase64.split(';');
      const mimeType = parts[0].split(':')[1];
      const data = parts[1].split(',')[1];
      
      requestParts.push({
        inlineData: {
          data,
          mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: requestParts,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.1, // Strict, analytical tone
      }
    });

    if (response.text) {
      return NextResponse.json(JSON.parse(response.text));
    } else {
      throw new Error('Analysis returned no output.');
    }

  } catch (error: any) {
    console.error('GhostJob Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze posting.' }, { status: 500 });
  }
}
