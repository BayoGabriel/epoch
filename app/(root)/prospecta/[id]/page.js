// app/(root)/prospecta/[id]/page.jsx
"use client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, parseISO } from "date-fns"
import opp from "@/public/opp.svg"
import toast from "react-hot-toast"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

const OpportunityDetails = ({ params }) => {
  const { id } = params
  const { data: session } = useSession()
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userInteractions, setUserInteractions] = useState([])
  const [error, setError] = useState(null)

  // Fetch opportunity details and user interactions
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          console.log("Fetching opportunity with ID:", id)

          // Fetch opportunity details - FIXED: using the correct API endpoint format
          const oppResponse = await fetch(`/api/opportunities/${id}`)

          if (!oppResponse.ok) {
            const errorData = await oppResponse.json()
            throw new Error(errorData.message || "Failed to fetch opportunity details")
          }

          const oppData = await oppResponse.json()
          console.log("Opportunity data received:", oppData)
          setOpportunity(oppData)

          // Only fetch user interactions if user is logged in
          if (session?.user?.id) {
            const interactResponse = await fetch(
              `/api/opportunities/interact?userId=${session.user.id}&opportunityId=${id}`,
            )
            if (interactResponse.ok) {
              const interactData = await interactResponse.json()
              setUserInteractions(interactData)
            }
          }

          setLoading(false)
        } catch (error) {
          console.error("Error fetching data:", error)
          setError(error.message)
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [id, session])

  // Handle opportunity interaction (applied/tracking)
  const handleInteraction = async (status) => {
    if (!session) {
      toast.error("Please log in to interact with this opportunity")
      return
    }

    try {
      const response = await fetch("/api/opportunities/interact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId: id,
          userId: session.user.id,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // If it was a toggle-off operation
        if (data.message && data.message.includes("removed")) {
          setUserInteractions((prev) => prev.filter((inter) => inter.status !== status))
          toast.success(`Removed ${status} status`)
        } else {
          // Update local state for new/updated interaction
          setUserInteractions((prev) => {
            const filtered = prev.filter((inter) => inter.status !== status)
            return [...filtered, data]
          })
          toast.success(`Successfully marked as ${status}`)
        }
      } else {
        toast.error(data.message || `Failed to update ${status} status`)
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while processing your request")
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">Error: {error}</p>
        <Link href="/prospecta" className="bg-accent text-white py-2 px-6 rounded-md">
          Back to Opportunities
        </Link>
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
        <p>Opportunity not found.</p>
        <Link href="/prospecta" className="bg-accent text-white py-2 px-6 rounded-md">
          Back to Opportunities
        </Link>
      </div>
    )
  }

  const postedDate = parseISO(opportunity.dateCreated)
  const now = new Date()

  const weeksAgo = differenceInWeeks(now, postedDate)
  const daysAgo = differenceInDays(now, postedDate)
  const hoursAgo = differenceInHours(now, postedDate)
  const minutesAgo = differenceInMinutes(now, postedDate)

  let timeAgo = ""

  if (weeksAgo > 0) {
    timeAgo = `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`
  } else if (daysAgo > 0) {
    timeAgo = `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`
  } else if (hoursAgo > 0) {
    timeAgo = `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`
  } else if (minutesAgo > 0) {
    timeAgo = `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`
  } else {
    timeAgo = "Just now"
  }

  // Check if user has already applied or is tracking
  const isApplied = userInteractions && userInteractions.some((interaction) => interaction.status === "applied")
  const isTracking = userInteractions && userInteractions.some((interaction) => interaction.status === "tracking")

  return (
    <>
      <div className="w-full mt-[83px] max-lg:mt-[70px] flex items-center justify-center">
        <div className="w-full bg-white lg:p-[120px] p-2 md:p-10 shadow-lg flex items-center justify-between">
          <div className="flex flex-col gap-5">
            <Image
              src={opportunity.imageUrl || opp}
              alt={opportunity.title || opportunity.institution}
              width={200}
              height={200}
              className="rounded-lg object-cover mb-4"
            />
            <h1 className="h2 text-black">{opportunity.institution}</h1>
            <h3 className="h3 capitalize text-[#403D39CC]">{opportunity.type}</h3>
            <div className="flex max-md:flex-col gap-4 md:items-center">
              <span className="text-white py-[6px] px-[15px] rounded-[8px] shadow-sm bg-accent">Posted {timeAgo}</span>

              {/* Interaction Buttons - Only show if logged in */}
              {session ? (
                <>
                  <button
                    onClick={() => handleInteraction("applied")}
                    className={`py-2 px-4 rounded-md ${
                      isApplied ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-green-100"
                    }`}
                  >
                    {isApplied ? "Applied ✓" : "Mark as Applied"}
                  </button>

                  <button
                    onClick={() => handleInteraction("tracking")}
                    className={`py-2 px-4 rounded-md ${
                      isTracking ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    {isTracking ? "Tracking ✓" : "Track Opportunity"}
                  </button>
                </>
              ) : (
                <Link href="/" className="py-2 px-4 rounded-md bg-accent text-white">
                  Login to interact
                </Link>
              )}
            </div>

            {/* Add description and other details */}
            <div className="mt-8">
              <h4 className="h4 mb-2">Description</h4>
              <div
                className="prose prose-lg text-gray-700"
                dangerouslySetInnerHTML={{ __html: opportunity.description }}
              />
            </div>

            <div className="mt-4">
              <h4 className="h4 mb-2">Position</h4>
              <p className="text-gray-700">{opportunity.position}</p>
            </div>

            <div className="py-4">
              <Link
                href={opportunity.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-white py-2 px-6 rounded-md hover:bg-opacity-90"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OpportunityDetails
