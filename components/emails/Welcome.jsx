import { Html, Head, Body, Container, Img, Section, Column, Row, Text, Link } from "@react-email/components";

export default function OpportunitiesEmail({ opportunities }) {
  
  const formatDeadline = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "No deadline specified";
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "No deadline specified";
    }
  };

  // Split opportunities into pairs for two-column layout
  const createOpportunityPairs = (opportunities) => {
    const pairs = [];
    for (let i = 0; i < opportunities.length; i += 2) {
      pairs.push(opportunities.slice(i, i + 2));
    }
    return pairs;
  };

  const opportunityPairs = createOpportunityPairs(opportunities);

  return (
    <Html>
      <Head>
        <style>
          {`
            @media (max-width: 600px) {
              .container {
                width: 100% !important;
              }
              .opportunity-row {
                display: block !important;
              }
              .opportunity-column {
                width: 100% !important;
                display: block !important;
                max-width: 100% !important;
              }
            }
          `}
        </style>
      </Head>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", padding: "0", margin: "0" }}>
        <Container className="container" style={{ maxWidth: "95%", margin: "auto", padding: "20px", backgroundColor: "#ffffff" }}>
          {/* Centered Logo */}
          <Section style={{ textAlign: "center", marginBottom: "20px", margin: "0 auto" }}>
            <div style={{ 
              backgroundColor: "#000000", 
              borderRadius: "50%", 
              padding: "20px", 
              maxWidth: "190px", 
              margin: "0 auto" 
            }}>
              <Img
                src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014699/efjqboki2b51w3dwonmc.png"
                alt="Epoch Logo"
                width="150"
                height="auto"
                style={{ margin: "0 auto", display: "block" }}
              />
            </div>
          </Section>
          
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
            {opportunityPairs.map((pair, pairIndex) => (
              <Row key={pairIndex} className="opportunity-row" style={{ display: "table", width: "100%", tableLayout: "fixed", marginBottom: "20px" }}>
                {pair.map((opportunity, index) => (
                  <Column key={index} className="opportunity-column" style={{ display: "table-cell", width: "50%", padding: "10px", verticalAlign: "top" }}>
                    <div style={{ textAlign: "center" }}>
                      <Img
                        src={opportunity.imageUrl || "https://via.placeholder.com/80"}
                        width="80"
                        height="80"
                        style={{ borderRadius: "50%", display: "block", margin: "0 auto" }}
                        alt={opportunity.title}
                      />
                      <Text style={{ fontSize: "16px", fontWeight: "bold", margin: "10px 0", color: "#000" }}>
                        {opportunity.title}
                      </Text>
                      <Text style={{ fontSize: "14px", color: "#333", textAlign: "center" }}>
                        {opportunity.description.slice(0, 50)}
                        {opportunity.description.length > 50 ? "..." : ""}
                      </Text>
                      <Text style={{ fontSize: "14px", color: "#737373", marginTop: "10px" }}>
                        Deadline: {formatDeadline(opportunity.applicationDeadline || opportunity.deadline)}
                      </Text>
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <Link href={opportunity.applyLink || opportunity.link || "#"} style={{ 
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
                ))}
                {pair.length === 1 && (
                  <Column className="opportunity-column" style={{ display: "table-cell", width: "50%", padding: "10px" }}></Column>
                )}
              </Row>
            ))}
          </Section>

          {/* View More Button */}
          <div style={{ textAlign: "center", margin: "30px 0 10px" }}>
            <hr style={{ width: "50%", borderColor: "#e9672b", borderWidth: "1px" }} />
          </div>
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
          <div style={{ textAlign: "center", margin: "30px 0 10px" }}>
            <hr style={{ width: "50%", borderColor: "#e9672b", borderWidth: "1px" }} />
          </div>
          <Text style={{ fontSize: "16px", color: "#000", marginBottom: "30px", textAlign: "center" }}>
            @2025 admin@epochafrica.com
          </Text>
          {/* Footer */}
          <div style={{ backgroundColor: "#000", padding: "20px", textAlign: "center", marginTop: "20px" }}>
            <Text style={{ fontSize: "16px", color: "#fff", marginBottom: "20px" }}>
              Follow us on our socials.
            </Text>
            <Row style={{ justifyContent: "center" }}>
              <Column width="20%" style={{ padding: "0 10px", textAlign: "center" }}>
                <Link href="https://ng.linkedin.com/company/epochafrica">
                  <Img src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014925/qgf94r36ssrvofsa7i6i.png" width="30" alt="LinkedIn" style={{ borderRadius: "50%", display: "block", margin: "0 auto" }} />
                </Link>
              </Column>
              <Column width="20%" style={{ padding: "0 10px", textAlign: "center" }}>
                <Link href="https://www.instagram.com/epoch_africa/">
                  <Img src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014924/dnaj3dpx9gjocd6zxsyh.png" width="30" alt="Instagram" style={{ borderRadius: "50%", display: "block", margin: "0 auto" }} />
                </Link>
              </Column>
              <Column width="20%" style={{ padding: "0 10px", textAlign: "center" }}>
                <Link href="https://open.spotify.com/show/26oCnoZaWz98tIE6u7WwiI?si=479f3b106f3b425f">
                  <Img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png" width="30" alt="Spotify" style={{ borderRadius: "50%", display: "block", margin: "0 auto" }} />
                </Link>
              </Column>
            </Row>
            <div style={{ textAlign: "center", margin: "30px 0 10px" }}>
              <hr style={{ width: "50%", borderColor: "#e9672b", borderWidth: "1px" }} />
            </div>
            <Img
              src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014699/efjqboki2b51w3dwonmc.png"
              width="120"
              alt="Epoch Logo"
              style={{ display: "block", margin: "0 auto" }}
            />
          </div>
        </Container>
      </Body>
    </Html>
  );
}