import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_MESSAGE = `You are EduBot, a friendly, professional, and helpful Customer Support Assistant for our institute. Your primary goal is to provide accurate, clear, and student-friendly responses while maintaining a warm and welcoming tone.

### Personality & Tone
- Be friendly, polite, and approachable.
- Communicate in simple, easy-to-understand language.
- Sound supportive and patient, especially when answering student and parent queries.
- Use positive and encouraging language.
- Show empathy when users are confused or facing issues.

### Response Guidelines
- Greet users warmly and acknowledge their questions.
- Provide concise and accurate answers based on the available knowledge base and database.
- Explain fees, admissions, courses, eligibility, placements, scholarships, and institute policies in a clear manner.
- When presenting numbers or fees, use tables or bullet points whenever possible.
- Ask follow-up questions if additional information is required.
- You MUST communicate fluently in the language the user speaks. Detect their language and respond accordingly.

### Customer Experience
- Prioritize Fast Support, Smart Automation, Omnichannel Service, AI Insights, and Higher Customer Satisfaction.
- Offer step-by-step guidance whenever appropriate.
- Thank users for their questions and invite them to ask additional questions.

### Escalation Rules
- Never guess or create information.
- If information is unavailable, outside your scope, or not found in the database, politely inform the user and immediately direct them to the institute's official email, phone number, or support team.
- For complex issues requiring human intervention, create a support ticket and provide escalation instructions.

### Prohibited Behaviors
- Do not provide misleading, speculative, or unverified information.
- Do not use rude, robotic, overly technical, or negative language.
- Do not discuss topics unrelated to the institute's services.

### Tools Available
You have tools to fetch LIVE data from the database. Use them whenever asked about:
- Fees (getFeeStructure)
- Student Statistics / Batch Enrollment (getBatchStatistics)
- Course Comparison (compareCourses)
- Counselor Handoff / Complaints (createSupportTicket)

### Suggestions Requirement
At the end of EVERY response, suggest 2-3 short follow-up questions the user can ask. Format them EXACTLY like this on new lines at the very end of your message:
[SUGGESTION] Question 1?
[SUGGESTION] Question 2?`;

// --- DB Tool Functions ---

async function getFeeStructure(courseCode: string) {
  const course = await prisma.course.findUnique({
    where: { code: courseCode },
    include: { feeStructures: { orderBy: { academicYear: 'desc' }, take: 1 } },
  });
  if (!course || course.feeStructures.length === 0) return JSON.stringify({ error: `Fee structure not found for ${courseCode}` });
  return JSON.stringify(course.feeStructures[0]);
}

async function getBatchStatistics(courseCode: string, startYear: number) {
  const batch = await prisma.batch.findFirst({
    where: { course: { code: courseCode }, startYear },
    include: { statistic: true },
  });
  if (!batch || !batch.statistic) return JSON.stringify({ error: `Statistics not found for ${courseCode} batch ${startYear}` });
  return JSON.stringify(batch.statistic);
}

async function compareCourses(courseCodes: string[]) {
  const courses = await prisma.course.findMany({
    where: { code: { in: courseCodes } },
    include: { feeStructures: { orderBy: { academicYear: 'desc' }, take: 1 } },
  });
  return JSON.stringify(courses);
}

async function createSupportTicket(title: string, description: string, userEmail?: string, sessionId?: string) {
  let userId = null;
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user) userId = user.id;
  }
  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      category: 'Handoff',
      userId,
      sessionId,
    },
  });
  return JSON.stringify({ success: true, ticketNumber: ticket.ticketNumber, message: "A counselor will review this ticket." });
}

// --- Groq Tool Definitions ---

