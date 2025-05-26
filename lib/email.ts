import { Resend } from 'resend'
import { NewPostEmail } from './email-templates'
import { renderAsync } from '@react-email/render'
import type { Subscriber } from '@/lib/generated/prisma'
import { prisma } from './db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNewPostEmail(postId: string) {
  try {
    // Fetch the post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        teaser: true,
        slug: true,
        isPublished: true,
      },
    })

    if (!post) {
      throw new Error('Post not found')
    }

    if (!post.isPublished) {
      throw new Error('Cannot send email for unpublished post')
    }

    // Fetch all confirmed subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: {
        isConfirmed: true,
      },
      select: {
        email: true,
        firstName: true,
        confirmToken: true,
      },
    })

    if (subscribers.length === 0) {
      console.log('No confirmed subscribers to send emails to')
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const postUrl = `${baseUrl}/posts/${post.slug}`
    const unsubscribeUrl = (token: string) => `${baseUrl}/api/unsubscribe?token=${token}`

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber: Pick<Subscriber, 'email' | 'firstName' | 'confirmToken'>) => {
      if (!subscriber.confirmToken) {
        console.warn(`Subscriber ${subscriber.email} has no confirm token, skipping email`)
        return
      }

      const emailHtml = await renderAsync(
        NewPostEmail({
          firstName: subscriber.firstName,
          postTitle: post.title,
          postTeaser: post.teaser || undefined,
          postUrl,
          unsubscribeUrl: unsubscribeUrl(subscriber.confirmToken),
        })
      )

      return resend.emails.send({
        from: 'Quesadilla Fan Club <noreply@quesadillafanclub.com>',
        to: subscriber.email,
        subject: `New Post: ${post.title}`,
        html: emailHtml,
      })
    })

    const results = await Promise.allSettled(emailPromises)
    
    // Log results
    const successful = results.filter((r: PromiseSettledResult<unknown>) => r.status === 'fulfilled').length
    const failed = results.filter((r: PromiseSettledResult<unknown>) => r.status === 'rejected').length
    
    console.log(`Email sending complete: ${successful} successful, ${failed} failed`)
    
    if (failed > 0) {
      console.error('Some emails failed to send:', results
        .filter((r: PromiseSettledResult<unknown>) => r.status === 'rejected')
        .map((r: PromiseRejectedResult) => r.reason))
    }
  } catch (error) {
    console.error('Error sending new post emails:', error)
    throw error
  }
}
