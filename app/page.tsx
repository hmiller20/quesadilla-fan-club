import HomePageWithModal from "./HomePageWithModal"
import { prisma } from "@/lib/db"

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true, trashedAt: null },
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true, teaser: true, slug: true, publishedAt: true },
    take: 3 // max three posts on home page
  })
  return <HomePageWithModal posts={posts} />
}