const tools: Groq.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getFeeStructure',
      description: 'Get the latest fee structure (admission, tuition, total) for a specific course.',
      parameters: {
        type: 'object',
        properties: { courseCode: { type: 'string', description: 'e.g., BCA, BSc, MCA, BTech' } },
        required: ['courseCode'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getBatchStatistics',
      description: 'Get enrollment and graduation statistics for a specific course batch.',
      parameters: {
        type: 'object',
        properties: {
          courseCode: { type: 'string' },
          startYear: { type: 'integer', description: 'The starting year of the batch, e.g., 2024' },
        },
        required: ['courseCode', 'startYear'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compareCourses',
      description: 'Compare multiple courses and their fees.',
      parameters: {
        type: 'object',
        properties: { courseCodes: { type: 'array', items: { type: 'string' }, description: 'Array of course codes like ["BCA", "BTech"]' } },
        required: ['courseCodes'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'createSupportTicket',
      description: 'Create a support ticket for a user when they request a human counselor, have a complaint, or a technical issue.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          userEmail: { type: 'string' },
        },
        required: ['title', 'description'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'queryAuditLogs',
      description: 'Query the database audit logs to see exactly who changed what data, when, and why. Use this to investigate modifications to records.',
      parameters: {
        type: 'object',
        properties: {
          tableName: { type: 'string', description: 'e.g., Student, Course, FeeStructure, Application' },
          actionType: { type: 'string', description: 'e.g., INSERT, UPDATE, DELETE' },
          limit: { type: 'integer', description: 'Max number of logs to return (default 5)' }
        },
      },
    },
  },
];

async function queryAuditLogs(tableName?: string, actionType?: string, limit: number = 5) {
  const where: any = {};
  if (tableName) where.tableName = tableName;
  if (actionType) where.actionType = actionType;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { name: true, email: true, role: true } } }
  });

  if (logs.length === 0) return JSON.stringify({ message: "No audit logs found matching criteria." });
  return JSON.stringify(logs);
}

async function generateResponse(message: string, sessionId: string): Promise<{ text: string, suggestions: string[] }> {
  // 1. Fetch persistent conversation
  let conversation = await prisma.conversation.findFirst({
    where: { sessionId },
    include: { messages: { orderBy: { timestamp: 'asc' }, take: 10 } },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { sessionId },
      include: { messages: true },
    });
  }

  // 2. Build Groq messages array
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_MESSAGE },
  ];
  for (const msg of conversation.messages) {
    messages.push({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content });
  }
  messages.push({ role: 'user', content: message });

  // 3. Save User Message
  await prisma.message.create({
    data: { conversationId: conversation.id, sender: 'user', content: message },
  });

  // 4. Call Groq
  let response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    tools,
    tool_choice: 'auto',
    temperature: 0.7,
  });

  let responseMessage = response.choices[0]?.message;

  // 5. Handle Tool Calling Loop
  while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
    messages.push(responseMessage); // Add assistant's tool call request to messages

    for (const toolCall of responseMessage.tool_calls) {
      const args = JSON.parse(toolCall.function.arguments || '{}');
      let toolResult = '';

      try {
        if (toolCall.function.name === 'getFeeStructure') {
          toolResult = await getFeeStructure(args.courseCode);
        } else if (toolCall.function.name === 'getBatchStatistics') {
          toolResult = await getBatchStatistics(args.courseCode, args.startYear);
        } else if (toolCall.function.name === 'compareCourses') {
          toolResult = await compareCourses(args.courseCodes);
        } else if (toolCall.function.name === 'createSupportTicket') {
          toolResult = await createSupportTicket(args.title, args.description, args.userEmail, sessionId);
        } else if (toolCall.function.name === 'queryAuditLogs') {
          toolResult = await queryAuditLogs(args.tableName, args.actionType, args.limit);
        }
      } catch (e: any) {
        toolResult = JSON.stringify({ error: e.message });
      }

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        name: toolCall.function.name,
        content: toolResult,
      });
    }

    // Call Groq again with tool results
    response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      tools,
      temperature: 0.7,
    });
    responseMessage = response.choices[0]?.message;
  }

  // 6. Extract final text and suggestions
  const fullText = responseMessage?.content?.trim() || "I'm having trouble connecting right now.";
  
  const suggestions: string[] = [];
  const textLines = fullText.split('\n');
  const cleanText = textLines.filter(line => {
    if (line.startsWith('[SUGGESTION]')) {
      suggestions.push(line.replace('[SUGGESTION]', '').trim());
      return false;
    }
    return true;
  }).join('\n').trim();

  // 7. Save Assistant Message
  await prisma.message.create({
    data: { conversationId: conversation.id, sender: 'bot', content: cleanText },
  });

  return { text: cleanText, suggestions };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { message, sessionId, action } = req.body || {};

    if (action === 'reset') {
      if (sessionId) {
        await prisma.conversation.deleteMany({ where: { sessionId } });
      }
      return res.json({ status: 'ok' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const id = sessionId || 'default-session';

    try {
      const { text, suggestions } = await generateResponse(message, id);
      return res.json({ sender: 'bot', content: text, suggestions });
    } catch (error) {
      console.error('Chat handler error:', error);
      return res.status(500).json({ error: 'Something went wrong on our end.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
