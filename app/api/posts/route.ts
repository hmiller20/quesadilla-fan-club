import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const draftsOnly = searchParams.get('drafts') === 'true'
    const trashedOnly = searchParams.get('trashed') === 'true'
    const publishedOnly = searchParams.get('published') === 'true'

    const posts = await prisma.post.findMany({
      where: {
        isDraft: draftsOnly ? true : undefined,
        isPublished: publishedOnly ? true : undefined,
        trashedAt: trashedOnly ? { not: null } : undefined,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        teaser: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isDraft: true,
        isPublished: true,
        slug: true,
        publishedAt: true,
        trashedAt: true,
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("POST /api/posts body:", body)
    const post = await prisma.post.create({
      data: {
        title: body.title,
        teaser: body.teaser || null,
        content: body.content,
        isDraft: body.isDraft ?? true,
        isPublished: body.isPublished ?? false,
        authorId: body.authorId, // TODO: Get this from the session
        slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        share: body.share ?? false,
      }
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error("POST /api/posts error:", error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    if (action === 'delete') {
      // Permanently delete the post
      await prisma.post.delete({
        where: { id }
      })
    } else {
      // Regular delete moves to trash
      await prisma.post.update({
        where: { id },
        data: {
          trashedAt: new Date(),
          isPublished: false,
        }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/posts error:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Parse body if needed
    let body = {}
    if (action === 'publish') {
      body = await request.json()
    }

    switch (action) {
      case 'publish': {
        const post = await prisma.post.update({
          where: { id },
          data: {
            isDraft: false,
            isPublished: true,
            share: body.share ?? false,
          }
        })
        return NextResponse.json(post)
      }
      case 'trash': {
        const post = await prisma.post.update({
          where: { id },
          data: {
            trashedAt: new Date(),
            isPublished: false, // Unpublish when trashed
          }
        })
        return NextResponse.json(post)
      }
      case 'restore': {
        const post = await prisma.post.update({
          where: { id },
          data: {
            trashedAt: null,
            isPublished: true, // Restore to published state
          }
        })
        return NextResponse.json(post)
      }
      case 'share': {
        // Fetch post, send email to all subscribers
        // (Implement email logic here)
        return NextResponse.json({ success: true })
      }
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('PATCH /api/posts error:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
} 