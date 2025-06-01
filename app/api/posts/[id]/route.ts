// this file updates a post, including the initial publishing (?)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendNewPostEmail } from "@/lib/email"

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { title, teaser, content, isPublished, shouldShare } = await request.json()
    const resolvedParams = await context.params

    // Get current time in UTC
    const now = new Date()
    // Adjust for local timezone
    const localNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))

    const updatedPost = await prisma.post.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        title,
        teaser: teaser || null,
        content,
        isPublished,
        isDraft: !isPublished,
        updatedAt: localNow,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        ...(isPublished ? { publishedAt: localNow } : {}),
      },
    })

    // If publishing and shouldShare is true, send emails to subscribers
    if (isPublished && shouldShare) {
      try {
        await sendNewPostEmail(updatedPost.id)
      } catch (error) {
        console.error('Error sending new post emails:', error)
        // Don't fail the update if email sending fails
      }
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
} 