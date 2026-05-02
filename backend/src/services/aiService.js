'use strict';

const DENTAL_SYSTEM_PROMPT = `You are DentalAI, an expert dental health assistant for VinaMec Dental Care System.
You provide accurate, helpful, and empathetic responses about dental health, treatments, prevention, and care.
Always recommend professional consultation for diagnosis.
Be concise, friendly, and professional.
If asked about medications or treatments, always note that a licensed dentist must confirm.
Language: respond in the same language the user writes in (English or Vietnamese).`;

const PRIVATE_SYSTEM_PROMPT = `You are DentalAI, a private clinical assistant for VinaMec Dental Care System.
You have access to the patient's context and medical history.
Provide personalized dental health advice based on the patient's profile.
For doctors: provide clinical insights, treatment suggestions, and evidence-based recommendations.
For patients: provide personalized guidance based on their dental history and scores.
Always maintain medical confidentiality and professionalism.`;

/**
 * Try to use OpenAI if API key is provided, otherwise use rule-based fallback
 */
const callAI = async (messages, systemPrompt) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const https = require('https');
      const payload = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 512,
        temperature: 0.7,
      });

      return await new Promise((resolve, reject) => {
        const req = https.request(
          {
            hostname: 'api.openai.com',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
              'Content-Length': Buffer.byteLength(payload),
            },
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) return reject(new Error(parsed.error.message));
                resolve(parsed.choices[0].message.content.trim());
              } catch (e) {
                reject(e);
              }
            });
          }
        );
        req.on('error', reject);
        req.write(payload);
        req.end();
      });
    } catch (err) {
      console.warn('OpenAI API error, falling back to rule-based:', err.message);
    }
  }

  // Fallback rule-based AI
  return ruleBasedResponse(messages[messages.length - 1]?.content || '');
};

const DENTAL_FAQ = [
  {
    keywords: ['toothache', 'đau răng', 'pain', 'đau'],
    answer: 'Toothaches can be caused by cavities, gum disease, or a cracked tooth. Rinse with warm salt water and take OTC pain relievers temporarily. Schedule a dental appointment as soon as possible for proper diagnosis and treatment.',
  },
  {
    keywords: ['brush', 'đánh răng', 'brushing', 'toothbrush'],
    answer: 'You should brush your teeth at least twice daily (morning and before bed) for 2 minutes each time using fluoride toothpaste. Use a soft-bristled toothbrush and replace it every 3 months.',
  },
  {
    keywords: ['floss', 'flossing', 'chỉ nha khoa'],
    answer: 'Floss at least once daily to remove plaque and food particles between teeth where your toothbrush can\'t reach. This helps prevent gum disease and cavities between teeth.',
  },
  {
    keywords: ['whitening', 'white', 'tẩy trắng', 'trắng răng'],
    answer: 'Teeth whitening options include professional in-office treatments, take-home trays prescribed by your dentist, or over-the-counter products. Professional whitening is safest and most effective.',
  },
  {
    keywords: ['cavity', 'cavities', 'sâu răng', 'decay', 'filling', 'trám'],
    answer: 'Cavities are permanently damaged areas in teeth that form holes. Treatment involves removing decayed tissue and filling the tooth. Prevention: brush twice daily, floss, limit sugary foods, and visit your dentist regularly.',
  },
  {
    keywords: ['gum', 'nướu', 'gingivitis', 'periodontitis', 'bleeding'],
    answer: 'Gum disease ranges from gingivitis (mild) to periodontitis (severe). Signs include bleeding, swelling, or receding gums. Treatment includes professional cleaning, improved home care, and in severe cases, surgical intervention.',
  },
  {
    keywords: ['appointment', 'book', 'schedule', 'đặt lịch', 'hẹn'],
    answer: 'You can book an appointment through the VinaMec portal. Go to Appointments → Book Appointment and select your preferred doctor, service, date and time.',
  },
  {
    keywords: ['x-ray', 'xray', 'xquang', 'x ray', 'scan'],
    answer: 'Dental X-rays help detect problems not visible during examination, like cavities between teeth, bone loss, or impacted teeth. They are safe with minimal radiation exposure.',
  },
  {
    keywords: ['children', 'kid', 'baby', 'trẻ em', 'infant'],
    answer: 'Children\'s first dental visit should be by age 1 or when their first tooth appears. Pediatric dental care is crucial for developing healthy habits. We recommend check-ups every 6 months.',
  },
  {
    keywords: ['cost', 'price', 'fee', 'giá', 'chi phí', 'bao nhiêu'],
    answer: 'Service prices vary depending on the treatment. Please check our Services page in the portal or contact our reception team for a detailed price list and insurance coverage information.',
  },
];

function ruleBasedResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  for (const faq of DENTAL_FAQ) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq.answer;
    }
  }

  // Generic fallback
  return `Thank you for your question about "${userMessage}". As your dental AI assistant, I recommend consulting with one of our qualified dentists for personalized advice. You can book an appointment through the VinaMec portal. Is there anything specific about dental health I can help you with?`;
}

/**
 * Public chatbot – no user context
 */
const publicChat = async (message, conversationHistory = []) => {
  const messages = [
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];
  const reply = await callAI(messages, DENTAL_SYSTEM_PROMPT);
  return reply;
};

/**
 * Private chatbot – with user/patient context
 */
const privateChat = async (message, conversationHistory = [], userContext = {}) => {
  const contextStr = buildContextString(userContext);
  const systemWithContext = PRIVATE_SYSTEM_PROMPT + (contextStr ? `\n\nPatient Context:\n${contextStr}` : '');

  const messages = [
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const reply = await callAI(messages, systemWithContext);
  return reply;
};

function buildContextString(context) {
  const parts = [];
  if (context.name) parts.push(`Patient Name: ${context.name}`);
  if (context.role) parts.push(`User Role: ${context.role}`);
  if (context.dentalScore) parts.push(`Dental Score: ${JSON.stringify(context.dentalScore)}`);
  if (context.recentDiagnosis) parts.push(`Recent Diagnosis: ${context.recentDiagnosis}`);
  return parts.join('\n');
}

/**
 * Basic image prediction (mock – integrate real ML model here)
 */
const predictImage = async (imagePath, imageType) => {
  // In production, integrate with a real ML API (Google Vision, custom model, etc.)
  const findings = [];
  const conditions = [
    'Possible cavity detected in upper molar region',
    'Mild tartar buildup visible',
    'Gum recession noted in lower front teeth',
    'Enamel erosion pattern detected',
    'Tooth appears healthy – no significant issues',
    'Crown integrity appears intact',
  ];

  const count = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < count; i++) {
    findings.push(conditions[Math.floor(Math.random() * conditions.length)]);
  }

  return {
    processed: true,
    findings: [...new Set(findings)],
    confidence: Math.round((0.6 + Math.random() * 0.35) * 100) / 100,
    processedAt: new Date(),
    recommendation: 'Please consult your dentist for a professional evaluation of these findings.',
  };
};

module.exports = { publicChat, privateChat, predictImage };