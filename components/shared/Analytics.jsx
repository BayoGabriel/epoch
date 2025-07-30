// "use client"

// import { useEffect, useCallback } from "react"
// import { usePathname, useSearchParams } from "next/navigation"
// import { useSession } from "next-auth/react"

// export default function AnalyticsTracker() {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   const { data: session } = useSession()

//   // Track page views
//   const trackPageView = useCallback(
//     async (url) => {
//       try {
//         // Get the previous page from localStorage if available
//         const previousPage = localStorage.getItem("current_page") || null

//         const analyticsData = {
//           url,
//           event: "pageview",
//           sessionId: getSessionId(),
//           userId: session?.user?.id || null,
//           userAgent: navigator.userAgent,
//           timestamp: new Date().toISOString(),
//           metadata: {
//             previousPage,
//             referrer: document.referrer || null,
//             title: document.title,
//           },
//         }

//         // Store current page for next navigation
//         localStorage.setItem("current_page", url)

//         await fetch("/api/analytics/track", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(analyticsData),
//         })
//       } catch (error) {
//         console.error("Error tracking page view:", error)
//       }
//     },
//     [session],
//   )

//   // Generate or retrieve session ID
//   const getSessionId = () => {
//     let sessionId = localStorage.getItem("analytics_session_id")

//     if (!sessionId) {
//       sessionId = "session_" + Math.random().toString(36).substring(2, 15)
//       localStorage.setItem("analytics_session_id", sessionId)

//       // Set session expiry (24 hours)
//       const expiry = Date.now() + 24 * 60 * 60 * 1000
//       localStorage.setItem("analytics_session_expiry", expiry)
//     } else {
//       // Check if session has expired
//       const expiry = localStorage.getItem("analytics_session_expiry")
//       if (expiry && Number.parseInt(expiry) < Date.now()) {
//         // Create new session
//         sessionId = "session_" + Math.random().toString(36).substring(2, 15)
//         localStorage.setItem("analytics_session_id", sessionId)

//         const newExpiry = Date.now() + 24 * 60 * 60 * 1000
//         localStorage.setItem("analytics_session_expiry", newExpiry)
//       }
//     }

//     return sessionId
//   }

//   // Track opportunity interactions
//   const setupOpportunityTracking = useCallback(() => {
//     // Track opportunity views
//     if (pathname.includes("/opportunities/") && pathname.split("/").length > 2) {
//       const opportunityId = pathname.split("/").pop()

//       // Don't track if it's not a valid ID
//       if (opportunityId === "opportunities") return

//       trackOpportunityInteraction(opportunityId, "view")
//     }

//     // Set up event listeners for tracking and applying
//     document.addEventListener("click", (e) => {
//       // Find closest button that might be for tracking or applying
//       const button = e.target.closest("button")
//       if (!button) return

//       // Check if it's a tracking button
//       if (
//         button.dataset.track === "opportunity" ||
//         button.textContent.includes("Track") ||
//         button.textContent.includes("Tracking") ||
//         button.textContent.includes("Save") ||
//         button.textContent.includes("Bookmark")
//       ) {
//         const opportunityId = button.dataset.opportunityId || pathname.split("/").pop()
//         if (opportunityId) {
//           trackOpportunityInteraction(opportunityId, "track")
//         }
//       }

//       // Check if it's an apply button
//       if (
//         button.dataset.apply === "opportunity" ||
//         button.textContent.includes("Apply") ||
//         button.textContent.includes("Applied")
//       ) {
//         const opportunityId = button.dataset.opportunityId || pathname.split("/").pop()
//         if (opportunityId) {
//           trackOpportunityInteraction(opportunityId, "apply")
//         }
//       }
//     })

//     // Also track link clicks to apply
//     document.addEventListener("click", (e) => {
//       const link = e.target.closest("a")
//       if (!link) return

//       // Track apply clicks
//       if (link.dataset.apply === "opportunity" || link.textContent.includes("Apply") || link.href.includes("apply")) {
//         const opportunityId = link.dataset.opportunityId || pathname.split("/").pop()
//         if (opportunityId) {
//           trackOpportunityInteraction(opportunityId, "apply")
//         }
//       }

//       // Track opportunity card clicks
//       if (link.dataset.opportunity === "card" || link.closest("[data-opportunity='card']")) {
//         const opportunityId =
//           link.dataset.opportunityId ||
//           (link.closest("[data-opportunity='card']") && link.closest("[data-opportunity='card']").dataset.opportunityId)
//         if (opportunityId) {
//           trackOpportunityInteraction(opportunityId, "interact")
//         }
//       }
//     })
//   }, [pathname])

//   // Track opportunity interactions
//   const trackOpportunityInteraction = async (opportunityId, interactionType) => {
//     try {
//       const eventType =
//         interactionType === "view"
//           ? "opportunity_view"
//           : interactionType === "track"
//             ? "opportunity_track"
//             : interactionType === "apply"
//               ? "opportunity_apply"
//               : "opportunity_interact"

//       const analyticsData = {
//         url: pathname,
//         event: eventType,
//         sessionId: getSessionId(),
//         userId: session?.user?.id || null,
//         userAgent: navigator.userAgent,
//         metadata: {
//           opportunityId,
//           interactionType,
//           title: document.title,
//         },
//         timestamp: new Date().toISOString(),
//       }

//       await fetch("/api/analytics/track", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(analyticsData),
//       })
//     } catch (error) {
//       console.error("Error tracking opportunity interaction:", error)
//     }
//   }

//   // Track page views when route changes
//   useEffect(() => {
//     // Don't track if pathname is not available yet
//     if (!pathname) return

//     // Track the page view
//     const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
//     trackPageView(url)

//     // Set up opportunity tracking
//     setupOpportunityTracking()

//     // Track session start/end
//     window.addEventListener("beforeunload", () => {
//       // Track session end
//       fetch("/api/analytics/track", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           event: "session_end",
//           sessionId: getSessionId(),
//           userId: session?.user?.id || null,
//           timestamp: new Date().toISOString(),
//           metadata: {
//             sessionDuration: Date.now() - Number.parseInt(localStorage.getItem("session_start_time") || Date.now()),
//             url: pathname,
//           },
//         }),
//         // Use keepalive to ensure the request completes even if the page is unloading
//         keepalive: true,
//       }).catch((err) => console.error("Error tracking session end:", err))
//     })

//     // Track session start
//     if (!localStorage.getItem("session_start_time")) {
//       localStorage.setItem("session_start_time", Date.now().toString())

//       fetch("/api/analytics/track", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           event: "session_start",
//           sessionId: getSessionId(),
//           userId: session?.user?.id || null,
//           timestamp: new Date().toISOString(),
//           metadata: {
//             url: pathname,
//             referrer: document.referrer || null,
//           },
//         }),
//       }).catch((err) => console.error("Error tracking session start:", err))
//     }
//   }, [pathname, searchParams, trackPageView, setupOpportunityTracking, session])

//   // This component doesn't render anything
//   return null
// }
import React from 'react'

const Analytics = () => {
  return (
    <div>Analytics</div>
  )
}

export default Analytics