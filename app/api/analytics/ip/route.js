export async function GET() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching IP:', error);
    return Response.json({ ip: '0.0.0.0' });
  }
}
