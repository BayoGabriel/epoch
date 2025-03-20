import { Html, Head, Body, Container, Img, Section, Column, Row, Text, Link } from "@react-email/components";

export default function OpportunitiesEmail({ opportunities }) {
  return (
    <Html>
      <Head>
        <style>
          {`
            @media (max-width: 600px) {
              .container {
                width: 95% !important;
                padding: 10px !important;
              }
              .opportunity-column {
                width: 100% !important;
                display: block !important;
              }
            }
          `}
        </style>
      </Head>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", padding: "0", margin: "0" }}>
        <Container className="container" style={{ maxWidth: "600px", margin: "auto", padding: "20px", backgroundColor: "#ffffff", textAlign: "center" }}>
          {/* Centered Logo */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
            <Img
              src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014699/efjqboki2b51w3dwonmc.png"
              alt="Epoch Logo"
              width="80"
              height="80"
              style={{ borderRadius: "50%" }}
            />
          </div>

          {/* Email Title */}
          <Text style={{ fontSize: "22px", fontWeight: "bold", textAlign: "center", margin: "20px 0" }}>
            OPPORTUNITIES FOR THE WEEK
          </Text>

          {/* Brief Description */}
          <Text style={{ fontSize: "14px", textAlign: "center", marginBottom: "30px", color: "#333", fontStyle: "italic" }}>
            Discover and seize internships, scholarships, and more to build your career.
          </Text>

          {/* Dynamic Opportunities List */}
          <Section>
            {opportunities.map((opportunity, index) => (
              <Row key={index} style={{ marginBottom: "30px" }}>
                <Column width="100%" style={{ padding: "0 10px" }}>
                  <div style={{ textAlign: "center" }}>
                    <Img
                      src={opportunity.imageUrl || "https://via.placeholder.com/80"}
                      width="80"
                      height="80"
                      style={{ borderRadius: "50%" }}
                      alt={opportunity.title}
                    />
                    <Text style={{ fontSize: "16px", fontWeight: "bold", margin: "10px 0", color: "#000" }}>
                      {opportunity.title}
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#333", textAlign: "center" }}>
                      {opportunity.description}
                    </Text>
                    <Text style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                      Deadline: {opportunity.deadline}
                    </Text>
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <Link href={opportunity.applyLink} style={{ 
                        fontSize: "14px", 
                        color: "#ffffff", 
                        backgroundColor: "#e9672b", 
                        padding: "8px 16px", 
                        textAlign: "center",
                        borderRadius: "5px",
                        display: "inline-block",
                        textDecoration: "none",
                      }}>
                        View Opportunity
                      </Link>
                    </div>
                  </div>
                </Column>
              </Row>
            ))}
          </Section>

          {/* View More Button */}
          <div style={{ textAlign: "center", margin: "30px 0" }}>
            <Link href="https://epochafrica.com/prospecta" style={{ 
              fontSize: "14px", 
              fontWeight: "bold",
              color: "#ffffff", 
              backgroundColor: "#000000", 
              padding: "12px 20px", 
              textAlign: "center",
              display: "inline-block",
              textDecoration: "none",
              borderRadius: "5px"
            }}>
              CLICK TO VIEW MORE OPPORTUNITIES
            </Link>
          </div>

          {/* Footer */}
          <div style={{ backgroundColor: "#000", padding: "20px", textAlign: "center", marginTop: "20px" }}>
            <Text style={{ fontSize: "16px", color: "#fff", marginBottom: "20px" }}>
              Follow us on our socials.
            </Text>
            <Row style={{ justifyContent: "center" }}>
              <Column width="20%" style={{ padding: "0 10px" }}>
                <Link href="https://linkedin.com">
                  <Img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" width="30" alt="LinkedIn" style={{ borderRadius: "50%" }} />
                </Link>
              </Column>
              <Column width="20%" style={{ padding: "0 10px" }}>
                <Link href="https://instagram.com">
                  <Img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" width="30" alt="Instagram" style={{ borderRadius: "50%" }} />
                </Link>
              </Column>
              <Column width="20%" style={{ padding: "0 10px" }}>
                <Link href="https://spotify.com">
                  <Img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" width="30" alt="Spotify" style={{ borderRadius: "50%" }} />
                </Link>
              </Column>
            </Row>
            <div style={{ textAlign: "center", margin: "30px 0 10px" }}>
              <hr style={{ width: "50%", borderColor: "#e9672b", borderWidth: "1px" }} />
            </div>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <Img
                src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014699/efjqboki2b51w3dwonmc.png"
                width="40"
                alt="Epoch Logo"
              />
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  );
}
