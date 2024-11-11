import { framer } from "framer-plugin"
import { useState, useEffect } from "react"
import "./App.css"

// Create a store key for the partner ID
const STORE_KEY = "affiliate-link-generator-partner-id"

export function App() {
    const [remixLink, setRemixLink] = useState("")
    const [partnerId, setPartnerId] = useState("")
    const [generatedLink, setGeneratedLink] = useState("")
    const [copied, setCopied] = useState(false)

    // Load the stored partner ID when the plugin opens
    useEffect(() => {
        const loadStoredPartnerId = () => {
            try {
                const storedId = localStorage.getItem(STORE_KEY)
                if (storedId) {
                    setPartnerId(storedId)
                }
            } catch (error) {
                console.error("Failed to load partner ID:", error)
            }
        }
        
        loadStoredPartnerId()
    }, [])

    // Save the partner ID whenever it changes
    const handlePartnerIdChange = (newValue: string) => {
        setPartnerId(newValue)
        try {
            localStorage.setItem(STORE_KEY, newValue)
        } catch (error) {
            console.error("Failed to save partner ID:", error)
        }
    }

    const generateAffiliateLink = () => {
        if (!remixLink || !partnerId) {
            framer.notify("Please fill in both fields", { variant: "error" })
            return
        }

        try {
            const baseUrl = remixLink.split('&via=')[0]
            const cleanPartnerId = partnerId.trim().toLowerCase()
            const newLink = `${baseUrl}&via=${cleanPartnerId}`
            setGeneratedLink(newLink)
            framer.notify("Link generated successfully!", { variant: "success" })
        } catch (error) {
            framer.notify("Please enter a valid Framer project URL", { variant: "error" })
        }
    }

    const copyToClipboard = async () => {
        if (!generatedLink) return
        try {
            await navigator.clipboard.writeText(generatedLink)
            setCopied(true)
            framer.notify("Copied to clipboard!", { variant: "success" })
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            framer.notify("Failed to copy to clipboard", { variant: "error" })
        }
    }

    // Update theme detection
    useEffect(() => {
        const updateTheme = () => {
            // Check if we're in Framer's light mode
            const isLightMode = document.querySelector('html')?.classList.contains('framer-light')
            document.documentElement.setAttribute('data-theme', isLightMode ? 'light' : 'dark')
        }
        
        // Initial theme check
        updateTheme()

        // Create observer to watch for theme changes
        const observer = new MutationObserver(updateTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })

        return () => observer.disconnect()
    }, [])

    // Update the UI size effect
    useEffect(() => {
        framer.showUI({
            width: 340,
            height: generatedLink ? 575 : 525,
            position: "top right"
        })
    }, [generatedLink])

    return (
        <main>
            <div className="content">
                <div className="hero-section">
                    <div className="header">
                        <img 
                            src="/aff_logo.png" 
                            alt="Affiliate Logo" 
                            className="aff-logo"
                        />
                    </div>

                    <p className="description">
                        Generate your Framer affiliate link for template and project submissions to earn 50% commission from Framer.
                    </p>

                    <a 
                        href="https://buy.stripe.com/fZe18a0KHc0M4kU8wx"
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="coffee-button"
                    >
                        Buy us a coffee
                    </a>
                </div>

                <div className="input-section">
                    <div className="input-group">
                        <div className="partner-id-label">
                            <label>Remix Link</label>
                            <a 
                                href="https://www.framer.com/help/articles/how-to-create-a-remix-link/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-link"
                            >
                                How to create a remix link?
                            </a>
                        </div>
                        <input
                            type="text"
                            value={remixLink}
                            onChange={(e) => setRemixLink(e.target.value)}
                            placeholder="https://framer.com/projects/new?duplicate=..."
                        />
                    </div>

                    <div className="input-group">
                        <div className="partner-id-label">
                            <label>Your partner ID</label>
                            <a href="https://framer.com/partner" target="_blank" rel="noopener" className="text-link">
                                Don't have a partner ID?
                            </a>
                        </div>
                        <input 
                            type="text"
                            value={partnerId}
                            onChange={(e) => handlePartnerIdChange(e.target.value)}
                            placeholder="Your username"
                        />
                    </div>
                </div>

                <button className="generate-button" onClick={generateAffiliateLink}>
                    Generate Remix Link
                </button>

                {generatedLink && (
                    <div className="input-group">
                        <div className="copy-container">
                            <input type="text" value={generatedLink} readOnly />
                            <button className="copy-button" onClick={copyToClipboard}>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}

                <div className="footer">
                    Created by:{' '}
                    <a href="mailto:akinshaywai@gmail.com" className="footer-link">
                        Olabode Felix
                    </a>
                    {' & '}
                    <a href="mailto:danieladebimpe@gmail.com" className="footer-link">
                        Adebimpe Omolaso
                    </a>
                </div>
            </div>
        </main>
    )
}
