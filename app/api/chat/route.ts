import { NextRequest, NextResponse } from 'next/server';

import {
  getOpenAI,
  CHAT_SYSTEM_PROMPT,
} from '@/lib/openai';

import { IChatMessage } from '@/interfaces/interfaces';

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

function sanitizeMessages(
  input: unknown
): IChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null;
  }

  if (input.length > MAX_MESSAGES) {
    return null;
  }

  const messages: IChatMessage[] = [];

  for (const entry of input) {
    if (
      !entry ||
      (entry.role !== 'user' &&
        entry.role !== 'assistant') ||
      typeof entry.content !== 'string' ||
      entry.content.length === 0 ||
      entry.content.length > MAX_CONTENT_LENGTH
    ) {
      return null;
    }

    messages.push({
      role: entry.role,
      content: entry.content,
    });
  }

  return messages;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const messages = sanitizeMessages(
      body?.messages
    );

    if (!messages) {
      return NextResponse.json({
        status: 400,
        message:
          `messages is required: an array of 1-${MAX_MESSAGES} ` +
          `{ role: "user" | "assistant", content: string } entries, ` +
          `each content up to ${MAX_CONTENT_LENGTH} characters`,
      });
    }

    const completion =
      await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: CHAT_SYSTEM_PROMPT,
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      });

    const reply =
      completion.choices[0]?.message?.content ?? '';

    return NextResponse.json({
      status: 200,
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error(
      'Failed to get chat completion:',
      error
    );

    return NextResponse.json({
      status: 500,
      message:
        'Failed to get a reply from the assistant',
    });
  }
}