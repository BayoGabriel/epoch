import { Html, Head, Body, Container, Img, Section, Column, Row, Text, Link } from "@react-email/components";

export default function OpportunitiesEmail({ opportunities }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif", color: "#333" }}>
        <Container style={{ maxWidth: "600px", margin: "auto", padding: "20px", backgroundColor: "#ffffff", borderRadius: "8px" }}>
          {/* Header with Logo */}
          <Img src="https://yourdomain.com/logo.png" width="120" alt="Your Logo" style={{ margin: "auto", display: "block" }} />

          {/* Email Title */}
          <Text style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center", margin: "10px 0" }}>
            Weekly Opportunities Digest 🚀
          </Text>

          {/* Brief Description */}
          <Text style={{ fontSize: "16px", textAlign: "center", marginBottom: "20px" }}>
            Here are the latest opportunities that are still open for applications. Apply now before the deadlines pass!
          </Text>

          {/* 2-Column Grid of Opportunities */}
          <Section>
            {opportunities.map((opportunity, index) => (
              <Row key={index}>
                <Column width="50%" style={{ padding: "10px" }}>
                  <Img src={opportunity.imageUrl} width="100%" style={{ borderRadius: "8px" }} alt={opportunity.title} />
                  <Text style={{ fontSize: "16px", fontWeight: "bold", margin: "10px 0" }}>
                    {opportunity.title}
                  </Text>
                  <Text style={{ fontSize: "14px", color: "#555" }}>
                    {opportunity.description.slice(0, 70)}...
                  </Text>
                  <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#ff5f00" }}>
                    Deadline: {new Date(opportunity.applicationDeadline).toDateString()}
                  </Text>
                  <Link href={opportunity.applyLink} style={{ fontSize: "14px", color: "#007bff", textDecoration: "underline" }}>
                    Apply Now
                  </Link>
                </Column>
              </Row>
            ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
