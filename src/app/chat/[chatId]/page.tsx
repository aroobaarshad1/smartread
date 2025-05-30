import { Suspense } from "react"
import ChatPageContent from "./ChatPageContent"
import { getChatsData } from "./chatUtils"
import { Slab } from "react-loading-indicators"

// ✅ Corrected type: params is a Promise
type PageProps = {
  params: Promise<{ chatId: string }>
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params }: PageProps) {
  const { chatId } = await params // ✅ Await the params promise

  // Server-side data fetching with error handling
  let chatsData
  try {
    chatsData = await getChatsData(chatId)
  } catch (error) {
    console.error("Failed to load chat data:", error)
    return <div className="h-screen grid place-items-center">Error loading chat</div>
  }

  return (
    <div className="h-screen overflow-hidden">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Slab color="#32cd32" size="medium" text="" textColor="" />
          </div>
        }
      >
        <ChatPageContent chatId={chatId} initialChatsData={chatsData} />
      </Suspense>
    </div>
  )
}

// Optional: Add these if you need dynamic rendering
export const dynamic = "force-dynamic"
export const revalidate = 0