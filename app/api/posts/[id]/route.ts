// this file updates a post, including the initial publishing (?)

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { title, teaser, content, isPublished } = await request.json()
    const resolvedParams = await context.params

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
        updatedAt: new Date(),
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        ...(isPublished ? { publishedAt: new Date() } : {}),
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
} 