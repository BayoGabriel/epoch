
"use client"

import { useState } from "react"
import { toast } from "react-hot-toast" // Assuming you're using react-hot-toast for notifications

export default function NewsletterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://api.sender.net/v2/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SENDER_API_KEY}`,
        },
        body: JSON.stringify({
          email: formData.email,
          groups: ["erXrJB"],
          fields: {
            name: `${formData.firstName} ${formData.lastName}`,
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("You have been added to the newsletter!")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
        })
      } else {
        const errorMessage = data.message || data.error || JSON.stringify(data)
        toast.error(`Failed to submit: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(`An error occurred: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center w-full px-4 py-8 mt-[140px]">
      <div className="w-full max-w-[600px] text-center">
        <h1 className="h2 mb-6 md:text-[48px] sm:after:content-[' Africa'] md:after:content-['']">
          Subscribe to Epoch Newsletter
        </h1>
        <p className="text-base text-black mb-8 leading-relaxed px-4 sm:text-[] text-[17px]">
          Explore internships, scholarships, and more to gain experience, build your network, and accelerate your career
          journey.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col md:flex-row gap-8 mb-4">
            <div className="flex flex-col text-left mb-4 w-full">
              <label htmlFor="firstName" className="h4 mb-2">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
                className="p-3 border border-gray-300 rounded text-base w-full"
              />
            </div>

            <div className="flex flex-col text-left mb-4 w-full">
              <label htmlFor="lastName" className="h4 mb-2">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
                className="p-3 border border-gray-300 rounded text-base w-full"
              />
            </div>
          </div>

          <div className="flex flex-col text-left mb-4 w-full">
            <label htmlFor="email" className="h4 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
              className="p-3 border border-gray-300 rounded text-base w-full"
            />
          </div>

          <button
            type="submit"
            className={`bg-[#e86a33] text-white border-none rounded-[8px] px-8 py-3 text-base font-medium cursor-pointer transition-colors mt-2 hover:bg-[#d55a27] ${
              isSubmitting ? "bg-opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  )
}
