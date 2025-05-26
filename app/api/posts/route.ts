import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("POST /api/posts body:", body)
    const { share, ...postData } = body // Extract share from body but don't store it
    const post = await prisma.post.create({
      data: {
        title: postData.title,
        teaser: postData.teaser || null,
        content: postData.content,
        isDraft: postData.isDraft ?? true,
        isPublished: postData.isPublished ?? false,
        authorId: postData.authorId, // TODO: Get this from the session
        slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }
    })

    // Handle share action if needed
    if (share && !postData.isDraft) {
      // TODO: Implement email sending logic here
      console.log('Share post with subscribers:', post.id)
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("POST /api/posts error:", error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
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

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const action = searchParams.get('action')
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    // Parse body if needed
    let body: { share?: boolean } = {}
    if (action === 'publish') {
      body = await request.json()
    }

    switch (action) {
      case 'publish': {
        const { share, ...updateData } = body // Extract share from body but don't store it
        const post = await prisma.post.update({
          where: { id },
          data: {
            isDraft: false,
            isPublished: true,
          }
        })

        // Handle share action if needed
        if (share) {
          // TODO: Implement email sending logic here
          console.log('Share post with subscribers:', post.id)
        }

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